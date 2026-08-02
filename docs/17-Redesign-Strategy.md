# 17 — Redesign Strategy (Holistic Product + Engineering Blueprint)

This is **not** a frontend reskin. The audit shows the visible problems (generic tools, confusing receipts, a vanity dashboard) sit on top of structural ones (no security, untrustworthy money, unmaintainable code). A reskin over that base would be lipstick on a liability. The strategy below redesigns **product and engineering together**, sequenced so the live institute never loses a working system.

## North star
Turn a back-office data-entry tool into a **calm, trustworthy operations platform** for the institute — and extend it to the **students and parents** who currently touch nothing. One brand, one secure backend, one honest ledger.

---

## A. Engineering foundation (the base everything stands on)

1. **Schema-in-repo + migrations.** Export the live schema, commit it, evolve via migrations. (No safe change is possible without this — [01](01-Architecture.md), [15](15-Technical-Debt.md).)
2. **Shared backend module** — one pooled DB client, one `requireAuth(role)` guard, one input-validation layer, one **money module** (integer paise / `NUMERIC`, server-computed). Functions become thin handlers over it. Collapse `update-payment` into `record-payment`.
3. **Security baseline** — signed JWTs verified server-side, authz on every endpoint, output escaping, locked-down CORS, soft-delete + audit log, DB TLS verification ([05](05-Security.md)).
4. **Single source of truth for money** — append-only ledger; balances derived, never stored-and-mutated ([02](02-Data-Model.md), [06](06-Billing-System.md)).
5. **Safety net** — lint/format, tests starting with billing math, CI on push, error monitoring, dependency pinning, a **staging environment**.

Keep the cheap stack (static + serverless + managed Postgres). Re-platform the *code organisation*, not the hosting model.

## B. Design system (the shared language)
Derive a **calm, dense, accessible** token set + component library from the public site's navy/gold identity ([14](14-Design-System.md)). Build all tools on it. Marketing site keeps its expressive layer; both share tokens so the product reads as one company.

## C. Frontend / IA
- **App shell** with real navigation: **Students · Payments · Courses · Reports · Leads · Settings**.
- **Student-centric IA** — the student profile (identity, registrations, unified ledger, next due, quick actions) is the hub; receipts become a view, not the top-level object ([08](08-Admin-Panel.md)).
- **Server-side search / filter / pagination** — retire the load-everything pattern.
- Accessible components (focus-trapped modals, inline validation, real empty/loading/error states), responsive down to tablet/phone, WCAG AA ([13](13-UX-Issues.md)).
- Keyboard-first: ⌘K command palette, per-row quick-collect, save-and-new admissions.

## D. Admin system
Reimagine as an **operations console** ([08](08-Admin-Panel.md)):
- Student & course/fee management UIs (no more DB edits).
- **Roles** (Admin / Accountant / Front-desk / read-only), server-enforced, with **audit log** view.
- **Operational queues** (dues this week, overdue 30+, follow-ups, today's collections) instead of a bare table.
- Bulk operations (reminders, exports), saved views, quick actions.

## E. Billing system
Re-found as a **fintech-grade ledger** ([06](06-Billing-System.md)):
- Server-computed, correctly-typed money; single ledger; fixed allocation & reconciled rounding.
- Discounts, scholarships, late fees, refunds, voids as **transaction types** with reason/approver.
- Payment-method **references + reconciliation** (daybook, bank match).
- **Idempotency keys** (kill double-submit duplicates).
- **Online self-pay** (UPI/Razorpay) with webhooks — the gateway to the student portal.

## F. Receipt system
One **server-issued, immutable, branded** template ([07](07-Receipt-System.md)): PDF export, reprint-the-original, **QR verification**, duplicate watermark, tax fields (ready), and **WhatsApp/email/portal delivery**. Retire the four client-side copies and offline makers.

## G. Dashboard
A **three-row decision dashboard** (Today / Risk / Health) — every tile actionable and click-through, on clean money ([09](09-Dashboard.md)). No decorative charts.

## H. Data entry
Guided, **inline-validated, keyboard-first** flow starting with **returning-student lookup** (ends silent overwrites), smart defaults, auto-save, single date picker, plus **bulk CSV import** with duplicate detection ([10](10-Data-Entry.md)).

## I. Reporting
Collections, Aging, Daybook, Course Performance first (data exists), then Reconciliation/Discount and **scheduled push reports** (daily daybook to owner, weekly aging to accountant), Tally export ([11](11-Reporting.md)).

## J. New product surfaces (growth)
- **Lead capture + CRM** ([16](16-Opportunities.md) O1) — stop leaking every enquiry.
- **Automated WhatsApp reminders** (O2).
- **Student/Parent portal** (O5) — view dues, pay online, download receipts.
- Later: **attendance/batches** (O9), **certificates** (O10).

---

## Guardrails / principles
- **Never break the live system** — phase behind the existing tools until parity, then cut over.
- **Backend and security lead; UI follows.** A beautiful admin over an open API is worse than no redesign — it invites more data in.
- **Design *for this product*** — an institute fee-and-enrolment platform for one town, not a generic SaaS dashboard. Optimise for the front-desk operator's day and the owner's decisions.
- **Every recommendation traces to a finding** in docs 01-16; if a feature doesn't map to a real workflow ([12](12-Product-Workflows.md)), it doesn't ship.

## What we explicitly are *not* doing
- Not adopting a heavy microservice architecture — the serverless + Postgres monolith is right-sized.
- Not chasing multi-tenant/white-label until this single institute's platform is solid.
- Not keeping the offline receipt makers or the duplicate landing pages.
