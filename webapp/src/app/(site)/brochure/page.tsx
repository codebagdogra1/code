import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PrintButton } from "@/components/site/PrintButton";
import { getCourses } from "@/lib/content";
import { formatRupees } from "@/lib/format";
import { ADDRESS, EMAIL, HOURS, PHONE_DISPLAY, whatsappLink } from "@/lib/site";

// Printable one-page fee brochure (ISR, refreshed every 5 minutes).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Course Brochure & Fee List",
  description: "Printable list of all courses, durations and fees at CODE, Bagdogra.",
  alternates: { canonical: "/brochure" },
  robots: { index: false, follow: true },
};

export default async function BrochurePage() {
  const courses = await getCourses();
  const printed = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

  return (
    <section>
      <div className="s-container max-w-4xl py-10 sm:py-14">
        <div className="s-noprint mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/courses" className="text-sm font-semibold text-[var(--s-ink)]">← Back to courses</Link>
          <PrintButton />
        </div>

        <div className="s-card p-6 sm:p-10">
          <header className="flex flex-wrap items-start justify-between gap-6 border-b border-[var(--s-line)] pb-6">
            <div>
              <Image src="/logo.png" alt="CODE — Computer & Digital Excellence" width={272} height={99} className="h-12 w-auto" />
              <p className="mt-3 text-sm text-[var(--s-body)]">{ADDRESS}</p>
              <p className="text-sm text-[var(--s-body)]">{PHONE_DISPLAY} · {EMAIL}</p>
              <p className="text-sm text-[var(--s-body)]">{HOURS}</p>
            </div>
            <div className="text-right">
              <p className="s-eyebrow">Course brochure</p>
              <p className="s-mono mt-2 text-xs text-[var(--s-muted)]">Fees as on {printed}</p>
            </div>
          </header>

          <table className="mt-6 w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--s-ink)] text-left text-xs uppercase tracking-wide text-[var(--s-muted)]">
                <th className="py-2 pr-3 font-semibold">Course</th>
                <th className="py-2 pr-3 font-semibold">Duration</th>
                <th className="py-2 pr-3 text-right font-semibold">Full payment</th>
                <th className="py-2 text-right font-semibold">Monthly plan</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-[var(--s-line)] align-top">
                  <td className="py-3 pr-3">
                    <span className="font-semibold text-[var(--s-ink)]">{c.content.displayName}</span>
                    <span className="block text-xs text-[var(--s-muted)]">{c.content.track} · {c.content.level}</span>
                  </td>
                  <td className="py-3 pr-3">{c.duration ?? "—"}</td>
                  <td className="s-mono py-3 pr-3 text-right">{c.fullPrice != null ? formatRupees(c.fullPrice) : "—"}</td>
                  <td className="s-mono py-3 text-right">
                    {c.perMonth != null ? (
                      <>
                        {formatRupees(c.perMonth)} × {c.monthlyInstallments}
                        <span className="block text-xs text-[var(--s-muted)]">= {formatRupees(c.monthlyPrice ?? 0)}</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[var(--s-muted)]">Course list unavailable — please call {PHONE_DISPLAY}.</td>
                </tr>
              )}
            </tbody>
          </table>

          <footer className="mt-6 text-xs leading-relaxed text-[var(--s-muted)]">
            Monthly plan = installment amount × number of months. A printed receipt is issued for every payment. Fees may be revised; the price
            quoted at admission applies for the course duration. Enquiries: {PHONE_DISPLAY} · WhatsApp {whatsappLink().replace("https://wa.me/", "+")}
          </footer>
        </div>
      </div>
    </section>
  );
}
