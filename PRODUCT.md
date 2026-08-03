# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are the small staff of one institute, working at a desk (desktop or tablet), often with a person waiting in front of them:

- **Front-desk / admissions staff** — enrol students and issue receipts, fastest at peak enrolment times.
- **Accountant / cashier** — record fee payments against monthly installments, reconcile, close the day.
- **Owner / administrator** — wants to know the business is healthy (cash collected, dues outstanding, enrolments) and manage the course catalogue.

Subjects of the system who are **not** users of any app today: **students** (many are minors, under 18) and their **parents**, who currently interact only in person or by phone.

Public-site visitors are prospective students/parents evaluating courses; today an enquiry is pushed to WhatsApp and not stored.

## Product Purpose

CODE is a computer-training institute in Bagdogra, West Bengal, India. The system is two things wired to one PostgreSQL database:

1. A **public marketing site** presenting courses and routing enquiries to WhatsApp.
2. An **internal operations tool** staff use to register students, collect fees (including monthly-installment plans), and issue receipts.

Success looks like: staff enrol a student quickly and correctly and hand them a trustworthy receipt; the accountant records payments accurately and can reconcile; the owner can see cash-in and dues-out at a glance.

## Positioning

The operational system of record for one institute's enrolments and fees — bespoke to how this school actually sells courses and collects money: a course catalogue with per-course pricing, monthly installment schedules, dues tracking, and sequential receipt numbers. It is not a generic CRM or template; its value is fidelity to this institute's real desk workflow.

## Operating Context

- **Enrolment:** staff log in, fill one registration form, which creates a student, a registration, per-course rows, and (for monthly plans) a full schedule of monthly installments — in a single transaction.
- **Fee collection:** payments are recorded against specific months via a month-grid modal; receipts can be reprinted.
- **Money is real and in INR (₹):** installment plans, discounts, dues, and receipt numbers are core objects, not decoration.
- **Public enquiry:** the marketing site sends enquiries straight to WhatsApp; no lead is captured today.
- **Physical setting:** used live at an enrolment desk during peaks, on desktop or tablet, sessions can run for hours.
- **Data:** PostgreSQL; the app is being rebuilt as a single Next.js project in `webapp/` (public site + admin together).

## Capabilities and Constraints

**Exists today (preserve the function):** student registration; course catalogue with pricing; monthly-installment scheduling; recording payments against specific months; receipt generation; an admin dashboard of cumulative totals.

**Active near-term goal:** redesign the **admin area's UI/UX**. The current admin interface is considered inadequate ("AI slop") and its redesign is the immediate work. Product truth, data, and functions above must be preserved; the visual world is chosen fresh in design.

**Rewrite is also fixing known correctness/security debt** (from the `docs/` audit): forgeable base64 auth replaced with signed httpOnly JWT sessions; money should be computed and trusted server-side, not in the browser; two divergent "paid" totals must become one ledger; multi-month lump sums must allocate to each month's real amount (not split evenly); no course/user admin UI today; no audit log today.

**Explicitly out of scope for now** (deferred, do not build unless asked): student/parent portal, lead capture / CRM, automated due reminders, attendance / batches / timetables, certificates, void/refund flows.

**Boundaries:** single institute — **no multi-tenancy** assumptions in data model or design.

**Terminology:** registration, receipt no., monthly installment, due, course, discount.

**Stack constraints:** Next.js 16 (`proxy.ts`, not `middleware.ts`), Prisma 7 (connection URL in `prisma.config.ts`, `@prisma/adapter-pg` driver), TypeScript, PostgreSQL; deployed on Netlify now with a planned move to Vercel, kept host-portable.

## Brand Commitments

- **Name:** "CODE — Computer & Digital Excellence." This is a real, operating institute in Bagdogra, West Bengal; the name and its meaning are factual and kept.
- **Visual identity is open to rebrand for this rewrite.** The current navy (`#0b1426`) + gold (`#f9b233`) + teal look, the Inter typeface, and the public site's expressive style are **evidence and anti-reference, not binding**. The design step chooses the world.
- No official logo asset is present in the repo (`webapp/public/` holds only Next.js default SVGs); a real logo, if one exists, must be supplied — do not fabricate one.

## Evidence on Hand

- A **live, in-real-use** system (118 commits, real receipts, real installment tracking at the institute).
- A comprehensive discovery/audit package in `docs/` (files 01–18), each finding anchored to a specific file and line.
- Real course catalogue and pricing in the production PostgreSQL database.
- **No testimonials, benchmarks, customer counts, or press exist** — do not invent them.

## Product Principles

1. **Trustworthy money first.** The system's core job is fees; balances, allocations, dues, and receipts must be correct and reconcilable before anything is made pretty.
2. **Fast and safe at the desk.** Enrolment and payment entry happen live with someone waiting — favor speed, inline correction, and no silent data loss or record overwrites.
3. **One institute, done well.** Bespoke to this school's real workflow; resist generic-template patterns and premature multi-tenant complexity.
4. **Built for long sessions.** Staff live in the internal tools for hours — scanability, low fatigue, and consistency outrank expressive flourish inside the admin area.
5. **Handle minors' data with care.** Many students are under 18; names, phones, DOBs, and addresses are sensitive PII and must be protected.

## Accessibility & Inclusion

Internal tools are used on desktop and tablet at a desk for extended periods. Target **WCAG 2.1 AA**: keyboard-operable, visible focus, and status conveyed by more than color alone (icon + label + color).
