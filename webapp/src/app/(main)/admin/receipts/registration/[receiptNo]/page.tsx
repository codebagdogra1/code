import { notFound } from "next/navigation";
import { getRegistrationReceipt } from "@/lib/receipt-data";
import { formatRupees, formatDate, statusLabel } from "@/lib/format";
import { ReceiptToolbar } from "@/components/receipt/ReceiptToolbar";
import { ReceiptMasthead, ReceiptFoot } from "@/components/receipt/ReceiptChrome";

export const dynamic = "force-dynamic";

export default async function RegistrationReceiptPage({
  params,
}: {
  params: Promise<{ receiptNo: string }>;
}) {
  const { receiptNo } = await params;
  const r = await getRegistrationReceipt(decodeURIComponent(receiptNo));
  if (!r) notFound();

  const courseTotal = r.courses.reduce((s, c) => s + c.course_fee, 0);

  return (
    <div className="receipt-page ro">
      <ReceiptToolbar backHref={`/admin/registrations/${encodeURIComponent(r.receipt_no)}`} />

      <article className="receipt-sheet ro">
        <ReceiptMasthead
          kind="Registration Receipt"
          serial={r.receipt_no}
          date={r.registration_date}
        />

        {/* Student */}
        <section className="mt-6">
          <h2 className="receipt-section-title">Student</h2>
          <dl className="receipt-dl">
            <Cell label="Name" value={r.student.full_name} />
            <Cell label="Phone" value={r.student.phone_number} mono />
            <Cell label="Email" value={r.student.email || "—"} />
            <Cell label="Registered" value={formatDate(r.registration_date)} />
            <Cell label="Address" value={r.student.address || "—"} full />
          </dl>
        </section>

        {/* Courses enrolled */}
        <section className="mt-6">
          <h2 className="receipt-section-title">Courses enrolled</h2>
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Plan</th>
                <th className="num">Fee</th>
              </tr>
            </thead>
            <tbody>
              {r.courses.map((c, i) => (
                <tr key={i}>
                  <td>
                    <div className="font-semibold">{c.course_name}</div>
                    {c.duration && (
                      <div className="text-[0.68rem] uppercase tracking-wide text-[var(--ro-ink-2)]">
                        {c.duration}
                      </div>
                    )}
                  </td>
                  <td className="uppercase text-[0.72rem] tracking-wide">{c.payment_plan}</td>
                  <td className="num">{formatRupees(c.course_fee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Fee ledger */}
        <section className="mt-6">
          <h2 className="receipt-section-title">Fee details</h2>
          <div className="receipt-ledger">
            <div className="row">
              <span>Course fees</span>
              <span className="amt">{formatRupees(courseTotal)}</span>
            </div>
            <div className="row">
              <span>Admission fee</span>
              <span className="amt">{formatRupees(r.admission_fees)}</span>
            </div>
            {r.discount_amount > 0 && (
              <div className="row">
                <span>Discount</span>
                <span className="amt">− {formatRupees(r.discount_amount)}</span>
              </div>
            )}
            <div className="row">
              <span>Total payable</span>
              <span className="amt">{formatRupees(r.total_amount)}</span>
            </div>
            <div className="row">
              <span>Paid</span>
              <span className="amt" style={{ color: "var(--ro-green)" }}>
                {formatRupees(r.paid_amount)}
              </span>
            </div>
            <div className="row grand">
              <span>Balance due</span>
              <span className="amt" style={{ color: r.due_amount > 0 ? "var(--ro-red)" : "var(--ro-green)" }}>
                {formatRupees(r.due_amount)}
              </span>
            </div>
          </div>
        </section>

        <p className="mt-5 text-[0.74rem] text-[var(--ro-ink-2)]">
          Payment method: <span className="font-semibold text-[var(--ro-ink)]">{r.payment_method || "—"}</span>
          {"  ·  "}
          Status: <span className="font-semibold text-[var(--ro-ink)]">{statusLabel(r.payment_status)}</span>
        </p>

        <ReceiptFoot />
      </article>
    </div>
  );
}

function Cell({
  label,
  value,
  full,
  mono,
}: {
  label: string;
  value: string;
  full?: boolean;
  mono?: boolean;
}) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : undefined}>
      <dt>{label}</dt>
      <dd className={mono ? "ro-mono" : ""}>{value}</dd>
    </div>
  );
}
