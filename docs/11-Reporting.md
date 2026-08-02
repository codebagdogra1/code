# 11 — Reporting

## Current implementation

Reporting today = **one CSV dump** of all registrations ([admin.html exportData:3038](../admin.html#L3038)) plus the five dashboard totals. The CSV is built from the in-memory `allRegistrations` array (so it reflects only what the load-everything routine fetched) and contains receipt, name, phone, email, date, total, paid, due, method.

There are **no reports** in the management sense — no revenue report, no dues report, no reconciliation, no cohort/lifecycle analysis.

---

## Strengths
- A CSV export exists, so data can at least reach a spreadsheet.
- The underlying ledger (`payment_history`) and schedule (`monthly_installments`) contain enough raw material to build proper reports later.

## Weaknesses
- The CSV is **registration-centric**, not money-centric — you can't answer "collected in July by method" from it.
- It exports **client-side state**, so it can silently miss records the load routine didn't fetch, and it inherits the float-money problem.
- No date filtering, no aggregation, no scheduling, no drill-down.

## Reports management actually needs (with the "why")

| Report | What it shows | Why it matters | Source data available? |
|--------|---------------|----------------|------------------------|
| **Revenue (collections)** | ₹ collected by day/week/month, split by method & fee type | Cash-flow truth; owner's #1 question | ✅ `payment_history` (needs clean money) |
| **Outstanding dues / aging** | Dues bucketed 1-7 / 8-30 / 30+ days, by student & course | Prioritises collection calls; predicts churn | ✅ `monthly_installments`, `registrations` |
| **Payment reconciliation** | Ledger vs. bank/UPI/cheque references, by day | Closes the books; catches missing/duplicate entries | ⚠️ needs txn references ([06](06-Billing-System.md)) |
| **Daily cash-up (daybook)** | Every transaction today, running total by method, opening/closing | Front-desk & accountant end-of-day | ✅ `payment_history` |
| **Course performance** | Enrolments + revenue + completion by course over time | Decides what to promote, reprice, or retire | ✅ `course_registrations` (+ the unused top-5 query) |
| **Student lifecycle / cohort** | Enquiry→enrol→active→completed/dropped funnel, retention by cohort | Growth & retention strategy | ⚠️ needs lead capture ([16](16-Opportunities.md)) & attendance |
| **Discount & scholarship** | ₹ discounted, by reason/approver | Controls margin leakage | ⚠️ needs discounts-as-transactions ([06](06-Billing-System.md)) |
| **Attendance trends** | Attendance by batch/course over time | Early drop-off signal | ❌ no attendance yet |
| **Staff productivity** | Registrations/collections per operator | Ops management, accountability | ❌ needs actor attribution ([05](05-Security.md) S6) |

## Pain points
- The owner cannot get a trustworthy monthly revenue figure without manual spreadsheet work.
- Nobody can reconcile the day's cash/UPI against the system.
- Collection effort is unprioritised because there's no aging report.

## Opportunities
- A small **reporting module** with date-range pickers, method/course/status filters, on-screen tables + charts (used sparingly, per [dataviz] discipline in [14](14-Design-System.md)), and **CSV/PDF export**.
- **Scheduled reports** — e.g. a daily WhatsApp/email daybook to the owner, a weekly aging report to the accountant.
- **Tally/accounting export** so the bookkeeper isn't re-keying.
- Reports should read from the **canonical ledger** with correct money types, not client state.

## Recommended direction
Build reports on top of the corrected ledger and money model: ship **Collections, Aging, Daybook, and Course Performance** first (all sourced from data that already exists), then add Reconciliation and Discount reports once transactions carry references/types, and Lifecycle/Attendance/Staff-productivity as those features land. Prioritise a couple of **scheduled push reports** — they change owner behaviour more than any on-screen chart.

## Priority
- **🟠 P1:** Collections, Aging, Daybook, Course Performance (data exists; high ROI).
- **🟡 P2:** Reconciliation, Discount/Scholarship, scheduled push reports, Tally export.
- **⚪ P3:** Lifecycle/cohort, Attendance, Staff productivity (depend on new features).
