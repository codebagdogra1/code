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

// The 12 content sections, concatenated in order. They are injected as the direct
// children of the `.elementor-10` wrapper so Elementor's :nth-of-type / direct-child
// CSS and its JS selectors keep matching exactly as in the original page.
export const getSections = (): string =>
  Array.from({ length: 12 }, (_, i) =>
    read(`sections/${String(i + 1).padStart(2, "0")}.html`).trim(),
  ).join("\n");
