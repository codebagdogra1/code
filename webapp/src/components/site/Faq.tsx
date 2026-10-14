// Native <details> — works without JavaScript, keyboard accessible by default.
export function Faq({ items }: { items: ReadonlyArray<{ q: string; a: string }> }) {
  return (
    <div className="divide-y divide-[var(--s-line)] rounded-[var(--s-radius)] border border-[var(--s-line)] bg-white">
      {items.map((item, i) => (
        <details key={item.q} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[var(--s-ink)] [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--s-sky)] text-[var(--s-ink)] transition-transform group-open:rotate-45"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--s-body)]">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
