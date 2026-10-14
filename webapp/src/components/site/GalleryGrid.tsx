"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PublicGalleryImage } from "@/lib/content";

// Masonry-ish grid with a simple accessible lightbox (Escape / arrows / backdrop).
export function GalleryGrid({ images }: { images: PublicGalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setActive((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, images.length]);

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(i)}
            className="group mb-3 block w-full overflow-hidden rounded-xl border border-[var(--s-line)] bg-[var(--s-paper-2)] sm:mb-4"
            aria-label={img.caption ? `Open photo: ${img.caption}` : "Open photo"}
          >
            <Image
              src={img.url}
              alt={img.alt}
              width={img.width}
              height={img.height}
              unoptimized
              className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {img.caption && (
              <span className="block px-3 py-2 text-left text-xs text-[var(--s-body)]">{img.caption}</span>
            )}
          </button>
        ))}
      </div>

      {active !== null && images[active] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={images[active].caption ?? "Photo"}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgb(11_20_55/0.92)] p-4"
          onClick={() => setActive(null)}
        >
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[active].url}
              alt={images[active].alt}
              width={images[active].width}
              height={images[active].height}
              unoptimized
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {images[active].caption && (
              <figcaption className="mt-3 text-center text-sm text-white/80">{images[active].caption}</figcaption>
            )}
          </figure>
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((active - 1 + images.length) % images.length);
                }}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((active + 1) % images.length);
                }}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
