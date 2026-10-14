import data from "@/data/google-reviews.json";
import { GOOGLE_MAPS_URL } from "@/lib/site";

// Google reviews for the centre's Maps listing, served from a static snapshot
// in src/data/google-reviews.json. No API key, OAuth or runtime fetch: the
// snapshot is refreshed by `npm run google:reviews`, which reads the public
// listing through Google Search's reviews dialog (see scripts/).
//
// Every review in the snapshot is verbatim from Google. Rating-only reviews
// (no text) are kept in the file and count towards the total, but are not
// shown as cards.

export type GoogleReview = {
  id: string;
  author: string;
  authorUrl?: string;
  photo?: string;
  rating: number;
  /** Relative time as Google showed it when captured, e.g. "3 months ago". */
  when: string;
  text: string;
  /** Link to the review on Google (the listing when no per-review link exists). */
  url: string;
};

export type GoogleReviewsData = {
  /** Rating as displayed, e.g. "5.0". */
  rating: string;
  count: number;
  /** Reviews with text, newest first. */
  reviews: GoogleReview[];
  /** ISO date the snapshot was taken. */
  capturedAt: string;
  mapsUrl: string;
};

const reviews: GoogleReview[] = data.reviews
  .filter((r) => r.text.trim().length > 0)
  .map((r) => ({
    id: r.id,
    author: r.author,
    authorUrl: r.authorUrl,
    photo: r.photo,
    rating: Math.max(1, Math.min(5, Math.round(r.rating))),
    when: r.when,
    text: r.text,
    url: r.url ?? GOOGLE_MAPS_URL,
  }));

/** Rating, review count and the reviews with text for the centre. */
export function getGoogleReviews(): GoogleReviewsData {
  return { rating: data.rating, count: data.count, reviews, capturedAt: data.capturedAt, mapsUrl: GOOGLE_MAPS_URL };
}
