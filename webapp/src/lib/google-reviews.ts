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
// Two Google APIs are involved, because no single one gives everything:
//
//   1. Business Profile API (owner-only, OAuth) → EVERY review on the listing,
//      with the reviewer's name and photo, stars, text and date. This is the
//      only official way to get more than five reviews. Needs the one-time
//      setup in scripts/google-reviews-setup.ts and these env vars:
//        GOOGLE_BUSINESS_CLIENT_ID, GOOGLE_BUSINESS_CLIENT_SECRET,
//        GOOGLE_BUSINESS_REFRESH_TOKEN, GOOGLE_BUSINESS_ACCOUNT_ID,
//        GOOGLE_BUSINESS_LOCATION_ID
//
//   2. Places API (New) (public, API key) → the rating, the review count, and
//      the five "most relevant" reviews, each with a link to the review and
//      to the reviewer's profile. Needs:
//        GOOGLE_MAPS_API_KEY  — key with "Places API (New)" enabled
//        GOOGLE_PLACE_ID      — optional; resolved by text search when absent
//
// When both are configured the Business Profile set is the base and the five
// Places reviews enrich it with their links. With only Places, the five live
// reviews are topped up with the curated ones below. With neither, or when
// Google is unreachable, the curated reviews and the rating/count constants in
// lib/site.ts are used, so the site always renders something true.
//
// Responses are cached for six hours (Google asks that review data is not
// stored for more than 30 days), so each API is hit a handful of times a day.

const PLACES_API = "https://places.googleapis.com/v1";
const BUSINESS_API = "https://mybusiness.googleapis.com/v4";
const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const REVALIDATE_SECONDS = 6 * 60 * 60;

export type GoogleReview = {
  id: string;
  author: string;
  authorUrl?: string;
  photo?: string;
  rating: number;
  /** Relative time as Google shows it, e.g. "3 months ago". */
  when: string;
  /** ISO timestamp when known (Business Profile path). Used for sorting. */
  publishedAt?: string;
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

const env = (key: string) => process.env[key]?.trim() || undefined;

/** "3 months ago" style wording, matching how Google Maps shows review dates. */
export function relativeTime(iso: string, now = Date.now()): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const days = Math.max(0, Math.floor((now - t) / 86_400_000));
  if (days < 1) return "today";
  if (days < 7) return days === 1 ? "a day ago" : `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (days < 30) return weeks === 1 ? "a week ago" : `${weeks} weeks ago`;
  const months = Math.floor(days / 30.44);
  if (months < 12) return months <= 1 ? "a month ago" : `${months} months ago`;
  const years = Math.floor(days / 365.25);
  return years <= 1 ? "a year ago" : `${years} years ago`;
}

// Google prefixes machine translations; keep the reviewer's original wording.
function cleanComment(raw: string): string {
  const marker = "(Original)";
  const at = raw.indexOf(marker);
  const text = at >= 0 ? raw.slice(at + marker.length) : raw.replace(/^\(Translated by Google\)\s*/i, "");
  return text.replace(/\s+/g, " ").trim();
}

// --- Places API (New) ------------------------------------------------------

type PlaceReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  publishTime?: string;
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
  const configured = env("GOOGLE_PLACE_ID");
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

function normalisePlaceReview(review: PlaceReview, placeUrl: string, index: number): GoogleReview | null {
  const text = (review.originalText?.text ?? review.text?.text ?? "").trim();
  const author = review.authorAttribution?.displayName?.trim();
  if (!text || !author) return null;
  return {
    id: review.name ?? `google-${index}`,
    author,
    authorUrl: review.authorAttribution?.uri,
    photo: review.authorAttribution?.photoUri,
    rating: Math.max(1, Math.min(5, Math.round(review.rating ?? 5))),
    when: review.relativePublishTimeDescription ?? (review.publishTime ? relativeTime(review.publishTime) : ""),
    publishedAt: review.publishTime,
    text,
    url: review.googleMapsUri ?? placeUrl,
    source: "google",
  };
}

type PlacesResult = { rating?: string; count?: number; mapsUrl: string; reviews: GoogleReview[] };

/** Rating, count and up to five reviews from the Places API. Null when not configured. */
async function fetchPlaces(): Promise<PlacesResult | null> {
  const apiKey = env("GOOGLE_MAPS_API_KEY");
  if (!apiKey) return null;

  const placeId = await resolvePlaceId(apiKey);
  if (!placeId) {
    console.warn("[google-reviews] Could not resolve a Place ID.");
    return null;
  }

  const place = await placesFetch<PlaceDetails>(`/places/${encodeURIComponent(placeId)}`, {
    apiKey,
    fieldMask: "id,rating,userRatingCount,googleMapsUri,reviews",
  });

  const mapsUrl = place.googleMapsUri ?? GOOGLE_MAPS_URL;
  return {
    rating: typeof place.rating === "number" ? place.rating.toFixed(1) : undefined,
    count: typeof place.userRatingCount === "number" ? place.userRatingCount : undefined,
    mapsUrl,
    reviews: (place.reviews ?? []).map((r, i) => normalisePlaceReview(r, mapsUrl, i)).filter((r): r is GoogleReview => r !== null),
  };
}

// --- Business Profile API (all reviews, owner OAuth) -----------------------

type BusinessReview = {
  reviewId?: string;
  name?: string;
  reviewer?: { profilePhotoUrl?: string; displayName?: string; isAnonymous?: boolean };
  starRating?: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "STAR_RATING_UNSPECIFIED";
  comment?: string;
  createTime?: string;
  updateTime?: string;
};

type BusinessReviewsPage = {
  reviews?: BusinessReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
};

const STARS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

type BusinessConfig = { clientId: string; clientSecret: string; refreshToken: string; accountId: string; locationId: string };

function businessConfig(): BusinessConfig | null {
  const clientId = env("GOOGLE_BUSINESS_CLIENT_ID");
  const clientSecret = env("GOOGLE_BUSINESS_CLIENT_SECRET");
  const refreshToken = env("GOOGLE_BUSINESS_REFRESH_TOKEN");
  const accountId = env("GOOGLE_BUSINESS_ACCOUNT_ID")?.replace(/^accounts\//, "");
  const locationId = env("GOOGLE_BUSINESS_LOCATION_ID")?.replace(/^locations\//, "");
  if (!clientId || !clientSecret || !refreshToken || !accountId || !locationId) return null;
  return { clientId, clientSecret, refreshToken, accountId, locationId };
}

/** Trade the long-lived refresh token for a short-lived access token. */
async function businessAccessToken(cfg: BusinessConfig): Promise<string> {
  const res = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      refresh_token: cfg.refreshToken,
      grant_type: "refresh_token",
    }),
    // Access tokens last an hour; share one across renders for most of that.
    next: { revalidate: 45 * 60, tags: ["google-reviews"] },
  });
  if (!res.ok) {
    throw new Error(`Business Profile OAuth → ${res.status} ${await res.text().catch(() => "")}`.slice(0, 400));
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Business Profile OAuth returned no access token");
  return data.access_token;
}

function normaliseBusinessReview(review: BusinessReview, placeUrl: string, index: number): GoogleReview | null {
  const text = cleanComment(review.comment ?? "");
  const author = review.reviewer?.displayName?.trim();
  if (!text || !author) return null;
  const createTime = review.createTime;
  return {
    id: review.reviewId ?? review.name ?? `business-${index}`,
    author,
    photo: review.reviewer?.profilePhotoUrl,
    rating: STARS[review.starRating ?? ""] ?? 5,
    when: createTime ? relativeTime(createTime) : "",
    publishedAt: createTime,
    text,
    url: placeUrl,
    source: "google",
  };
}

type BusinessResult = { rating?: string; count?: number; reviews: GoogleReview[] };

/** Every review on the listing via the Business Profile API. Null when not configured. */
async function fetchBusinessProfile(placeUrl: string): Promise<BusinessResult | null> {
  const cfg = businessConfig();
  if (!cfg) return null;

  const token = await businessAccessToken(cfg);
  const base = `${BUSINESS_API}/accounts/${encodeURIComponent(cfg.accountId)}/locations/${encodeURIComponent(cfg.locationId)}/reviews`;

  const all: BusinessReview[] = [];
  let rating: string | undefined;
  let count: number | undefined;
  let pageToken: string | undefined;
  // 50 per page is the API maximum; a listing this size is a single page, but
  // keep paging in case it grows. Hard-stop at 20 pages (1,000 reviews).
  for (let page = 0; page < 20; page++) {
    const url = new URL(base);
    url.searchParams.set("pageSize", "50");
    url.searchParams.set("orderBy", "updateTime desc");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["google-reviews"] },
    });
    if (!res.ok) {
      throw new Error(`Business Profile reviews → ${res.status} ${await res.text().catch(() => "")}`.slice(0, 400));
    }
    const data = (await res.json()) as BusinessReviewsPage;
    all.push(...(data.reviews ?? []));
    if (typeof data.averageRating === "number") rating = data.averageRating.toFixed(1);
    if (typeof data.totalReviewCount === "number") count = data.totalReviewCount;
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  return {
    rating,
    count,
    reviews: all.map((r, i) => normaliseBusinessReview(r, placeUrl, i)).filter((r): r is GoogleReview => r !== null),
  };
}

// --- Merge ------------------------------------------------------------------

const key = (name: string) => name.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * Business Profile reviews carry no links to the review or reviewer; the
 * Places copies of the same reviews do. Borrow those (and Google's own
 * relative-time wording) where the two sets overlap.
 */
function enrich(base: GoogleReview[], places: GoogleReview[]): GoogleReview[] {
  if (places.length === 0) return base;
  const byAuthor = new Map(places.map((r) => [key(r.author), r]));
  return base.map((r) => {
    const match = byAuthor.get(key(r.author));
    if (!match) return r;
    return {
      ...r,
      authorUrl: match.authorUrl ?? r.authorUrl,
      photo: r.photo ?? match.photo,
      url: match.url ?? r.url,
      when: match.when || r.when,
    };
  });
}

/** Reviews with text first and newest first; rating-only reviews are not shown. */
function sortNewest(reviews: GoogleReview[]): GoogleReview[] {
  return [...reviews].sort((a, b) => Date.parse(b.publishedAt ?? "") - Date.parse(a.publishedAt ?? "") || 0);
}

/**
 * Rating, review count and reviews for the centre. Never throws: any failure
 * logs once and falls back to the next best source so pages still render.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData> {
  let places: PlacesResult | null = null;
  try {
    places = await fetchPlaces();
  } catch (err) {
    console.warn("[google-reviews] Places API unavailable:", err instanceof Error ? err.message : err);
  }

  const mapsUrl = places?.mapsUrl ?? GOOGLE_MAPS_URL;

  let business: BusinessResult | null = null;
  try {
    business = await fetchBusinessProfile(mapsUrl);
  } catch (err) {
    console.warn("[google-reviews] Business Profile API unavailable:", err instanceof Error ? err.message : err);
  }

  // Full set from the Business Profile, enriched with the Places links.
  if (business && business.reviews.length > 0) {
    return {
      rating: business.rating ?? places?.rating ?? GOOGLE_RATING,
      count: business.count ?? places?.count ?? GOOGLE_REVIEW_COUNT,
      reviews: sortNewest(enrich(business.reviews, places?.reviews ?? [])),
      live: true,
      mapsUrl,
    };
  }

  // Five Places reviews, topped up with curated ones Google did not return.
  if (places) {
    const seen = new Set(places.reviews.map((r) => key(r.author)));
    const extra = curatedReviews().filter((r) => !seen.has(key(r.author)));
    return {
      rating: places.rating ?? GOOGLE_RATING,
      count: places.count ?? GOOGLE_REVIEW_COUNT,
      reviews: [...places.reviews, ...extra],
      live: places.reviews.length > 0,
      mapsUrl,
    };
  }

  return fallback();
}
