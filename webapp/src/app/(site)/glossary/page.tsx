import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { contentFor } from "@/lib/course-content";
import { GLOSSARY, GLOSSARY_UPDATED, formatDate, guideBySlug, termId } from "@/lib/guides";
import { OG_IMAGE, breadcrumbSchema, definedTermSetSchema, webPageSchema } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const revalidate = 3600;

const DESCRIPTION =
  "One-sentence definitions of computer course terms — CCA, DCA, ADCA, MS Office, SQL, HTML and CSS, WordPress, Shopify, marketplace selling, Meta Ads, Google Business Profile, prompt engineering — each linked to the course at CODE, Bagdogra, that teaches it.";

export const metadata: Metadata = {
  title: "Glossary — CCA, DCA, ADCA and Other Computer Course Terms Explained",
  description: DESCRIPTION,
  alternates: { canonical: "/glossary" },
  openGraph: { ...OG_IMAGE, url: "/glossary", title: "Computer course glossary | CODE Bagdogra", description: DESCRIPTION },
};

export default function GlossaryPage() {
  const terms = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: "Glossary", path: "/glossary" }])} />
      <JsonLd data={webPageSchema({ path: "/glossary", name: "Computer course glossary", description: DESCRIPTION, dateModified: GLOSSARY_UPDATED })} />
      <JsonLd data={definedTermSetSchema(terms.map((t) => ({ id: termId(t.term), term: t.term, aka: t.aka, definition: t.definition })))} />

      <section className="s-grid s-grid-fade">
        <div className="s-container py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="s-mono text-xs text-[var(--s-muted)]">
            <Link href="/" className="hover:text-[var(--s-ink)]">Home</Link> / <Link href="/guides" className="hover:text-[var(--s-ink)]">Guides</Link> / <span>Glossary</span>
          </nav>
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="Glossary"
              title="Computer course terms, explained in one sentence"
              lead={`What CCA, DCA, ADCA and the other names on our course list actually mean, and which course teaches each one. ${terms.length} terms · updated ${formatDate(GLOSSARY_UPDATED)}.`}
            />
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {terms.map((t) => (
              <li key={t.term}>
                <a href={`#${termId(t.term)}`} className="s-chip border border-[var(--s-line-2)] bg-white text-[var(--s-ink)] hover:border-[var(--s-ink)]">
                  {t.term}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="s-container pb-16">
          <dl className="divide-y divide-[var(--s-line)]">
            {terms.map((t) => {
              const course = t.course ? contentFor(t.course) : null;
              const guide = t.guide ? guideBySlug(t.guide) : undefined;
              return (
                <div key={t.term} id={termId(t.term)} className="grid scroll-mt-28 gap-3 py-7 md:grid-cols-[16rem_1fr]">
                  <dt>
                    <h2 className="text-xl text-[var(--s-ink)]">{t.term}</h2>
                    {t.aka && t.aka.length > 0 && <p className="mt-1 text-xs text-[var(--s-muted)]">Also: {t.aka.join(" · ")}</p>}
                  </dt>
                  <dd className="max-w-3xl">
                    <p className="leading-relaxed text-[var(--s-body)]">{t.definition}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
                      {course && (
                        <Link href={`/courses/${course.slug}`} className="text-[var(--s-ink)] underline decoration-[var(--s-accent)] decoration-2 underline-offset-4 hover:text-[var(--s-accent)]">
                          Taught in {course.displayName} →
                        </Link>
                      )}
                      {guide && (
                        <Link href={`/guides/${guide.slug}`} className="text-[var(--s-ink)] underline decoration-[var(--s-accent)] decoration-2 underline-offset-4 hover:text-[var(--s-accent)]">
                          Read the guide →
                        </Link>
                      )}
                    </div>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <section className="s-grid--dark text-white">
        <div className="s-container flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl text-white">A term we have not explained?</h2>
            <p className="mt-2 max-w-lg text-white/75">Ask on WhatsApp and a trainer will answer — and we will add it here.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink("a course term")} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent">
              Ask on WhatsApp
            </a>
            <Link href="/guides" className="s-btn s-btn--white">
              All guides
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
