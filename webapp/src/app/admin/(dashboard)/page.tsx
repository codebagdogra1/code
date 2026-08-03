import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatRupees } from "@/lib/format";
import { Icon } from "@/components/ro/Icon";

export const dynamic = "force-dynamic";

// The day register. Money truth (collected / outstanding / overdue / this month),
// today's collections posted as job-cards, and the overdue drawer that needs work.
async function getStats() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    collectedAgg,
    outstandingAgg,
    thisMonth,
    totalRegistrations,
    totalStudents,
    todaysPayments,
    overdueGroups,
    courses,
  ] = await Promise.all([
    prisma.registration.aggregate({ _sum: { paidAmount: true } }),
    prisma.registration.aggregate({ _sum: { dueAmount: true }, where: { dueAmount: { gt: 0 } } }),
    prisma.registration.count({ where: { registrationDate: { gte: monthStart } } }),
    prisma.registration.count(),
    prisma.student.count(),
    prisma.paymentHistory.findMany({
      where: { paymentDate: { gte: dayStart } },
      orderBy: { paymentDate: "desc" },
      take: 8,
      include: {
        registration: { select: { receiptNo: true, student: { select: { fullName: true } } } },
      },
    }),
    prisma.monthlyInstallment.groupBy({
      by: ["registrationId"],
      where: { paymentStatus: "PENDING", dueDate: { lt: now } },
      _sum: { installmentAmount: true },
      _count: { _all: true },
    }),
    prisma.course.findMany({
      select: { name: true, _count: { select: { courseRegistrations: true } } },
    }),
  ]);

  const overdueSorted = overdueGroups
    .filter((g) => g.registrationId != null)
    .map((g) => ({
      id: g.registrationId as number,
      amount: Number(g._sum.installmentAmount ?? 0),
      months: g._count._all,
    }))
    .sort((a, b) => b.amount - a.amount);
  const overdueTotal = overdueSorted.reduce((s, g) => s + g.amount, 0);
  const topIds = overdueSorted.slice(0, 5).map((g) => g.id);
  const topRegs = topIds.length
    ? await prisma.registration.findMany({
        where: { id: { in: topIds } },
        select: { id: true, receiptNo: true, student: { select: { fullName: true } } },
      })
    : [];
  const overdueList = overdueSorted.slice(0, 5).map((g) => {
    const r = topRegs.find((x) => x.id === g.id);
    return {
      receiptNo: r?.receiptNo ?? "—",
      name: r?.student?.fullName ?? "Unknown",
      amount: g.amount,
      months: g.months,
    };
  });

  const todaysCollections = todaysPayments.map((p) => ({
    id: p.id,
    receiptNo: p.registration?.receiptNo ?? "—",
    name: p.registration?.student?.fullName ?? "Unknown",
    amount: Number(p.paymentAmount ?? 0),
    method: p.paymentMethod ?? "Cash",
    time: p.paymentDate,
  }));
  const collectedToday = todaysCollections.reduce((s, c) => s + c.amount, 0);

  return {
    collected: Number(collectedAgg._sum.paidAmount ?? 0),
    outstanding: Number(outstandingAgg._sum.dueAmount ?? 0),
    overdueTotal,
    overdueCount: overdueSorted.length,
    thisMonth,
    totalRegistrations,
    totalStudents,
    todaysCollections,
    collectedToday,
    overdueList,
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
    error = "Could not read the register — check the database connection (DATABASE_URL).";
  }

  const today = new Date()
    .toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="ro-plate py-1.5">Day Register</span>
          <span className="ro-mono text-xs font-semibold tracking-widest text-[var(--ro-ink-2)]">
            {today}
          </span>
        </div>
        <Link href="/admin/registrations/new" className="ro-btn ro-btn--primary">
          <Icon name="new" size={15} />
          New registration
        </Link>
      </header>

      {error ? (
        <div className="ro-panel mt-6 flex items-start gap-3 p-6 text-[var(--ro-red)]">
          <Icon name="alert" size={20} />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        stats && (
          <>
            {/* Stamped money-plates */}
            <div className="ro-reveal mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MoneyPlate
                label="Collected"
                chip="var(--ro-green)"
                value={formatRupees(stats.collected)}
                sub="total to date"
              />
              <MoneyPlate
                label="Outstanding"
                chip="var(--ro-ochre)"
                value={formatRupees(stats.outstanding)}
                sub="across open registrations"
              />
              <MoneyPlate
                label="Overdue"
                chip="var(--ro-red)"
                value={formatRupees(stats.overdueTotal)}
                sub={`${stats.overdueCount} registration${stats.overdueCount === 1 ? "" : "s"}`}
                alarm={stats.overdueTotal > 0}
              />
              <MoneyPlate
                label="This month"
                chip="var(--ro-blue)"
                value={String(stats.thisMonth)}
                sub="new registrations"
              />
            </div>

            <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1.6fr_1fr]">
              {/* Today's collections — the day's posted entries */}
              <section className="ro-panel overflow-hidden">
                <div className="ro-underrule flex items-center justify-between px-5 py-3.5">
                  <span className="ro-plate ro-plate--ink">Today&apos;s collections</span>
                  <span className="ro-mono text-sm font-semibold text-[var(--ro-green)]">
                    {formatRupees(stats.collectedToday)}
                    <span className="ml-1.5 text-[0.7rem] font-normal text-[var(--ro-ink-2)]">
                      / {stats.todaysCollections.length} receipt
                      {stats.todaysCollections.length === 1 ? "" : "s"}
                    </span>
                  </span>
                </div>
                {stats.todaysCollections.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
                    <span className="grid h-10 w-10 place-items-center rounded-sm border border-dashed border-[var(--ro-line-2)] text-[var(--ro-ink-2)]">
                      <Icon name="stamp" size={18} />
                    </span>
                    <p className="text-sm text-[var(--ro-ink-2)]">
                      No fees collected yet today.
                      <br />
                      Payments you stamp will post here.
                    </p>
                  </div>
                ) : (
                  <ul>
                    {stats.todaysCollections.map((c) => (
                      <li
                        key={c.id}
                        className="flex items-center gap-3 border-b border-[var(--ro-line)] px-5 py-3 last:border-0"
                      >
                        <span className="ro-mono rounded-sm border border-[var(--ro-line-2)] bg-[var(--ro-panel-2)] px-2 py-1 text-[0.7rem] font-semibold text-[var(--ro-ink-2)]">
                          {c.receiptNo}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{c.name}</p>
                          <p className="text-[0.72rem] uppercase tracking-wide text-[var(--ro-ink-2)]">
                            {c.method}
                          </p>
                        </div>
                        <span className="ro-mono text-sm font-semibold text-[var(--ro-green)]">
                          {formatRupees(c.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* The overdue drawer */}
              <div className="space-y-5">
                <section
                  className="ro-panel overflow-hidden"
                  style={{ borderColor: stats.overdueCount > 0 ? "var(--ro-red)" : undefined }}
                >
                  <div
                    className="flex items-center justify-between px-5 py-3.5"
                    style={{
                      background: stats.overdueCount > 0 ? "var(--ro-red-tint)" : "transparent",
                      borderBottom: "1px solid var(--ro-line)",
                    }}
                  >
                    <span className="flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--ro-red)]">
                      <Icon name="alert" size={15} />
                      Overdue
                    </span>
                    {stats.overdueCount > 0 && (
                      <span className="ro-mono rounded-sm bg-[var(--ro-red)] px-2 py-0.5 text-xs font-bold text-[#f6efe6]">
                        {stats.overdueCount}
                      </span>
                    )}
                  </div>
                  {stats.overdueList.length === 0 ? (
                    <div className="flex items-center gap-2.5 px-5 py-6 text-sm text-[var(--ro-green)]">
                      <Icon name="check" size={18} />
                      Nothing overdue. The register is clean.
                    </div>
                  ) : (
                    <ul>
                      {stats.overdueList.map((o) => (
                        <li
                          key={o.receiptNo}
                          className="flex items-center gap-3 border-b border-[var(--ro-line)] px-5 py-3 last:border-0"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{o.name}</p>
                            <p className="ro-mono text-[0.7rem] text-[var(--ro-ink-2)]">
                              {o.receiptNo} · {o.months} month{o.months === 1 ? "" : "s"}
                            </p>
                          </div>
                          <Link
                            href={`/admin/registrations/${o.receiptNo}`}
                            className="ro-mono text-sm font-semibold text-[var(--ro-red)] hover:underline"
                          >
                            {formatRupees(o.amount)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Enrolment ledger — most-taken courses */}
                <section className="ro-panel overflow-hidden">
                  <div className="px-5 py-3.5" style={{ borderBottom: "1px solid var(--ro-line)" }}>
                    <span className="ro-plate ro-plate--ink">Enrolment by course</span>
                  </div>
                  {stats.popularCourses.length === 0 ? (
                    <EmptyLine text="No enrolments recorded yet." />
                  ) : (
                    <ul className="px-5 py-2">
                      {stats.popularCourses.map((c) => (
                        <li
                          key={c.name}
                          className="flex items-center justify-between border-b border-dashed border-[var(--ro-line)] py-2.5 text-sm last:border-0"
                        >
                          <span className="truncate pr-3">{c.name}</span>
                          <span className="ro-mono flex-none font-semibold text-[var(--ro-ink-2)]">
                            {c.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}

function MoneyPlate({
  label,
  value,
  sub,
  chip,
  alarm,
}: {
  label: string;
  value: string;
  sub: string;
  chip: string;
  alarm?: boolean;
}) {
  return (
    <div className="ro-money">
      <div className="ro-money__head">
        <span className="ro-money__chip" style={{ background: chip }} />
        {label}
      </div>
      <div className="ro-money__value" style={alarm ? { color: "var(--ro-red)" } : undefined}>
        {value}
      </div>
      <div className="ro-money__sub">{sub}</div>
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <p className="px-5 py-6 text-sm text-[var(--ro-ink-2)]">{text}</p>;
}
