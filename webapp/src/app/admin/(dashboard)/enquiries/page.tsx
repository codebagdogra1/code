import { EnquiriesManager } from "@/components/admin/EnquiriesManager";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const ORDER: Record<string, number> = { NEW: 0, CONTACTED: 1, CLOSED: 2 };

export default async function EnquiriesPage() {
  const rows = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 300 });
  const sorted = [...rows].sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9) || b.createdAt.getTime() - a.createdAt.getTime());
  const newCount = rows.filter((r) => r.status === "NEW").length;

  return (
    <div>
      <header className="flex flex-wrap items-center gap-3">
        <span className="ro-plate py-1.5">Enquiries</span>
        <span className="ro-mono text-xs font-semibold tracking-widest text-[var(--ro-ink-2)]">
          {newCount} NEW · {rows.length} TOTAL
        </span>
      </header>
      <p className="mt-2 max-w-2xl text-[0.8rem] text-[var(--ro-ink-2)]">
        Everything sent through the website contact form. Mark an enquiry contacted once you have called or messaged, and close it when it is enrolled or dropped.
      </p>
      <EnquiriesManager
        enquiries={sorted.map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email,
          courseInterest: r.courseInterest,
          message: r.message,
          status: r.status,
          notes: r.notes,
          createdLabel: r.createdAt.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }),
        }))}
      />
    </div>
  );
}
