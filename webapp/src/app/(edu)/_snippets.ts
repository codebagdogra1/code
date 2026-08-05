import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HeadResource, ScriptDesc } from "./_types";

// The EduSmart homepage is composed from snippets that live in the repo under
// public/home/snippets/ (generated from page.shell.html by scripts/split-home.py).
// The home route is statically rendered (see page.tsx), so these reads run at
// build time — the snippet files are always present in the source tree then.
const DIR = join(process.cwd(), "public", "home", "snippets");
const read = (p: string): string => readFileSync(join(DIR, p), "utf8");

export const getHead = (): HeadResource[] => JSON.parse(read("head.json"));
export const getScripts = (): ScriptDesc[] => JSON.parse(read("scripts.json"));
export const getBodyClass = (): string => read("body-class.txt").trim();
export const getHeader = (): string => read("header.html");
export const getFooter = (): string => read("footer.html");

// Demo sub-pages (contact, about, courses, blog, …) extracted by
// scripts/split-pages.py. Each page's unique main content lives at
// public/home/pages/<slug>/content.html; the shared header/footer/head/scripts
// above are reused verbatim. Read at build time (routes are force-static).
const PAGES_DIR = join(process.cwd(), "public", "home", "pages");
export const getPageContent = (slug: string): string =>
  readFileSync(join(PAGES_DIR, slug, "content.html"), "utf8");

// The page's own inline <style> delta (mainly `.elementor-kit-9` globals and any
// per-page Elementor styles the shared homepage head doesn't already carry).
export const getPageHead = (slug: string): HeadResource[] =>
  JSON.parse(readFileSync(join(PAGES_DIR, slug, "head.json"), "utf8"));

// Each demo page's original <body> class list. Inner pages are NOT `home`, so
// applying their own class (instead of the homepage's) keeps the theme's
// transparent-overlay header from expecting a hero and overlapping the content.
type PageManifest = Record<string, { bodyClass: string }>;
let _manifest: PageManifest | undefined;
const manifest = (): PageManifest =>
  (_manifest ??= JSON.parse(readFileSync(join(PAGES_DIR, "manifest.json"), "utf8")));
export const getPageBodyClass = (slug: string): string =>
  manifest()[slug]?.bodyClass ?? "";

// The 12 content sections, concatenated in order. They are injected as the direct
// children of the `.elementor-10` wrapper so Elementor's :nth-of-type / direct-child
// CSS and its JS selectors keep matching exactly as in the original page.
export const getSections = (): string =>
  Array.from({ length: 12 }, (_, i) =>
    read(`sections/${String(i + 1).padStart(2, "0")}.html`).trim(),
  ).join("\n");
