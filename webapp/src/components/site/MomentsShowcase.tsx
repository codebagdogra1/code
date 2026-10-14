"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MAPS_PHOTOS, type MapsPhoto } from "@/lib/maps-photos";
import { GOOGLE_MAPS_URL, GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from "@/lib/site";
import { DoodleIcon, DoodleLayer } from "@/components/site/Doodles";
import { SectionHeading } from "@/components/site/SectionHeading";

const INTERVAL_MS = 5000;
const TILTS = [-4, 3, -2.5, 4, -3, 2];

// "Real moments" — photos from the centre's Google Maps listing in a Ken Burns
// crossfade stage with a polaroid wall beside it. Autoplay pauses on hover,
// on focus, when the tab is hidden, and whenever the section is off-screen;
// prefers-reduced-motion turns autoplay and all decorative motion off.
export function MomentsShowcase({ photos = MAPS_PHOTOS, eyebrow = "From our Google listing" }: { photos?: MapsPhoto[]; eyebrow?: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [cycle, setCycle] = useState(0); // bumps to restart the progress bar
  const sectionRef = useRef<HTMLElement>(null);
  const count = photos.length;

  const go = useCallback(
    (i: number) => {
      setActive(((i % count) + count) % count);
      setCycle((c) => c + 1);
    },
    [count],
  );

  // Reduced motion → no autoplay, no reveals.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Scroll reveal + "only animate while visible".
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".s-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === root) setInView(e.isIntersecting);
          else if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(root);
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const running = inView && !paused && !reduced && count > 1;

  useEffect(() => {
    if (!running) return;
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const t = window.setTimeout(() => go(active + 1), INTERVAL_MS);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [running, active, cycle, go]);

  if (count === 0) return null;
  const current = photos[active];

  return (
    <section
      ref={sectionRef}
      className="s-moments relative overflow-hidden bg-[var(--s-paper)]"
      aria-labelledby="moments-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {/* Soft colour blobs behind everything */}
      <div className="s-moments__blob h-72 w-72 -left-20 top-10" style={{ background: "var(--m-blob-1)" }} aria-hidden />
      <div className="s-moments__blob h-80 w-80 -right-24 top-1/3" style={{ background: "var(--m-blob-2)", animationDelay: "-6s" }} aria-hidden />
      <div className="s-moments__blob h-64 w-64 bottom-0 left-1/3" style={{ background: "var(--m-blob-3)", animationDelay: "-11s" }} aria-hidden />
      <div className="s-moments__blob h-56 w-56 -bottom-10 right-1/4" style={{ background: "var(--m-blob-4)", animationDelay: "-3s" }} aria-hidden />
      <DoodleLayer />

      <div className="s-container relative py-14 sm:py-20">
        <div className="s-reveal flex flex-wrap items-end justify-between gap-4">
          <div id="moments-title">
            <SectionHeading
              eyebrow={eyebrow}
              title="Real moments at CODE"
              lead="Batch photos, surprise cakes and a few proud days — straight from what students and trainers share on Google."
            />
          </div>
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--outline s-btn--sm">
            <span className="text-[#fbbc04]" aria-hidden>
              ★
            </span>
            {GOOGLE_RATING} on Google · {GOOGLE_REVIEW_COUNT} reviews
          </a>
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
          {/* STAGE */}
          <div className="s-reveal" style={{ "--d": "120ms" } as React.CSSProperties}>
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/60 bg-[var(--s-ink)] shadow-[var(--s-shadow-lg)]"
              role="group"
              aria-roledescription="carousel"
              aria-label="Photos from the centre"
            >
              {photos.map((p, i) => (
                <figure
                  key={p.src}
                  className={`s-stage__slide ${i === active ? "is-active" : ""}`}
                  aria-hidden={i !== active}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority={i === 0}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[rgb(11_20_55/0.85)] to-transparent" />
                  <figcaption className="s-stage__caption absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 text-white sm:p-6">
                    <span>
                      <span className="s-chip bg-white/15 text-white backdrop-blur">
                        <DoodleIcon name="sparkles" size={14} fill="currentColor" strokeWidth={1.5} />
                        {p.tag}
                      </span>
                      <span className="s-display mt-2 block max-w-md text-lg font-bold leading-snug sm:text-xl">{p.caption}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}

              {/* Progress + controls */}
              {count > 1 && (
                <>
                  <div className="absolute inset-x-0 top-0 z-[2] h-1 bg-white/20">
                    <div
                      key={cycle}
                      className={`s-stage__bar h-full bg-[var(--s-accent)] ${running ? "is-running" : ""}`}
                      style={{ "--interval": `${INTERVAL_MS}ms` } as React.CSSProperties}
                    />
                  </div>
                  <div className="absolute right-4 top-4 z-[2] flex gap-2">
                    <button
                      type="button"
                      onClick={() => go(active - 1)}
                      aria-label="Previous photo"
                      className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-[var(--s-ink)]"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => go(active + 1)}
                      aria-label="Next photo"
                      className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-[var(--s-ink)]"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>

            {count > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Choose photo">
                {photos.map((p, i) => (
                  <button
                    key={p.src}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Photo ${i + 1}: ${p.tag}`}
                    onClick={() => go(i)}
                    className={`h-2.5 rounded-full transition-all ${i === active ? "w-8 bg-[var(--s-accent)]" : "w-2.5 bg-[var(--s-line-2)] hover:bg-[var(--s-ink-3)]"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* POLAROID WALL */}
          <div className="s-reveal" style={{ "--d": "240ms" } as React.CSSProperties}>
            <ul className="grid grid-cols-4 gap-2 sm:gap-4 lg:grid-cols-2 lg:gap-6" aria-label="All photos">
              {photos.map((p, i) => (
                <li key={p.src} className={i === 2 && count === 4 ? "lg:col-span-2 lg:justify-self-center lg:w-[62%]" : ""}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Show photo: ${p.caption}`}
                    aria-current={i === active ? "true" : undefined}
                    className={`s-polaroid block w-full rounded-xl border border-[var(--s-line)] bg-white p-1.5 pb-1.5 shadow-[var(--s-shadow)] sm:p-2 sm:pb-2 ${i === active ? "is-active" : ""}`}
                    style={{ "--r": `${TILTS[i % TILTS.length]}deg` } as React.CSSProperties}
                  >
                    <span className="block aspect-[4/3] overflow-hidden rounded-lg bg-[var(--s-paper-3)]">
                      <Image src={p.src} alt="" width={p.width} height={p.height} sizes="(max-width: 1024px) 33vw, 18vw" className="h-full w-full object-cover" />
                    </span>
                    <span className="s-mono mt-1.5 hidden items-center justify-between gap-2 px-1 text-[0.62rem] uppercase tracking-widest text-[var(--s-muted)] sm:flex">
                      <span className="truncate">{p.tag}</span>
                      <span className={i === active ? "text-[var(--s-accent)]" : ""}>{String(i + 1).padStart(2, "0")}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="s-card s-card--lift mt-6 flex items-center gap-4 p-4 sm:p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--s-accent-tint)] text-[var(--s-accent)]">
                <DoodleIcon name="rocket" size={26} />
              </span>
              <p className="text-sm leading-relaxed text-[var(--s-body)]">
                <span className="block font-semibold text-[var(--s-ink)]">Your photo could be next.</span>
                Every batch at CODE gets its lab photo — and a cake when there is something to celebrate.
              </p>
            </div>
          </div>
        </div>

        <p className="s-reveal mt-8 text-center text-xs text-[var(--s-muted)]" style={{ "--d": "360ms" } as React.CSSProperties}>
          Photos from the centre&apos;s public Google Maps listing. Currently showing: {current.tag}.{" "}
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--s-ink)] underline underline-offset-4">
            See all photos on Google
          </a>
        </p>
      </div>
    </section>
  );
}
