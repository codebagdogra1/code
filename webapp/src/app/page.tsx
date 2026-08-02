import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/format";

// Server component: fetch active courses directly from the DB (no API round-trip).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let courses: {
    id: number;
    name: string;
    duration: string | null;
    fullPrice: number | null;
    monthlyPrice: number | null;
  }[] = [];
  try {
    const rows = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, duration: true, fullPrice: true, monthlyPrice: true },
    });
    courses = rows.map((c) => ({
      id: c.id,
      name: c.name,
      duration: c.duration,
      fullPrice: c.fullPrice != null ? Number(c.fullPrice) : null,
      monthlyPrice: c.monthlyPrice != null ? Number(c.monthlyPrice) : null,
    }));
  } catch {
    courses = [];
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <section className="py-16 text-center sm:py-24">
          <span className="badge bg-[var(--brand)]/10 text-[var(--brand)]">Now enrolling</span>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Learn to code. Build a career.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
            Industry-focused courses with flexible monthly payment plans. Register online in
            minutes and track your fees anytime.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/register" className="btn-primary px-6 py-3 text-base">
              Enroll now
            </Link>
            <Link href="/brochure" className="btn-ghost px-6 py-3 text-base">
              View brochure
            </Link>
          </div>
        </section>

        <section className="pb-24">
          <h2 className="mb-6 text-2xl font-semibold">Our courses</h2>
          {courses.length === 0 ? (
            <div className="card p-8 text-center text-[var(--muted)]">
              Courses will appear here once they&apos;re added in the admin panel.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <div key={c.id} className="card flex flex-col p-5">
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  {c.duration && <p className="mt-1 text-sm text-[var(--muted)]">{c.duration}</p>}
                  <div className="mt-4 flex-1">
                    {c.fullPrice != null && (
                      <p className="text-2xl font-bold">{formatCurrency(c.fullPrice)}</p>
                    )}
                    {c.monthlyPrice != null && (
                      <p className="text-sm text-[var(--muted)]">
                        or {formatCurrency(c.monthlyPrice)}/month
                      </p>
                    )}
                  </div>
                  <Link href="/register" className="btn-primary mt-4">
                    Enroll
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-6 text-center text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} CODE. All rights reserved.
      </footer>
    </>
  );
}
