"use client";

export function PrintButton() {
  return (
    <button type="button" className="s-btn s-btn--sm" onClick={() => window.print()}>
      Print / save as PDF
    </button>
  );
}
