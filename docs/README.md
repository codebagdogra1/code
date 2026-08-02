# CODE Platform — Product Discovery & Technical Audit

**Product:** "CODE" (Computer & Digital Excellence) — a computer-training institute in Bagdogra, West Bengal, India.
**System:** A public marketing site + an internal course-registration, fee-collection, and receipting tool for staff.
**Audit date:** 2 August 2026
**Author:** Principal Product Engineer (discovery engagement)

> This package is **discovery only**. No application code has been changed. Every finding below is anchored to a specific file and line in the repository so it can be independently verified before any redesign work begins.

---

## How to read this package

| # | Document | What it answers |
|---|----------|-----------------|
| 00 | This file | Executive summary, scope, verdict |
| 01 | [Architecture](01-Architecture.md) | How the system is built and deployed |
| 02 | [Data Model & Data Flow](02-Data-Model.md) | Reconstructed schema, entity relationships, how data moves |
| 03 | [Backend Audit](03-Backend-Audit.md) | The 7 serverless functions, endpoint by endpoint |
| 04 | [Frontend Audit](04-Frontend-Audit.md) | Every HTML page and its role |
| 05 | [Security](05-Security.md) | Auth, authorization, PII, injection — the biggest risk area |
| 06 | [Billing System](06-Billing-System.md) | Fees, installments, dues, payment recording |
| 07 | [Receipt System](07-Receipt-System.md) | How receipts are generated and delivered |
| 08 | [Admin Panel](08-Admin-Panel.md) | The operational cockpit |
| 09 | [Dashboard](09-Dashboard.md) | Metrics today vs. metrics that drive decisions |
| 10 | [Data Entry](10-Data-Entry.md) | Forms, validation, speed of work |
| 11 | [Reporting](11-Reporting.md) | Reports that management actually needs |
| 12 | [Product Workflows](12-Product-Workflows.md) | Journey maps for 7 personas + friction log |
| 13 | [UX Issues](13-UX-Issues.md) | Concrete usability defects |
| 14 | [Design System](14-Design-System.md) | Proposed premium, calm, productivity-first system |
| 15 | [Technical Debt](15-Technical-Debt.md) | Duplication, dead code, missing tooling |
| 16 | [Opportunities](16-Opportunities.md) | Where the biggest ROI lives |
| 17 | [Redesign Strategy](17-Redesign-Strategy.md) | Holistic product + engineering blueprint |
| 18 | [Roadmap](18-Roadmap.md) | Sequenced plan with priorities and effort |

---

## The system in one paragraph

A prospective student sees the public landing page ([index.html](../index.html)) and is pushed to WhatsApp — **no lead is ever stored**. When they enrol, a staff member logs in ([login.html](../login.html)) and fills a single long form ([course-registration.html](../course-registration.html)) that creates a student, a registration, per-course rows, and — for monthly plans — a full schedule of monthly installments (all in one transaction, [registrations.js:31-140](../netlify/functions/registrations.js#L31-L140)). Staff then manage everything from one 3,057-line page ([admin.html](../admin.html)): view registrations, record further payments against specific months ([record-payment.js](../netlify/functions/record-payment.js)), reprint receipts, and delete records. Data lives in PostgreSQL reached through seven Netlify serverless functions.

---

## Verdict

The product **works and is in real use** (118 commits, live receipts, monthly-installment tracking). That is a genuine achievement for a small institute. But it was built by incremental copy-paste, and it has crossed the threshold where the next feature is harder to add than the last. Three things must be understood before any redesign:

### 🔴 1. There is effectively no backend security
The login issues a **base64 string, not a signed token** ([auth.js:10-20](../netlify/functions/auth.js#L10-L20)), and **not one data endpoint checks it**. `registrations`, `record-payment`, `update-payment`, `delete-registration`, `dashboard-stats`, and `courses` are all open to the public internet with `Access-Control-Allow-Origin: *`. Anyone who knows the URL can download every student's name, phone, email, address and date of birth, record fake payments, or delete records. This is the single most important finding in the package. See [Security](05-Security.md).

### 🟠 2. Money is computed in the browser and trusted by the server
Totals, discounts, and due amounts are calculated in JavaScript and posted to the server, which stores them verbatim ([course-registration.html:711-726](../course-registration.html#L711-L726) → [registrations.js:65-72](../netlify/functions/registrations.js#L65-L72)). Multi-month payments are split **evenly** regardless of each month's real amount ([record-payment.js:127](../netlify/functions/record-payment.js#L127)). Two separate "paid" totals exist (`registrations.paid_amount` and the sum of `monthly_installments`) and can silently drift apart. For a system whose entire job is handling fees, the financial core is not trustworthy. See [Billing System](06-Billing-System.md).

### 🟡 3. The internal tools are a maintenance dead-end
`admin.html` is one file of 3,057 lines with the **same functions defined twice** (`showRegistrationDetails`, `generateCourseRegistrationReceipt`, `closePaymentModal`, `showPaymentHistory`, `closeHistoryModal`), comments like *"Replace the entire `<script>`"*, four near-duplicate receipt implementations across four files, and 186 inline `style=` attributes. There is no build, no tests, no schema-in-code, no error monitoring. See [Technical Debt](15-Technical-Debt.md).

None of this means "rewrite everything." It means the redesign must **lead with a real backend and a trustworthy data model**, and treat the UI redesign as the visible half of that work. The roadmap in doc 18 sequences this so the institute is never without a working system.

---

## What the product does *not* do yet (and a school like this needs)

- No **lead capture / CRM** — every WhatsApp inquiry is lost.
- No **student or parent portal** — students cannot see dues or pay online.
- No **automated due reminders** (WhatsApp/SMS/email).
- No **attendance, batches, or timetables**.
- No **certificates**.
- No **audit log** of who deleted or edited what.
- No **PDF / emailed / verifiable receipts**.

These are the growth opportunities, detailed in [Opportunities](16-Opportunities.md).
