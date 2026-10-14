import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { AREAS, AREAS_UPDATED, DIRECTIONS_URL } from "@/lib/areas";
import { OG_IMAGE, absoluteUrl, breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { ADDRESS, HOURS, HOURS_CLOSED, whatsappLink } from "@/lib/site";

export const revalidate = 300;

const DESCRIPTION =
  "CODE has one computer training centre, in Bagdogra. These pages are for students travelling from Upper Bagdogra, Station More, Bihar More, Bhujiapani, Putimari, Gossaipur, Buribalason, Kestopur, Shibmandir, Medical, Matigara, Siliguri and Naxalbari: distance, the road in, who joins from there and which batch time fits.";

export const metadata: Metadata = {
  title: "Computer Courses Near You — Bagdogra, Siliguri & Around",
  description: DESCRIPTION,
  alternates: { canonical: "/areas" },
  openGraph: { ...OG_IMAGE, url: "/areas", title: "Computer courses near you | CODE Bagdogra", description: DESCRIPTION },
};

export default function AreasPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Areas", path: "/areas" }])} />
      <JsonLd data={webPageSchema({ path: "/areas", name: "Computer courses near you", description: DESCRIPTION, dateModified: AREAS_UPDATED, type: "CollectionPage" })} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Areas students travel to CODE, Bagdogra from",
          itemListElement: AREAS.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.name, url: absoluteUrl(`/areas/${a.slug}`) })),
        }}
      />

      <section className="s-grid s-grid-fade">
        <div className="s-container py-14 sm:py-20">
          <SectionHeading
            as="h1"
            eyebrow="Areas"
            title="Computer courses near you"
            lead="CODE has one centre, on Lokenath Nagar Road in Bagdogra. Students come from across Bagdogra and the Siliguri side; pick your area for the distance, the road in, who usually joins from there and which batch time fits."
          />
          <p className="mt-6 max-w-2xl text-sm text-[var(--s-muted)]">
            {ADDRESS} · {HOURS} · {HOURS_CLOSED}
          </p>
        </div>
      </section>

      <section>
        <div className="s-container grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a) => (
            <Link key={a.slug} href={`/areas/${a.slug}`} className="s-card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--s-shadow)]">
              <span className="s-mono text-xs text-[var(--s-muted)]">{a.distance}</span>
              <h2 className="mt-3 text-xl leading-snug group-hover:text-[var(--s-accent)]">{a.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--s-body)]">{a.travel} · {a.route}</p>
              <span className="mt-5 text-sm font-semibold text-[var(--s-ink)]">Courses and batch times for {a.name} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="s-grid--dark text-white">
        <div className="s-container flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl text-white">Not on the list?</h2>
            <p className="mt-2 max-w-lg text-white/75">Tell us where you are coming from on WhatsApp and we will say honestly whether the commute works and which batch fits.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink("a course — I'm from a nearby area")} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent">
              WhatsApp us
            </a>
            <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--white">
              Directions to the centre
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
