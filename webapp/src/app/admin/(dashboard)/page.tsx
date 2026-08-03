import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

// Dashboard stats computed directly (server component). Mirrors the dashboard-stats API.
async function getStats() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const [totalRegistrations, totalStudents, revenueAgg, pendingAgg, thisMonth, courses] =
    await Promise.all([
      prisma.registration.count(),
      prisma.student.count(),
      prisma.registration.aggregate({ _sum: { paidAmount: true } }),
      prisma.registration.aggregate({ _sum: { dueAmount: true }, where: { dueAmount: { gt: 0 } } }),
      prisma.registration.count({ where: { registrationDate: { gte: monthStart } } }),
      prisma.course.findMany({
        select: { name: true, _count: { select: { courseRegistrations: true } } },
      }),
    ]);
  return {
    totalRegistrations,
    totalStudents,
    totalRevenue: Number(revenueAgg._sum.paidAmount ?? 0),
    pendingPayments: Number(pendingAgg._sum.dueAmount ?? 0),
    registrationsThisMonth: thisMonth,
    popularCourses: courses
      .map((c) => ({ name: c.name, count: c._count.courseRegistrations }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  };
}

export default async function DashboardPage() {
  let stats: Awaited<ReturnType<typeof getStats>> | null = null;
  let error: string | null = null;
  try {
    stats = await getStats();
  } catch {
    error = "Could not load stats — check the database connection (DATABASE_URL).";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-[var(--muted)]">Overview of registrations and payments.</p>

      {error ? (
        <div className="card mt-6 p-6 text-red-600">{error}</div>
      ) : (
        stats && (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Registrations" value={stats.totalRegistrations.toString()} />
              <StatCard label="Students" value={stats.totalStudents.toString()} />
              <StatCard
                label="Revenue collected"
                value={formatCurrency(stats.totalRevenue)}
                accent="text-[var(--success)]"
              />
              <StatCard
                label="Pending payments"
                value={formatCurrency(stats.pendingPayments)}
                accent="text-[var(--warning)]"
              />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="card p-6">
                <h2 className="mb-1 text-sm font-medium text-[var(--muted)]">This month</h2>
                <p className="text-3xl font-bold">{stats.registrationsThisMonth}</p>
                <p className="text-sm text-[var(--muted)]">new registrations</p>
              </div>

              <div className="card p-6">
                <h2 className="mb-4 text-sm font-medium text-[var(--muted)]">Popular courses</h2>
                {stats.popularCourses.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">No enrollments yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {stats.popularCourses.map((c) => (
                      <li key={c.name} className="flex items-center justify-between text-sm">
                        <span>{c.name}</span>
                        <span className="badge bg-[var(--surface-2)] font-medium text-[var(--body)]">
                          {c.count} enrolled
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Link href="/admin/registrations" className="btn-primary">
                View all registrations
              </Link>
            </div>
          </>
        )
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className={`mt-2 text-2xl font-bold tracking-tight ${accent ?? "text-[var(--foreground)]"}`}>
        {value}
      </p>
    </div>
  );
}
