import { getGoogleReviews } from "@/lib/google-reviews";
import { GoogleBadge } from "@/components/site/GoogleBadge";
import { ReviewsSlider } from "@/components/site/ReviewsSlider";

// Google rating badge + a slider of the centre's Google reviews. Pulls live
// data from the Places API when a key is configured and falls back to the
// curated verbatim reviews otherwise (see lib/google-reviews.ts).
export async function GoogleReviews() {
  const data = await getGoogleReviews();

  return (
    <div>
      <div className="flex justify-center">
        <GoogleBadge size="md" rating={data.rating} count={data.count} href={data.mapsUrl} />
      </div>

      <div className="mt-8">
        <ReviewsSlider reviews={data.reviews} />
      </div>

      <p className="mt-6 text-center text-sm text-[var(--s-muted)]">
        Rated <strong className="text-[var(--s-ink)]">{data.rating}</strong> from {data.count} reviews on Google ·{" "}
        <a href={data.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--s-ink)] underline underline-offset-4">
          Read all reviews on Google
        </a>
      </p>
    </div>
  );
}
