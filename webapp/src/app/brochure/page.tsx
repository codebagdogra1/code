import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CODE — Brochure",
  description: "Courses, durations and fees at CODE.",
};

export default async function BrochurePage() {
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
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold">Course brochure</h1>
        <p className="mt-1 text-[var(--muted)]">
          Everything we offer, with durations and flexible payment plans.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <th className="py-3 pr-4">Course</th>
                <th className="py-3 pr-4">Duration</th>
                <th className="py-3 pr-4">Full price</th>
                <th className="py-3">Monthly plan</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="py-3 pr-4 text-[var(--muted)]">{c.duration || "—"}</td>
                  <td className="py-3 pr-4">
                    {c.fullPrice != null ? formatCurrency(c.fullPrice) : "—"}
                  </td>
                  <td className="py-3">
                    {c.monthlyPrice != null
                      ? `${formatCurrency(c.monthlyPrice)} × ${c.monthlyInstallments}`
                      : "—"}
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[var(--muted)]">
                    No courses to show yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <Link href="/register" className="btn-primary px-6 py-3">
            Enroll now
          </Link>
        </div>
      </main>
    </>
  );
}
