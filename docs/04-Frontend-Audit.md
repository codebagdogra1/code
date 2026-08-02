# 04 — Frontend Audit

Nine HTML files at the repo root, plus one shared `style.css`. There are effectively **two products** with two unrelated design languages: a polished public marketing site, and a set of generic-looking internal tools.

| File | Lines | Role | Design language | Linked CSS |
|------|------:|------|-----------------|-----------|
| [index.html](../index.html) | 448 | Public landing page | Premium navy/gold, glassmorphism | inline |
| [old-index.html](../old-index.html) | 496 | Previous landing page (superseded) | older | `style.css` |
| [brochure.html](../brochure.html) | 1050 | Course brochure / marketing | marketing | inline |
| [login.html](../login.html) | 268 | Staff login | Purple gradient template | inline |
| [course-registration.html](../course-registration.html) | 1135 | Enrolment + payment data entry | Purple gradient template | inline |
| [admin.html](../admin.html) | 3057 | Admin operations cockpit | Purple gradient template | `style.css` + 186 inline |
| [zxrbmw1250.html](../zxrbmw1250.html) | 1414 | Standalone offline receipt/admission maker | receipt | inline |
| [admission-bkp.html](../admission-bkp.html) | 1119 | Backup of an admission/receipt maker | receipt | inline |
| [style.css](../style.css) | 891 | Shared styles (admin + old-index only) | — | — |

## Current implementation

- **No framework, no components, no build.** Every page is a self-contained HTML document with its CSS in a `<style>` block and its logic in a `<script>` block. Shared behaviour (auth gate, receipt layout, money formatting) is **copy-pasted** between files rather than imported.
- **`index.html`** is the strongest artefact in the repo: a sticky glass header, particle canvas, scroll reveals, animated counters, tilt/magnetic button micro-interactions, WhatsApp lead CTAs, FAQ JSON-LD for SEO. It looks like a real agency built it (footer credits "Vibhora Shopify Agency", [index.html:359](../index.html#L359)).
- **`login.html` / `course-registration.html` / `admin.html`** share a completely different, generic look: `linear-gradient(135deg,#667eea,#764ba2)`, Arial, rounded white cards. This is the classic bootstrap-era template aesthetic.
- **`zxrbmw1250.html` and `admission-bkp.html`** are standalone, DB-less receipt/admission generators (`window.print()`, no `fetch`) — parallel offline tools that duplicate the receipt logic a third and fourth time. The obfuscated filename `zxrbmw1250.html` is an "unlisted URL" pattern — security by obscurity.

## Client-side auth gate (the illusion of protection)
Each protected page runs an IIFE that reads `sessionStorage`, base64-decodes the token, checks a 2-hour expiry, and checks `userType === 'admin'` ([course-registration.html:287-313](../course-registration.html#L287-L313), [admin.html:~500-604](../admin.html#L581-L604)). Because the token is unsigned and **the backend never checks anything**, this gate stops nobody: open dev tools, set `sessionStorage.isLoggedIn='true'`, or just call the functions directly. See [05 — Security](05-Security.md).

## Rendering pattern
All dynamic HTML is built with template-literal string concatenation and assigned to `innerHTML` or written via `document.write` into a popup ([admin.html displayRegistrations:775](../admin.html#L775), [course-registration.html generateReceipt:794](../course-registration.html#L794)). User-controlled values (`full_name`, `address`, `email`, `notes`, `course.name`) are interpolated **without escaping**, both into markup and into `onclick="...('${value}')"` attribute strings ([admin.html:792-808](../admin.html#L792-L808)). This is both an XSS vector and a functional bug (an apostrophe in a name breaks the handler).

---

## Strengths
- The **public site is genuinely good** — modern, fast, mobile-aware, SEO-conscious. It sets the quality bar the internal tools should meet.
- **Progressive enhancement mindset:** no framework means no hydration cost and instant loads.
- Responsive breakpoints exist on the public site and the registration form ([course-registration.html:268-280](../course-registration.html#L268-L280)).

## Weaknesses
- **Two design languages** with no shared system; the tools staff use all day look the cheapest.
- **Zero componentisation** — the same receipt is implemented four times, the auth gate three times, money formatting everywhere.
- **`admin.html` is unmaintainable** (see [15](15-Technical-Debt.md)): 3,057 lines, duplicate function definitions, 186 inline styles, "replace this whole block" comments.
- **XSS-prone rendering** throughout the internal tools.
- **No loading/empty/error states worth the name** — a spinner, or red text on failure ([admin.html:757](../admin.html#L757)); no retry, no skeletons, no "no results yet" guidance.
- **CDN dependencies** (Font Awesome, Google Fonts) on the public site are a privacy/availability coupling and block first paint.
- **Accessibility is essentially absent** in the tools: emoji-as-icon buttons, no ARIA, modals are bare `<div>` overlays with no focus trap or `Esc` handling, colour-only status.

## Pain points
- A staff-facing change (e.g. add a column) means hand-editing a giant file and hoping you edited the *live* copy of a duplicated function, not the dead one.
- The offline receipt makers (`zxrbmw1250`, `admission-bkp`) can produce receipts that **never touch the database** — so a receipt can exist with no matching record, and vice versa.

## Opportunities
- **Extend the public site's design language into the tools** — the institute already owns a premium look; the admin panel should feel like the same company.
- Introduce **one component layer** and a **single shared module** for auth, formatting, and receipts.
- Retire the standalone offline receipt makers once the real receipt system (see [07](07-Receipt-System.md)) can reprint/download on demand.

## Recommended direction
1. Establish the **design system** ([14](14-Design-System.md)) derived from the public site's navy/gold identity.
2. Rebuild the internal tools as **components** on that system (light framework or Web Components; keep static hosting).
3. Centralise **auth, money, and receipt** rendering into shared modules with proper output-escaping.
4. Delete `old-index.html`, `admission-bkp.html`, and `zxrbmw1250.html` after migration; keep one source of truth per concern.

## Priority
**🟠 P1** for the tools rebuild (gated on the design system and the secure backend). The **XSS-prone rendering** is **🔴 P0** to fix even before a full rebuild.
