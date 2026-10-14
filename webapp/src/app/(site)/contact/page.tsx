import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/site/ContactForm";
import { PhotoCollage } from "@/components/site/PhotoCollage";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { getCourses } from "@/lib/content";
import { OG_IMAGE, breadcrumbSchema, organizationId, siteUrl } from "@/lib/seo";
import {
  ADDRESS_LINES,
  AREAS_SERVED,
  EMAIL,
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_MAPS_URL,
  HOURS,
  HOURS_CLOSED,
  LANDMARKS,
  PHONE_DISPLAY,
  PHONE_TEL,
  whatsappLink,
} from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact & Directions — Lokenath Nagar Road, Bagdogra",
  description: "Contact CODE computer centre in Bagdogra: phone +91 96358 09537, WhatsApp, email, address near K1 Fitness Gym, map, hours Mon–Sat 11 AM–9 PM. Enquire about courses, fees and batches.",
  alternates: { canonical: "/contact" },
  openGraph: { ...OG_IMAGE, url: "/contact", title: "Contact CODE Bagdogra" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const [{ course }, courses] = await Promise.all([searchParams, getCourses()]);
  const names = courses.map((c) => c.name);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", url: `${siteUrl()}/contact`, mainEntity: { "@id": organizationId() } }} />

      <section className="s-grid s-grid-fade overflow-hidden">
        <div className="s-container grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading as="h1" eyebrow="Contact" title="Talk to us" lead="Ask about a course, fees, batch timings or directions. WhatsApp is fastest; the form reaches the same desk." />
          </div>
          <PhotoCollage variant="fan" start={0} className="mt-2 lg:mt-0" />
        </div>
      </section>

      <section>
        <div className="s-container grid gap-10 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
          <ContactForm courses={names} defaultCourse={course && names.includes(course) ? course : undefined} />

          <div className="space-y-5">
            <div className="s-card p-6">
              <p className="s-eyebrow">Reach us</p>
              <ul className="mt-4 space-y-3 text-[var(--s-ink)]">
                <li>
                  <span className="block text-xs uppercase tracking-wide text-[var(--s-muted)]">Phone</span>
                  <a href={`tel:${PHONE_TEL}`} className="text-lg font-semibold">{PHONE_DISPLAY}</a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wide text-[var(--s-muted)]">WhatsApp</span>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold">Message us on WhatsApp</a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wide text-[var(--s-muted)]">Email</span>
                  <a href={`mailto:${EMAIL}`} className="font-semibold">{EMAIL}</a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wide text-[var(--s-muted)]">Hours</span>
                  <span className="font-semibold">{HOURS}</span>
                  <span className="block text-sm text-[var(--s-muted)]">{HOURS_CLOSED}</span>
                </li>
              </ul>
            </div>

            <div className="s-card overflow-hidden">
              <iframe
                title="Map: CODE — Computer & Digital Excellence, Bagdogra"
                src={GOOGLE_MAPS_EMBED_URL}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-6">
                <p className="s-eyebrow">Address</p>
                <address className="mt-3 not-italic leading-relaxed text-[var(--s-ink)]">
                  {ADDRESS_LINES.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                </address>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--outline s-btn--sm mt-4">
                  Open in Google Maps
                </a>
              </div>
            </div>

            <div className="s-card p-6">
              <h2 className="text-xl">How to reach CODE</h2>
              <dl className="mt-3 divide-y divide-[var(--s-line)]">
                {LANDMARKS.map((l) => (
                  <div key={l.name} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                    <dt className="text-[var(--s-body)]">From {l.name}</dt>
                    <dd className="shrink-0 font-semibold text-[var(--s-ink)]">{l.distance}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-[var(--s-body)]">
                Students reach us from {AREAS_SERVED.slice(0, -1).join(", ")} and {AREAS_SERVED[AREAS_SERVED.length - 1]} by bus, auto or bike. Look for K1 Fitness Gym on Lokenath Nagar Road; the centre is beside it.
              </p>
              <p className="mt-3 text-sm text-[var(--s-body)]">
                Coming from Shibmandir, Medical, Matigara, Siliguri or Naxalbari?{" "}
                <Link href="/areas" className="font-semibold text-[var(--s-ink)] underline decoration-[var(--s-accent)] decoration-2 underline-offset-4">
                  Route, travel time and batch advice for your area
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
