# 14 — Design System

## Why a system, and why *this* one
The institute already owns a strong visual identity — the public site's **navy + gold, glassy, confident** look ([index.html:11-25](../index.html#L11-L25)). The internal tools throw it away for a generic purple-gradient template ([login.html](../login.html), [admin.html](../admin.html)). The opportunity is not to invent a look but to **derive a calm, productivity-focused sibling** of the identity the institute already has, so the whole product feels like one company.

**Design principles for the tools** (deliberately *not* a flashy marketing aesthetic):
1. **Calm over decorative** — staff use this for hours; low chroma, generous whitespace, no animation for its own sake. (The public site keeps its particles and tilt; the tools do not.)
2. **Density with breathing room** — operators need a lot on screen; use scale and spacing, not clutter.
3. **Status is instant and never colour-only** — every state has an icon + label + colour.
4. **Keyboard-first, accessible by default** — WCAG AA, focus-visible, ARIA.
5. **One token set** drives both light and dark and both public + internal surfaces.

---

## Colour palette (tokens)

Derived from the public identity (navy `#0b1426`, gold `#f9b233`, teal `#49d2d6`) but retuned for long-session legibility. Values below are a proposed starting set — validate contrast before finalising.

```
/* Brand */
--brand-navy-900: #0b1426   /* primary surface (dark), public bg */
--brand-navy-700: #0f1c33
--brand-navy-500: #1b2c50
--brand-gold-500: #f9b233   /* primary accent / CTAs */
--brand-gold-400: #ffd166
--brand-teal-500: #49d2d6   /* secondary accent, links, info */

/* Neutrals (the workhorse of the tools UI) */
--gray-50:  #f7f8fb   /* app background (light) */
--gray-100: #eef1f6   /* card / row zebra */
--gray-200: #dfe4ec   /* borders */
--gray-500: #6b7488   /* muted text */
--gray-700: #384152   /* body text */
--gray-900: #131722   /* headings */

/* Semantic status (icon + label always accompany colour) */
--success-500: #1f9d55   /* Paid / settled */
--warning-500: #c77700   /* Pending / due soon (AA-safe amber) */
--danger-500:  #d1394c   /* Overdue / error / destructive */
--info-500:    #2c7be5   /* neutral info */
```

- **Money semantics:** collected = success, outstanding = warning, overdue = danger. Never use gold for status (gold = brand/CTA only).
- **Dark mode** is a first-class second theme via `prefers-color-scheme` + a manual toggle; navy becomes the surface, neutrals invert.
- **Charts:** follow the `dataviz` skill — a small categorical set, sequential ramps for aging buckets, no more colours than series. No decorative gradients in data.

## Typography
- **Inter** (already loaded on the public site, [index.html:8](../index.html#L8)) as the single family — self-host it (drop the Google Fonts CDN, see [05](05-Security.md) S11).
- **Tabular numerals** (`font-variant-numeric: tabular-nums`) for all money and counts so columns align — critical for a finance tool.
- Scale (1.25 ratio): `12 / 14 / 16(base) / 20 / 25 / 31 / 39`px. Body 14-16, table cells 14, page titles 25-31.
- Weights: 400 body, 500 labels, 600 headings, 700 numbers-that-matter.

## Spacing & layout
- **4px base grid**: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`.
- Card padding 16-24; table row height 44-48 (touch-friendly for tablet at the desk).
- **Radius**: 8 (controls), 12 (cards), 999 (pills/badges). (Public site's 22-28px radii are too soft for dense data.)
- **Elevation**: two levels only — resting card (subtle border, no shadow) and floating (modal/popover, soft shadow). Avoid the heavy `0 20px 40px` shadows of the current tools.
- **App shell**: left nav rail (Students / Payments / Courses / Reports / Settings) + top bar (search ⌘K, quick "New registration", user menu) + content. Max content width for readability; tables full-bleed with sticky header.

## Components (the kit to build)

| Component | Replaces today | Key requirements |
|-----------|----------------|------------------|
| **Button** | ad-hoc inline-styled buttons | variants: primary(gold), secondary, ghost, danger; loading state; icon+label |
| **Input / Select / Textarea** | template inputs | inline validation, error text, helper text, prefix (₹) |
| **Date picker** | 3-field DOB | single control, calendar, range validation ([10](10-Data-Entry.md)) |
| **Table** | 10-col static table | server-side sort/filter/paginate, sticky header, zebra, responsive→cards, tabular nums |
| **Card / Stat tile** | inline-styled stat cards | number + label + trend + click-through ([09](09-Dashboard.md)) |
| **Modal / Dialog** | `<div>` overlay + native `confirm` | focus trap, Esc, ARIA, return-focus |
| **Status badge** | colour badges | icon + label + colour; Paid/Partial/Pending/Overdue |
| **Toast / Alert** | auto-hide banner | assertive for errors, persistent until dismissed for important info |
| **Empty state** | bare text | illustration/icon + message + primary action |
| **Command palette (⌘K)** | none | jump-to-student, quick actions |
| **Money display** | `.toLocaleString()` scattered | one component: ₹ symbol, tabular, correct rounding, colour by semantic |
| **Receipt template** | 4 copies | one branded, server-rendered template ([07](07-Receipt-System.md)) |

## Iconography
- One line-icon set (e.g. Lucide/Phosphor), self-hosted, with `aria-label`s. Retire emoji-as-icons ([13](13-UX-Issues.md)).

## Motion
- Minimal and functional: 120-160ms ease for state changes, respect `prefers-reduced-motion`. No tilt/magnetic effects in the tools (keep them on the marketing site where they belong).

---

## Strengths of current design (to preserve)
- The public site's **navy/gold identity** is genuinely premium — reuse it.
- **Inter** is already the brand typeface.
- The **month-grid + legend** and **live totals** patterns are good; port them into the kit.

## Weaknesses to correct
- Two clashing languages; heavy shadows and oversized radii in data-dense views; emoji icons; no tokens; colour-only status; no dark mode; CDN fonts.

## Recommended direction
Ship a **token file + component library** (framework-appropriate; keep static hosting) derived from the navy/gold identity but tuned for calm, dense, accessible productivity work. Build the tools on it. Keep the marketing site's expressive layer separate but token-compatible so both read as one brand.

## Priority
**🟠 P1** — the design system is the dependency for every tool-facing UI improvement ([08](08-Admin-Panel.md), [09](09-Dashboard.md), [10](10-Data-Entry.md), [13](13-UX-Issues.md)). Start it in parallel with the P0 backend/security work.
