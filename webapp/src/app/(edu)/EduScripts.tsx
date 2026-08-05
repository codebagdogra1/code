"use client";

import { useEffect } from "react";

import type { ScriptDesc } from "./_types";

// Replays the EduSmart page's original runtime — jQuery, the Elementor webpack
// runtime + frontend, Swiper, the theme's custom-script, etc. — in the exact
// document order (see scripts/split-home.py). WordPress inlines config globals
// like `elementorFrontendConfig` between the library scripts, and each library
// depends on the previous one, so order matters: we await each blocking script
// before appending the next, while `async` scripts are fired without blocking
// (matching browser semantics). Scripts run after mount, so the whole DOM the
// runtime needs to enhance (sliders, counters, sticky header) is already present.
function loadOne(desc: ScriptDesc): Promise<void> {
  return new Promise((resolve) => {
    const el = document.createElement("script");
    if (desc.type === "inline") {
      if (desc.id) el.id = desc.id;
      el.textContent = desc.code;
      document.body.appendChild(el);
      resolve(); // inline scripts execute synchronously on append
      return;
    }
    el.src = desc.src;
    if (desc.async) el.async = true;
    if (desc.defer) el.defer = true;
    // Resolve on both load and error so a single missing asset can't stall the
    // dependency chain.
    el.addEventListener("load", () => resolve());
    el.addEventListener("error", () => resolve());
    document.body.appendChild(el);
    // async scripts don't block later ones — continue immediately.
    if (desc.async) resolve();
  });
}

export function EduScripts({ scripts }: { scripts: ScriptDesc[] }) {
  useEffect(() => {
    const w = window as unknown as { __eduScriptsLoaded?: boolean };
    if (w.__eduScriptsLoaded) return; // guard React StrictMode double-mount in dev
    w.__eduScriptsLoaded = true;

    // Warm every external script into the HTTP cache in parallel up front. The
    // execution loop below is deliberately ordered (each library depends on the
    // one before it) and blocks on each script's `load` — without pre-warming
    // that means ~50 serial round-trips, which delays every downstream animation
    // and slider init. Preloading lets the browser fetch them concurrently so the
    // ordered execution then runs back-to-back from cache.
    for (const desc of scripts) {
      if (desc.type === "src") {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "script";
        link.href = desc.src;
        document.head.appendChild(link);
      }
    }

    let cancelled = false;
    (async () => {
      for (const desc of scripts) {
        if (cancelled) return;
        await loadOne(desc);
      }
      if (cancelled) return;
      // The original page runs this JS *during* document load, so the browser
      // fires DOMContentLoaded and window.load *after* the scripts have attached
      // their handlers. Here the scripts are replayed post-hydration — long after
      // those native events already fired — so anything bound to them (Elementor's
      // background lazy-load, which un-gates the `background-image: none !important`
      // rule by adding `.e-lazyloaded`; the reveal-animation observers; jQuery
      // `$(window).on('load')` handlers) would otherwise never run, leaving section
      // gradients/images blank and animations un-triggered. Re-dispatch the
      // lifecycle events once every script has executed to reproduce that sequence.
      document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true, cancelable: false }));
      window.dispatchEvent(new Event("load"));
    })();

    return () => {
      cancelled = true;
    };
  }, [scripts]);

  return null;
}
