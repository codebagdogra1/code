# 12 — Product Workflows (Persona Journey Maps)

Seven personas. For each: what they do today, where it hurts, and the biggest fix. Friction is tagged **[F#]** and collected at the end.

---

## 1. Business Owner (institute proprietor)
**Goal:** Know the business is healthy — cash in, dues out, enrolments up.
**Today:** Opens `admin.html`, reads five cumulative totals ([09](09-Dashboard.md)). For anything real (monthly revenue, who owes, which course sells) → exports CSV → Excel. Cannot trust the revenue figure (float truncation + client-stored `paid_amount`).
**Hurts:** No decision-grade view **[F1]**; no trend/target; revenue not reconcilable **[F2]**.
**Biggest fix:** Decision dashboard + collections/aging reports on a clean ledger.

## 2. Administrator (manages the system & catalogue)
**Goal:** Add/adjust courses and prices, manage staff, keep data clean.
**Today:** **No UI for courses or users** — both require raw Postgres edits **[F3]**. No role management (only a client-side "admin" flag). No audit of what changed **[F4]**.
**Hurts:** Every catalogue change is a developer ticket; no accountability.
**Biggest fix:** Course/fee admin UI + real roles + audit log.

## 3. Staff / Front-desk (does admissions)
**Goal:** Enrol a student fast and correctly, hand them a receipt.
**Today:** Long single-column form ([10](10-Data-Entry.md)); retypes everything for returning students **[F5]**; DOB via 3 fields with a 2010 ceiling that can reject young students **[F6]**; a mistyped phone silently overwrites a real student **[F7]**; errors arrive one `alert()` at a time at submit **[F8]**; receipt offered via a `confirm()` that, if declined, is lost **[F9]**.
**Hurts:** Slow at peak; dangerous overwrite; rework from late validation.
**Biggest fix:** Returning-student lookup + inline validation + reliable receipt.

## 4. Accountant / Cashier
**Goal:** Record payments accurately, reconcile, close the day.
**Today:** Records installments via the month-grid modal (a good tool) but: multi-month lump sums are **split evenly regardless of each month's amount** **[F10]** ([record-payment.js:127](../netlify/functions/record-payment.js#L127)); two payment paths yield **two different balances** **[F11]**; **no txn reference** captured for UPI/cheque **[F12]**; **no daybook/cash-up** report **[F13]**; a mistake can only be fixed by a DB edit (no void/refund) **[F14]**.
**Hurts:** Can't trust balances; can't reconcile; can't correct cleanly.
**Biggest fix:** Single ledger + correct allocation + txn refs + daybook + void/refund.

## 5. Student
**Goal:** Know what they owe, pay conveniently, keep receipts.
**Today:** **No portal at all.** A `student` user type exists in data ([02](02-Data-Model.md)) but there is no student-facing app. They must visit/call to learn their due, pay in person, and hope they kept the printout **[F15]**.
**Hurts:** Zero self-service; friction on every payment; lost receipts.
**Biggest fix:** Student portal (view dues, pay online, download receipts).

## 6. Parent
**Goal:** Pay a child's fees, get proof, track progress.
**Today:** Not modelled at all — no parent contact, no link to a student, no notifications **[F16]**. Parents of minors (the institute enrolls under-18s) have no visibility.
**Hurts:** Invisible to the people who often pay and decide.
**Biggest fix:** Parent contact on the student record + WhatsApp receipts/reminders + optional parent portal view.

## 7. Operator / Marketing (handles inbound leads)
**Goal:** Capture an enquiry, follow up, convert.
**Today:** The public site sends every enquiry straight to **WhatsApp with no record** ([index.html:396-412](../index.html#L396-L412)) **[F17]**. No lead DB, no follow-up queue, no source attribution, no conversion tracking **[F18]**.
**Hurts:** Leads leak; follow-up is memory-based; marketing ROI is unknowable.
**Biggest fix:** Lead capture + a simple CRM pipeline (enquiry → counselled → enrolled).

---

## Friction register (prioritised)

| # | Friction | Persona | Severity | Fix doc |
|---|----------|---------|----------|---------|
| F7 | Mistyped phone silently overwrites a student | Staff | 🔴 | [10](10-Data-Entry.md) |
| F11 | Two payment paths → two balances | Accountant | 🔴 | [06](06-Billing-System.md) |
| F10 | Even-split misallocates multi-month payments | Accountant | 🔴 | [06](06-Billing-System.md) |
| F17 | Leads go to WhatsApp, never captured | Operator | 🔴 | [16](16-Opportunities.md) |
| F2 | Revenue not reconcilable/trustworthy | Owner | 🟠 | [02](02-Data-Model.md)/[06](06-Billing-System.md) |
| F15 | No student self-service | Student | 🟠 | [16](16-Opportunities.md) |
| F3 | No course/user admin UI (DB edits) | Admin | 🟠 | [08](08-Admin-Panel.md) |
| F5 | Retype everything for returning students | Staff | 🟠 | [10](10-Data-Entry.md) |
| F13/F12 | No daybook / no txn references | Accountant | 🟠 | [06](06-Billing-System.md)/[11](11-Reporting.md) |
| F1 | Dashboard answers no decision | Owner | 🟠 | [09](09-Dashboard.md) |
| F4 | No audit log | Admin | 🟠 | [05](05-Security.md) |
| F8 | Submit-time modal validation | Staff | 🟡 | [10](10-Data-Entry.md) |
| F6 | DOB 3-field + 2010 ceiling | Staff | 🟡 | [10](10-Data-Entry.md) |
| F9 | Receipt lost if popup declined | Staff | 🟡 | [07](07-Receipt-System.md) |
| F14 | No void/refund; DB edits to fix | Accountant | 🟡 | [06](06-Billing-System.md) |
| F16 | Parents not modelled | Parent | 🟡 | [16](16-Opportunities.md) |
| F18 | No conversion/attribution tracking | Operator | 🟡 | [16](16-Opportunities.md) |

## Cross-persona observations
- **Duplicate & manual work:** staff retype returning students; accountants can't correct without a developer; admins edit the DB for prices; the *same receipt* is generated four ways.
- **Automatable today:** due reminders (WhatsApp), receipt delivery, daybook, lead capture, overdue queues — all are manual or nonexistent.
- **The two absent personas (Student, Parent)** are where the biggest product growth lives: shifting payment and communication from "come to the desk" to "self-serve on your phone."
