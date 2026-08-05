import { PublicLayout } from "@/components/PublicLayout";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/format";
import { whatsappLink } from "@/lib/site";

// Prerender and revalidate every 5 minutes (ISR) — the brochure is public and
// changes only when courses do, so there's no need to query the DB per request.
export const revalidate = 300;

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
    <PublicLayout>
      <section className="bg-gradient-to-b from-[var(--edu-tint)] to-white">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 text-center sm:py-16">
          <span className="edu-eyebrow mx-auto w-fit">Brochure</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Course brochure</h1>
          <p className="mx-auto mt-3 max-w-xl text-[var(--body)]">
            Everything we offer, with durations and flexible payment plans.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="edu-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-[var(--edu-tint)] text-left text-[var(--edu-ink)]">
                  <th className="px-5 py-4 font-bold">Course</th>
                  <th className="px-5 py-4 font-bold">Duration</th>
                  <th className="px-5 py-4 font-bold">Full price</th>
                  <th className="px-5 py-4 font-bold">Monthly plan</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="border-t border-[var(--border)]">
                    <td className="px-5 py-4 font-semibold text-[var(--edu-ink)]">{c.name}</td>
                    <td className="px-5 py-4 text-[var(--muted)]">{c.duration || "—"}</td>
                    <td className="px-5 py-4 font-semibold">
                      {c.fullPrice != null ? formatCurrency(c.fullPrice) : "—"}
                    </td>
                    <td className="px-5 py-4 text-[var(--body)]">
                      {c.monthlyPrice != null
                        ? `${formatCurrency(
                            Math.ceil(c.monthlyPrice / c.monthlyInstallments),
                          )}/mo × ${c.monthlyInstallments} = ${formatCurrency(c.monthlyPrice)}`
                        : "—"}
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-[var(--muted)]">
                      No courses to show yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="edu-btn px-8 py-3.5 text-base"
          >
            Enroll on WhatsApp
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
