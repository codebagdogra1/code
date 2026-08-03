"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, statusColor } from "@/lib/format";
import type { Pagination, RegistrationListItem } from "@/lib/types";

export default function RegistrationsPage() {
  const [items, setItems] = useState<RegistrationListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/registrations?page=${p}&limit=10`);
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
    // Fetch (and re-fetch) the page whenever `page` changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on param change
    load(page);
  }, [page, load]);

  async function remove(receiptNo: string) {
    if (!confirm(`Delete registration ${receiptNo} and all related data? This cannot be undone.`))
      return;
    const res = await fetch(`/api/admin/registrations/${receiptNo}`, { method: "DELETE" });
    if (res.ok) load(page);
    else alert("Failed to delete registration.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Registrations</h1>
          <p className="mt-1 text-[var(--muted)]">
            {pagination ? `${pagination.totalRecords} total` : "Loading…"}
          </p>
        </div>
      </div>

      {error && <div className="card mt-6 p-6 text-red-600">{error}</div>}

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[48rem] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
              <th className="p-4">Receipt</th>
              <th className="p-4">Student</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Paid</th>
              <th className="p-4 text-right">Due</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[var(--muted)]">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[var(--muted)]">
                  No registrations yet.
                </td>
              </tr>
            ) : (
              items.map((r) => (
                <tr key={r.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-4 font-mono text-xs">{r.receipt_no}</td>
                  <td className="p-4">
                    <div className="font-medium">{r.full_name}</div>
                    <div className="text-xs text-[var(--muted)]">{r.phone_number}</div>
                  </td>
                  <td className="p-4 text-[var(--muted)]">{formatDate(r.registration_date)}</td>
                  <td className="p-4 text-right">{formatCurrency(r.paid_amount)}</td>
                  <td className="p-4 text-right">{formatCurrency(r.due_amount)}</td>
                  <td className="p-4">
                    <span className={`badge badge-dot ${statusColor(r.payment_status)}`}>
                      {r.payment_status}
                    </span>
                    {r.overdue_months > 0 && (
                      <span className={`badge badge-dot ml-1 ${statusColor("OVERDUE")}`}>
                        {r.overdue_months} overdue
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/registrations/${r.receipt_no}`}
                        className="btn-ghost px-3 py-1.5"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => remove(r.receipt_no)}
                        className="btn-danger px-3 py-1.5"
                      >
                        Delete
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
        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            className="btn-ghost"
            disabled={!pagination.hasPrev}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </button>
          <span className="text-[var(--muted)]">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            className="btn-ghost"
            disabled={!pagination.hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
