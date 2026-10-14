import { GalleryManager } from "@/components/admin/GalleryManager";
import { prisma } from "@/lib/db";
import { mediaUrl } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const rows = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { media: { select: { id: true, width: true, height: true } } },
  });
  const live = rows.filter((r) => r.isPublished).length;

  return (
    <div>
      <header className="flex flex-wrap items-center gap-3">
        <span className="ro-plate py-1.5">Gallery</span>
        <span className="ro-mono text-xs font-semibold tracking-widest text-[var(--ro-ink-2)]">
          {live} LIVE · {rows.length} PHOTOS
        </span>
      </header>
      <p className="mt-2 max-w-2xl text-[0.8rem] text-[var(--ro-ink-2)]">
        Photos of the centre. The first photos in this order are also used on the homepage hero and the About page, so put the best ones first.
      </p>
      <GalleryManager
        images={rows.map((r) => ({
          id: r.id,
          url: mediaUrl(r.media.id),
          width: r.media.width,
          height: r.media.height,
          caption: r.caption,
          isPublished: r.isPublished,
        }))}
      />
    </div>
  );
}
