import type { Metadata } from "next";
import { EventCard } from "@/components/site/EventCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { getEvents } from "@/lib/content";
import { breadcrumbSchema, eventSchema } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Events, Workshops & Demo Classes",
  description: "Upcoming demo classes, workshops and student events at CODE computer centre in Bagdogra.",
  alternates: { canonical: "/events" },
  openGraph: { url: "/events", title: "Events & Workshops | CODE Bagdogra" },
};

export default async function EventsPage() {
  const { upcoming, past } = await getEvents();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }])} />
      {upcoming.map((e) => (
        <JsonLd key={e.id} data={eventSchema({ ...e, imageUrl: e.image?.url ?? null })} />
      ))}

      <section className="s-grid s-grid-fade">
        <div className="s-container py-14 sm:py-20">
          <SectionHeading
            eyebrow="Events"
            title="Events at the centre"
            lead="Free demo classes, workshops, certificate days and student meet-ups. Message us to reserve a seat."
          />
        </div>
      </section>

      <section>
        <div className="s-container pb-16">
          <h2 className="text-2xl">Upcoming</h2>
          {upcoming.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-[var(--s-line-2)] p-10 text-center">
              <p className="text-lg font-semibold text-[var(--s-ink)]">Nothing scheduled right now.</p>
              <p className="mt-2 text-[var(--s-muted)]">Want a free demo class? We run them on request — just ask.</p>
              <a href={whatsappLink("a free demo class")} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent mt-6">
                Ask for a demo class
              </a>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}

          {past.length > 0 && (
            <>
              <h2 className="mt-14 text-2xl">Past events</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {past.map((e) => (
                  <EventCard key={e.id} event={e} past />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
