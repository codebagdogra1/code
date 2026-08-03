"use client";

import { useEffect, useState } from "react";
import { formatRupees } from "@/lib/format";
import type { Course } from "@/lib/types";
import { Icon } from "@/components/ro/Icon";

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
      <header className="flex items-center gap-3">
        <span className="ro-plate py-1.5">Courses</span>
        <span className="ro-mono text-xs font-semibold tracking-widest text-[var(--ro-ink-2)]">
          {loading ? "LOADING…" : `${courses.length} IN CATALOGUE`}
        </span>
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="ro-panel overflow-x-auto">
          <table className="ro-table min-w-[38rem]">
            <thead>
              <tr>
                <th>Course</th>
                <th>Duration</th>
                <th className="text-right">Full</th>
                <th className="text-right">Monthly</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SpanRow>Opening the catalogue…</SpanRow>
              ) : courses.length === 0 ? (
                <SpanRow>No courses yet — add the first one on the right.</SpanRow>
              ) : (
                courses.map((c) => (
                  <tr key={c.id}>
                    <td className="font-semibold">{c.name}</td>
                    <td className="text-[var(--ro-ink-2)]">{c.duration || "—"}</td>
                    <td className="ro-mono text-right">
                      {c.fullPrice != null ? formatRupees(c.fullPrice) : "—"}
                    </td>
                    <td className="ro-mono text-right text-[0.8rem]">
                      {c.monthlyPrice != null ? (
                        <>
                          {formatRupees(Math.ceil(c.monthlyPrice / c.monthlyInstallments))}
                          <span className="text-[var(--ro-ink-2)]"> ×{c.monthlyInstallments}</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span
                        className={`ro-stamp ${c.isActive ? "ro-stamp--paid" : ""}`}
                        style={c.isActive ? undefined : { color: "var(--ro-ink-2)" }}
                      >
                        {c.isActive ? "Active" : "Retired"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={create} className="ro-panel h-fit space-y-3.5 p-5">
          <span className="ro-plate ro-plate--ink">Add course</span>
          <div>
            <label className="ro-label">Name *</label>
            <input
              className="ro-input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="ro-label">Duration</label>
            <input
              className="ro-input"
              placeholder="e.g. 6 months"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="ro-label">Full price</label>
              <input
                type="number"
                className="ro-input ro-mono"
                value={form.full_price}
                onChange={(e) => setForm({ ...form, full_price: e.target.value })}
              />
            </div>
            <div>
              <label className="ro-label">Monthly total</label>
              <input
                type="number"
                className="ro-input ro-mono"
                value={form.monthly_price}
                onChange={(e) => setForm({ ...form, monthly_price: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="ro-label">Monthly installments</label>
            <input
              type="number"
              className="ro-input ro-mono"
              value={form.monthly_installments}
              onChange={(e) => setForm({ ...form, monthly_installments: e.target.value })}
            />
          </div>
          {error && (
            <p className="flex items-start gap-2 text-[0.78rem] text-[var(--ro-red)]">
              <Icon name="alert" size={15} />
              {error}
            </p>
          )}
          <button type="submit" className="ro-btn ro-btn--primary w-full" disabled={saving}>
            <Icon name="new" size={15} />
            {saving ? "Saving…" : "Add to catalogue"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SpanRow({ children }: { children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={5} className="py-10 text-center text-[var(--ro-ink-2)]">
        {children}
      </td>
    </tr>
  );
}
