"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/components/ro/Icon";
import { deleteEnquiry, updateEnquiry } from "@/app/admin/(dashboard)/site-actions";

export type EnquiryRow = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  courseInterest: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdLabel: string;
};

const STATUS_STAMP: Record<string, string> = { NEW: "ro-stamp--due", CONTACTED: "ro-stamp--partial", CLOSED: "ro-stamp--paid" };

export function EnquiriesManager({ enquiries }: { enquiries: EnquiryRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    start(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Something went wrong.");
      router.refresh();
    });
  }

  if (enquiries.length === 0) {
    return <div className="ro-panel mt-5 p-8 text-center text-[var(--ro-ink-2)]">No enquiries yet. Submissions from the website contact form appear here.</div>;
  }

  return (
    <div className="mt-5 space-y-3">
      {error && (
        <p className="flex items-center gap-2 text-[0.78rem] text-[var(--ro-red)]">
          <Icon name="alert" size={15} /> {error}
        </p>
      )}
      {enquiries.map((q) => (
        <div key={q.id} className="ro-panel p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`ro-stamp ${STATUS_STAMP[q.status] ?? ""}`}>{q.status.charAt(0) + q.status.slice(1).toLowerCase()}</span>
                <span className="ro-mono text-[0.68rem] text-[var(--ro-ink-2)]">{q.createdLabel}</span>
              </div>
              <p className="mt-1.5 font-semibold">
                {q.name}
                {q.courseInterest && <span className="ml-2 text-[0.78rem] font-normal text-[var(--ro-ink-2)]">· {q.courseInterest}</span>}
              </p>
              <p className="ro-mono mt-0.5 text-[0.78rem]">
                {q.phone && (
                  <a href={`tel:${q.phone}`} className="text-[var(--ro-blue)] underline-offset-2 hover:underline">
                    {q.phone}
                  </a>
                )}
                {q.phone && q.email && " · "}
                {q.email && (
                  <a href={`mailto:${q.email}`} className="text-[var(--ro-blue)] underline-offset-2 hover:underline">
                    {q.email}
                  </a>
                )}
              </p>
              <p className="mt-2 whitespace-pre-line text-[0.84rem]">{q.message}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {q.phone && (
                <a
                  href={`https://wa.me/${q.phone.replace(/\D/g, "").replace(/^0/, "91")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.72rem]"
                >
                  WhatsApp
                </a>
              )}
              {q.status !== "CONTACTED" && (
                <button type="button" disabled={pending} onClick={() => run(() => updateEnquiry(q.id, { status: "CONTACTED" }))} className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.72rem]">
                  Mark contacted
                </button>
              )}
              {q.status !== "CLOSED" && (
                <button type="button" disabled={pending} onClick={() => run(() => updateEnquiry(q.id, { status: "CLOSED" }))} className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.72rem]">
                  Close
                </button>
              )}
              {q.status === "CLOSED" && (
                <button type="button" disabled={pending} onClick={() => run(() => updateEnquiry(q.id, { status: "NEW" }))} className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.72rem]">
                  Reopen
                </button>
              )}
              <button type="button" onClick={() => setOpen(open === q.id ? null : q.id)} className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.72rem]">
                {q.notes ? "Notes ✎" : "Add note"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (confirm(`Delete the enquiry from ${q.name}?`)) run(() => deleteEnquiry(q.id));
                }}
                className="ro-btn ro-btn--danger px-2.5 py-1 text-[0.72rem]"
                aria-label="Delete enquiry"
              >
                <Icon name="trash" size={13} />
              </button>
            </div>
          </div>
          {(open === q.id || q.notes) && (
            <div className="mt-3 border-t border-[var(--ro-line)] pt-3">
              <label className="ro-label">Desk notes</label>
              <textarea
                defaultValue={q.notes ?? ""}
                rows={2}
                maxLength={4000}
                className="ro-input"
                placeholder="Called on …, wants evening batch, follow up Friday."
                onBlur={(e) => {
                  if (e.target.value !== (q.notes ?? "")) run(() => updateEnquiry(q.id, { notes: e.target.value }));
                }}
              />
              <p className="mt-1 text-[0.7rem] text-[var(--ro-ink-2)]">Saved when you click away.</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
