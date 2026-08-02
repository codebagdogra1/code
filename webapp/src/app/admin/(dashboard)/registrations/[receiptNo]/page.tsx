"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, statusColor } from "@/lib/format";
import type { Installment, RegistrationDetail } from "@/lib/types";

export default function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ receiptNo: string }>;
}) {
  const { receiptNo } = use(params);
  const [reg, setReg] = useState<RegistrationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add-payment form state
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations/${receiptNo}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      setReg(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [receiptNo]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount
    load();
  }, [load]);

  async function addPayment(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receipt_no: receiptNo,
          additional_payment: value,
          payment_method: method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      setNotice(data.message);
      setAmount("");
      load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-[var(--muted)]">Loading…</p>;
  if (error || !reg)
    return (
      <div>
        <div className="card p-6 text-red-600">{error || "Registration not found"}</div>
        <Link href="/admin/registrations" className="btn-ghost mt-4">
          ← Back
        </Link>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/admin/registrations" className="text-sm text-[var(--muted)] hover:underline">
            ← Registrations
          </Link>
          <h1 className="mt-1 text-2xl font-bold">{reg.full_name}</h1>
          <p className="font-mono text-sm text-[var(--muted)]">{reg.receipt_no}</p>
        </div>
        <span className={`badge ${statusColor(reg.payment_status)}`}>{reg.payment_status}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          {/* Student & courses */}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">Student</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Phone" value={reg.phone_number} />
              <Field label="Email" value={reg.email || "—"} />
              <Field label="Date of birth" value={formatDate(reg.date_of_birth)} />
              <Field label="Registered" value={formatDate(reg.registration_date)} />
              <Field label="Address" value={reg.address || "—"} full />
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">Courses</h2>
            <ul className="space-y-2">
              {reg.courses.map((c, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3 text-sm"
                >
                  <div>
                    <div className="font-medium">{c.course_name}</div>
                    <div className="text-xs text-[var(--muted)]">
                      {c.duration} · {c.payment_plan}
                    </div>
                  </div>
                  <span className="font-medium">{formatCurrency(c.course_fee)}</span>
                </li>
              ))}
            </ul>
          </div>

          {reg.monthly_installments.length > 0 && (
            <div className="card p-6">
              <h2 className="mb-4 text-lg font-semibold">Monthly installments</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[32rem] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                      <th className="py-2 pr-3">Month</th>
                      <th className="py-2 pr-3">Course</th>
                      <th className="py-2 pr-3">Due date</th>
                      <th className="py-2 pr-3 text-right">Amount</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reg.monthly_installments.map((mi: Installment) => (
                      <tr key={mi.id} className="border-b border-[var(--border)] last:border-0">
                        <td className="py-2 pr-3">{mi.month_name}</td>
                        <td className="py-2 pr-3 text-[var(--muted)]">{mi.course_name}</td>
                        <td className="py-2 pr-3 text-[var(--muted)]">{formatDate(mi.due_date)}</td>
                        <td className="py-2 pr-3 text-right">
                          {formatCurrency(mi.installment_amount)}
                        </td>
                        <td className="py-2">
                          <span className={`badge ${statusColor(mi.payment_status)}`}>
                            {mi.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Payment summary + add payment */}
        <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
          <div className="card space-y-2 p-6">
            <h2 className="text-lg font-semibold">Payment summary</h2>
            <Row label="Total" value={formatCurrency(reg.total_amount)} />
            <Row label="Admission fee" value={formatCurrency(reg.admission_fees)} />
            <Row label="Discount" value={formatCurrency(reg.discount_amount)} />
            <Row label="Paid" value={formatCurrency(reg.paid_amount)} />
            <div className="border-t border-[var(--border)] pt-2">
              <Row label="Balance due" value={formatCurrency(reg.due_amount)} bold />
            </div>
          </div>

          <form onSubmit={addPayment} className="card space-y-3 p-6">
            <h2 className="text-lg font-semibold">Record a payment</h2>
            <div>
              <label className="label">Amount</label>
              <input
                type="number"
                min={1}
                className="input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Method</label>
              <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            {notice && <p className="text-sm text-[var(--muted)]">{notice}</p>}
            <button type="submit" className="btn-primary w-full" disabled={saving}>
              {saving ? "Saving…" : "Add payment"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <dt className="text-xs text-[var(--muted)]">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-semibold" : "text-[var(--muted)]"}>{label}</span>
      <span className={bold ? "text-lg font-bold" : ""}>{value}</span>
    </div>
  );
}
