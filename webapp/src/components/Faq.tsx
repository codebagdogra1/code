"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.q}
            className={`edu-card overflow-hidden transition-colors ${
              isOpen ? "border-[var(--edu-primary)]/40" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-[var(--edu-ink)] sm:text-base">
                {item.q}
              </span>
              <span
                aria-hidden
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-all ${
                  isOpen
                    ? "rotate-45 bg-[var(--edu-primary)] text-white"
                    : "bg-[var(--edu-tint)] text-[var(--edu-primary)]"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-[var(--body)]">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
