"use client";

import Link from "next/link";
import { Icon } from "@/components/ro/Icon";

// Screen-only toolbar above a printable receipt: return to the file, and print.
// Hidden at print time by the `.receipt-toolbar` print rule in globals.css.
export function ReceiptToolbar({ backHref }: { backHref: string }) {
  return (
    <div className="receipt-toolbar ro">
      <Link
        href={backHref}
        className="ro-mono inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--ro-ink-2)] hover:text-[var(--ro-ink)]"
      >
        <Icon name="arrow-left" size={14} /> Back to file
      </Link>
      <button type="button" onClick={() => window.print()} className="ro-btn ro-btn--primary">
        <Icon name="printer" size={15} /> Print
      </button>
    </div>
  );
}
