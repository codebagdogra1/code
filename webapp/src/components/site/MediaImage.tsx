import Image from "next/image";
import type { PublicMedia } from "@/lib/content";

// Images uploaded through /admin are already resized at upload time and served
// by /api/media/[id] with immutable caching, so they bypass the Next optimizer.
export function MediaImage({
  media,
  className,
  sizes,
  priority,
}: {
  media: PublicMedia;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width}
      height={media.height}
      sizes={sizes}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}
