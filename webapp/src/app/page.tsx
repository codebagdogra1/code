import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/format";

// Server component: fetch active courses directly from the DB (no API round-trip).
// Courses change rarely, so serve a prerendered page and revalidate in the
// background every 5 minutes (ISR) instead of hitting the DB on every request.
export const revalidate = 300;

export default async function HomePage() {
  let courses: {
    id: number;
    name: string;
    duration: string | null;
    fullPrice: number | null;
    monthlyPrice: number | null;
    monthlyInstallments: number;
  }[] = [];
  try {
    const rows = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        duration: true,
        fullPrice: true,
        monthlyPrice: true,
        monthlyInstallments: true,
      },
    });
    courses = rows.map((c) => ({
      id: c.id,
      name: c.name,
      duration: c.duration,
      fullPrice: c.fullPrice != null ? Number(c.fullPrice) : null,
      monthlyPrice: c.monthlyPrice != null ? Number(c.monthlyPrice) : null,
      monthlyInstallments: c.monthlyInstallments,
    }));
  } catch {
    courses = [];
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero — the public site's premium navy/gold identity. */}
        <section className="relative overflow-hidden bg-[var(--navy-900)] text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(60rem 40rem at 70% -10%, rgba(73,210,214,0.18), transparent 60%), radial-gradient(50rem 40rem at 10% 110%, rgba(249,178,51,0.16), transparent 55%)",
            }}
          />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-20 text-center sm:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-[var(--gold-400)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-500)]" />
              Now enrolling
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Learn to code.{" "}
              <span className="text-[var(--gold-500)]">Build a career.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-slate-300">
              Industry-focused courses with flexible monthly payment plans. Register online in
              minutes and track your fees anytime.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="btn-primary px-6 py-3 text-base">
                Enroll now
              </Link>
              <Link
                href="/brochure"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] border border-white/20 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                View brochure
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Our courses</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Pay in full or spread it across monthly installments.
              </p>
            </div>
            <Link
              href="/brochure"
              className="hidden text-sm font-medium text-[var(--link)] hover:underline sm:inline"
            >
              See all details →
            </Link>
          </div>
          {courses.length === 0 ? (
            <div className="card p-10 text-center text-[var(--muted)]">
              Courses will appear here once they&apos;re added in the admin panel.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="card flex flex-col p-6 transition-shadow hover:shadow-[var(--shadow-float)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">{c.name}</h3>
                    {c.duration && (
                      <span className="badge shrink-0 bg-[var(--surface-2)] text-[var(--muted)]">
                        {c.duration}
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex-1">
                    {c.fullPrice != null && (
                      <p className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
                        {formatCurrency(c.fullPrice)}
                      </p>
                    )}
                    {c.monthlyPrice != null && (
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        or{" "}
                        <span className="font-medium text-[var(--body)]">
                          {formatCurrency(Math.ceil(c.monthlyPrice / c.monthlyInstallments))}/mo
                        </span>{" "}
                        × {c.monthlyInstallments} months
                      </p>
                    )}
                  </div>
                  <Link href="/register" className="btn-primary mt-6">
                    Enroll
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} CODE. All rights reserved.
      </footer>
    </>
  );
}
