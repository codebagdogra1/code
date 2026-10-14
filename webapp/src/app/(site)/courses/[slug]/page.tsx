import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/site/CourseCard";
import { Faq } from "@/components/site/Faq";
import { PhotoMarquee } from "@/components/site/PhotoMarquee";
import { JsonLd } from "@/components/JsonLd";
import { getCourseBySlug, getCourses } from "@/lib/content";
import { COURSE_CONTENT, COURSE_CONTENT_UPDATED } from "@/lib/course-content";
import { formatDate, guidesForCourse } from "@/lib/guides";
import { OG_IMAGE, breadcrumbSchema, courseSchema, faqSchema, webPageSchema } from "@/lib/seo";
import { LANGUAGES, LOCALITY, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  return Object.values(COURSE_CONTENT).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  const c = course.content;
  const title = c.seoTitle ?? `${c.shortName ?? c.displayName} Course in Bagdogra — Syllabus & Duration`;
  const description = c.definition ?? c.summary;
  return {
    // The template would append "| CODE Bagdogra"; these titles already carry the place.
    title: { absolute: `${title} | CODE` },
    description,
    alternates: { canonical: `/courses/${slug}` },
    openGraph: { ...OG_IMAGE, url: `/courses/${slug}`, title: `${title} | CODE`, description },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const c = course.content;
  const all = await getCourses();
  const related = all.filter((o) => o.id !== course.id && (o.content.track === c.track || o.name === c.idealNext)).slice(0, 3);
  const next = c.idealNext ? all.find((o) => o.name === c.idealNext) : undefined;
  const short = c.shortName ?? c.displayName;
  const faq = c.faq ?? [];
  const guides = guidesForCourse(course.name);
  const title = c.seoTitle ?? `${short} Course in Bagdogra`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Courses", path: "/courses" },
          { name: c.displayName, path: `/courses/${slug}` },
        ])}
      />
      <JsonLd
        data={courseSchema({
          name: c.displayName,
          slug,
          summary: c.definition ?? c.summary,
          duration: course.duration,
          level: c.level,
          modules: c.modules,
          outcomes: c.outcomes,
          prerequisites: c.prerequisites,
          whoFor: c.whoFor,
        })}
      />
      {faq.length > 0 && <JsonLd data={faqSchema(faq)} />}
      <JsonLd data={webPageSchema({ path: `/courses/${slug}`, name: title, description: c.definition ?? c.summary, dateModified: COURSE_CONTENT_UPDATED, type: "ItemPage" })} />

      <section className="s-grid--dark text-white">
        <div className="s-container py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="s-mono text-xs text-white/60">
            <Link href="/" className="hover:text-white">Home</Link> / <Link href="/courses" className="hover:text-white">Courses</Link> / <span className="text-white/80">{c.displayName}</span>
          </nav>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="s-eyebrow s-eyebrow--light">{c.track} · {c.level}</p>
              <h1 className="mt-3 text-4xl leading-tight text-white sm:text-5xl">{c.displayName}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{c.summary}</p>
              <p className="s-mono mt-4 text-xs text-white/60">
                Course information updated <time dateTime={COURSE_CONTENT_UPDATED}>{formatDate(COURSE_CONTENT_UPDATED)}</time>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={whatsappLink(c.displayName)} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent">
                  Enquire on WhatsApp
                </a>
                <Link href={`/contact?course=${encodeURIComponent(course.name)}`} className="s-btn s-btn--ghost-light">
                  Request a call back
                </Link>
              </div>
            </div>

            {/* Course facts card */}
            <div className="s-card s-card--lift h-fit p-6 text-[var(--s-ink)] sm:p-7">
              <p className="s-eyebrow">At a glance</p>
              <dl className="mt-4 space-y-4">
                <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[var(--s-line-2)] pb-3">
                  <dt className="text-sm text-[var(--s-muted)]">Duration</dt>
                  <dd className="s-display text-lg font-bold">{course.duration ?? "Ask us"}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[var(--s-line-2)] pb-3">
                  <dt className="text-sm text-[var(--s-muted)]">Level</dt>
                  <dd className="s-display text-lg font-bold">{c.level}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-[var(--s-muted)]">Payment</dt>
                  <dd className="text-right font-semibold">Full or monthly plan</dd>
                </div>
              </dl>
              <p className="mt-5 text-xs leading-relaxed text-[var(--s-muted)]">
                Printed receipt for every payment. For the current fee, batch and start date, ask at the desk or call{" "}
                <a href={`tel:${PHONE_TEL}`} className="font-semibold text-[var(--s-ink)]">{PHONE_DISPLAY}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Answer-first definition: one quotable paragraph an assistant or snippet can lift whole. */}
      {c.definition && (
        <section className="border-b border-[var(--s-line)] bg-white">
          <div className="s-container py-10 sm:py-12">
            <h2 className="text-2xl sm:text-3xl">What is {short}?</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--s-ink)]">{c.definition}</p>
            <dl className="mt-6 grid max-w-3xl gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--s-muted)]">Where</dt>
                <dd className="mt-0.5 font-semibold text-[var(--s-ink)]">In person at CODE, {LOCALITY}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--s-muted)]">Taught in</dt>
                <dd className="mt-0.5 font-semibold text-[var(--s-ink)]">{LANGUAGES.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--s-muted)]">Fee</dt>
                <dd className="mt-0.5 font-semibold text-[var(--s-ink)]">Full or monthly plan, quoted at the desk</dd>
              </div>
            </dl>
          </div>
        </section>
      )}

      <section>
        <div className="s-container grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="s-eyebrow">Who it&apos;s for</p>
            <p className="mt-3 text-lg leading-relaxed text-[var(--s-ink)]">{c.whoFor}</p>
            {c.prerequisites && (
              <>
                <p className="s-eyebrow mt-8">Before you join</p>
                <p className="mt-3 text-[var(--s-body)]">{c.prerequisites}.</p>
              </>
            )}

            {c.outcomes.length > 0 && (
              <>
                <p className="s-eyebrow mt-10">What you&apos;ll be able to do</p>
                <ul className="mt-4 space-y-3">
                  {c.outcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-[var(--s-body)]">
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--s-mint)] text-[var(--s-mint-ink)]" aria-hidden>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {c.modules.length > 0 && (
            <div className="s-card p-6 sm:p-8">
              <p className="s-eyebrow">Syllabus outline</p>
              <ol className="mt-4 space-y-3">
                {c.modules.map((m, i) => (
                  <li key={m} className="flex gap-4 border-b border-dashed border-[var(--s-line-2)] pb-3 last:border-0 last:pb-0">
                    <span className="s-mono w-6 shrink-0 text-xs text-[var(--s-accent)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm text-[var(--s-ink)]">{m}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-xs text-[var(--s-muted)]">Topics are indicative and are updated as tools change. Ask for the detailed syllabus at the centre.</p>
            </div>
          )}
        </div>
      </section>

      {faq.length > 0 && (
        <section className="bg-[var(--s-paper-2)]">
          <div className="s-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="s-eyebrow">FAQ</p>
              <h2 className="mt-3 text-3xl sm:text-4xl">Questions about {short}</h2>
              <p className="mt-3 text-[var(--s-body)]">
                Anything else? Ask on WhatsApp or call {PHONE_DISPLAY} — a trainer answers, not a bot.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={whatsappLink(c.displayName)} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent s-btn--sm">
                  Ask on WhatsApp
                </a>
                <Link href="/courses" className="s-btn s-btn--outline s-btn--sm">
                  Compare courses
                </Link>
              </div>
            </div>
            <Faq items={faq} />
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="bg-white">
          <div className="s-container py-14 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="s-eyebrow">Helpful guides</p>
                <h2 className="mt-3 text-2xl">Read before you decide on {short}</h2>
              </div>
              <Link href="/guides" className="s-btn s-btn--outline s-btn--sm">
                All guides
              </Link>
            </div>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="s-card block h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--s-shadow)]">
                    <span className="font-semibold text-[var(--s-ink)]">{g.title}</span>
                    <span className="mt-1 block text-sm text-[var(--s-body)]">{g.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <PhotoMarquee eyebrow="Your batch" title="You learn with a small batch, and a trainer who knows your name." start={3} />

      {(next || related.length > 0) && (
        <section className="bg-white">
          <div className="s-container py-14 sm:py-20">
            {next && (
              <div className="s-card mb-10 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="s-eyebrow">After this course</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--s-ink)]">Most students continue to {next.content.displayName}.</p>
                </div>
                <Link href={`/courses/${next.content.slug}`} className="s-btn s-btn--sm">
                  View {next.content.displayName.split(" — ")[0]}
                </Link>
              </div>
            )}
            {related.length > 0 && (
              <>
                <h2 className="text-2xl">Related courses</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <CourseCard key={r.id} course={r} index={all.indexOf(r)} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}
