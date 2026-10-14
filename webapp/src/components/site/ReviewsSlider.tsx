"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { GoogleReview } from "@/lib/google-reviews";
import { GoogleG, Stars } from "@/components/site/GoogleBadge";

const AUTOPLAY_MS = 5000;
const CLAMP_CHARS = 220;
const GAP = 16;
const CONTAINER_MAX = 1152; // matches .s-container (max-w-6xl)
const SWIPE_PX = 40;
const MAX_DOTS = 8;
// Cards rendered either side of the focused one; the rest are empty spacers.
const RENDER_WINDOW = 6;

// Full-bleed, infinitely looping, centre-focused carousel of Google reviews.
// The focused card sits in the middle of the viewport at full strength and
// its neighbours peek out on both sides, dimmed and slightly smaller. The
// track is a translateX strip of the reviews repeated several times; after
// each slide the index silently re-centres into the middle copy, so it loops
// both ways no matter how few or many reviews there are.
//
// Autoplay rotates every few seconds and pauses while the pointer is over
// the cards, while a card has focus, during a drag, in a hidden tab and when
// the slider is off screen. prefers-reduced-motion disables autoplay and the
// slide animation.
export function ReviewsSlider({ reviews }: { reviews: GoogleReview[] }) {
  const count = reviews.length;
  // Copies of the list on each side of the "home" copy. Enough that the
  // widest viewport never sees past the end of the strip.
  const reps = Math.max(2, Math.ceil(6 / Math.max(count, 1)));
  const home = reps * count;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ cardW: 360, viewW: 0 });
  const [index, setIndex] = useState(home);
  const [anim, setAnim] = useState(true);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const drag = useRef<{ startX: number; dx: number; active: boolean; moved: boolean; touch: boolean }>({ startX: 0, dx: 0, active: false, moved: false, touch: false });
  const [dragX, setDragX] = useState(0);

  const total = (2 * reps + 1) * count;
  const step = layout.cardW + GAP;

  // Measure the viewport and size the cards: one wide card on phones, and on
  // larger screens the width that lets three cards sit inside the page
  // container, so the focused card is flanked by two full neighbours.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const pad = w >= 640 ? 24 : 16;
      const inner = Math.min(w - pad * 2, CONTAINER_MAX);
      const cardW = w < 640 ? Math.round(inner * 0.86) : w < 1024 ? Math.floor((inner - GAP) / 1.8) : Math.floor((inner - GAP * 2) / 3);
      setLayout({ cardW, viewW: w });
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
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Re-enable the transition one frame after a silent re-centre.
  useLayoutEffect(() => {
    if (anim) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
    return () => cancelAnimationFrame(id);
  }, [anim]);

  // With reduced motion there is no slide (and so no transitionend to
  // re-centre on), so jump straight to the equivalent card in the home copy.
  const go = useCallback(
    (i: number) => setIndex(reduced ? home + ((((i - home) % count) + count) % count) : i),
    [count, home, reduced],
  );

  const recentre = () => {
    if (index >= home + count) {
      setAnim(false);
      setIndex(index - count);
    } else if (index < home) {
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

  // Place the focused card in the middle of the viewport.
  const x = Math.round(layout.viewW / 2 - layout.cardW / 2) - index * step + dragX;
  const transition = anim && !reduced && dragX === 0 ? "transform 560ms cubic-bezier(0.22, 1, 0.36, 1)" : "none";
  const active = ((index % count) + count) % count;
  const showDots = count <= MAX_DOTS;

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
        className="overflow-hidden py-3 select-none"
        role="region"
        aria-roledescription="carousel"
        aria-label="Google reviews"
        aria-live={paused ? "polite" : "off"}
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
            if (e.target === e.currentTarget && e.propertyName === "transform") recentre();
          }}
        >
          {Array.from({ length: total }, (_, i) => {
            const distance = Math.abs(i - index);
            if (distance > RENDER_WINDOW) {
              return <div key={`spacer-${i}`} style={{ width: layout.cardW }} className="shrink-0" aria-hidden />;
            }
            const r = reviews[i % count];
            const isActive = i === index;
            return (
              <div
                key={`${r.id}-${i}`}
                style={{ width: layout.cardW }}
                className="shrink-0 cursor-pointer"
                aria-hidden={!isActive}
                onClick={() => {
                  if (!isActive && !drag.current.moved) go(i);
                }}
              >
                <ReviewCard review={r} index={i % count} total={count} focused={isActive} reduced={reduced} />
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

          {showDots ? (
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
          ) : (
            <span className="min-w-[4.5rem] text-center text-sm tabular-nums text-[var(--s-muted)]" aria-live="polite">
              <strong className="font-semibold text-[var(--s-ink)]">{active + 1}</strong> / {count}
            </span>
          )}

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

function ReviewCard({ review, index, total, focused, reduced }: { review: GoogleReview; index: number; total: number; focused: boolean; reduced: boolean }) {
  const [open, setOpen] = useState(false);
  const long = review.text.length > CLAMP_CHARS;
  const text = long && !open ? `${review.text.slice(0, CLAMP_CHARS).trimEnd()}…` : review.text;
  const tab = focused ? undefined : -1;

  return (
    <figure
      className={`s-card flex h-full flex-col p-6 ${
        focused ? "bg-white shadow-[var(--s-shadow-lg)] ring-1 ring-[var(--s-ink)]/10" : "bg-[var(--s-paper-2)] shadow-none"
      }`}
      style={{
        transform: focused ? "scale(1)" : "scale(0.94)",
        transformOrigin: "center",
        transition: reduced ? "none" : "transform 560ms cubic-bezier(0.22, 1, 0.36, 1), background-color 560ms ease, box-shadow 560ms ease",
      }}
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
          <button
            type="button"
            tabIndex={tab}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
            className="ml-1 font-semibold text-[var(--s-ink)] underline underline-offset-4"
            aria-expanded={open}
          >
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
