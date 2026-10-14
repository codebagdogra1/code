import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "@/components/site/CourseCard";
import { PhotoMarquee } from "@/components/site/PhotoMarquee";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { getCourses } from "@/lib/content";
import { OG_IMAGE, breadcrumbSchema, courseListSchema } from "@/lib/seo";
import { PHONE_DISPLAY, whatsappLink } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Computer Courses in Bagdogra",
  description:
    "All courses at CODE Bagdogra with duration and syllabus: CCA, DCA, ADCA, Web Design, Ecommerce Expert, Digital Marketing and AI Prompt Engineering. Monthly installment plans available.",
  alternates: { canonical: "/courses" },
  openGraph: { ...OG_IMAGE, url: "/courses", title: "Computer Courses in Bagdogra | CODE" },
};

export default async function CoursesPage() {
  const courses = await getCourses();
  const tracks = Array.from(new Set(courses.map((c) => c.content.track)));

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Courses", path: "/courses" }])} />
      {courses.length > 0 && (
        <JsonLd
          data={courseListSchema(
            courses.map((c) => ({ name: c.content.displayName, slug: c.content.slug, summary: c.content.summary })),
          )}
        />
      )}

      <section className="s-grid s-grid-fade">
        <div className="s-container py-14 sm:py-20">
          <SectionHeading
            as="h1"
            eyebrow="Courses"
            title="Every course in one place"
            lead="Pick a track, compare durations and read the syllabus. Ask at the desk or on WhatsApp for the current fee and batch."
          />
          {tracks.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {tracks.map((t) => (
                <a key={t} href={`#${t.toLowerCase().replace(/\s+/g, "-")}`} className="s-chip border border-[var(--s-line-2)] bg-white text-[var(--s-ink)] hover:border-[var(--s-ink)]">
                  {t}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="s-container pb-16">
          {courses.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--s-line-2)] p-10 text-center text-[var(--s-muted)]">
              The course list is temporarily unavailable. Call {PHONE_DISPLAY} for the current catalogue.
            </p>
          ) : (
            tracks.map((track) => {
              const list = courses.filter((c) => c.content.track === track);
              return (
                <div key={track} id={track.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-28 py-8 first:pt-0">
                  <h2 className="text-2xl">{track}</h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((c) => (
                      <CourseCard key={c.id} course={c} index={courses.indexOf(c)} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <PhotoMarquee eyebrow="Life at CODE" title="Every course is taught at a computer, with the batch around you." start={1} />

      {courses.length > 0 && (
        <section className="bg-white">
          <div className="s-container py-14 sm:py-20">
            <SectionHeading eyebrow="Overview" title="Compare at a glance" />
            <div className="s-card mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-sm">
                <thead>
                  <tr className="border-b border-[var(--s-line)] text-left text-xs uppercase tracking-wide text-[var(--s-muted)]">
                    <th className="px-5 py-3 font-semibold">Course</th>
                    <th className="px-5 py-3 font-semibold">Track</th>
                    <th className="px-5 py-3 font-semibold">Level</th>
                    <th className="px-5 py-3 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="border-b border-[var(--s-line)] last:border-0">
                      <td className="px-5 py-3 font-semibold text-[var(--s-ink)]">
                        <Link href={`/courses/${c.content.slug}`} className="hover:text-[var(--s-accent)]">
                          {c.content.displayName}
                        </Link>
                      </td>
                      <td className="px-5 py-3">{c.content.track}</td>
                      <td className="px-5 py-3">{c.content.level}</td>
                      <td className="px-5 py-3">{c.duration ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent">
                Ask about fees &amp; batches
              </a>
              <Link href="/contact" className="s-btn s-btn--outline">
                Request a call back
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
