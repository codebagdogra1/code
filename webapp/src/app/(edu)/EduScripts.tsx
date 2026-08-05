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

    let cancelled = false;
    (async () => {
      for (const desc of scripts) {
        if (cancelled) return;
        await loadOne(desc);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [scripts]);

  return null;
}
