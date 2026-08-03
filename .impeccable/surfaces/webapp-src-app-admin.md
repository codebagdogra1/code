---
version: 1
slug: "webapp-src-app-admin"
primary_target: "webapp/src/app/admin"
related_targets: []
---

# Admin — surface brief

**Scope:** the whole CODE admin area (shell, login, dashboard, registrations list, registration detail, new-registration, courses). **Mode:** Operate.

**Audience / job:** one staffer at a desk (desktop, long sessions), often with a student/parent waiting; enrols students, records fee payments against monthly installments, reads money truth (collected / outstanding / overdue), manages courses.

**Direction — "The Records Office" (seed 23faa872, grounded #6, user-confirmed):** the institute's steel records room made digital — the physical thing this software replaces. Enamel-on-steel grey-green chrome + file-cream content ground; oxide-red (overdue/danger), ink-blue (action), stamp-green (paid), ochre (due) as the only working accents. Engraved label plates, riveted edges, numbered file-spine nav tabs. Archivo (industrial grotesque) for labels/headings; JetBrains Mono for every rupee figure and receipt number (tabular). Objects are physical records: a registration = a job-card with a receipt-no spine; the month-installment tracker = a punch-card grid (paid = stamped square, due = open, overdue = red). Signature: recording a payment "stamps" the month square.

**Approved composition — dashboard = "The Worktop":** four stamped money-plates across the top (Collected / Outstanding / Overdue / This month), then a stack of file-cream job-cards for today's collections, with a prominent oxide-red OVERDUE panel calling out what needs attention. Chosen over the Register-Sheet and Drawer-Wall compositions on 2026-08-03. (No AI comp: image generation unavailable — out of credits; presented as annotated layout previews + committed palette, the documented no-image fallback. Delegated/approved pick recorded here.)

**Register-Sheet table treatment** carries into the Registrations list screen; the punch-card grid carries into registration detail.

**Workflow fixes in scope (agreed):** record-payment-against-specific-months UI (punch-card grid, posts per-month exact amounts — also fixes the even-split misallocation); dues/overdue visibility on dashboard + list; returning-student lookup in the admin new-registration flow (behind auth, PII-safe).

**Boundaries:** the Records Office world is scoped to the admin subtree only (a `.ro` root class); the public site (`/`, `/register`, `/brochure`) keeps its existing look untouched. Data model, API/route contracts, receipt numbering, and money semantics preserved.

**Constraints:** Next.js 16, Prisma 7, TS, Tailwind v4, PostgreSQL; desktop-first, degrade to tablet; WCAG 2.1 AA, status never colour-only (shape + label + colour).

**Open (resolved at build):** exact final hex values and font weights; committed in globals.css `.ro` layer.
