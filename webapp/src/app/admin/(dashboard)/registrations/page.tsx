"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatRupees, formatDate, roStampClass, statusLabel } from "@/lib/format";
import type { Pagination, RegistrationListItem } from "@/lib/types";
import { Icon } from "@/components/ro/Icon";

export default function RegistrationsPage() {
  const [items, setItems] = useState<RegistrationListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/registrations?page=${p}&limit=12`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setItems(data.registrations);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on param change
    load(page);
  }, [page, load]);

  async function remove(receiptNo: string, name: string) {
    if (
      !confirm(
        `Delete registration ${receiptNo} (${name}) and all its payments and installments? This cannot be undone.`,
      )
    )
      return;
    const res = await fetch(`/api/admin/registrations/${receiptNo}`, { method: "DELETE" });
    if (res.ok) load(page);
    else alert("Failed to delete registration.");
  }

  // Student left midway / cancelled the course. Parks unpaid months (they stop
  // counting as overdue) while keeping recorded payments; ACTIVE reverses it.
  async function setStatus(receiptNo: string, name: string, status: "CANCELLED" | "ACTIVE") {
    const cancelling = status === "CANCELLED";
    const msg = cancelling
      ? `Mark ${receiptNo} (${name}) as cancelled? Remaining unpaid months stop counting as overdue. Payments already recorded are kept.`
      : `Restore ${receiptNo} (${name}) to active?`;
    if (!confirm(msg)) return;
    const res = await fetch(`/api/admin/registrations/${receiptNo}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load(page);
    else alert(`Failed to ${cancelling ? "cancel" : "restore"} registration.`);
  }

  const q = query.trim().toLowerCase();
  const rows = q
    ? items.filter(
        (r) =>
          r.full_name.toLowerCase().includes(q) ||
          r.receipt_no.toLowerCase().includes(q) ||
          (r.phone_number || "").includes(q),
      )
    : items;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="ro-plate py-1.5">Registrations</span>
          <span className="ro-mono text-xs font-semibold tracking-widest text-[var(--ro-ink-2)]">
            {pagination ? `${pagination.totalRecords} ON FILE` : "LOADING…"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              className="ro-input py-1.5 pl-8 text-sm"
              placeholder="Filter this page…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Filter registrations on this page"
            />
          </div>
          <Link href="/admin/registrations/new" className="ro-btn ro-btn--primary">
            <Icon name="new" size={15} />
            New
          </Link>
        </div>
      </header>

      {error && (
        <div className="ro-panel mt-6 flex items-start gap-3 p-6 text-[var(--ro-red)]">
          <Icon name="alert" size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="ro-panel mt-5 overflow-x-auto">
        <table className="ro-table min-w-[52rem]">
          <thead>
            <tr>
              <th>Receipt</th>
              <th>Student</th>
              <th>Registered</th>
              <th className="text-right">Paid</th>
              <th className="text-right">Due</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SpanRow>Reading the register…</SpanRow>
            ) : rows.length === 0 ? (
              <SpanRow>{q ? "No match on this page." : "No registrations on file yet."}</SpanRow>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link
                      href={`/admin/registrations/${r.receipt_no}`}
                      className="ro-mono text-xs font-semibold text-[var(--ro-blue)] hover:underline"
                    >
                      {r.receipt_no}
                    </Link>
                  </td>
                  <td>
                    <div className="font-semibold">{r.full_name}</div>
                    <div className="ro-mono text-[0.72rem] text-[var(--ro-ink-2)]">
                      {r.phone_number}
                    </div>
                    {/* Course names so a multi-course row shows every course —
                        the active one alongside any written-off one (struck
                        through) — rather than only signalling that a write-off
                        happened. Skipped on plain single-course rows. */}
                    {(r.course_count > 1 || r.written_off_course_count > 0) &&
                      r.courses.length > 0 && (
                        <div className="mt-0.5 text-[0.72rem] text-[var(--ro-ink-2)]">
                          {r.courses.map((c, i) => (
                            <span key={i}>
                              {i > 0 && ", "}
                              <span
                                className={c.written_off ? "line-through opacity-70" : ""}
                                title={c.written_off ? `${c.name} — written off` : c.name}
                              >
                                {c.name}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                  </td>
                  <td className="text-[var(--ro-ink-2)]">{formatDate(r.registration_date)}</td>
                  <td className="ro-mono text-right">{formatRupees(r.paid_amount)}</td>
                  <td className="ro-mono text-right font-semibold">
                    {r.due_amount > 0 ? formatRupees(r.due_amount) : "—"}
                  </td>
                  <td>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`ro-stamp ${roStampClass(r.payment_status)}`}>
                        {statusLabel(r.payment_status)}
                      </span>
                      {r.written_off_course_count > 0 && (
                        <span
                          className="ro-stamp ro-stamp--cancelled"
                          title="Course(s) written off — parked amounts are excluded from Due"
                        >
                          {r.written_off_course_count} written off
                        </span>
                      )}
                      {r.overdue_months > 0 && (
                        <span className="ro-stamp ro-stamp--overdue">
                          {r.overdue_months} overdue
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1.5">
                      <Link
                        href={`/admin/registrations/${r.receipt_no}`}
                        className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.7rem]"
                      >
                        Open
                      </Link>
                      {/* Cancel/restore lives here only for single-course rows. A
                          registration with several courses is cancelled per-course
                          from its detail page, so the blunt whole-registration
                          toggle is hidden for those. */}
                      {r.course_count > 1 ? null : r.payment_status?.toUpperCase() ===
                        "CANCELLED" ? (
                        <button
                          onClick={() => setStatus(r.receipt_no, r.full_name, "ACTIVE")}
                          className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.7rem]"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => setStatus(r.receipt_no, r.full_name, "CANCELLED")}
                          className="ro-btn ro-btn--ghost px-2 py-1 text-[var(--ro-ochre)]"
                          aria-label={`Cancel registration ${r.receipt_no}`}
                          title="Student left / cancelled the course"
                        >
                          <Icon name="cancel" size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => remove(r.receipt_no, r.full_name)}
                        className="ro-btn ro-btn--ghost px-2 py-1 text-[var(--ro-red)]"
                        aria-label={`Delete registration ${r.receipt_no}`}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            className="ro-btn ro-btn--ghost"
            disabled={!pagination.hasPrev}
            onClick={() => setPage((p) => p - 1)}
          >
            <Icon name="arrow-left" size={15} />
            Previous
          </button>
          <span className="ro-mono text-xs font-semibold tracking-widest text-[var(--ro-ink-2)]">
            SHEET {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            className="ro-btn ro-btn--ghost"
            disabled={!pagination.hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <Icon name="arrow-right" size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function SpanRow({ children }: { children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={7} className="py-10 text-center text-[var(--ro-ink-2)]">
        {children}
      </td>
    </tr>
  );
}
