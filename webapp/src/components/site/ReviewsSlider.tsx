"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { GoogleReview } from "@/lib/google-reviews";
import { GoogleG, Stars } from "@/components/site/GoogleBadge";

const AUTOPLAY_MS = 6000;
const CLAMP_CHARS = 220;
const GAP = 16;
const CONTAINER_MAX = 1152; // matches .s-container (max-w-6xl)
const SWIPE_PX = 40;

// Full-bleed, infinitely looping carousel of Google reviews. The track is a
// translateX strip of the reviews repeated a few times; after each slide the
// index silently re-centres into the middle copy, so it loops both ways even
// when every review already fits on screen. One card per view on phones,
// two on tablets, three on desktop, with the active card aligned to the page
// container's left edge and neighbours peeking at both sides.
//
// Autoplay pauses on hover, focus, drag, hidden tab and off-screen;
// prefers-reduced-motion disables autoplay and the slide animation.
export function ReviewsSlider({ reviews }: { reviews: GoogleReview[] }) {
  const count = reviews.length;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ cardW: 360, padLeft: 16, perView: 1 });
  const [index, setIndex] = useState(count);
  const [anim, setAnim] = useState(true);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const drag = useRef<{ startX: number; dx: number; active: boolean; moved: boolean; touch: boolean }>({ startX: 0, dx: 0, active: false, moved: false, touch: false });
  const [dragX, setDragX] = useState(0);

  const copies = Math.max(4, layout.perView * 2 + 2);
  const items = Array.from({ length: copies * count }, (_, i) => reviews[i % count]);
  const step = layout.cardW + GAP;

  // Measure: how many cards fit, how wide each is, and where the page
  // container's left edge sits so the active card lines up with it.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const pad = w >= 640 ? 24 : 16;
      const inner = Math.min(w - pad * 2, CONTAINER_MAX);
      const perView = w < 640 ? 1 : w < 1024 ? 2 : 3;
      const cardW = perView === 1 ? Math.round(inner * 0.88) : Math.floor((inner - GAP * (perView - 1)) / perView);
      setLayout({ cardW, padLeft: Math.round((w - inner) / 2), perView });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Re-enable the transition one frame after a silent re-centre.
  useLayoutEffect(() => {
    if (anim) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
    return () => cancelAnimationFrame(id);
  }, [anim]);

  const go = useCallback((i: number) => setIndex(i), []);

  const onTransitionEnd = () => {
    if (index >= 2 * count) {
      setAnim(false);
      setIndex(index - count);
    } else if (index < count) {
      setAnim(false);
      setIndex(index + count);
    }
  };

  // Autoplay. `index` is a dependency on purpose: any manual move restarts
  // the timer, so the next automatic slide is a full interval away.
  useEffect(() => {
    if (reduced || paused || !inView || count < 2) return;
    const t = setInterval(() => {
      if (document.visibilityState === "hidden") return;
      setIndex((i) => i + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [count, index, inView, paused, reduced]);

  // Pointer drag / swipe.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { startX: e.clientX, dx: 0, active: true, moved: false, touch: e.pointerType !== "mouse" };
    setPaused(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    d.dx = e.clientX - d.startX;
    if (Math.abs(d.dx) > 6) {
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (d.moved) setDragX(d.dx);
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    setDragX(0);
    if (d.dx <= -SWIPE_PX) go(index + 1);
    else if (d.dx >= SWIPE_PX) go(index - 1);
    // A mouse is still hovering, so stay paused until it leaves; touch resumes.
    if (d.touch) setPaused(false);
  };
  // A drag should not trigger the link/button under the pointer.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  if (count === 0) return null;

  const x = -(index * step) + layout.padLeft + dragX;
  const transition = anim && !reduced && dragX === 0 ? "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)" : "none";
  const active = ((index % count) + count) % count;

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!drag.current.active) setPaused(false);
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="overflow-hidden py-2 select-none"
        role="region"
        aria-roledescription="carousel"
        aria-label="Google reviews"
        style={{ touchAction: "pan-y", cursor: dragX !== 0 ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
      >
        <div
          className="flex items-stretch will-change-transform"
          style={{ gap: GAP, transform: `translate3d(${x}px, 0, 0)`, transition }}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && e.propertyName === "transform") onTransitionEnd();
          }}
        >
          {items.map((r, i) => {
            const isActive = i >= index && i < index + layout.perView;
            return (
              <div key={`${r.id}-${i}`} style={{ width: layout.cardW }} className="shrink-0" aria-hidden={!isActive}>
                <ReviewCard review={r} index={i % count} total={count} inert={!isActive} />
              </div>
            );
          })}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
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
                onClick={() => {
                  // Move the shortest way round the loop.
                  const base = Math.floor(index / count) * count;
                  const candidates = [base + i - count, base + i, base + i + count];
                  go(candidates.reduce((best, c) => (Math.abs(c - index) < Math.abs(best - index) ? c : best)));
                }}
                className={`h-2.5 rounded-full transition-all ${i === active ? "w-8 bg-[var(--s-accent)]" : "w-2.5 bg-[var(--s-line-2)] hover:bg-[var(--s-ink-3)]"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
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

function ReviewCard({ review, index, total, inert }: { review: GoogleReview; index: number; total: number; inert: boolean }) {
  const [open, setOpen] = useState(false);
  const long = review.text.length > CLAMP_CHARS;
  const text = long && !open ? `${review.text.slice(0, CLAMP_CHARS).trimEnd()}…` : review.text;
  const tab = inert ? -1 : undefined;

  return (
    <figure
      className={`s-card flex h-full flex-col p-6 transition-opacity duration-500 ${inert ? "opacity-60" : "opacity-100 shadow-[var(--s-shadow)]"}`}
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
    >
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} size={18} label={`${review.rating} out of 5 stars`} />
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={tab}
          draggable={false}
          aria-label={`View ${review.author}'s review on Google`}
          className="grid h-8 w-8 place-items-center rounded-full bg-[#f8f9fa]"
        >
          <GoogleG size={18} />
        </a>
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[var(--s-body)]">
        {text}
        {long && (
          <button type="button" tabIndex={tab} onClick={() => setOpen((o) => !o)} className="ml-1 font-semibold text-[var(--s-ink)] underline underline-offset-4" aria-expanded={open}>
            {open ? "Show less" : "Read more"}
          </button>
        )}
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 border-t border-[var(--s-line)] pt-4">
        <Avatar name={review.author} photo={review.photo} />
        <span className="min-w-0">
          {review.authorUrl ? (
            <a href={review.authorUrl} target="_blank" rel="noopener noreferrer" tabIndex={tab} draggable={false} className="block truncate text-sm font-semibold text-[var(--s-ink)] hover:underline">
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
        draggable={false}
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
