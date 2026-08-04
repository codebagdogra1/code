"use client";

import { useState } from "react";

type Status = { type: "idle" | "loading" | "ok" | "error"; message?: string };

export function ContactForm() {
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
      setStatus({ type: "ok", message: "Thanks! We've received your message and will get back to you soon." });
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="edu-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">
            Full name
          </label>
          <input id="name" name="name" type="text" required className="input" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="phone" className="label">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className="input" placeholder="Your phone number" />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" name="email" type="email" className="input" placeholder="you@example.com" />
      </div>
      <div className="mt-4">
        <label htmlFor="message" className="label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="input resize-y"
          placeholder="Tell us what you'd like to learn or ask…"
        />
      </div>

      {status.type === "ok" && (
        <p className="mt-4 rounded-[var(--radius-control)] border border-[var(--success)]/40 bg-[var(--success)]/10 px-4 py-3 text-sm text-[var(--success)]">
          {status.message}
        </p>
      )}
      {status.type === "error" && (
        <p className="mt-4 rounded-[var(--radius-control)] border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
          {status.message}
        </p>
      )}

      <button type="submit" disabled={status.type === "loading"} className="edu-btn mt-6 w-full sm:w-auto">
        {status.type === "loading" ? "Sending…" : "Send message"}
      </button>
      <p className="mt-3 text-xs text-[var(--muted)]">
        Please share an email or phone number so we can reach you.
      </p>
    </form>
  );
}
