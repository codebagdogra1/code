import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { getCourses } from "@/lib/content";
import { GLOSSARY, GUIDES, formatDate, guideContext } from "@/lib/guides";
import { OG_IMAGE, absoluteUrl, breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const revalidate = 300;

const DESCRIPTION =
  "Plain-language guides for students and parents in Bagdogra and Siliguri: DCA vs ADCA, which course after Class 10 or 12, how to choose an institute, how fees and monthly plans work, and courses for shop owners who want to sell online.";

export const metadata: Metadata = {
  title: "Guides — Choosing a Computer Course in Bagdogra & Siliguri",
  description: DESCRIPTION,
  alternates: { canonical: "/guides" },
  openGraph: { ...OG_IMAGE, url: "/guides", title: "Computer course guides | CODE Bagdogra", description: DESCRIPTION },
};

export default async function GuidesPage() {
  const courses = await getCourses();
  const ctx = guideContext(courses);
  const latest = GUIDES.map((g) => g.updated).sort().at(-1) ?? GUIDES[0].updated;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }])} />
      <JsonLd data={webPageSchema({ path: "/guides", name: "Computer course guides", description: DESCRIPTION, dateModified: latest, type: "CollectionPage" })} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Guides from CODE, Bagdogra",
          itemListElement: GUIDES.map((g, i) => ({ "@type": "ListItem", position: i + 1, name: g.title, url: absoluteUrl(`/guides/${g.slug}`) })),
        }}
      />

      <section className="s-grid s-grid-fade">
        <div className="s-container py-14 sm:py-20">
          <SectionHeading
            as="h1"
            eyebrow="Guides"
            title="Read this before you choose a course"
            lead="Short, honest answers to the questions students and parents in Bagdogra and Siliguri ask before joining — written by the people who teach the courses, and updated when the courses change."
          />
        </div>
      </section>

      <section>
        <div className="s-container grid gap-5 pb-16 md:grid-cols-2">
          {GUIDES.map((g, i) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="s-card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--s-shadow)]">
              <span className="s-mono text-xs text-[var(--s-muted)]">{String(i + 1).padStart(2, "0")} · Updated {formatDate(g.updated)}</span>
              <h2 className="mt-3 text-xl leading-snug group-hover:text-[var(--s-accent)]">{g.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--s-body)]">{g.tldr(ctx).split(". ").slice(0, 2).join(". ")}.</p>
              <span className="mt-5 text-sm font-semibold text-[var(--s-ink)]">Read the guide →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[var(--s-paper-2)]">
        <div className="s-container grid gap-8 py-14 sm:py-20 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading eyebrow="Glossary" title="What the course names mean" lead={`${GLOSSARY.length} terms — CCA, DCA, ADCA, HTML, Shopify, Meta Ads, prompt engineering and more — each in one sentence, each linked to the course that teaches it.`} />
            <Link href="/glossary" className="s-btn mt-6">
              Open the glossary
            </Link>
          </div>
          <ul className="flex flex-wrap gap-2 self-center">
            {GLOSSARY.map((t) => (
              <li key={t.term}>
                <Link href={`/glossary#${t.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="s-chip border border-[var(--s-line-2)] bg-white text-[var(--s-ink)] hover:border-[var(--s-ink)]">
                  {t.term}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="s-grid--dark text-white">
        <div className="s-container flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl text-white">Still deciding?</h2>
            <p className="mt-2 max-w-lg text-white/75">Tell us your goal on WhatsApp and a trainer will suggest a starting course, the batch timing and the fee plan.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink("choosing a course")} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent">
              WhatsApp us
            </a>
            <Link href="/courses" className="s-btn s-btn--white">
              See all courses
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
