import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/site/CourseCard";
import { GuideBlocks } from "@/components/site/GuideBlocks";
import { JsonLd } from "@/components/JsonLd";
import { AREAS, DIRECTIONS_URL, areaBySlug } from "@/lib/areas";
import { getCourses } from "@/lib/content";
import { formatDate, guideContext, type Block } from "@/lib/guides";
import { OG_IMAGE, breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/seo";
import { ADDRESS_LINES, GOOGLE_MAPS_URL, HOURS, HOURS_CLOSED, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/site";

export const revalidate = 300;

export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const area = areaBySlug(slug);
  if (!area) return { title: "Area not found" };
  return {
    title: { absolute: `${area.seoTitle} | CODE Bagdogra` },
    description: area.description,
    keywords: [`computer course ${area.name}`, `computer centre near ${area.name}`, ...(area.aka ?? []).map((n) => `computer class ${n}`)],
    alternates: { canonical: `/areas/${slug}` },
    openGraph: { ...OG_IMAGE, url: `/areas/${slug}`, title: `${area.seoTitle} | CODE Bagdogra`, description: area.description },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = areaBySlug(slug);
  if (!area) notFound();

  const courses = await getCourses();
  const ctx = guideContext(courses);
  const blocks = area.body(ctx);
  const tldr = area.tldr(ctx);
  const faq = blocks.flatMap((b) => (b.type === "faq" ? b.items : []));
  const sections = blocks.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2");
  const picks = area.courses.map((name) => courses.find((c) => c.name === name)).filter((c): c is NonNullable<typeof c> => !!c);
  const others = AREAS.filter((a) => a.slug !== area.slug);
  const title = `Computer courses near ${area.name}`;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Areas", path: "/areas" }, { name: area.name, path: `/areas/${slug}` }])} />
      <JsonLd data={webPageSchema({ path: `/areas/${slug}`, name: title, description: area.description, dateModified: area.updated, datePublished: area.updated })} />
      {faq.length > 0 && <JsonLd data={faqSchema(faq)} />}

      <article>
        <header className="s-grid--dark text-white">
          <div className="s-container py-14 sm:py-20">
            <nav aria-label="Breadcrumb" className="s-mono text-xs text-white/60">
              <Link href="/" className="hover:text-white">Home</Link> / <Link href="/areas" className="hover:text-white">Areas</Link> / <span className="text-white/80">{area.name}</span>
            </nav>
            <p className="s-eyebrow s-eyebrow--light mt-6">{area.distance} from the centre</p>
            <h1 className="mt-3 max-w-4xl text-3xl leading-tight text-white sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-white/75">
              CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI — taught in person at CODE, Lokenath Nagar Road, Bagdogra.
              {area.aka?.length ? ` Also written ${area.aka.join(", ")}.` : ""}
            </p>
            <p className="s-mono mt-5 text-xs text-white/60">
              Updated <time dateTime={area.updated}>{formatDate(area.updated)}</time>
            </p>
          </div>
        </header>

        <section className="border-b border-[var(--s-line)] bg-white">
          <div className="s-container py-10 sm:py-12">
            <p className="s-eyebrow">The short answer</p>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--s-ink)]">{tldr}</p>
            <p lang="bn" className="mt-5 max-w-3xl text-sm leading-relaxed text-[var(--s-body)]">
              {area.nameBn} থেকে ছাত্রছাত্রীদের জন্য কম্পিউটার কোর্স — CCA, DCA, ADCA, ওয়েব ডিজাইন, ই-কমার্স, ডিজিটাল মার্কেটিং ও AI, বাগডোগরার CODE সেন্টারে। ক্লাস বাংলা, হিন্দি বা ইংরেজিতে; মাসিক ফি প্ল্যান আছে।
            </p>
            <p lang="hi" className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--s-body)]">
              {area.nameHi} के छात्रों के लिए कंप्यूटर कोर्स — CCA, DCA, ADCA, वेब डिज़ाइन, ई-कॉमर्स, डिजिटल मार्केटिंग और AI, बागडोगरा के CODE सेंटर में। क्लास बांग्ला, हिंदी या अंग्रेज़ी में; मासिक फीस प्लान उपलब्ध।
            </p>
          </div>
        </section>

        <div className="s-container grid gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <GuideBlocks blocks={blocks} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="s-card p-5">
              <p className="s-eyebrow">Getting here from {area.name}</p>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-[var(--s-muted)]">Distance</dt>
                  <dd className="font-semibold text-[var(--s-ink)]">{area.distance}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-[var(--s-muted)]">Travel time</dt>
                  <dd className="font-semibold text-[var(--s-ink)]">{area.travel}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-[var(--s-muted)]">Route</dt>
                  <dd className="text-[var(--s-body)]">{area.route}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-[var(--s-muted)]">Address</dt>
                  <dd>
                    <address className="not-italic text-[var(--s-body)]">
                      {ADDRESS_LINES.map((l) => (
                        <span key={l} className="block">{l}</span>
                      ))}
                    </address>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-[var(--s-muted)]">Hours</dt>
                  <dd className="text-[var(--s-body)]">
                    {HOURS}
                    <span className="block text-[var(--s-muted)]">{HOURS_CLOSED}</span>
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-[var(--s-muted)]">Distances are straight-line and rounded; travel times are typical, not promised.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--outline s-btn--sm">
                  Directions
                </a>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--outline s-btn--sm">
                  Google Maps
                </a>
              </div>
            </div>

            {sections.length > 1 && (
              <nav aria-label="On this page" className="s-card p-5">
                <p className="s-eyebrow">On this page</p>
                <ol className="mt-3 space-y-2 text-sm">
                  {sections.map((s) => (
                    <li key={s.text}>
                      <a href={`#${s.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`} className="text-[var(--s-body)] hover:text-[var(--s-ink)]">
                        {s.text}
                      </a>
                    </li>
                  ))}
                  {faq.length > 0 && (
                    <li>
                      <a href="#faq" className="text-[var(--s-body)] hover:text-[var(--s-ink)]">
                        Frequently asked questions
                      </a>
                    </li>
                  )}
                </ol>
              </nav>
            )}

            <div className="s-card p-5">
              <p className="s-eyebrow">Ask about a batch</p>
              <p className="mt-2 text-sm text-[var(--s-body)]">Say where you are coming from and your free hours; a trainer replies on WhatsApp with a batch that has a seat.</p>
              <a href={whatsappLink(`a course — I'm from ${area.name}`)} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent s-btn--sm mt-4">
                Ask on WhatsApp
              </a>
              <a href={`tel:${PHONE_TEL}`} className="mt-3 block text-sm font-semibold text-[var(--s-ink)]">
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </aside>
        </div>
      </article>

      {picks.length > 0 && (
        <section className="bg-[var(--s-paper-2)]">
          <div className="s-container py-14 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl">Courses most asked for from {area.name}</h2>
              <Link href="/courses" className="s-btn s-btn--outline s-btn--sm">
                All courses
              </Link>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {picks.map((c) => (
                <CourseCard key={c.id} course={c} index={courses.indexOf(c)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="s-container py-14 sm:py-20">
          <h2 className="text-2xl">Coming from somewhere else?</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {others.map((a) => (
              <li key={a.slug}>
                <Link href={`/areas/${a.slug}`} className="s-chip border border-[var(--s-line-2)] bg-white text-[var(--s-ink)] hover:border-[var(--s-ink)]">
                  {a.name} · {a.distance}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[var(--s-body)]">
            Every page above describes the same single centre in Bagdogra — <Link href="/contact" className="font-semibold text-[var(--s-ink)] underline decoration-[var(--s-accent)] decoration-2 underline-offset-4">contact and directions</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
