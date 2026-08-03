---
name: The Records Office (CODE Admin)
description: Admin-only steel records-room world for CODE's enrolment & fee desk — scoped to the `.ro` root class.
colors:
  ink-blue: "#274b77"
  ink-blue-deep: "#1c3a5d"
  oxide-red: "#a2372a"
  oxide-red-deep: "#86281d"
  stamp-green: "#3a6041"
  ochre: "#7c560f"
  file-cream-ground: "#ece7d8"
  panel-cream: "#fbfaf4"
  steel-chrome: "#39433c"
  steel-edge: "#212824"
  ink: "#201e18"
  ink-soft: "#574f3f"
  hairline: "#cdc6b1"
  hairline-strong: "#b3aa90"
  steel-ink: "#d4dcd2"
  steel-ink-muted: "#aeb7ac"
  cream-inverse: "#f4f1e8"
typography:
  figure:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "1.7rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tabular-nums"
  plate:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    letterSpacing: "0.15em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.86rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 700
    letterSpacing: "0.1em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.68rem"
    fontWeight: 600
    letterSpacing: "-0.01em"
    fontFeature: "tabular-nums"
rounded:
  xs: "2px"
  sm: "3px"
  md: "4px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "36px"
components:
  button-primary:
    backgroundColor: "{colors.ink-blue}"
    textColor: "{colors.cream-inverse}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.9rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-blue-deep}"
    textColor: "{colors.cream-inverse}"
  button-ghost:
    backgroundColor: "{colors.panel-cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.9rem"
  button-danger:
    backgroundColor: "{colors.oxide-red}"
    textColor: "{colors.cream-inverse}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.9rem"
  input:
    backgroundColor: "#fffdf6"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.52rem 0.62rem"
---

# Design System: The Records Office (CODE Admin)

> **Scope: admin only.** This system governs the CODE admin subtree exclusively, delivered as a CSS layer scoped to the `.ro` root class (`webapp/src/app/globals.css`, under the "THE RECORDS OFFICE" banner). It does **not** govern the public site (`/`, `/register`, `/brochure`), which keeps a separate, older navy/gold + Inter system that is out of scope here. Every token below is evidenced by the shipped `.ro` layer; when the direction contract and the build diverged, the build won.

## Overview

**Creative North Star: "The Records Office"**

The institute's steel records room made digital — the physical thing this software replaces, not a SaaS dashboard. The surface reads as a daytime clerk's worktop under tubelight: an enamel-on-steel grey-green chrome rail down the side, file-cream panels and job-cards on the desk, engraved metal label plates for headers, inked rubber-stamps for status, and a punch-card grid for the months of an installment plan. It deliberately refuses the incumbent "AI slop" template (sidebar + sparkline stat-card + rounded-2xl) that the product brief names as the anti-reference.

The world is dense but calm, built for one operator who lives in it for hours with a student waiting in front of them. Money truth is the loudest thing on screen: collected, outstanding, and overdue are stamped into metal number-plates in a tabular mono face so figures align and never lie. Everything is squared and hairline-bordered like filed records, not soft cards; depth is engraved (inset light and shadow) rather than floated. Colour is a strict working code — four accents, each meaning one operational thing — never decoration.

The mode is Operate, and the theme is deliberately light: a daytime desk, not a dark IDE. There is no dark theme for admin. Contrast targets WCAG 2.1 AA throughout, including a purpose-lightened muted label colour for text on the steel rail.

**Key Characteristics:**
- Enamel-on-steel grey-green chrome rail + file-cream content ground.
- A four-colour working code (oxide-red, ink-blue, stamp-green, ochre) and nothing else.
- Engraved label plates, inked status stamps, numbered file-spine nav, punch-card month grid.
- Squared corners (3–4px), hairlines, inset "engraved" shadows — no soft SaaS drop shadows.
- JetBrains Mono tabular figures for every rupee amount and receipt number; Archivo for everything else.
- Status is never colour-only: colour + boxed shape marker + text label, always.

## Colors

A muted, aged-paper-and-painted-steel palette carrying a strict four-colour operational code; nothing on screen is coloured for decoration.

### Primary
- **Ink-Blue** (`#274b77`): The action colour — primary buttons, links, focus outlines, text selection, and the "selected" state of a punch-card month. Its deeper shade **Ink-Blue Deep** (`#1c3a5d`) is the hover/pressed and border tone.

### Secondary — the working colour code
- **Oxide-Red** (`#a2372a`): Overdue and destructive only — the OVERDUE panel, overdue stamps, danger buttons, the top line of the double ledger rule, and the pulled-file marker on the active nav tab. Deep shade **Oxide-Red Deep** (`#86281d`) is its hover/border.
- **Stamp-Green** (`#3a6041`): Paid / settled only — the paid stamp (solid marker) and paid punch-card squares.
- **Ochre** (`#7c560f`): Due / pending / partial — hollow-marker stamps signalling "not yet settled."

### Neutral
- **File-Cream Ground** (`#ece7d8`): The desk surface — the admin body background.
- **Panel-Cream** (`#fbfaf4`): Job-cards, panels, and the active nav file; the content stock.
- **Steel-Chrome** (`#39433c`): The records-room rail (nav aside / mobile top bar), rendered as a top-lit vertical gradient with **Steel-Edge** (`#212824`) as its riveted border.
- **Ink** (`#201e18`): Primary text and headings on cream.
- **Ink-Soft** (`#574f3f`): Secondary text, micro-labels, table headers, captions.
- **Hairline** (`#cdc6b1`) / **Hairline-Strong** (`#b3aa90`): Table row rules and panel/control borders respectively.
- **Steel-Ink** (`#d4dcd2`): Text on the steel rail. **Steel-Ink-Muted** (`#aeb7ac`): the rail's secondary label tone, deliberately lightened to clear AA (4.5:1) on steel.
- **Cream-Inverse** (`#f4f1e8`): Text on the dark accents (blue/red buttons, active spine numeral).

### Named Rules
**The Colour-Code Rule.** Exactly four working accents exist and each means one thing: oxide-red = overdue/danger, ink-blue = action, stamp-green = paid, ochre = due. Never repurpose an accent for decoration or a second meaning; if a new surface needs a "brand" colour, it doesn't get one.

**The Never-Colour-Alone Rule.** Status is conveyed by colour **plus** a boxed shape marker **plus** a text label — never colour alone. A stamp's solid square = settled, hollow square = outstanding; the word is always present.

## Typography

**Display / Body / Label Font:** Archivo (industrial grotesque), self-hosted via `next/font`, with `system-ui, -apple-system, sans-serif` fallback. Carries labels, plates, headings, buttons, inputs, and body copy.
**Figure / Mono Font:** JetBrains Mono, tabular numerals, with `ui-monospace, monospace` fallback. Carries every rupee figure, receipt number, nav index, and the punch-card grid.

**Character:** Archivo's squared industrial grotesque reads like stencilled records-room signage — most of it uppercase and tightly tracked. Against it, JetBrains Mono's tabular figures give money the fixed-width, columns-align feel of a fee register. The pairing is clerical and exact, never expressive.

### Hierarchy
- **Figure** (JetBrains Mono, 700, 1.7rem, line-height 1, `-0.02em`, tabular): The stamped money-plate value — the loudest element on the dashboard. Reserved for headline amounts.
- **Plate** (Archivo, 700, 0.72rem, `0.15em`, UPPERCASE): Engraved label-plate headers and the CODE·RECORDS mark.
- **Body** (Archivo, 400, ~0.86–0.9rem, line-height ~1.5): Table cells, input text, panel prose.
- **Label** (Archivo, 700, 0.68rem, `0.1em`, UPPERCASE): Field labels, table headers, money-plate captions, stamp text — the tracked micro-label used everywhere structure needs naming.
- **Mono-inline** (JetBrains Mono, 600, ~0.64–0.68rem, `-0.01em`, tabular): Receipt numbers, nav indices, file-spine text — inline mono at label scale.

### Named Rules
**The Mono-Money Rule.** Every rupee figure and every receipt number is set in JetBrains Mono with tabular numerals, no exceptions. Money that isn't monospaced isn't trusted.

**The Plate-Not-Eyebrow Rule.** The engraved label plate carries its own title and stands alone as a section header. It is never used as a kicker or eyebrow stacked above a larger heading.

## Layout

Desktop-first, degrading to tablet. A fixed 15rem (`w-60`) steel rail sits on the left at `md`+ and collapses into a steel top bar with horizontal nav below `md`. Content lives in a centred column capped at `max-w-6xl` with page padding stepping up responsively (`px-4 py-6` on mobile → `sm:px-8 sm:py-9`). Density is high but breathing: panels group related records; the dashboard is a worktop of four money-plates across the top, then a stack of file-cream job-cards, with the oxide-red OVERDUE panel called out. Spacing rhythm runs on an 8px base (roughly 8 / 16 / 24 / 36px). Tabular numerals are enabled globally on the `.ro` root so figures align in any column.

## Elevation & Depth

Depth is **engraved, not floated.** Resting surfaces are flat file stock defined by hairline borders; the sense of physical material comes from *inset* highlights and shadows (a top light-line, a soft bottom shadow) that make plates and money read as pressed metal and paper — never from soft SaaS drop shadows. Only two outward shadows exist: a barely-there card shadow at rest and a genuine lift shadow reserved for popovers/modals. The active nav tab casts a hard-edged coloured spine (a solid oxide-red left bar), which is a deliberate file-pulled-from-the-rail marker native to this world, not a decorative shadow.

### Shadow Vocabulary
- **Card (rest)** (`box-shadow: 0 1px 2px rgba(32,30,24,0.06)`): The default barely-there seating for panels and job-cards.
- **Lift** (`box-shadow: 0 10px 24px -12px rgba(32,30,24,0.4), 0 2px 6px -3px rgba(32,30,24,0.22)`): Popovers, modals, and hover-raised punch squares only.
- **Engraved inset** (e.g. `inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -3px 8px rgba(32,30,24,0.05)`): The metal/paper pressed look on plates and money-plates. This is the primary depth device.

### Named Rules
**The Engraved-Not-Floating Rule.** Surfaces are flat at rest and gain depth from inset light/shadow and hairlines. A soft outward drop shadow appears only as a response to elevation (modal, popover) — never as ambient decoration on a resting card.

## Shapes

Squared records, not soft cards. Corner radii live in a tight 2–4px band: panels/buttons/money-plates at 4px, plates/stamps/inputs/punch-squares at 3px, small chips and inset markers at 2px. There are no pill/999px shapes and nothing approaching the `rounded-2xl` of the anti-reference. Every surface is defined by a 1–1.5px hairline border; structure is drawn with rules, not with fills. The signature register device is a two-colour ledger rule — a thin oxide-red line sitting directly over a thin ink-blue line — under table headers and section titles.

### Named Rules
**The Squared-Records Rule.** Corner radii stay within 2–4px. If a shape needs to look filed and official, it is squared and hairline-bordered; soft or pill geometry belongs to the out-of-scope public site.

## Components

### Buttons (`.ro-btn`)
Stencilled, uppercase, tracked action plates.
- **Shape:** Squared (4px radius), 1px border, `0.5rem 0.9rem` padding, Archivo 600 / 0.78rem / `0.06em` uppercase.
- **Primary** (`--primary`): Ink-blue fill, cream-inverse text, ink-blue-deep border, with an inset top highlight. Hover deepens to ink-blue-deep.
- **Ghost** (`--ghost`): Panel-cream fill, ink text, hairline-strong border; hover to `--ro-panel-2`.
- **Danger** (`--danger`): Oxide-red fill, cream text, oxide-red-deep border; hover deepens. For destructive actions only.
- **Focus:** 2px ink-blue outline, 2px offset. Disabled = 0.5 opacity, no pointer events.

### Inputs (`.ro-input` / `.ro-label`)
- **Style:** Near-white (`#fffdf6`) fill, hairline-strong border, 3px radius, with a subtle inset top shadow so the field reads recessed. Archivo body text.
- **Focus:** 2px ink-blue outline (no offset) plus ink-blue border shift.
- **Label:** Uppercase tracked micro-label (Archivo 700 / 0.68rem / `0.1em`) in ink-soft, above the field.

### Navigation — File-Spine Rail (`.ro-spine`)
The signature nav. Tabs sit as uppercase entries on the dark steel rail, each carrying a mono index chip (`.ro-spine__no`). The **active** tab becomes a cream file physically pulled out of the rail: it fills panel-cream, shifts right (`translateX(5px)`), and grows a hard oxide-red spine bar on its left edge (`box-shadow: -5px 0 0 0 var(--ro-red)`), its index chip flipping to red-on-cream. Hover lightens the steel. The pull-out `translateX` is disabled under reduced motion.

### Cards / Panels (`.ro-panel`)
- **Corner Style:** Squared (4px).
- **Background:** Panel-cream on the file-cream ground.
- **Border:** 1px hairline (`--ro-panel-line`).
- **Shadow:** Card-rest by default; `--lift` variant for raised/overlay contexts (see Elevation).

### Engraved Label Plate (`.ro-plate`)
The world's headline device. A pressed metal plate — vertical grey-green gradient, dark edge, inset light/shadow — carrying an uppercase tracked title (optionally a line icon). An `--ink` variant renders it as a lighter cream plate for section titles inside panels. Stands alone as a header; never an eyebrow.

### Money Number-Plate (`.ro-money`)
Dashboard's four worktop figures. A stamped metal plate (cream gradient, hairline-strong border, inset press shadow) with an uppercase caption + a 2px colour-code chip, then the amount in the large mono Figure face. Sub-line in ink-soft.

### Status Stamp (`.ro-stamp`)
An inked rubber-stamp: uppercase tracked text inside a 1.5px `currentColor` box with a boxed shape marker, rotated `-2deg`. Colour + marker + label together encode state — paid (green, solid marker), overdue (red, solid), due/partial (ochre, hollow marker). Recording a payment plays a one-shot settle animation (`ro-stamp-settle`, scale-and-rotate into place, 0.42s), disabled under reduced motion.

### Punch-Card Month Grid (`.ro-punch`)
An installment plan rendered as a row of mono month squares. States: **paid** (green tint + green border/text, "stamped"), **overdue** (red tint + red border), **selectable** (hover lifts 1px with card shadow), **selected** (2px ink-blue outline + blue tint). Default is an open cream square = due.

### Register Table (`.ro-table`)
Full-width register sheet. Uppercase tracked ink-soft headers underlined by the two-colour ledger rule (red over blue). Body rows separated by hairline rules, tabular text, zebra-tint on hover, no rule under the last row.

### Receipt File-Spine (`.ro-filespine`)
A vertical steel spine down the edge of a job-card carrying its receipt number in mono (rotated vertical writing-mode), so a registration reads as a physical job-card with a numbered spine.

### Icons (`components/ro/Icon.tsx`)
An authored line-icon set — single 1.6 stroke, round caps/joins, `currentColor`, 24px viewBox. No icon library, no icon font, no emoji. Motifs are records-room objects (file stack, ruled register sheet, stamp, drawer).

## Do's and Don'ts

### Do:
- **Do** set every rupee figure and receipt number in JetBrains Mono tabular (The Mono-Money Rule).
- **Do** encode status with colour + boxed shape marker + text label together (The Never-Colour-Alone Rule).
- **Do** keep radii in the 2–4px squared band and define surfaces with hairline borders (The Squared-Records Rule).
- **Do** convey depth with inset light/shadow and hairlines; reserve outward drop shadows for modals/popovers (The Engraved-Not-Floating Rule).
- **Do** use the engraved label plate as a standalone section header carrying its own title.
- **Do** hold to the four-colour working code and give each accent exactly one meaning (The Colour-Code Rule).
- **Do** respect `prefers-reduced-motion`: the stamp-settle, section reveal, spine pull-out, and punch hover all fall back to no motion.

### Don't:
- **Don't** ship soft SaaS drop shadows, `rounded-2xl` cards, or a sparkline stat-card layout — the named anti-reference ("AI slop").
- **Don't** use a working accent for decoration or a second meaning; there is no free brand colour on a new surface.
- **Don't** stack a label plate as a kicker/eyebrow above a heading (The Plate-Not-Eyebrow Rule).
- **Don't** introduce a dark theme for admin; this is a deliberately light daytime-desk world.
- **Don't** let this system leak onto the public site, or the public navy/gold + Inter system leak into the `.ro` admin subtree.
- **Don't** substitute glyph icons, an icon font, or emoji for the authored 1.6-stroke line set.
