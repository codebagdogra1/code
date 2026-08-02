# 09 — Dashboard

## Current implementation

Five stat cards at the top of `admin.html`, fed by `dashboard-stats`:
1. Total Registrations
2. Total Students
3. Total Revenue (`SUM(paid_amount)`)
4. Pending Payments (`SUM(due_amount) WHERE due_amount>0`)
5. Registrations This Month

Plus a top-5 popular-courses query that **is computed but never rendered** ([dashboard-stats.js:32-39](../netlify/functions/dashboard-stats.js#L32-L39); the UI only renders cards 1-5, [admin.html:702-723](../admin.html#L702-L723)).

These are **vanity/cumulative totals**. They tell you the institute exists; they don't tell an administrator what to *do* today.

---

## Strengths
- The numbers load fast and in parallel ([dashboard-stats.js:22](../netlify/functions/dashboard-stats.js#L22)).
- "This month" registrations is the one card with a hint of operational value.
- A popular-courses aggregate already exists in the backend — half the work for a real widget is done.

## Weaknesses
- **Cumulative totals answer no decision.** "Total Revenue = ₹X ever" doesn't help decide anything this week.
- **No actionability** — nothing is clickable-to-workqueue, nothing surfaces risk (overdue, at-risk students, today's expected collections).
- **`totalRevenue` = `SUM(paid_amount)`** conflates course fees + admission fees and is float-truncated; it's not a trustworthy accounting figure ([dashboard-stats.js:48](../netlify/functions/dashboard-stats.js#L48)).
- **Computed data goes to waste** (popular courses).
- **No time context** — no trend, no comparison to last month, no target.

## Pain points
- An administrator opening the dashboard cannot answer: *How much should we collect today? Who is overdue? Which students are about to drop off? Did collections dip this month?*
- "Pending Payments" is a single scary number with no breakdown by age or student, so it can't drive action.

## Opportunities — a decision dashboard, not a metrics wall

> Principle: **every widget must answer a question an administrator acts on, and click through to the work.** No decorative charts.

**Row 1 — Today's operations (the "what do I do now" row)**
- **Collections today** (₹, count, by method) — lets the front desk cash-up and the accountant reconcile. Clicks to today's `payment_history`.
- **Due today / this week** (₹ and student count) — the call list. Clicks to a filtered, actionable queue with one-tap WhatsApp reminder.
- **New registrations today/this week** with WoW delta — is enrolment healthy?

**Row 2 — Risk & retention (the "what needs attention" row)**
- **Overdue aging** — buckets 1-7 / 8-30 / 30+ days, ₹ and count each. 30+ is a churn-risk queue.
- **At-risk students** — monthly-plan students who missed the last installment; the intervention list.
- **Silent/near-complete** — students one payment from `COMPLETED` (easy wins to close out).

**Row 3 — Business health (the "how are we doing" row)**
- **Revenue this month vs last** (collected, not billed) with a small trend line — real, correctly-typed money.
- **Course performance** — enrolments and revenue by course (finally render the existing top-5, extended) → decides which courses to promote/retire.
- **Outstanding vs. collected** ratio — cash-flow health at a glance.

Each tile: a number, a one-line "why it matters," a trend/delta, and a click-through to the exact filtered list. Empty states say what "good" looks like (e.g. "No overdue students 🎉").

## Recommended direction
Replace the five vanity cards with a **three-row decision dashboard** (Today / Risk / Health), every tile actionable and click-through, powered by dedicated, indexed, correctly-typed aggregate queries (and cached briefly). Wire the reminder queues to WhatsApp. Render the course-performance data that already exists.

## Design notes
- Money must use the correct type (paise/`NUMERIC`) and mean **collected**, not client-stored `paid_amount`.
- Aggregates should be cheap: add indexes on `payment_history.payment_date`, `monthly_installments(due_date, payment_status)`, `registrations.registration_date`.
- Follow the visualization discipline in [14 — Design System](14-Design-System.md): restrained palette, no chart for what a number says better.

## Priority
**🟠 P1.** High operational ROI and moderate effort once the money model ([02](02-Data-Model.md)/[06](06-Billing-System.md)) is trustworthy — the dashboard is only as honest as the ledger beneath it.
