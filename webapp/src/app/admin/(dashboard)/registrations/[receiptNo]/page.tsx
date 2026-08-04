"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatRupees, formatDate, roStampClass, statusLabel } from "@/lib/format";
import type { RegistrationDetail } from "@/lib/types";
import { Icon } from "@/components/ro/Icon";

type GroupInstallment = {
  id: number;
  course_id: number;
  month_number: number;
  month_name: string;
  installment_amount: number | string;
  paid_amount: number | string;
  payment_status: string;
  current_status: string;
  due_date: string;
};
type CourseGroup = {
  course_id: number;
  course_name: string;
  duration: string;
  installments: GroupInstallment[];
};
type PaymentRow = {
  id: number;
  payment_amount: number;
  payment_method: string;
  payment_type: string;
  receipt_no: string;
  payment_date: string | null;
  // Amount this payment applied to each course, derived from its installment
  // mappings. Empty for flat/legacy payments with no course attribution.
  courses?: { course_id: number; amount_applied: number }[];
};

const num = (v: number | string | null | undefined) => Number(v ?? 0);

export default function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ receiptNo: string }>;
}) {
  const { receiptNo } = use(params);
  const [reg, setReg] = useState<RegistrationDetail | null>(null);
  const [groups, setGroups] = useState<CourseGroup[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  // Which course's details are shown. "all" merges every course (the default);
  // a course_id narrows the installments and payments to just that course.
  const [courseFilter, setCourseFilter] = useState<number | "all">("all");
  const [method, setMethod] = useState("Cash");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{
    kind: "ok" | "warn" | "err";
    text: string;
    receiptNo?: string;
  } | null>(null);
  const [stamped, setStamped] = useState(false);

  // Flat quick-payment (used when a registration has no monthly installments).
  const [flatAmount, setFlatAmount] = useState("");
  // Custom amount for a single-month installment payment (partial payments).
  const [customAmount, setCustomAmount] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dRes, mRes, pRes] = await Promise.all([
        fetch(`/api/admin/registrations/${receiptNo}`),
        fetch(`/api/admin/payments?receipt_no=${encodeURIComponent(receiptNo)}&action=monthly_installments`),
        fetch(`/api/admin/payments?receipt_no=${encodeURIComponent(receiptNo)}`),
      ]);
      const dData = await dRes.json();
      if (!dRes.ok) throw new Error(dData.error || "Not found");
      setReg(dData);
      const mData = await mRes.json();
      setGroups(mRes.ok && Array.isArray(mData.courses) ? mData.courses : []);
      const pData = await pRes.json();
      setPayments(pRes.ok && Array.isArray(pData.payments) ? pData.payments : []);
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

  // remaining due per installment id, and quick lookups
  const byId = useMemo(() => {
    const m = new Map<number, GroupInstallment>();
    for (const g of groups) for (const i of g.installments) m.set(i.id, i);
    return m;
  }, [groups]);

  const remainingOf = (i: GroupInstallment) =>
    Math.max(0, Math.round(num(i.installment_amount) - num(i.paid_amount)));

  const isPaid = (i: GroupInstallment) => i.payment_status === "PAID" || remainingOf(i) <= 0;
  const isCancelledInst = (i: GroupInstallment) => i.payment_status === "CANCELLED";

  // Whole registration was cancelled (student left / withdrew). No payments can be
  // recorded and installments are parked until it is restored to active.
  const isCancelled = reg?.payment_status?.toUpperCase() === "CANCELLED";

  const selectedTotal = useMemo(() => {
    let t = 0;
    for (const id of selected) {
      const i = byId.get(id);
      if (i) t += remainingOf(i);
    }
    return t;
  }, [selected, byId]);

  const hasInstallments = groups.some((g) => g.installments.length > 0);

  // When exactly one month is selected the amount is editable, so the admin can
  // record a partial payment. Multiple months always settle at their own dues.
  const singleSelected = useMemo(
    () => (selected.size === 1 ? byId.get([...selected][0]) ?? null : null),
    [selected, byId],
  );
  const singleId = singleSelected?.id ?? null;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync input to selection
    setCustomAmount(singleSelected ? String(remainingOf(singleSelected)) : "");
    // Reset only when the single selection changes, not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleId]);

  // Amount actually posted: the (clamped) custom amount for a single month,
  // otherwise the sum of each selected month's remaining due.
  const payAmount = singleSelected
    ? Math.min(Math.max(0, Math.round(Number(customAmount) || 0)), remainingOf(singleSelected))
    : selectedTotal;

  function toggle(id: number) {
    const i = byId.get(id);
    if (!i || isPaid(i) || isCancelledInst(i) || isCancelled) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function stampPayment() {
    if (selected.size === 0 || payAmount <= 0) return;
    setSaving(true);
    setNotice(null);
    // One entry per month. A single month can carry a custom (partial) amount;
    // multiple months are each allocated their real due (never split evenly).
    const monthly_payments = singleSelected
      ? [{ course_id: singleSelected.course_id, month_ids: [singleSelected.id], amount: payAmount }]
      : [...selected]
          .map((id) => byId.get(id))
          .filter((i): i is GroupInstallment => !!i)
          .map((i) => ({ course_id: i.course_id, month_ids: [i.id], amount: remainingOf(i) }));
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_receipt_no: receiptNo,
          payment_amount: payAmount,
          payment_method: method,
          monthly_payments,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      setStamped(true);
      setTimeout(() => setStamped(false), 900);
      setSelected(new Set());
      if (data.warnings?.length) {
        setNotice({ kind: "warn", text: data.warnings.join(" "), receiptNo: data.payment_receipt_no });
      } else {
        setNotice({
          kind: "ok",
          text: data.message || "Payment recorded.",
          receiptNo: data.payment_receipt_no,
        });
      }
      load();
    } catch (err) {
      setNotice({ kind: "err", text: err instanceof Error ? err.message : "Payment failed" });
    } finally {
      setSaving(false);
    }
  }

  async function addFlat(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(flatAmount);
    if (!value || value <= 0) return;
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt_no: receiptNo, additional_payment: value, payment_method: method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      setStamped(true);
      setTimeout(() => setStamped(false), 900);
      setFlatAmount("");
      setNotice({ kind: "ok", text: data.message || "Payment recorded." });
      load();
    } catch (err) {
      setNotice({ kind: "err", text: err instanceof Error ? err.message : "Payment failed" });
    } finally {
      setSaving(false);
    }
  }

  // Cancel (student left midway) parks unpaid months so they stop counting as
  // overdue; restore reverses it. Recorded payments are kept either way.
  async function setStatus(status: "CANCELLED" | "ACTIVE") {
    const cancelling = status === "CANCELLED";
    const msg = cancelling
      ? "Mark this registration as cancelled? Remaining unpaid months stop counting as overdue. Payments already recorded are kept."
      : "Restore this registration to active?";
    if (!confirm(msg)) return;
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/registrations/${receiptNo}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${cancelling ? "cancel" : "restore"}`);
      setSelected(new Set());
      setNotice({ kind: "ok", text: cancelling ? "Registration cancelled." : "Registration restored." });
      load();
    } catch (err) {
      setNotice({ kind: "err", text: err instanceof Error ? err.message : "Update failed" });
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <p className="ro-mono text-sm tracking-widest text-[var(--ro-ink-2)]">READING FILE…</p>;
  if (error || !reg)
    return (
      <div>
        <div className="ro-panel flex items-start gap-3 p-6 text-[var(--ro-red)]">
          <Icon name="alert" size={20} />
          <p className="text-sm">{error || "Registration not found"}</p>
        </div>
        <Link href="/admin/registrations" className="ro-btn ro-btn--ghost mt-4">
          <Icon name="arrow-left" size={15} /> Back to register
        </Link>
      </div>
    );

  // A single registration can carry several courses; the selector below lets the
  // admin drill into one at a time. With one course there is nothing to switch, so
  // the selector stays hidden and every panel shows that course as before.
  const multiCourse = reg.courses.length > 1;
  const activeCourse =
    courseFilter === "all" ? null : reg.courses.find((c) => c.course_id === courseFilter) ?? null;

  // Switching course clears any pending month selection so a now-hidden course's
  // months can't silently stay in the payment total.
  const chooseCourse = (f: number | "all") => {
    setCourseFilter(f);
    setSelected(new Set());
  };

  const visibleGroups =
    courseFilter === "all" ? groups : groups.filter((g) => g.course_id === courseFilter);

  // In a course-filtered view, show the amount that payment applied to this course
  // (a payment can settle months across courses); in the "all" view show the full total.
  const paymentAmountFor = (p: PaymentRow) =>
    courseFilter === "all"
      ? p.payment_amount
      : (p.courses ?? []).reduce(
          (t, c) => (c.course_id === courseFilter ? t + c.amount_applied : t),
          0,
        );
  const visiblePayments =
    courseFilter === "all"
      ? payments
      : payments.filter((p) => (p.courses ?? []).some((c) => c.course_id === courseFilter));

  return (
    <div>
      <Link
        href="/admin/registrations"
        className="ro-mono inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[var(--ro-ink-2)] hover:text-[var(--ro-ink)]"
      >
        <Icon name="arrow-left" size={14} /> REGISTER
      </Link>

      <header className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{reg.full_name}</h1>
          <p className="ro-mono mt-0.5 text-sm text-[var(--ro-ink-2)]">
            {reg.receipt_no} · registered {formatDate(reg.registration_date)}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href={`/admin/receipts/registration/${encodeURIComponent(reg.receipt_no)}`}
            target="_blank"
            className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.7rem]"
            title="Open a printable registration receipt"
          >
            <Icon name="printer" size={14} /> Print receipt
          </Link>
          <span className={`ro-stamp ${roStampClass(reg.payment_status)}`}>
            {statusLabel(reg.payment_status)}
          </span>
          {!isCancelled && (
            <button
              onClick={() => setStatus("CANCELLED")}
              disabled={saving}
              className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.7rem] text-[var(--ro-ochre)]"
              title="Student left / cancelled the course"
            >
              <Icon name="cancel" size={14} /> Cancel
            </button>
          )}
        </div>
      </header>

      {/* Student files — when a student holds more than one registration (e.g. a
          DCA→ADCA transfer on two receipts), a strip of their registrations lets
          the desk hop between them. The current one is marked and non-clickable. */}
      {reg.student_registrations.length > 1 && (
        <section className="ro-panel mt-4 overflow-hidden">
          <div
            className="flex items-center gap-2.5 px-4 py-2.5"
            style={{ borderBottom: "1px solid var(--ro-line)" }}
          >
            <span className="ro-plate ro-plate--ink">Student files</span>
            <span className="ro-mono text-[0.7rem] tracking-wide text-[var(--ro-ink-2)]">
              {reg.student_registrations.length} registrations for {reg.full_name}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto p-3">
            {reg.student_registrations.map((r) => (
              <FileTab key={r.receipt_no} r={r} current={r.receipt_no === reg.receipt_no} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-5">
          {/* Student job-card — receipt number runs down the file spine */}
          <section className="ro-panel flex overflow-hidden">
            <div className="ro-filespine" aria-hidden="true">
              {reg.receipt_no}
            </div>
            <div className="min-w-0 flex-1">
              <div className="px-5 py-3.5" style={{ borderBottom: "1px solid var(--ro-line)" }}>
                <span className="ro-plate ro-plate--ink">Student card</span>
              </div>
              <dl className="grid grid-cols-2 gap-x-5 gap-y-4 p-5">
                <Field label="Phone" value={reg.phone_number} mono />
                <Field label="Email" value={reg.email || "—"} />
                <Field label="Date of birth" value={formatDate(reg.date_of_birth)} />
                <Field label="Registered" value={formatDate(reg.registration_date)} />
                <Field label="Address" value={reg.address || "—"} full />
              </dl>
            </div>
          </section>

          {/* Courses — with 2+ courses each row is a filter that scopes the
              installments and payments below to that course. */}
          <section className="ro-panel overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--ro-line)" }}>
              <span className="ro-plate ro-plate--ink">Courses</span>
              {multiCourse && (
                <span className="ro-mono hidden text-[0.7rem] tracking-wide text-[var(--ro-ink-2)] sm:inline">
                  tap a course to view its details
                </span>
              )}
            </div>
            {multiCourse ? (
              <div className="divide-y divide-[var(--ro-line)]">
                <CourseRow
                  active={courseFilter === "all"}
                  onClick={() => chooseCourse("all")}
                  title="All courses"
                  subtitle={`${reg.courses.length} enrolled`}
                  amount={formatRupees(reg.courses.reduce((t, c) => t + c.course_fee, 0))}
                />
                {reg.courses.map((c, i) => (
                  <CourseRow
                    key={c.course_id ?? i}
                    active={courseFilter === c.course_id}
                    onClick={() => c.course_id != null && chooseCourse(c.course_id)}
                    title={c.course_name}
                    subtitle={`${c.duration || "—"} · ${c.payment_plan}`}
                    amount={formatRupees(c.course_fee)}
                  />
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-[var(--ro-line)]">
                {reg.courses.map((c, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <div className="font-semibold">{c.course_name}</div>
                      <div className="text-[0.72rem] uppercase tracking-wide text-[var(--ro-ink-2)]">
                        {c.duration || "—"} · {c.payment_plan}
                      </div>
                    </div>
                    <span className="ro-mono font-semibold">{formatRupees(c.course_fee)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Punch-card month grid */}
          {hasInstallments && (
            <section className="ro-panel overflow-hidden">
              <div
                className="ro-underrule flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: undefined }}
              >
                <span className="ro-plate ro-plate--ink">Monthly installments</span>
                <span className="ro-mono hidden text-[0.7rem] tracking-wide text-[var(--ro-ink-2)] sm:inline">
                  tap a month to record its payment
                </span>
              </div>
              <div className="space-y-5 p-5">
                {visibleGroups.length === 0 && (
                  <p className="ro-mono text-[0.72rem] tracking-wide text-[var(--ro-ink-2)]">
                    No monthly installments for {activeCourse?.course_name ?? "this course"}.
                  </p>
                )}
                {visibleGroups.map((g) => {
                  const settled = g.installments.filter(isPaid).length;
                  return (
                    <div key={g.course_id}>
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="text-sm font-semibold">{g.course_name}</span>
                        <span className="ro-mono text-[0.7rem] text-[var(--ro-ink-2)]">
                          {settled}/{g.installments.length} settled
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {g.installments.map((i) => {
                          const paid = isPaid(i);
                          const cancelled = !paid && isCancelledInst(i);
                          const overdue = i.current_status === "OVERDUE";
                          const sel = selected.has(i.id);
                          const remaining = remainingOf(i);
                          const selectable = !paid && !cancelled && !isCancelled;
                          return (
                            <button
                              key={i.id}
                              type="button"
                              disabled={!selectable}
                              onClick={() => toggle(i.id)}
                              aria-pressed={sel}
                              title={`${i.month_name} — ${paid ? "paid" : cancelled ? "cancelled" : overdue ? "overdue" : "due"} ${formatRupees(remaining)}`}
                              className={`ro-punch ${paid ? "ro-punch--paid" : cancelled ? "ro-punch--cancelled" : overdue ? "ro-punch--overdue" : ""} ${selectable ? "ro-punch--selectable" : ""} ${sel ? "ro-punch--selected" : ""}`}
                            >
                              <span className="ro-punch__m">M{i.month_number}</span>
                              {paid ? (
                                <Icon name="check" size={15} />
                              ) : (
                                <span className="ro-punch__a">{formatRupees(remaining)}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Payment history — each collected payment prints its own fee receipt.
              When a course is selected we show only payments that touched it, and the
              amount each applied to that course (a payment can span several courses). */}
          {visiblePayments.length > 0 && (
            <section className="ro-panel overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--ro-line)" }}>
                <span className="ro-plate ro-plate--ink">Payments received</span>
                {activeCourse && (
                  <span className="ro-mono hidden text-[0.7rem] tracking-wide text-[var(--ro-ink-2)] sm:inline">
                    applied to {activeCourse.course_name}
                  </span>
                )}
              </div>
              <ul className="divide-y divide-[var(--ro-line)]">
                {visiblePayments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <div className="ro-mono text-sm font-semibold">{formatRupees(paymentAmountFor(p))}</div>
                      <div className="ro-mono truncate text-[0.7rem] text-[var(--ro-ink-2)]">
                        {p.receipt_no} · {formatDate(p.payment_date)} · {p.payment_method}
                      </div>
                    </div>
                    <Link
                      href={`/admin/receipts/payment/${encodeURIComponent(p.receipt_no)}`}
                      target="_blank"
                      className="ro-btn ro-btn--ghost shrink-0 px-2.5 py-1 text-[0.7rem]"
                      title="Open a printable fee payment receipt"
                    >
                      <Icon name="printer" size={14} /> Receipt
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Ledger summary + record payment */}
        <aside className="space-y-5 lg:sticky lg:top-6 lg:h-fit">
          <section className="ro-panel p-5">
            <span className="ro-plate ro-plate--ink">Ledger</span>
            <dl className="mt-4 space-y-2.5">
              <Row label="Total" value={formatRupees(reg.total_amount)} />
              <Row label="Admission fee" value={formatRupees(reg.admission_fees)} />
              <Row label="Discount" value={reg.discount_amount ? `− ${formatRupees(reg.discount_amount)}` : "—"} />
              <Row label="Paid" value={formatRupees(reg.paid_amount)} tone="green" />
              <div className="mt-1 border-t border-[var(--ro-line-2)] pt-2.5">
                <Row
                  label="Balance due"
                  value={formatRupees(reg.due_amount)}
                  big
                  tone={reg.due_amount > 0 ? "red" : "green"}
                />
              </div>
            </dl>
          </section>

          <section className="ro-panel relative p-5">
            {stamped && (
              <span className="ro-stamp ro-stamp--paid ro-stamp--settle pointer-events-none absolute right-4 top-4 text-sm">
                Posted
              </span>
            )}
            <span className="ro-plate ro-plate--ink">Record payment</span>

            {isCancelled ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2.5 rounded-sm border border-dashed border-[var(--ro-ochre)] bg-[var(--ro-panel-2)] px-3.5 py-3.5 text-sm font-medium text-[var(--ro-ink-2)]">
                  <Icon name="cancel" size={18} />
                  Registration cancelled — no payments can be recorded. Unpaid months are parked.
                </div>
                <button
                  onClick={() => setStatus("ACTIVE")}
                  disabled={saving}
                  className="ro-btn ro-btn--primary w-full"
                >
                  <Icon name="arrow-left" size={15} />
                  {saving ? "Restoring…" : "Restore to active"}
                </button>
              </div>
            ) : reg.due_amount <= 0 ? (
              <div className="mt-4 flex items-center gap-2.5 rounded-sm border border-dashed border-[var(--ro-green)] bg-[var(--ro-green-tint)] px-3.5 py-3.5 text-sm font-medium text-[var(--ro-green)]">
                <Icon name="check" size={18} />
                Fully settled — nothing due.
              </div>
            ) : hasInstallments ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between rounded-sm border border-dashed border-[var(--ro-line-2)] bg-[var(--ro-panel-2)] px-3 py-2.5">
                  <span className="text-[0.72rem] uppercase tracking-wide text-[var(--ro-ink-2)]">
                    {selected.size} month{selected.size === 1 ? "" : "s"} selected
                  </span>
                  <span className="ro-mono text-lg font-bold">{formatRupees(payAmount)}</span>
                </div>
                {singleSelected && (
                  <div>
                    <label className="ro-label" htmlFor="inst-amt">
                      Amount (₹)
                    </label>
                    <input
                      id="inst-amt"
                      type="number"
                      min={1}
                      max={remainingOf(singleSelected)}
                      className="ro-input ro-mono"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                    <p className="mt-1 text-[0.72rem] leading-relaxed text-[var(--ro-ink-2)]">
                      {singleSelected.month_name}: {formatRupees(remainingOf(singleSelected))} due.
                      Enter less to record a partial payment.
                    </p>
                  </div>
                )}
                <div>
                  <label className="ro-label" htmlFor="method">
                    Method
                  </label>
                  <select
                    id="method"
                    className="ro-input"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                  </select>
                </div>
                <button
                  onClick={stampPayment}
                  disabled={saving || selected.size === 0 || payAmount <= 0}
                  className="ro-btn ro-btn--primary w-full"
                >
                  <Icon name="stamp" size={15} />
                  {saving ? "Posting…" : `Stamp ${formatRupees(payAmount)}`}
                </button>
                <p className="text-[0.72rem] leading-relaxed text-[var(--ro-ink-2)]">
                  Select one month to enter a custom amount; multiple months each settle at their own
                  due — no even-splitting.
                </p>
              </div>
            ) : (
              <form onSubmit={addFlat} className="mt-4 space-y-3">
                <div>
                  <label className="ro-label" htmlFor="amt">
                    Amount (₹)
                  </label>
                  <input
                    id="amt"
                    type="number"
                    min={1}
                    className="ro-input ro-mono"
                    value={flatAmount}
                    onChange={(e) => setFlatAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="ro-label" htmlFor="method2">
                    Method
                  </label>
                  <select
                    id="method2"
                    className="ro-input"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                  </select>
                </div>
                <button type="submit" disabled={saving} className="ro-btn ro-btn--primary w-full">
                  <Icon name="stamp" size={15} />
                  {saving ? "Posting…" : "Stamp payment"}
                </button>
              </form>
            )}

            {notice && (
              <p
                className="mt-3 flex items-start gap-2 text-[0.78rem] leading-relaxed"
                style={{
                  color:
                    notice.kind === "err" || notice.kind === "warn"
                      ? "var(--ro-red)"
                      : "var(--ro-green)",
                }}
              >
                <Icon name={notice.kind === "ok" ? "check" : "alert"} size={15} />
                {notice.text}
              </p>
            )}
            {notice?.receiptNo && (
              <Link
                href={`/admin/receipts/payment/${encodeURIComponent(notice.receiptNo)}`}
                target="_blank"
                className="ro-btn ro-btn--ghost mt-3 w-full"
              >
                <Icon name="printer" size={15} /> Print this receipt
              </Link>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function FileTab({
  r,
  current,
}: {
  r: RegistrationDetail["student_registrations"][number];
  current: boolean;
}) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="ro-mono text-xs font-semibold">{r.receipt_no}</span>
        <span className={`ro-stamp ${roStampClass(r.payment_status)} text-[0.65rem]`}>
          {statusLabel(r.payment_status)}
        </span>
      </div>
      <div className="mt-1 truncate text-[0.72rem]">{r.course_names.join(", ") || "—"}</div>
      <div className="ro-mono mt-0.5 text-[0.65rem] text-[var(--ro-ink-2)]">
        {formatDate(r.registration_date)} ·{" "}
        {r.due_amount > 0 ? `due ${formatRupees(r.due_amount)}` : "settled"}
      </div>
    </>
  );
  const base = "min-w-[9.5rem] max-w-[13rem] shrink-0 rounded-sm border px-3 py-2 text-left";
  if (current) {
    return (
      <div
        aria-current="page"
        className={`${base} border-[var(--ro-ink)] bg-[var(--ro-panel-2)]`}
        style={{ boxShadow: "inset 3px 0 0 var(--ro-ink)" }}
      >
        {inner}
      </div>
    );
  }
  return (
    <Link
      href={`/admin/registrations/${encodeURIComponent(r.receipt_no)}`}
      className={`${base} border-[var(--ro-line-2)] transition-colors hover:bg-[var(--ro-panel-2)]`}
    >
      {inner}
    </Link>
  );
}

function CourseRow({
  active,
  onClick,
  title,
  subtitle,
  amount,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  amount: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors ${
        active ? "bg-[var(--ro-panel-2)]" : "hover:bg-[var(--ro-panel-2)]"
      }`}
      style={active ? { boxShadow: "inset 3px 0 0 var(--ro-ink)" } : undefined}
    >
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-[0.72rem] uppercase tracking-wide text-[var(--ro-ink-2)]">{subtitle}</div>
      </div>
      <span className="ro-mono font-semibold">{amount}</span>
    </button>
  );
}

function Field({
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
    <div className={full ? "col-span-2" : ""}>
      <dt className="text-[0.64rem] font-bold uppercase tracking-[0.12em] text-[var(--ro-ink-2)]">
        {label}
      </dt>
      <dd className={`mt-1 text-sm ${mono ? "ro-mono" : ""}`}>{value}</dd>
    </div>
  );
}

function Row({
  label,
  value,
  big,
  tone,
}: {
  label: string;
  value: string;
  big?: boolean;
  tone?: "red" | "green";
}) {
  const color =
    tone === "red" ? "var(--ro-red)" : tone === "green" ? "var(--ro-green)" : "var(--ro-ink)";
  return (
    <div className="flex items-baseline justify-between">
      <span
        className={`${big ? "text-sm font-semibold" : "text-sm"} text-[var(--ro-ink-2)]`}
      >
        {label}
      </span>
      <span
        className={`ro-mono ${big ? "text-xl font-bold" : "font-semibold"}`}
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}
