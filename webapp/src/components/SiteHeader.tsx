"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/brochure", label: "Brochure" },
  { href: "/contact", label: "Contact" },
];

function BrandMark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 font-semibold tracking-tight text-[var(--foreground)]"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--brand)] font-mono text-sm text-[var(--accent)] shadow-sm">
        {"</>"}
      </span>
      <span className="text-base">CODE</span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <BrandMark />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/register" className="btn-primary hidden sm:inline-flex">
            Enroll now
          </Link>
          <Link
            href="/admin"
            className="hidden text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)] lg:inline"
          >
            Admin
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-[var(--radius-control)] border border-[var(--border)] text-[var(--body)] md:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-[var(--surface-2)] text-[var(--foreground)]"
                    : "text-[var(--body)] hover:bg-[var(--surface-2)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-[var(--border)] pt-3">
              <Link href="/register" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                Enroll now
              </Link>
              <Link href="/admin" className="btn-ghost" onClick={() => setOpen(false)}>
                Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
