import type { PublicEvent } from "@/lib/content";
import { formatDayMonth, formatEventDate, formatEventTime } from "@/lib/format";
import { whatsappLink } from "@/lib/site";
import { MediaImage } from "./MediaImage";

export function EventCard({ event, past = false }: { event: PublicEvent; past?: boolean }) {
  const { day, month } = formatDayMonth(event.startsAt);
  return (
    <article className={`s-card flex gap-5 p-5 sm:p-6 ${past ? "opacity-80" : "s-card--lift"}`}>
      <div className="flex h-fit w-16 shrink-0 flex-col items-center rounded-xl bg-[var(--s-ink)] py-2.5 text-white">
        <span className="s-display text-2xl font-bold leading-none">{day}</span>
        <span className="s-mono mt-1 text-[0.65rem] tracking-widest">{month}</span>
      </div>
      <div className="min-w-0 flex-1">
        {event.image && (
          <MediaImage media={event.image} className="mb-4 h-44 w-full rounded-lg object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        )}
        <h3 className="text-lg leading-snug">{event.title}</h3>
        <p className="s-mono mt-1.5 text-xs text-[var(--s-muted)]">
          {formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt)}
          {event.endsAt ? ` – ${formatEventTime(event.endsAt)}` : ""}
          {event.venue ? ` · ${event.venue}` : " · At the centre"}
        </p>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--s-body)]">{event.description}</p>
        {!past && (
          <a
            href={whatsappLink(`the event "${event.title}"`)}
            target="_blank"
            rel="noopener noreferrer"
            className="s-btn s-btn--outline s-btn--sm mt-4"
          >
            Reserve a seat on WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}
