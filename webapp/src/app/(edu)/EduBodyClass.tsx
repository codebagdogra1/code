"use client";

import { useLayoutEffect } from "react";

// The (edu) root layout renders <body> with the homepage's class list (which
// includes `home`). The theme scopes its transparent-overlay header to
// `body.home`, so on inner pages that class makes the header sit on top of and
// overlap the content. Each demo page carried its own <body> class; apply it
// here so the header falls back to its normal, in-flow solid state.
//
// This runs after hydration and mutates document.body directly. React never
// re-renders <body> (it lives in the layout with no state), so the class we set
// is not reconciled away.
export function EduBodyClass({ className }: { className: string }) {
  useLayoutEffect(() => {
    if (!className) return;
    const prev = document.body.className;
    document.body.className = className;
    return () => {
      document.body.className = prev;
    };
  }, [className]);
  return null;
}
