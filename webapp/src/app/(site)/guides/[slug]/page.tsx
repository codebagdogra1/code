import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/site/CourseCard";
import { GuideBlocks } from "@/components/site/GuideBlocks";
import { JsonLd } from "@/components/JsonLd";
import { getCourses } from "@/lib/content";
import { contentFor } from "@/lib/course-content";
import { GUIDES, formatDate, guideBySlug, guideContext, type Block } from "@/lib/guides";
import { OG_IMAGE, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { BUSINESS_NAME, whatsappLink } from "@/lib/site";

export const revalidate = 300;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return { title: "Guide not found" };
  const title = guide.seoTitle ?? guide.title;
  return {
    title: { absolute: `${title} | CODE Bagdogra` },
    description: guide.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: {
      ...OG_IMAGE,
      type: "article",
      url: `/guides/${slug}`,
      title: `${title} | CODE Bagdogra`,
      description: guide.description,
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      authors: [BUSINESS_NAME],
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();

  const courses = await getCourses();
  const ctx = guideContext(courses);
  const blocks = guide.body(ctx);
  const tldr = guide.tldr(ctx);
  const faq = blocks.flatMap((b) => (b.type === "faq" ? b.items : []));
  const related = guide.courses.map((name) => courses.find((c) => c.name === name)).filter((c): c is NonNullable<typeof c> => !!c).slice(0, 3);
  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 4);
  const sections = blocks.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          path: `/guides/${slug}`,
          headline: guide.title,
          description: guide.description,
          published: guide.published,
          updated: guide.updated,
          aboutCourseSlugs: guide.courses.map((n) => contentFor(n).slug),
        })}
      />
      {faq.length > 0 && <JsonLd data={faqSchema(faq)} />}

      <article>
        <header className="s-grid--dark text-white">
          <div className="s-container py-14 sm:py-20">
            <nav aria-label="Breadcrumb" className="s-mono text-xs text-white/60">
              <Link href="/" className="hover:text-white">Home</Link> / <Link href="/guides" className="hover:text-white">Guides</Link> / <span className="text-white/80">{guide.seoTitle ?? guide.title}</span>
            </nav>
            <p className="s-eyebrow s-eyebrow--light mt-6">Guide</p>
            <h1 className="mt-3 max-w-4xl text-3xl leading-tight text-white sm:text-5xl">{guide.title}</h1>
            <p className="s-mono mt-5 text-xs text-white/60">
              By the trainers at {BUSINESS_NAME} · Published <time dateTime={guide.published}>{formatDate(guide.published)}</time> · Updated{" "}
              <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
            </p>
          </div>
        </header>

        {/* The short answer first — the paragraph a snippet or an assistant should quote. */}
        <section className="border-b border-[var(--s-line)] bg-white">
          <div className="s-container py-10 sm:py-12">
            <p className="s-eyebrow">The short answer</p>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--s-ink)]">{tldr}</p>
          </div>
        </section>

        <div className="s-container grid gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <GuideBlocks blocks={blocks} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {sections.length > 1 && (
              <nav aria-label="In this guide" className="s-card p-5">
                <p className="s-eyebrow">In this guide</p>
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
              <p className="s-eyebrow">Ask a trainer</p>
              <p className="mt-2 text-sm text-[var(--s-body)]">A real person answers on WhatsApp — about this guide, a course or the fee plan.</p>
              <a href={whatsappLink(guide.seoTitle ?? guide.title)} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent s-btn--sm mt-4">
                Ask on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-[var(--s-paper-2)]">
          <div className="s-container py-14 sm:py-20">
            <h2 className="text-2xl">Courses mentioned in this guide</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <CourseCard key={r.id} course={r} index={courses.indexOf(r)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="s-container py-14 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl">More guides</h2>
            <Link href="/glossary" className="s-btn s-btn--outline s-btn--sm">
              Glossary of course terms
            </Link>
          </div>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {others.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="s-card block p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--s-shadow)]">
                  <span className="font-semibold text-[var(--s-ink)]">{g.title}</span>
                  <span className="mt-1 block text-xs text-[var(--s-muted)]">Updated {formatDate(g.updated)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
