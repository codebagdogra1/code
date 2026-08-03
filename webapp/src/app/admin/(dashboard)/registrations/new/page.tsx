"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { formatRupees } from "@/lib/format";
import type { Course } from "@/lib/types";
import { Icon } from "@/components/ro/Icon";

type Plan = "full" | "monthly";
type StudentMatch = {
  id: number;
  full_name: string;
  phone_number: string;
  email: string | null;
  date_of_birth: string;
  address: string;
  registrations_count: number;
};

const ADMISSION_FEES = 500;
const BLANK = { full_name: "", phone_number: "", email: "", date_of_birth: "", address: "" };

export default function NewRegistrationPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selected, setSelected] = useState<Record<number, { plan: Plan }>>({});
  const [student, setStudent] = useState({ ...BLANK });
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);

  // Returning-student lookup
  const [matches, setMatches] = useState<StudentMatch[]>([]);
  const [applied, setApplied] = useState<StudentMatch | null>(null);
  const [looking, setLooking] = useState(false);
  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load courses."))
      .finally(() => setLoadingCourses(false));
  }, []);

  // Debounced phone lookup — surfaces existing students so the desk never retypes.
  useEffect(() => {
    if (applied && applied.phone_number === student.phone_number) return;
    const phone = student.phone_number.trim();
    if (lookupTimer.current) clearTimeout(lookupTimer.current);
    if (phone.length < 4) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale matches when the phone is too short to query
      setMatches([]);
      return;
    }
    lookupTimer.current = setTimeout(async () => {
      setLooking(true);
      try {
        const res = await fetch(`/api/admin/students?phone=${encodeURIComponent(phone)}`);
        const data = await res.json();
        setMatches(res.ok ? data.students : []);
      } catch {
        setMatches([]);
      } finally {
        setLooking(false);
      }
    }, 350);
    return () => {
      if (lookupTimer.current) clearTimeout(lookupTimer.current);
    };
  }, [student.phone_number, applied]);

  function applyMatch(m: StudentMatch) {
    setStudent({
      full_name: m.full_name,
      phone_number: m.phone_number,
      email: m.email ?? "",
      date_of_birth: m.date_of_birth,
      address: m.address,
    });
    setApplied(m);
    setMatches([]);
  }

  function clearStudent() {
    setStudent({ ...BLANK });
    setApplied(null);
    setMatches([]);
  }

  const chosen = useMemo(
    () =>
      Object.entries(selected).map(([id, sel]) => {
        const course = courses.find((c) => c.id === Number(id))!;
        const fee =
          sel.plan === "monthly" ? Number(course.monthlyPrice ?? 0) : Number(course.fullPrice ?? 0);
        return { course, plan: sel.plan, fee };
      }),
    [selected, courses],
  );
  const coursesTotal = chosen.reduce((s, c) => s + c.fee, 0);
  const grandTotal = Math.max(0, coursesTotal + ADMISSION_FEES - discount);

  function toggle(id: number) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = { plan: "full" };
      return next;
    });
  }
  function setPlan(id: number, plan: Plan) {
    setSelected((prev) => ({ ...prev, [id]: { plan } }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (chosen.length === 0) {
      setError("Select at least one course.");
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
      <div className="mx-auto max-w-lg py-8 text-center">
        <div className="ro-panel ro-panel--lift p-8">
          <span className="ro-stamp ro-stamp--paid ro-stamp--settle mx-auto text-sm">Filed</span>
          <h1 className="mt-4 text-2xl font-bold">Registration filed</h1>
          <p className="mt-1 text-sm text-[var(--ro-ink-2)]">Receipt number</p>
          <p className="ro-mono my-3 select-all rounded-sm border border-[var(--ro-line-2)] bg-[var(--ro-panel-2)] py-2.5 text-lg font-bold">
            {receipt}
          </p>
          <p className="text-sm text-[var(--ro-ink-2)]">
            No money collected yet — open the card to stamp the first payment.
          </p>
          <div className="mt-6 flex justify-center gap-2.5">
            <Link href={`/admin/registrations/${receipt}`} className="ro-btn ro-btn--primary">
              <Icon name="arrow-right" size={15} /> Open card
            </Link>
            <button
              onClick={() => {
                setReceipt(null);
                setSelected({});
                setDiscount(0);
                clearStudent();
              }}
              className="ro-btn ro-btn--ghost"
            >
              <Icon name="new" size={15} /> Enrol another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="flex items-center gap-3">
        <span className="ro-plate py-1.5">New registration</span>
        <span className="ro-mono text-xs font-semibold tracking-widest text-[var(--ro-ink-2)]">
          A ONE-TIME ₹{ADMISSION_FEES} ADMISSION FEE APPLIES
        </span>
      </header>

      <form onSubmit={submit} className="mt-5 grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          {/* Student details + returning lookup */}
          <section className="ro-panel overflow-hidden">
            <div className="ro-underrule flex items-center justify-between px-5 py-3.5">
              <span className="ro-plate ro-plate--ink">Student</span>
              {applied && (
                <span className="flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--ro-green)]">
                  <Icon name="check" size={14} /> On file · {applied.registrations_count} prior
                </span>
              )}
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="relative sm:col-span-2">
                <label className="ro-label">Phone number *</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      className="ro-input ro-mono pl-8"
                      required
                      placeholder="Start typing to find a returning student"
                      value={student.phone_number}
                      onChange={(e) => {
                        setStudent({ ...student, phone_number: e.target.value });
                        if (applied) setApplied(null);
                      }}
                    />
                  </div>
                  {applied && (
                    <button type="button" onClick={clearStudent} className="ro-btn ro-btn--ghost">
                      <Icon name="x" size={14} /> Clear
                    </button>
                  )}
                </div>
                {/* lookup results */}
                {!applied && (matches.length > 0 || looking) && (
                  <div className="ro-panel ro-panel--lift absolute z-10 mt-1 w-full overflow-hidden">
                    {looking && matches.length === 0 ? (
                      <p className="px-4 py-2.5 text-[0.78rem] text-[var(--ro-ink-2)]">Searching…</p>
                    ) : (
                      <ul className="max-h-56 overflow-auto">
                        {matches.map((m) => (
                          <li key={m.id}>
                            <button
                              type="button"
                              onClick={() => applyMatch(m)}
                              className="flex w-full items-center justify-between gap-3 border-b border-[var(--ro-line)] px-4 py-2.5 text-left last:border-0 hover:bg-[var(--ro-zebra)]"
                            >
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold">
                                  {m.full_name}
                                </span>
                                <span className="ro-mono text-[0.72rem] text-[var(--ro-ink-2)]">
                                  {m.phone_number}
                                </span>
                              </span>
                              <span className="ro-mono flex-none text-[0.7rem] text-[var(--ro-ink-2)]">
                                {m.registrations_count} reg
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="ro-label">Full name *</label>
                <input
                  className="ro-input"
                  required
                  value={student.full_name}
                  onChange={(e) => setStudent({ ...student, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="ro-label">Date of birth *</label>
                <input
                  type="date"
                  className="ro-input"
                  required
                  value={student.date_of_birth}
                  onChange={(e) => setStudent({ ...student, date_of_birth: e.target.value })}
                />
              </div>
              <div>
                <label className="ro-label">Email</label>
                <input
                  type="email"
                  className="ro-input"
                  value={student.email}
                  onChange={(e) => setStudent({ ...student, email: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="ro-label">Address</label>
                <textarea
                  className="ro-input"
                  rows={2}
                  value={student.address}
                  onChange={(e) => setStudent({ ...student, address: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Course selection */}
          <section className="ro-panel overflow-hidden">
            <div className="px-5 py-3.5" style={{ borderBottom: "1px solid var(--ro-line)" }}>
              <span className="ro-plate ro-plate--ink">Choose courses</span>
            </div>
            <div className="p-5">
              {loadingCourses ? (
                <p className="text-sm text-[var(--ro-ink-2)]">Loading courses…</p>
              ) : courses.length === 0 ? (
                <p className="text-sm text-[var(--ro-ink-2)]">No courses in the catalogue yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {courses.map((c) => {
                    const sel = selected[c.id];
                    return (
                      <div
                        key={c.id}
                        className="rounded-sm border p-3.5"
                        style={{
                          borderColor: sel ? "var(--ro-blue)" : "var(--ro-line-2)",
                          background: sel ? "var(--ro-blue-tint)" : "transparent",
                        }}
                      >
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 accent-[var(--ro-blue)]"
                            checked={!!sel}
                            onChange={() => toggle(c.id)}
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-semibold">{c.name}</span>
                              <span className="text-[0.72rem] uppercase tracking-wide text-[var(--ro-ink-2)]">
                                {c.duration}
                              </span>
                            </div>
                            {sel && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {c.fullPrice != null && (
                                  <PlanButton
                                    active={sel.plan === "full"}
                                    onClick={() => setPlan(c.id, "full")}
                                    label={`Full — ${formatRupees(c.fullPrice)}`}
                                  />
                                )}
                                {c.monthlyPrice != null && (
                                  <PlanButton
                                    active={sel.plan === "monthly"}
                                    onClick={() => setPlan(c.id, "monthly")}
                                    label={`Monthly — ${formatRupees(Math.ceil(c.monthlyPrice / c.monthlyInstallments))}/mo ×${c.monthlyInstallments}`}
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
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <div className="ro-panel p-5">
            <span className="ro-plate ro-plate--ink">Summary</span>
            <dl className="mt-4 space-y-2.5">
              <SummaryRow label="Courses" value={formatRupees(coursesTotal)} />
              <SummaryRow label="Admission fee" value={formatRupees(ADMISSION_FEES)} />
            </dl>
            <div className="mt-3.5">
              <label className="ro-label">Discount (₹)</label>
              <input
                type="number"
                min={0}
                className="ro-input ro-mono"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <div className="mt-3.5">
              <label className="ro-label">Payment method</label>
              <select
                className="ro-input"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Cheque</option>
              </select>
            </div>
            <div className="mt-3.5 border-t border-[var(--ro-line-2)] pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-[var(--ro-ink-2)]">Total payable</span>
                <span className="ro-mono text-xl font-bold">{formatRupees(grandTotal)}</span>
              </div>
            </div>
            {error && (
              <p className="mt-3 flex items-start gap-2 text-[0.8rem] text-[var(--ro-red)]">
                <Icon name="alert" size={15} />
                {error}
              </p>
            )}
            <button type="submit" className="ro-btn ro-btn--primary mt-4 w-full py-2.5" disabled={submitting}>
              <Icon name="stamp" size={15} />
              {submitting ? "Filing…" : "File registration"}
            </button>
            <p className="mt-2 text-center text-[0.7rem] text-[var(--ro-ink-2)]">
              Payment is recorded on the card after filing.
            </p>
          </div>
        </aside>
      </form>
    </div>
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
      className="rounded-sm border px-3 py-1.5 text-[0.78rem] font-medium"
      style={{
        borderColor: active ? "var(--ro-blue-2)" : "var(--ro-line-2)",
        background: active ? "var(--ro-blue)" : "transparent",
        color: active ? "#f4f1e8" : "var(--ro-ink)",
      }}
    >
      {label}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--ro-ink-2)]">{label}</span>
      <span className="ro-mono font-semibold">{value}</span>
    </div>
  );
}
