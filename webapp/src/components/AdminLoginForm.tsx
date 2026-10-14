"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "");

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok || !result.success) {
        setError(result.error ?? "Unable to sign in. Please try again.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to reach the sign-in service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0e3f65] focus:ring-4 focus:ring-[#0e3f65]/15"
          placeholder="Enter your username"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0e3f65] focus:ring-4 focus:ring-[#0e3f65]/15"
          placeholder="Enter your password"
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[#0e3f65] px-4 py-3 font-semibold text-white transition hover:bg-[#0a3150] focus:outline-none focus:ring-4 focus:ring-[#0e3f65]/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
