import Image from "next/image";
import Link from "next/link";
import { DoodleIcon } from "@/components/site/Doodles";
import { MAPS_PHOTOS, type MapsPhoto } from "@/lib/maps-photos";

// A full-width "film strip" of tilted prints sliding slowly across the page.
// CSS-only: the list is rendered twice and translated by -50%, pauses on
// hover, and becomes a static scrollable row under prefers-reduced-motion.
export function PhotoMarquee({
  photos = MAPS_PHOTOS,
  eyebrow = "Life at CODE",
  title = "Small batches. Big smiles.",
  start = 0,
  className = "",
}: {
  photos?: MapsPhoto[];
  eyebrow?: string;
  title?: string;
  start?: number;
  className?: string;
}) {
  if (photos.length === 0) return null;
  const ordered = photos.map((_, i) => photos[(start + i) % photos.length]);
  // Repeat until the strip comfortably exceeds a wide viewport before doubling.
  const base = ordered.length >= 6 ? ordered : [...ordered, ...ordered];
  const tilts = [-3, 2.5, -1.5, 3, -2.5, 2];

  return (
    <section className={`relative overflow-hidden bg-[var(--s-paper-2)] py-12 sm:py-16 ${className}`} aria-labelledby="photo-marquee-title">
      <div className="s-container flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="s-eyebrow">{eyebrow}</p>
          <h2 id="photo-marquee-title" className="mt-2 text-2xl sm:text-3xl">
            {title}
          </h2>
        </div>
        <Link href="/gallery" className="s-btn s-btn--outline s-btn--sm">
          <DoodleIcon name="sparkles" size={14} fill="currentColor" strokeWidth={1.5} className="text-[var(--s-accent)]" />
          See the moments
        </Link>
      </div>

      <div className="s-photo-marquee mt-8" aria-label="Photos of students at the centre">
        <div className="s-photo-marquee__track">
          {[...base, ...base].map((p, i) => (
            <figure
              key={`${p.src}-${i}`}
              className="s-polaroid w-52 shrink-0 rounded-xl border border-[var(--s-line)] bg-white p-1.5 shadow-[var(--s-shadow)] sm:w-64 sm:p-2"
              style={{ "--r": `${tilts[i % tilts.length]}deg` } as React.CSSProperties}
              aria-hidden={i >= base.length}
            >
              <span className="block aspect-[4/3] overflow-hidden rounded-lg bg-[var(--s-paper-3)]">
                <Image src={p.src} alt={i >= base.length ? "" : p.alt} width={p.width} height={p.height} sizes="256px" className="h-full w-full object-cover" />
              </span>
              <figcaption className="s-mono mt-1.5 truncate px-1 text-[0.6rem] uppercase tracking-widest text-[var(--s-muted)]">{p.tag}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
