"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { Course } from "@/lib/types";

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    duration: "",
    full_price: "",
    monthly_price: "",
    monthly_installments: "12",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/courses");
    const data = await res.json();
    setCourses(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          duration: form.duration || null,
          full_price: form.full_price ? Number(form.full_price) : null,
          monthly_price: form.monthly_price ? Number(form.monthly_price) : null,
          monthly_installments: Number(form.monthly_installments) || 12,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create course");
      setForm({ name: "", duration: "", full_price: "", monthly_price: "", monthly_installments: "12" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Courses</h1>
      <p className="mt-1 text-[var(--muted)]">Manage the courses offered to students.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <th className="p-4">Name</th>
                <th className="p-4">Duration</th>
                <th className="p-4 text-right">Full</th>
                <th className="p-4 text-right">Monthly</th>
                <th className="p-4">Active</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--muted)]">
                    Loading…
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--muted)]">
                    No courses yet — add one on the right.
                  </td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4 text-[var(--muted)]">{c.duration || "—"}</td>
                    <td className="p-4 text-right">
                      {c.fullPrice != null ? formatCurrency(c.fullPrice) : "—"}
                    </td>
                    <td className="p-4 text-right">
                      {c.monthlyPrice != null
                        ? `${formatCurrency(c.monthlyPrice)} × ${c.monthlyInstallments}`
                        : "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`badge ${
                          c.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={create} className="card h-fit space-y-3 p-6">
          <h2 className="text-lg font-semibold">Add course</h2>
          <div>
            <label className="label">Name *</label>
            <input
              className="input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Duration</label>
            <input
              className="input"
              placeholder="e.g. 6 months"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Full price</label>
              <input
                type="number"
                className="input"
                value={form.full_price}
                onChange={(e) => setForm({ ...form, full_price: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Monthly price</label>
              <input
                type="number"
                className="input"
                value={form.monthly_price}
                onChange={(e) => setForm({ ...form, monthly_price: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Monthly installments</label>
            <input
              type="number"
              className="input"
              value={form.monthly_installments}
              onChange={(e) => setForm({ ...form, monthly_installments: e.target.value })}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? "Saving…" : "Add course"}
          </button>
        </form>
      </div>
    </div>
  );
}
