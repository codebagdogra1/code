"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GoogleReview } from "@/lib/google-reviews";
import { GoogleG, Stars } from "@/components/site/GoogleBadge";

const AUTOPLAY_MS = 6000;
const CLAMP_CHARS = 220;

// Horizontal, scroll-snapped slider of Google reviews. Autoplay advances one
// card at a time and pauses on hover, focus, touch, when the tab is hidden and
// while the slider is off-screen; prefers-reduced-motion disables it entirely.
export function ReviewsSlider({ reviews }: { reviews: GoogleReview[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const count = reviews.length;

  const scrollTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const idx = ((i % count) + count) % count;
      const card = track.children[idx] as HTMLElement | undefined;
      if (!card) return;
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: reduced ? "auto" : "smooth" });
    },
    [count, reduced],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Track which card is nearest the left edge; also whether we are on screen.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cards = Array.from(track.children) as HTMLElement[];
        const left = track.scrollLeft + track.offsetLeft;
        let best = 0;
        let dist = Infinity;
        cards.forEach((c, i) => {
          const d = Math.abs(c.offsetLeft - left);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(track);
    return () => {
      track.removeEventListener("scroll", onScroll);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Autoplay.
  useEffect(() => {
    if (reduced || paused || !inView || count < 2) return;
    let hidden = document.visibilityState === "hidden";
    const onVis = () => {
      hidden = document.visibilityState === "hidden";
    };
    document.addEventListener("visibilitychange", onVis);
    const t = setInterval(() => {
      if (hidden) return;
      const track = trackRef.current;
      if (!track) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      scrollTo(atEnd ? 0 : active + 1);
    }, AUTOPLAY_MS);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [active, count, inView, paused, reduced, scrollTo]);

  if (count === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div
        ref={trackRef}
        className="s-reviews-track -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0"
        role="region"
        aria-roledescription="carousel"
        aria-label="Google reviews"
        tabIndex={0}
      >
        {reviews.map((r, i) => (
          <ReviewCard key={r.id} review={r} index={i} total={count} />
        ))}
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollTo(active - 1)}
            aria-label="Previous review"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--s-line-2)] bg-white text-[var(--s-ink)] transition-colors hover:border-[var(--s-ink)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose review">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Review ${i + 1} by ${r.author}`}
                onClick={() => scrollTo(i)}
                className={`h-2.5 rounded-full transition-all ${i === active ? "w-8 bg-[var(--s-accent)]" : "w-2.5 bg-[var(--s-line-2)] hover:bg-[var(--s-ink-3)]"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollTo(active + 1)}
            aria-label="Next review"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--s-line-2)] bg-white text-[var(--s-ink)] transition-colors hover:border-[var(--s-ink)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review, index, total }: { review: GoogleReview; index: number; total: number }) {
  const [open, setOpen] = useState(false);
  const long = review.text.length > CLAMP_CHARS;
  const text = long && !open ? `${review.text.slice(0, CLAMP_CHARS).trimEnd()}…` : review.text;

  return (
    <figure
      className="s-card flex w-[85%] shrink-0 snap-start flex-col p-6 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.7rem)]"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
    >
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} size={18} label={`${review.rating} out of 5 stars`} />
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${review.author}'s review on Google`}
          className="grid h-8 w-8 place-items-center rounded-full bg-[#f8f9fa]"
        >
          <GoogleG size={18} />
        </a>
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[var(--s-body)]">
        {text}
        {long && (
          <button type="button" onClick={() => setOpen((o) => !o)} className="ml-1 font-semibold text-[var(--s-ink)] underline underline-offset-4" aria-expanded={open}>
            {open ? "Show less" : "Read more"}
          </button>
        )}
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 border-t border-[var(--s-line)] pt-4">
        <Avatar name={review.author} photo={review.photo} />
        <span className="min-w-0">
          {review.authorUrl ? (
            <a href={review.authorUrl} target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-semibold text-[var(--s-ink)] hover:underline">
              {review.author}
            </a>
          ) : (
            <span className="block truncate text-sm font-semibold text-[var(--s-ink)]">{review.author}</span>
          )}
          <span className="block text-xs text-[var(--s-muted)]">{review.when ? `${review.when} · ` : ""}Google review</span>
        </span>
      </figcaption>
    </figure>
  );
}

// Google profile photos are small, change without notice and come from a
// Google CDN, so they are shown as plain images (no optimizer round-trip).
// A missing or blocked photo falls back to the reviewer's initial.
function Avatar({ name, photo }: { name: string; photo?: string }) {
  const [broken, setBroken] = useState(false);
  if (photo && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className="h-10 w-10 shrink-0 rounded-full bg-[var(--s-paper-3)] object-cover"
      />
    );
  }
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--s-ink)] text-sm font-bold text-white" aria-hidden>
      {name.trim()[0]?.toUpperCase() ?? "?"}
    </span>
  );
}
