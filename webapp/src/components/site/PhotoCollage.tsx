import Image from "next/image";
import { DoodleIcon } from "@/components/site/Doodles";
import { MAPS_PHOTOS, type MapsPhoto } from "@/lib/maps-photos";

// Server-rendered collage of the Google Maps photos. Three looks:
//  - stack: big hero stack of three tilted prints with doodles
//  - fan:   three prints fanned like a hand of cards (page headers)
//  - grid:  two-by-two bento (about page)
// Entry pop-in and hover straighten are CSS only, so no JS ships for this.

type Props = {
  variant?: "stack" | "fan" | "grid";
  /** Rotate the photo order so pages don't all open on the same picture. */
  start?: number;
  photos?: MapsPhoto[];
  className?: string;
};

function pick(photos: MapsPhoto[], start: number, n: number) {
  if (photos.length === 0) return [];
  return Array.from({ length: Math.min(n, photos.length) }, (_, i) => photos[(start + i) % photos.length]);
}

function Print({ p, r, delay, sizes, className = "", caption }: { p: MapsPhoto; r: number; delay: number; sizes: string; className?: string; caption?: boolean }) {
  return (
    <figure
      className={`s-polaroid s-collage-item rounded-xl border border-[var(--s-line)] bg-white p-1.5 shadow-[var(--s-shadow)] sm:p-2 ${className}`}
      style={{ "--r": `${r}deg`, "--delay": `${delay}ms` } as React.CSSProperties}
    >
      <span className="block aspect-[4/3] overflow-hidden rounded-lg bg-[var(--s-paper-3)]">
        <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes={sizes} className="h-full w-full object-cover" />
      </span>
      {caption && (
        <figcaption className="s-mono mt-1.5 flex items-center justify-between gap-2 px-1 text-[0.6rem] uppercase tracking-widest text-[var(--s-muted)]">
          <span className="truncate">{p.tag}</span>
          <DoodleIcon name="sparkles" size={11} fill="currentColor" strokeWidth={1.5} className="shrink-0 text-[var(--s-accent)]" />
        </figcaption>
      )}
    </figure>
  );
}

export function PhotoCollage({ variant = "fan", start = 0, photos = MAPS_PHOTOS, className = "" }: Props) {
  if (variant === "grid") {
    const list = pick(photos, start, 4);
    if (list.length === 0) return null;
    return (
      <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${className}`}>
        {list.map((p, i) => (
          <Print key={p.src} p={p} r={[-2, 2.5, 1.5, -2.5][i]} delay={i * 110} sizes="(max-width: 1024px) 50vw, 25vw" caption />
        ))}
      </div>
    );
  }

  if (variant === "stack") {
    const [a, b, c] = pick(photos, start, 3);
    if (!a) return null;
    return (
      <div className={`relative mx-auto aspect-[5/4] w-full max-w-xl ${className}`} aria-label="Photos of students at CODE" role="group">
        {/* back print */}
        {c && <Print p={c} r={7} delay={0} sizes="(max-width: 1024px) 60vw, 28vw" className="absolute right-0 top-0 w-[58%]" />}
        {/* main print */}
        <Print p={a} r={-3} delay={140} sizes="(max-width: 1024px) 85vw, 40vw" className="absolute left-0 top-[12%] z-[1] w-[72%]" caption />
        {/* front print */}
        {b && <Print p={b} r={4} delay={280} sizes="(max-width: 1024px) 50vw, 24vw" className="absolute bottom-0 right-[2%] z-[2] w-[50%]" caption />}

        {/* doodles */}
        <span className="s-doodle s-doodle--twinkle" style={{ top: "-4%", left: "8%", "--c": "#fbbc04", "--t": "2.8s" } as React.CSSProperties} aria-hidden>
          <DoodleIcon name="sparkles" size={34} fill="currentColor" strokeWidth={1.5} />
        </span>
        <span className="s-doodle" style={{ top: "40%", right: "-6%", "--c": "var(--s-accent)", "--t": "5.5s", "--rot": "-15deg" } as React.CSSProperties} aria-hidden>
          <DoodleIcon name="rocket" size={38} />
        </span>
        <span className="s-doodle s-doodle--twinkle" style={{ bottom: "6%", left: "-2%", "--c": "#ffb39e", "--t": "3.4s", "--delay": "0.7s" } as React.CSSProperties} aria-hidden>
          <DoodleIcon name="star" size={24} fill="currentColor" strokeWidth={1.5} />
        </span>
        <span className="s-doodle s-doodle--wobble" style={{ bottom: "-3%", left: "40%", "--c": "#9ad7b5", "--t": "4.8s" } as React.CSSProperties} aria-hidden>
          <DoodleIcon name="cap" size={30} />
        </span>
        <span className="s-chip s-collage-item absolute left-[2%] top-0 z-[3] bg-[var(--s-accent)] text-white shadow-[var(--s-shadow)]" style={{ "--delay": "420ms" } as React.CSSProperties}>
          <DoodleIcon name="party" size={13} /> Admission open
        </span>
      </div>
    );
  }

  // fan
  const list = pick(photos, start, 3);
  if (list.length === 0) return null;
  return (
    <div className={`relative mx-auto flex w-full max-w-md items-end justify-center ${className}`} role="group" aria-label="Photos of students at CODE">
      {list.map((p, i) => (
        <Print
          key={p.src}
          p={p}
          r={[-9, 0, 9][i]}
          delay={i * 130}
          sizes="(max-width: 1024px) 40vw, 18vw"
          className={`w-[46%] shrink-0 ${i === 1 ? "z-[1] -mx-[8%] mb-4" : ""}`}
        />
      ))}
      <span className="s-doodle s-doodle--twinkle" style={{ top: "-10%", right: "4%", "--c": "#fbbc04", "--t": "3s" } as React.CSSProperties} aria-hidden>
        <DoodleIcon name="sparkles" size={28} fill="currentColor" strokeWidth={1.5} />
      </span>
      <span className="s-doodle s-doodle--twinkle" style={{ bottom: "-6%", left: "2%", "--c": "var(--s-accent)", "--t": "2.6s", "--delay": "0.9s" } as React.CSSProperties} aria-hidden>
        <DoodleIcon name="star" size={20} fill="currentColor" strokeWidth={1.5} />
      </span>
    </div>
  );
}
