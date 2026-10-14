import {
  BUSINESS_NAME,
  GOOGLE_MAPS_URL,
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  LOCALITY,
  MAP_LAT,
  MAP_LNG,
} from "@/lib/site";

// Google reviews for the centre's Maps listing.
//
// Live path: Places API (New) → rating, review count and the reviews Google
// returns for the place (profile photo, name, stars, text, relative time).
// Google serves at most five reviews per place through the API, so the live
// set is topped up with the verbatim reviews below that are not already in it.
//
// Fallback path: when GOOGLE_MAPS_API_KEY is missing, or Google is unreachable,
// the curated reviews and the rating/count constants in lib/site.ts are used,
// so the site always renders something true.
//
// Setup (Netlify → Site configuration → Environment variables):
//   GOOGLE_MAPS_API_KEY  — key with "Places API (New)" enabled
//   GOOGLE_PLACE_ID      — optional; resolved by text search when absent
//
// Responses are cached for six hours (Google asks that review data is not
// stored for more than 30 days), so the API is hit a handful of times a day.

const PLACES_API = "https://places.googleapis.com/v1";
const REVALIDATE_SECONDS = 6 * 60 * 60;

export type GoogleReview = {
  id: string;
  author: string;
  authorUrl?: string;
  photo?: string;
  rating: number;
  when: string;
  text: string;
  url: string;
  source: "google" | "curated";
};

export type GoogleReviewsData = {
  /** Rating as displayed, e.g. "5.0". */
  rating: string;
  count: number;
  reviews: GoogleReview[];
  /** True when the numbers and reviews came from Google in this render. */
  live: boolean;
  mapsUrl: string;
};

// Verbatim public reviews from the centre's Google Maps listing. Keep these in
// sync with Google; never add testimonials that are not on the listing.
const CURATED: Omit<GoogleReview, "source" | "url" | "id">[] = [
  {
    author: "Deepak Bagoriya",
    when: "a year ago",
    rating: 5,
    text: "I would highly recommend to anyone looking to build or advance a career in technology. Whether you're a student, working professional, or a career switcher, this is a great place to start your journey.",
  },
  {
    author: "Kashish Choudhary",
    when: "10 months ago",
    rating: 5,
    text: "I am currently pursuing a Diploma in Computer, and my experience so far has been very good and knowledgeable. This course has helped me learn a lot about computers and technology.",
  },
  {
    author: "Debjit Ghosh",
    when: "3 months ago",
    rating: 5,
    text: "The class is very clean. Trainer is supportive; all the things are explained properly.",
  },
];

function curatedReviews(): GoogleReview[] {
  return CURATED.map((r, i) => ({
    ...r,
    id: `curated-${i}`,
    url: GOOGLE_MAPS_URL,
    source: "curated",
  }));
}

function fallback(): GoogleReviewsData {
  return {
    rating: GOOGLE_RATING,
    count: GOOGLE_REVIEW_COUNT,
    reviews: curatedReviews(),
    live: false,
    mapsUrl: GOOGLE_MAPS_URL,
  };
}

// --- Places API (New) response shapes (only the fields we read) -------------

type PlaceReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  googleMapsUri?: string;
};

type PlaceDetails = {
  id?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlaceReview[];
};

type TextSearch = { places?: { id: string }[] };

async function placesFetch<T>(path: string, init: RequestInit & { fieldMask: string; apiKey: string }): Promise<T> {
  const { fieldMask, apiKey, ...rest } = init;
  const res = await fetch(`${PLACES_API}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fieldMask,
      ...(rest.headers ?? {}),
    },
    next: { revalidate: REVALIDATE_SECONDS, tags: ["google-reviews"] },
  });
  if (!res.ok) {
    throw new Error(`Places API ${path} → ${res.status} ${await res.text().catch(() => "")}`.slice(0, 400));
  }
  return (await res.json()) as T;
}

async function resolvePlaceId(apiKey: string): Promise<string | null> {
  const configured = process.env.GOOGLE_PLACE_ID?.trim();
  if (configured) return configured;

  const data = await placesFetch<TextSearch>("/places:searchText", {
    method: "POST",
    apiKey,
    fieldMask: "places.id",
    body: JSON.stringify({
      textQuery: `${BUSINESS_NAME} ${LOCALITY}`,
      locationBias: { circle: { center: { latitude: MAP_LAT, longitude: MAP_LNG }, radius: 1500 } },
      maxResultCount: 1,
    }),
  });
  return data.places?.[0]?.id ?? null;
}

function normalise(review: PlaceReview, placeUrl: string, index: number): GoogleReview | null {
  const text = (review.text?.text ?? review.originalText?.text ?? "").trim();
  const author = review.authorAttribution?.displayName?.trim();
  if (!text || !author) return null;
  return {
    id: review.name ?? `google-${index}`,
    author,
    authorUrl: review.authorAttribution?.uri,
    photo: review.authorAttribution?.photoUri,
    rating: Math.max(1, Math.min(5, Math.round(review.rating ?? 5))),
    when: review.relativePublishTimeDescription ?? "",
    text,
    url: review.googleMapsUri ?? placeUrl,
    source: "google",
  };
}

/**
 * Rating, review count and reviews for the centre. Never throws: any failure
 * logs once and falls back to the curated data so pages still render.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (!apiKey) return fallback();

  try {
    const placeId = await resolvePlaceId(apiKey);
    if (!placeId) {
      console.warn("[google-reviews] Could not resolve a Place ID; using curated reviews.");
      return fallback();
    }

    const place = await placesFetch<PlaceDetails>(`/places/${encodeURIComponent(placeId)}`, {
      apiKey,
      fieldMask: "id,rating,userRatingCount,googleMapsUri,reviews",
    });

    const mapsUrl = place.googleMapsUri ?? GOOGLE_MAPS_URL;
    const live = (place.reviews ?? [])
      .map((r, i) => normalise(r, mapsUrl, i))
      .filter((r): r is GoogleReview => r !== null);

    // Top up with curated reviews that Google did not return this time.
    const seen = new Set(live.map((r) => r.author.toLowerCase()));
    const extra = curatedReviews().filter((r) => !seen.has(r.author.toLowerCase()));

    return {
      rating: typeof place.rating === "number" ? place.rating.toFixed(1) : GOOGLE_RATING,
      count: typeof place.userRatingCount === "number" ? place.userRatingCount : GOOGLE_REVIEW_COUNT,
      reviews: [...live, ...extra],
      live: live.length > 0,
      mapsUrl,
    };
  } catch (err) {
    console.warn("[google-reviews] Falling back to curated reviews:", err instanceof Error ? err.message : err);
    return fallback();
  }
}
