import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CourseCard } from "@/components/CourseCard";
import { getActiveCourses } from "@/lib/courses";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Courses — CODE",
  description: "Browse CODE's coding courses with flexible monthly payment plans.",
};

export default async function CoursesPage() {
  const courses = await getActiveCourses();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Page header */}
        <section className="bg-[var(--navy-900)] text-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-20">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Our courses</h1>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Industry-focused tracks you can pay for in full or across easy monthly
              installments.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-16">
          {courses.length === 0 ? (
            <div className="card mx-auto max-w-lg p-10 text-center">
              <p className="text-[var(--muted)]">
                Courses will appear here once they&apos;re added in the admin panel.
              </p>
              <Link href="/contact" className="btn-primary mt-6">
                Contact us
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-8 text-sm text-[var(--muted)]">
                {courses.length} course{courses.length === 1 ? "" : "s"} available
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* CTA */}
        <section className="bg-[var(--surface-2)]/60">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 text-center">
            <h2 className="text-2xl font-semibold">Not sure which course fits?</h2>
            <p className="mx-auto mt-3 max-w-lg text-[var(--muted)]">
              Tell us your goals and we&apos;ll help you pick the right track and payment plan.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary px-6 py-3">
                Talk to an advisor
              </Link>
              <Link href="/brochure" className="btn-ghost px-6 py-3">
                View brochure
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
