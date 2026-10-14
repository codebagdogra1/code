import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "@/components/site/CourseCard";
import { EventCard } from "@/components/site/EventCard";
import { Faq } from "@/components/site/Faq";
import { GoogleBadge } from "@/components/site/GoogleBadge";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import { MediaImage } from "@/components/site/MediaImage";
import { MomentsShowcase } from "@/components/site/MomentsShowcase";
import { PhotoCollage } from "@/components/site/PhotoCollage";
import { OfferCard } from "@/components/site/OfferCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { getActiveOffers, getCourses, getEvents, getGallery } from "@/lib/content";
import { getGoogleReviews } from "@/lib/google-reviews";
import { FAQ } from "@/lib/course-content";
import { OG_IMAGE, courseListSchema, faqSchema, organizationSchema } from "@/lib/seo";
import {
  ADDRESS_LINES,
  AREAS_SERVED,
  GOOGLE_MAPS_URL,
  HOURS,
  LANDMARKS,
  LANGUAGES,
  PHONE_DISPLAY,
  PHONE_TEL,
  whatsappLink,
} from "@/lib/site";

// Prerendered and refreshed every 5 minutes; admin edits also revalidate on demand.
export const revalidate = 300;

export const metadata: Metadata = {
  // Absolute: the layout template would otherwise append a second "CODE Bagdogra".
  title: { absolute: "Computer Courses in Bagdogra & Siliguri | CODE — Computer & Digital Excellence" },
  description:
    "CODE is a computer training centre in Bagdogra, Siliguri. CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI prompt engineering with monthly fee plans. Rated 5.0 on Google.",
  alternates: { canonical: "/" },
  openGraph: { ...OG_IMAGE, url: "/", title: "Computer Courses in Bagdogra & Siliguri | CODE" },
};

const WHY = [
  {
    title: "Hands-on from day one",
    text: "Every class is at a computer. You practise what was just taught, with the trainer in the room.",
    icon: "M4 6h16v10H4zM2 19h20M9 16v3M15 16v3",
  },
  {
    title: "Small batches, real attention",
    text: "Doubts get answered the same day. Trainers know every student by name.",
    icon: "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21a8 8 0 0 1 16 0",
  },
  {
    title: "Monthly fee plans",
    text: "Pay month by month with a printed receipt for every payment. No hidden charges.",
    icon: "M3 7h18v12H3zM3 11h18M7 15h3",
  },
  {
    title: "Certificate on completion",
    text: "Finish the course and assessment and receive a CODE certificate for your file.",
    icon: "M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM8.5 14 7 22l5-3 5 3-1.5-8",
  },
];

export default async function HomePage() {
  const [courses, offers, { upcoming }, gallery, google] = await Promise.all([
    getCourses(),
    getActiveOffers(),
    getEvents(),
    getGallery(5),
    getGoogleReviews(),
  ]);
  const courseNames = courses.map((c) => c.content.displayName);
  const heroPhotos = gallery.slice(0, 3);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={faqSchema(FAQ)} />
      {courses.length > 0 && (
        <JsonLd
          data={courseListSchema(
            courses.map((c) => ({ name: c.content.displayName, slug: c.content.slug, summary: c.content.summary })),
          )}
        />
      )}

      {/* HERO */}
      <section className="s-grid--dark relative overflow-hidden text-white">
        <div className="s-container grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="s-eyebrow s-eyebrow--light">Computer training centre · Bagdogra</p>
            <h1 className="mt-4 text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Computer courses in Bagdogra, taught the practical way.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              From your first click to job-ready skills in web design, ecommerce, digital marketing and
              AI. Small batches, hands-on classes and monthly fee plans at our centre in Bagdogra.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/courses" className="s-btn s-btn--accent">
                See all courses
              </Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--ghost-light">
                Ask on WhatsApp
              </a>
            </div>

            {/* Google rating badge — the trust signal local visitors recognise. */}
            <div className="mt-8">
              <GoogleBadge size="lg" rating={google.rating} count={google.count} href={google.mapsUrl} tone="dark" />
            </div>

            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-6">
              <div>
                <dt className="s-mono text-[0.65rem] uppercase tracking-widest text-white/60">Courses</dt>
                <dd className="s-display mt-1 text-2xl font-bold">
                  {courses.length || "9"}
                  <span className="block text-xs font-normal text-white/60">beginner to job-ready</span>
                </dd>
              </div>
              <div>
                <dt className="s-mono text-[0.65rem] uppercase tracking-widest text-white/60">Open</dt>
                <dd className="s-display mt-1 text-2xl font-bold">
                  Mon–Sat
                  <span className="block text-xs font-normal text-white/60">11 AM – 9 PM</span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Right: photos uploaded through /admin when there are any, otherwise a
              tilted stack of the Google Maps photos of students at the centre. */}
          <div className="relative">
            {heroPhotos.length >= 1 ? (
              <div className="grid grid-cols-2 gap-3">
                <MediaImage
                  media={heroPhotos[0]}
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className={`${heroPhotos.length >= 3 ? "col-span-2" : "col-span-2"} aspect-[16/10] w-full rounded-2xl object-cover shadow-[var(--s-shadow-lg)]`}
                />
                {heroPhotos.slice(1, 3).map((m) => (
                  <MediaImage key={m.id} media={m} sizes="20vw" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                ))}
              </div>
            ) : (
              <PhotoCollage variant="stack" className="lg:ml-auto" />
            )}
          </div>
        </div>

        {/* Course marquee */}
        {courseNames.length > 0 && (
          <div className="border-t border-white/10 bg-black/20 py-3" aria-hidden>
            <div className="flex overflow-hidden">
              <div className="s-marquee flex shrink-0 gap-10 whitespace-nowrap pr-10">
                {[...courseNames, ...courseNames].map((n, i) => (
                  <span key={i} className="s-mono text-xs uppercase tracking-[0.2em] text-white/60">
                    {n} <span className="ml-10 text-[var(--s-accent)]">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* OFFERS */}
      {offers.length > 0 && (
        <section className="bg-[var(--s-paper-2)]" id="offers">
          <div className="s-container py-14 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="01 · Offers" title="Current offers" lead="Limited-period admission offers at the centre." />
              <Link href="/offers" className="s-btn s-btn--outline s-btn--sm">
                All offers
              </Link>
            </div>
            <div className={`mt-8 grid gap-5 ${offers.length > 1 ? "md:grid-cols-2" : ""}`}>
              {offers.slice(0, 2).map((o) => (
                <OfferCard key={o.id} offer={o} featured={offers.length === 1} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COURSES */}
      <section id="courses">
        <div className="s-container py-14 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow={`${offers.length > 0 ? "02" : "01"} · Courses`}
              title="Courses for every starting point"
              lead="Begin with the basics or go straight to a specialist skill. Ask us for the current fee and batch timing."
            />
            <Link href="/courses" className="s-btn s-btn--outline s-btn--sm">
              Compare all courses
            </Link>
          </div>
          {courses.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 6).map((c, i) => (
                <CourseCard key={c.id} course={c} index={i} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-xl border border-dashed border-[var(--s-line-2)] p-8 text-center text-[var(--s-muted)]">
              The course list is temporarily unavailable. Call {PHONE_DISPLAY} for the current catalogue.
            </p>
          )}
        </div>
      </section>

      {/* REAL MOMENTS — photos from the Google Maps listing */}
      <MomentsShowcase />

      {/* WHY */}
      <section className="s-grid s-grid-fade">
        <div className="s-container py-14 sm:py-20">
          <SectionHeading eyebrow="Why CODE" title="A centre built around practice, not lectures" align="center" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.title} className="s-card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--s-ink)] text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={w.icon} />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--s-body)]">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section>
          <div className="s-container py-14 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Inside the centre" title="Take a look around" />
              <Link href="/gallery" className="s-btn s-btn--outline s-btn--sm">
                Full gallery
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {gallery.map((g, i) => (
                <Link key={g.id} href="/gallery" className={`overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                  <MediaImage media={g} sizes="(max-width: 640px) 50vw, 20vw" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EVENTS */}
      {upcoming.length > 0 && (
        <section className="bg-[var(--s-paper-2)]">
          <div className="s-container py-14 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Upcoming" title="Events at the centre" lead="Demo classes, workshops and student events. Seats are limited." />
              <Link href="/events" className="s-btn s-btn--outline s-btn--sm">
                All events
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {upcoming.slice(0, 2).map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REVIEWS */}
      <section id="reviews">
        <div className="s-container pt-14 sm:pt-20">
          <SectionHeading eyebrow="Reviews" title="What students say on Google" align="center" />
        </div>
        <div className="pb-14 sm:pb-20">
          <GoogleReviews />
        </div>
      </section>

      {/* LOCAL — who and where the centre is for, in plain sentences a search or answer engine can quote. */}
      <section className="bg-white" id="bagdogra">
        <div className="s-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              eyebrow="Bagdogra · Siliguri"
              title="A computer institute in Bagdogra, within reach of Siliguri"
              lead={`CODE is on Lokenath Nagar Road in Bagdogra, ${LANDMARKS[0].distance} from ${LANDMARKS[0].name} and ${LANDMARKS[1].distance} from ${LANDMARKS[1].name}. Students come from across Bagdogra and the Siliguri side, and classes are explained in ${LANGUAGES.join(", ")}.`}
            />
            <p className="s-eyebrow mt-8">Areas we serve</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {AREAS_SERVED.map((a) => (
                <li key={a} className="s-chip border border-[var(--s-line-2)] bg-white text-[var(--s-ink)]">
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="s-card h-fit p-6">
            <p className="s-eyebrow">Getting here</p>
            <dl className="mt-4 divide-y divide-[var(--s-line)]">
              {LANDMARKS.map((l) => (
                <div key={l.name} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                  <dt className="text-[var(--s-body)]">{l.name}</dt>
                  <dd className="shrink-0 font-semibold text-[var(--s-ink)]">{l.distance}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-[var(--s-muted)]">Straight-line distances. Buses, autos and bikes reach the centre from all of these.</p>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--outline s-btn--sm mt-5">
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* FAQ + LOCATION */}
      <section className="bg-[var(--s-paper-2)]">
        <div className="s-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="FAQ" title="Questions parents and students ask" />
            <div className="mt-8">
              <Faq items={FAQ} />
            </div>
          </div>
          <div className="s-card s-card--lift h-fit overflow-hidden">
            <iframe
              title="Map: CODE — Computer & Digital Excellence, Bagdogra"
              src="https://www.google.com/maps?q=Computer+and+Digital+Excellence+-+CODE,+Bagdogra&output=embed"
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-6">
              <p className="s-eyebrow">Find us</p>
              <address className="mt-3 not-italic leading-relaxed text-[var(--s-ink)]">
                {ADDRESS_LINES.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <p className="mt-2 text-sm text-[var(--s-muted)]">{HOURS}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={`tel:${PHONE_TEL}`} className="s-btn s-btn--sm">
                  Call {PHONE_DISPLAY}
                </a>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--outline s-btn--sm">
                  Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="s-grid--dark text-white">
        <div className="s-container flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl text-white">Not sure which course fits?</h2>
            <p className="mt-2 max-w-lg text-white/75">
              Tell us your goal and we&apos;ll suggest a starting point, the batch timing and the fee plan. No pressure.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent">
              WhatsApp us
            </a>
            <Link href="/contact" className="s-btn s-btn--white">
              Send an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
