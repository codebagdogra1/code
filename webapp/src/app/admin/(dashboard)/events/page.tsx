import { EventsManager } from "@/components/admin/EventsManager";
import { prisma } from "@/lib/db";
import { mediaUrl } from "@/lib/content";
import { formatEventDate, formatEventTime } from "@/lib/format";

export const dynamic = "force-dynamic";

// datetime-local wants "yyyy-mm-ddThh:mm" in the centre's timezone.
function toISTLocal(d: Date | null): string | null {
  if (!d) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour") === "24" ? "00" : get("hour")}:${get("minute")}`;
}

export default async function EventsAdminPage() {
  const now = new Date();
  const rows = await prisma.siteEvent.findMany({ orderBy: { startsAt: "desc" } });
  const upcoming = rows.filter((r) => (r.endsAt ?? r.startsAt) >= now && r.isPublished).length;
  // Upcoming first (soonest at top), then past (most recent first).
  const sorted = [
    ...rows.filter((r) => (r.endsAt ?? r.startsAt) >= now).sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime()),
    ...rows.filter((r) => (r.endsAt ?? r.startsAt) < now),
  ];

  return (
    <div>
      <header className="flex flex-wrap items-center gap-3">
        <span className="ro-plate py-1.5">Events</span>
        <span className="ro-mono text-xs font-semibold tracking-widest text-[var(--ro-ink-2)]">
          {upcoming} UPCOMING · {rows.length} TOTAL
        </span>
      </header>
      <p className="mt-2 max-w-2xl text-[0.8rem] text-[var(--ro-ink-2)]">
        Demo classes, workshops and student events. Upcoming events show on the homepage and the Events page; past ones move to the archive automatically.
      </p>
      <EventsManager
        events={sorted.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          startsAt: toISTLocal(r.startsAt) as string,
          endsAt: toISTLocal(r.endsAt),
          venue: r.venue,
          isPublished: r.isPublished,
          imageUrl: r.mediaId ? mediaUrl(r.mediaId) : null,
          startsLabel: `${formatEventDate(r.startsAt)} · ${formatEventTime(r.startsAt)}`,
          past: (r.endsAt ?? r.startsAt) < now,
        }))}
      />
    </div>
  );
}
