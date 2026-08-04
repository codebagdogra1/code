"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/site";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/brochure", label: "Brochure" },
  { href: "/contact", label: "Contact" },
];

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-[var(--edu-ink)]">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--edu-primary)] text-white shadow-[0_8px_18px_-6px_rgba(1,113,241,0.7)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3 2 8l10 5 8-4v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 11v4c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-lg leading-none">
        CODE
        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--edu-primary)]">
          Coding Institute
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <BrandMark />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive(item.href)
                  ? "bg-[var(--edu-tint)] text-[var(--edu-primary)]"
                  : "text-[var(--body)] hover:text-[var(--edu-primary)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${PHONE_TEL}`}
            className="hidden items-center gap-2 text-sm font-semibold text-[var(--edu-ink)] transition-colors hover:text-[var(--edu-primary)] lg:inline-flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6.6 2.5 4 3.2c-1 .3-1.6 1.3-1.4 2.4C3.8 12.9 9.1 18.2 16.4 19.4c1.1.2 2.1-.4 2.4-1.4l.7-2.6-4.2-1.6-1.5 1.8a12 12 0 0 1-4.9-4.9l1.8-1.5L9.1 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
            {PHONE_DISPLAY}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="edu-btn hidden !px-5 !py-2.5 sm:inline-flex"
          >
            Enroll now
          </a>
          <Link
            href="/admin"
            className="hidden text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--edu-ink)] xl:inline"
          >
            Admin
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] text-[var(--edu-ink)] md:hidden"
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
        <div className="border-t border-[var(--border)] bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  isActive(item.href)
                    ? "bg-[var(--edu-tint)] text-[var(--edu-primary)]"
                    : "text-[var(--body)] hover:bg-[var(--edu-tint)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-[var(--border)] pt-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="edu-btn flex-1"
                onClick={() => setOpen(false)}
              >
                Enroll on WhatsApp
              </a>
              <Link href="/admin" className="edu-btn-outline !px-4" onClick={() => setOpen(false)}>
                Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
