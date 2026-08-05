import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { CourseCard } from "@/components/CourseCard";
import { getActiveCourses } from "@/lib/courses";
import { whatsappLink } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Courses — CODE",
  description: "Browse CODE's coding courses with flexible monthly payment plans.",
};

export default async function CoursesPage() {
  const courses = await getActiveCourses();

  return (
    <PublicLayout>
      {/* Page header */}
      <section className="bg-gradient-to-b from-[var(--edu-tint)] to-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-20">
          <span className="edu-eyebrow">Our courses</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Industry-focused tracks
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[var(--body)]">
            Pay in full or across easy monthly installments — pick the track that fits your goals.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-16">
        {courses.length === 0 ? (
          <div className="edu-card mx-auto max-w-lg p-10 text-center">
            <p className="text-[var(--muted)]">
              Courses will appear here once they&apos;re added in the admin panel.
            </p>
            <Link href="/contact" className="edu-btn mt-6">
              Contact us
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-8 text-sm font-medium text-[var(--muted)]">
              {courses.length} course{courses.length === 1 ? "" : "s"} available
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA */}
      <section className="bg-[var(--edu-tint)]/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Not sure which course fits?</h2>
          <p className="mx-auto mt-3 max-w-lg text-[var(--body)]">
            Tell us your goals and we&apos;ll help you pick the right track and payment plan.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="edu-btn px-6 py-3"
            >
              Ask on WhatsApp
            </a>
            <Link href="/brochure" className="edu-btn-outline px-6 py-3">
              View brochure
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
