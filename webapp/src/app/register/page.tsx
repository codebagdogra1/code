"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { formatCurrency } from "@/lib/format";
import type { Course } from "@/lib/types";

type Plan = "full" | "monthly";
type Selection = { plan: Plan };

const ADMISSION_FEES = 500; // one-time admission fee

export default function RegisterPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<number, Selection>>({});
  const [student, setStudent] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    date_of_birth: "",
    address: "",
  });
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load courses."))
      .finally(() => setLoading(false));
  }, []);

  const chosen = useMemo(
    () =>
      Object.entries(selected).map(([id, sel]) => {
        const course = courses.find((c) => c.id === Number(id))!;
        // `monthlyPrice` from the DB is the TOTAL for the monthly plan (already the
        // sum of all installments), not a per-month figure. The per-month amount is
        // derived by dividing by the number of installments.
        const fee =
          sel.plan === "monthly"
            ? Number(course.monthlyPrice ?? 0)
            : Number(course.fullPrice ?? 0);
        return { course, plan: sel.plan, fee };
      }),
    [selected, courses],
  );

  const coursesTotal = chosen.reduce((sum, c) => sum + c.fee, 0);
  const grandTotal = Math.max(0, coursesTotal + ADMISSION_FEES - discount);

  function toggle(courseId: number) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[courseId]) delete next[courseId];
      else next[courseId] = { plan: "full" };
      return next;
    });
  }

  function setPlan(courseId: number, plan: Plan) {
    setSelected((prev) => ({ ...prev, [courseId]: { plan } }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (chosen.length === 0) {
      setError("Please select at least one course.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentData: {
            full_name: student.full_name,
            phone_number: student.phone_number,
            email: student.email || null,
            date_of_birth: student.date_of_birth || null,
            address: student.address || null,
          },
          selectedCourses: chosen.map((c) => ({
            course_id: c.course.id,
            payment_plan: c.plan,
            course_fee: c.fee,
          })),
          paymentDetails: {
            total_amount: coursesTotal + ADMISSION_FEES,
            admission_fees: ADMISSION_FEES,
            discount_amount: discount,
            paid_amount: 0,
            due_amount: grandTotal,
            payment_method: paymentMethod,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setReceipt(data.receipt_no);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (receipt) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto w-full max-w-lg flex-1 px-4 py-20 text-center">
          <div className="card p-8">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-100 text-2xl text-green-700">
              ✓
            </div>
            <h1 className="text-2xl font-bold">Registration successful!</h1>
            <p className="mt-2 text-[var(--muted)]">Your receipt number is</p>
            <p className="my-3 select-all rounded-lg bg-[var(--background)] py-2 font-mono text-lg font-semibold">
              {receipt}
            </p>
            <p className="text-sm text-[var(--muted)]">
              Please keep this number to track and pay your fees.
            </p>
            <Link href="/" className="btn-primary mt-6">
              Back to home
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold">Course registration</h1>
        <p className="mt-1 text-[var(--muted)]">
          Fill in your details and choose your courses. A one-time admission fee of{" "}
          {formatCurrency(ADMISSION_FEES)} applies.
        </p>

        <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-8">
            {/* Student details */}
            <section className="card p-6">
              <h2 className="mb-4 text-lg font-semibold">Your details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Full name *</label>
                  <input
                    className="input"
                    required
                    value={student.full_name}
                    onChange={(e) => setStudent({ ...student, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Phone number *</label>
                  <input
                    className="input"
                    required
                    value={student.phone_number}
                    onChange={(e) => setStudent({ ...student, phone_number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={student.email}
                    onChange={(e) => setStudent({ ...student, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Date of birth</label>
                  <input
                    type="date"
                    className="input"
                    value={student.date_of_birth}
                    onChange={(e) => setStudent({ ...student, date_of_birth: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Address</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={student.address}
                    onChange={(e) => setStudent({ ...student, address: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Courses */}
            <section className="card p-6">
              <h2 className="mb-4 text-lg font-semibold">Choose courses</h2>
              {loading ? (
                <p className="text-[var(--muted)]">Loading courses…</p>
              ) : courses.length === 0 ? (
                <p className="text-[var(--muted)]">No courses available right now.</p>
              ) : (
                <div className="space-y-3">
                  {courses.map((c) => {
                    const sel = selected[c.id];
                    return (
                      <div
                        key={c.id}
                        className={`rounded-lg border p-4 transition-colors ${
                          sel
                            ? "border-[var(--brand)] bg-[var(--brand)]/5"
                            : "border-[var(--border)]"
                        }`}
                      >
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={!!sel}
                            onChange={() => toggle(c.id)}
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-medium">{c.name}</span>
                              <span className="text-sm text-[var(--muted)]">{c.duration}</span>
                            </div>
                            {sel && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {c.fullPrice != null && (
                                  <PlanButton
                                    active={sel.plan === "full"}
                                    onClick={() => setPlan(c.id, "full")}
                                    label={`Full — ${formatCurrency(c.fullPrice)}`}
                                  />
                                )}
                                {c.monthlyPrice != null && (
                                  <PlanButton
                                    active={sel.plan === "monthly"}
                                    onClick={() => setPlan(c.id, "monthly")}
                                    label={`Monthly — ${formatCurrency(
                                      Math.ceil(c.monthlyPrice / c.monthlyInstallments),
                                    )}/mo × ${c.monthlyInstallments} = ${formatCurrency(
                                      c.monthlyPrice,
                                    )}`}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="card space-y-3 p-6">
              <h2 className="text-lg font-semibold">Summary</h2>
              <SummaryRow label="Courses" value={formatCurrency(coursesTotal)} />
              <SummaryRow label="Admission fee" value={formatCurrency(ADMISSION_FEES)} />
              <div>
                <label className="label">Discount</label>
                <input
                  type="number"
                  min={0}
                  className="input"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                />
              </div>
              <div>
                <label className="label">Preferred payment method</label>
                <select
                  className="input"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div className="border-t border-[var(--border)] pt-3">
                <SummaryRow label="Total payable" value={formatCurrency(grandTotal)} bold />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
                {submitting ? "Submitting…" : "Complete registration"}
              </button>
              <p className="text-center text-xs text-[var(--muted)]">
                No payment is collected online. Pay at the institute or via the admin desk.
              </p>
            </div>
          </aside>
        </form>
      </main>
    </>
  );
}

function PlanButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm ${
        active
          ? "border-[var(--brand)] bg-[var(--brand)] text-white"
          : "border-[var(--border)]"
      }`}
    >
      {label}
    </button>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-semibold" : "text-[var(--muted)]"}>{label}</span>
      <span className={bold ? "text-lg font-bold" : ""}>{value}</span>
    </div>
  );
}
