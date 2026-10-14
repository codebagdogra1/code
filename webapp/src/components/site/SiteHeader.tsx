"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/site";

const NAV = [
  { href: "/courses", label: "Courses" },
  { href: "/offers", label: "Offers" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Mobile drawer: lock page scroll and close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--s-line)] bg-white/90 backdrop-blur">
        {/* Utility strip: phone + hours. Hidden on small screens where the FAB covers it. */}
        <div className="hidden bg-[var(--s-ink)] text-[0.78rem] text-white/85 md:block">
          <div className="s-container flex h-8 items-center justify-between">
            <p className="s-mono tracking-wide">
              Bagdogra · Mon–Sat 11:00 AM – 9:00 PM
            </p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="s-mono tracking-wide hover:text-white"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <div className="s-container flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <Logo priority />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive(item.href)
                    ? "bg-[var(--s-sky)] text-[var(--s-ink)]"
                    : "text-[var(--s-body)] hover:bg-[var(--s-paper-2)] hover:text-[var(--s-ink)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="s-btn s-btn--accent s-btn--sm hidden sm:inline-flex"
            >
              Enquire on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--s-line-2)] text-[var(--s-ink)] lg:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                {open ? (
                  <path d="M6 6l12 12M18 6 6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-blur would otherwise trap this fixed overlay. */}
      {open && (
        <div
          className="fixed inset-0 z-[55] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          {/* Dark blurred backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="s-drawer-backdrop absolute inset-0 bg-[var(--s-ink)]/60 backdrop-blur-sm"
          />

          {/* Right-hand drawer */}
          <div
            id="site-mobile-nav"
            className="s-drawer-panel absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col bg-white shadow-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-[var(--s-line)] px-4 sm:h-[4.5rem]">
              <span className="text-sm font-semibold uppercase tracking-wide text-[var(--s-muted)]">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-[var(--s-line-2)] text-[var(--s-ink)]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav
              className="flex flex-1 flex-col overflow-y-auto px-4 py-3"
              aria-label="Mobile"
            >
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 text-base font-semibold ${
                    isActive(item.href)
                      ? "bg-[var(--s-sky)] text-[var(--s-ink)]"
                      : "text-[var(--s-body)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="grid grid-cols-2 gap-2 border-t border-[var(--s-line)] p-4">
              <a href={`tel:${PHONE_TEL}`} className="s-btn s-btn--outline">
                Call us
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="s-btn s-btn--accent"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
