import { notFound } from "next/navigation";
import { getPaymentReceipt } from "@/lib/receipt-data";
import { formatRupees, formatDate, statusLabel } from "@/lib/format";
import { ReceiptToolbar } from "@/components/receipt/ReceiptToolbar";
import { ReceiptMasthead, ReceiptFoot } from "@/components/receipt/ReceiptChrome";

export const dynamic = "force-dynamic";

export default async function PaymentReceiptPage({
  params,
}: {
  params: Promise<{ paymentNo: string }>;
}) {
  const { paymentNo } = await params;
  const p = await getPaymentReceipt(decodeURIComponent(paymentNo));
  if (!p) notFound();

  return (
    <div className="receipt-page ro">
      <ReceiptToolbar
        backHref={`/admin/registrations/${encodeURIComponent(p.registration_receipt_no)}`}
      />

      <article className="receipt-sheet ro">
        <ReceiptMasthead
          kind="Fee Payment Receipt"
          serial={p.payment_receipt_no}
          date={p.payment_date}
        />

        {/* Student + reference */}
        <section className="mt-6">
          <h2 className="receipt-section-title">Received from</h2>
          <dl className="receipt-dl">
            <Cell label="Name" value={p.student.full_name} />
            <Cell label="Phone" value={p.student.phone_number} mono />
            <Cell label="Registration" value={p.registration_receipt_no} mono />
            <Cell label="Method" value={p.payment_method} />
          </dl>
        </section>

        {/* Amount received — the headline of a payment receipt */}
        <section className="mt-6">
          <div className="receipt-amount-hero">
            <div>
              <div className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--ro-ink-2)]">
                Amount received
              </div>
              <div className="mt-0.5 text-[0.72rem] text-[var(--ro-ink-2)]">
                on {formatDate(p.payment_date)} · {p.payment_method}
              </div>
            </div>
            <div className="amt">{formatRupees(p.payment_amount)}</div>
          </div>
        </section>

        {/* Months this payment settled */}
        {p.months.length > 0 && (
          <section className="mt-6">
            <h2 className="receipt-section-title">Applied to installments</h2>
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Month</th>
                  <th className="num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {p.months.map((m, i) => (
                  <tr key={i}>
                    <td>{m.course_name}</td>
                    <td>
                      <span className="ro-mono font-semibold">M{m.month_number}</span> · {m.month_name}
                    </td>
                    <td className="num">{formatRupees(m.amount_applied)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Balance after this payment (current standing on the registration) */}
        <section className="mt-6">
          <h2 className="receipt-section-title">Account balance</h2>
          <div className="receipt-ledger">
            <div className="row">
              <span>Total payable</span>
              <span className="amt">{formatRupees(p.registration.total_amount)}</span>
            </div>
            <div className="row">
              <span>Paid to date</span>
              <span className="amt" style={{ color: "var(--ro-green)" }}>
                {formatRupees(p.registration.paid_amount)}
              </span>
            </div>
            <div className="row grand">
              <span>Balance due</span>
              <span
                className="amt"
                style={{
                  color: p.registration.due_amount > 0 ? "var(--ro-red)" : "var(--ro-green)",
                }}
              >
                {formatRupees(p.registration.due_amount)}
              </span>
            </div>
          </div>
          <p className="mt-2 text-right text-[0.68rem] text-[var(--ro-ink-2)]">
            Account status: {statusLabel(p.registration.payment_status)}
          </p>
        </section>

        <ReceiptFoot />
      </article>
    </div>
  );
}

function Cell({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd className={mono ? "ro-mono" : ""}>{value}</dd>
    </div>
  );
}
