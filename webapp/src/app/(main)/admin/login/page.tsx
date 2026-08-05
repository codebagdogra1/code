"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ro/Icon";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="ro-panel ro-panel--lift w-full max-w-sm p-7">
      <span className="ro-plate">
        <Icon name="stamp" size={15} />
        CODE · RECORDS
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight">Sign in to the register</h1>
      <p className="mt-1 text-sm text-[var(--ro-ink-2)]">Staff access · CODE, Bagdogra</p>

      <div className="mt-5 space-y-3.5">
        <div>
          <label className="ro-label" htmlFor="u">
            Username
          </label>
          <input
            id="u"
            className="ro-input"
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="ro-label" htmlFor="p">
            Password
          </label>
          <input
            id="p"
            type="password"
            className="ro-input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="flex items-start gap-2 text-[0.8rem] text-[var(--ro-red)]">
            <Icon name="alert" size={15} />
            {error}
          </p>
        )}
        <button type="submit" className="ro-btn ro-btn--primary w-full py-2.5" disabled={loading}>
          {loading ? "Opening…" : "Open register"}
        </button>
      </div>

      <Link
        href="/"
        className="ro-mono mt-5 flex items-center justify-center gap-1.5 text-[0.72rem] tracking-widest text-[var(--ro-ink-2)] hover:text-[var(--ro-ink)]"
      >
        <Icon name="arrow-left" size={13} /> BACK TO SITE
      </Link>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main
      className="ro grid min-h-screen place-items-center px-4"
      style={{
        background:
          "radial-gradient(120% 90% at 50% -10%, var(--ro-steel-hi), var(--ro-steel) 45%, var(--ro-steel-2))",
      }}
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
