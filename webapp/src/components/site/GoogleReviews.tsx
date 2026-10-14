import { GOOGLE_MAPS_URL, GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from "@/lib/site";

// Verbatim public reviews from the centre's Google Maps listing. Keep these in
// sync with Google; never add testimonials that are not on the listing.
const REVIEWS = [
  {
    name: "Deepak Bagoriya",
    when: "a year ago",
    text: "I would highly recommend to anyone looking to build or advance a career in technology. Whether you're a student, working professional, or a career switcher, this is a great place to start your journey.",
  },
  {
    name: "Kashish Choudhary",
    when: "10 months ago",
    text: "I am currently pursuing a Diploma in Computer, and my experience so far has been very good and knowledgeable. This course has helped me learn a lot about computers and technology.",
  },
  {
    name: "Debjit Ghosh",
    when: "3 months ago",
    text: "The class is very clean. Trainer is supportive; all the things are explained properly.",
  },
];

export function GoogleReviews() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure key={r.name} className="s-card flex flex-col p-6">
            <div className="flex items-center justify-between">
              <span aria-label="5 out of 5 stars" className="text-[#fbbc04]">
                ★★★★★
              </span>
              <span className="s-mono text-[0.65rem] uppercase tracking-widest text-[var(--s-muted)]">Google</span>
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[var(--s-body)]">“{r.text}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3 border-t border-[var(--s-line)] pt-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--s-ink)] text-sm font-bold text-white" aria-hidden>
                {r.name[0]}
              </span>
              <span>
                <span className="block text-sm font-semibold text-[var(--s-ink)]">{r.name}</span>
                <span className="block text-xs text-[var(--s-muted)]">{r.when}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-[var(--s-muted)]">
        Rated <strong className="text-[var(--s-ink)]">{GOOGLE_RATING}</strong> from {GOOGLE_REVIEW_COUNT} reviews ·{" "}
        <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--s-ink)] underline underline-offset-4">
          Read all reviews on Google
        </a>
      </p>
    </div>
  );
}
