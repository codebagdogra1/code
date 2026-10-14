// Refreshes src/data/google-reviews.json from the centre's public Google
// listing. No API key or sign-in: it drives a headless Chrome through the
// "View all Google reviews" dialog on Google Search, which lists every review
// (Google Maps itself caps anonymous visitors at ten).
//
//   npm run google:reviews
//
// Google's markup changes without notice; if the run reports zero reviews,
// open the same dialog in a browser and update the selectors in extract().

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = new URL("../src/data/google-reviews.json", import.meta.url);
const QUERY = "Computer and Digital Excellence - CODE Bagdogra";
// Feature ID of the Maps listing (the "!1s0x...:0x..." part of its URL).
const FEATURE_ID = "0x39e4474778f7c643:0x8d332693e200adc8";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9400 + Math.floor(Math.random() * 400);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "code-reviews-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--window-size=1400,1000", "--lang=en-IN", "--no-first-run", "about:blank"], { stdio: "ignore" });
const cleanup = () => { chrome.kill(); rmSync(profile, { recursive: true, force: true }); };
process.on("exit", cleanup);
process.on("SIGINT", () => process.exit(130));

let targets = null;
for (let i = 0; i < 60 && !targets; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); } catch { await sleep(500); }
}
if (!targets) throw new Error(`Chrome did not start at ${CHROME}`);
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let seq = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (fn) => {
  const r = await send("Runtime.evaluate", { expression: `(${fn})()`, awaitPromise: true, returnByValue: true });
  if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description ?? "evaluate failed");
  return r.result.result.value;
};

await send("Page.enable");
await send("Emulation.setUserAgentOverride", { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36", acceptLanguage: "en-IN,en;q=0.9" });
await send("Page.navigate", { url: `https://www.google.com/search?q=${encodeURIComponent(QUERY)}&hl=en&gl=in#lrd=${FEATURE_ID},1` });
await sleep(6000);

// Open the reviews dialog from the knowledge panel and sort newest first.
const opened = await evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const link = [...document.querySelectorAll("a")].find((a) => /view all google reviews/i.test(a.textContent));
  if (!link) return false;
  link.click();
  await sleep(5000);
  const newest = [...document.querySelectorAll('[role="dialog"] *')].find((el) => el.children.length === 0 && el.textContent.trim() === "Newest");
  newest?.click();
  await sleep(4000);
  return true;
});
if (!opened) throw new Error('Could not find the "View all Google reviews" link on the search page.');

// Scroll the dialog until no more reviews load.
const loaded = await evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const count = () => document.querySelectorAll(".bwb7ce").length;
  let pane = document.querySelector(".bwb7ce");
  while (pane && pane !== document.body && !(pane.scrollHeight > pane.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(pane).overflowY))) pane = pane.parentElement;
  let last = -1, stable = 0;
  for (let i = 0; i < 80; i++) {
    const n = count();
    if (pane && pane !== document.body) pane.scrollTop = pane.scrollHeight; else window.scrollTo(0, document.body.scrollHeight);
    if (n === last && ++stable >= 5) break;
    if (n !== last) stable = 0;
    last = n;
    await sleep(1500);
  }
  return last;
});
console.log(`Loaded ${loaded} review blocks.`);

const data = await evaluate(() => {
  const dialog = document.querySelector('[role="dialog"]');
  const head = dialog?.innerText.match(/(\d\.\d)\s*\n[\s\S]*?([\d,]+)\s+reviews/);
  const out = []; const seen = new Set();
  for (const c of document.querySelectorAll(".bwb7ce")) {
    const h = c.querySelector(".p7f0Nd");
    const id = c.querySelector("[data-review-id]")?.getAttribute("data-review-id");
    if (!h || !id || seen.has(id)) continue;
    seen.add(id);
    const bg = h.querySelector(".QNewyd")?.style.backgroundImage ?? "";
    const stars = [...c.querySelectorAll(".h3PQJ svg path")].map((p) => (p.getAttribute("fill") ?? "").toLowerCase());
    const full = c.querySelector(".gbdaZe .d83Iyc") ?? c.querySelector(".d83Iyc");
    let text = "";
    if (full) {
      const t = document.createElement("div");
      t.innerHTML = full.innerHTML.replace(/<br\s*\/?>/gi, "\n");
      t.querySelectorAll("a").forEach((a) => a.remove());
      text = t.textContent.replace(/\s*…\s*$/, "").replace(/[ \t]+\n/g, "\n").replace(/\n{2,}/g, "\n").trim();
    }
    const ed = [...c.querySelectorAll("[data-ed]")].map((e) => e.getAttribute("data-ed")).join(" ").replace(/&quot;/g, '"');
    out.push({
      id,
      author: h.querySelector(".rhtdWc")?.textContent.trim() ?? "",
      authorUrl: (h.querySelector('a[href*="/maps/contrib"]')?.getAttribute("href") ?? "").replace(/\?hl=.*$/, "") || undefined,
      photo: (bg.match(/url\("?([^")]+)"?\)/) ?? [])[1] || undefined,
      rating: stars.filter((f) => f === "#fabb05").length || 5,
      when: c.querySelector(".m6Mr5d")?.textContent.trim() ?? "",
      text,
      url: (ed.match(/https:\/\/www\.google\.com\/maps\/reviews\/data=[^"]+/) ?? [])[0] || undefined,
    });
  }
  return { rating: head?.[1], count: head ? Number(head[2].replace(/,/g, "")) : undefined, reviews: out };
});
ws.close();
chrome.kill();

if (data.reviews.length === 0) throw new Error("No reviews extracted; Google's markup has probably changed.");
const json = {
  capturedAt: new Date().toISOString().slice(0, 10),
  rating: data.rating ?? "5.0",
  count: data.count ?? data.reviews.length,
  reviews: data.reviews,
};
writeFileSync(OUT, JSON.stringify(json, null, 2) + "\n");
console.log(`Wrote ${json.reviews.length} reviews (${json.reviews.filter((r) => r.text).length} with text), rating ${json.rating} from ${json.count}, to ${fileURLToPath(OUT)}`);
