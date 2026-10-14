"use client";

import { useState } from "react";
import { trackPixel } from "./MetaPixel";

type Status = { type: "idle" | "loading" | "ok" | "error"; message?: string };

export function ContactForm({ courses, defaultCourse }: { courses: string[]; defaultCourse?: string }) {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ type: "loading" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ type: "error", message: json.error ?? "Something went wrong. Please try again." });
        return;
      }
      form.reset();
      trackPixel("Lead", { content_name: String(data.course || "general enquiry") });
      setStatus({
        type: "ok",
        message: "Thanks! We've received your enquiry and will call or message you shortly.",
      });
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again, or message us on WhatsApp." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="s-card s-card--lift p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="s-label">
            Full name <span className="text-[var(--s-accent)]">*</span>
          </label>
          <input id="name" name="name" type="text" required maxLength={160} className="s-input" placeholder="Your name" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="phone" className="s-label">
            Phone / WhatsApp <span className="text-[var(--s-accent)]">*</span>
          </label>
          <input id="phone" name="phone" type="tel" required maxLength={30} className="s-input" placeholder="10-digit mobile number" autoComplete="tel" inputMode="tel" />
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="s-label">
            Email <span className="text-xs font-normal text-[var(--s-muted)]">(optional)</span>
          </label>
          <input id="email" name="email" type="email" maxLength={255} className="s-input" placeholder="you@example.com" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="course" className="s-label">
            Course you&apos;re interested in
          </label>
          <select id="course" name="course" className="s-input" defaultValue={defaultCourse ?? ""}>
            <option value="">Not sure yet — help me choose</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="message" className="s-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          className="s-input resize-y"
          placeholder="Tell us what you'd like to learn, your preferred timing, or any question."
        />
      </div>
      {/* Honeypot: real users never see or fill this. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status.type === "ok" && (
        <p role="status" className="mt-4 rounded-[var(--s-radius-sm)] border border-[var(--s-mint-ink)]/30 bg-[var(--s-mint)] px-4 py-3 text-sm text-[var(--s-mint-ink)]">
          {status.message}
        </p>
      )}
      {status.type === "error" && (
        <p role="alert" className="mt-4 rounded-[var(--s-radius-sm)] border border-[var(--s-accent)]/30 bg-[var(--s-accent-tint)] px-4 py-3 text-sm text-[var(--s-accent-2)]">
          {status.message}
        </p>
      )}

      <button type="submit" disabled={status.type === "loading"} className="s-btn s-btn--accent mt-6 w-full sm:w-auto">
        {status.type === "loading" ? "Sending…" : "Send enquiry"}
      </button>
      <p className="mt-3 text-xs text-[var(--s-muted)]">We reply by phone or WhatsApp during centre hours, Mon–Sat 11 AM – 9 PM.</p>
    </form>
  );
}
