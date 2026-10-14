import { OffersManager } from "@/components/admin/OffersManager";
import { prisma } from "@/lib/db";
import { mediaUrl } from "@/lib/content";

export const dynamic = "force-dynamic";

const ymd = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);

export default async function OffersAdminPage() {
  const rows = await prisma.offer.findMany({ orderBy: [{ isActive: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }] });
  const live = rows.filter((r) => r.isActive).length;

  return (
    <div>
      <header className="flex flex-wrap items-center gap-3">
        <span className="ro-plate py-1.5">Offers</span>
        <span className="ro-mono text-xs font-semibold tracking-widest text-[var(--ro-ink-2)]">
          {live} LIVE · {rows.length} TOTAL
        </span>
      </header>
      <p className="mt-2 max-w-2xl text-[0.8rem] text-[var(--ro-ink-2)]">
        Admission offers shown on the homepage and the Offers page. An offer with an end date disappears from the site automatically after that date.
      </p>
      <OffersManager
        offers={rows.map((r) => ({
          id: r.id,
          title: r.title,
          highlight: r.highlight,
          description: r.description,
          validFrom: ymd(r.validFrom),
          validUntil: ymd(r.validUntil),
          isActive: r.isActive,
          sortOrder: r.sortOrder,
          imageUrl: r.mediaId ? mediaUrl(r.mediaId) : null,
        }))}
      />
    </div>
  );
}
