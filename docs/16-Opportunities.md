# 16 — Opportunities

Ranked by ROI = (business value) ÷ (implementation complexity). Each is grounded in a gap the audit found, not generic SaaS wishlisting.

---

## O1 — Lead capture + lightweight CRM  🔷 Highest ROI
**Gap:** Every enquiry from the public site goes to WhatsApp and is **never stored** ([index.html:396-412](../index.html#L396-L412)); the contact form does the same ([:405-412](../index.html#L405-L412)). Leads leak; follow-up is memory.
**Value:** Directly grows revenue — captured + followed-up leads convert far better than lost ones. Gives marketing attribution.
**Complexity:** Low-Medium. Add a `leads` table + a capture endpoint; the forms already collect name/phone/course. Add a simple pipeline view (New → Counselled → Enrolled → Lost) in the admin.
**ROI:** ⭐⭐⭐⭐⭐

## O2 — Automated due reminders via WhatsApp  🔷
**Gap:** Overdue is *detected* ([record-payment.js:225-232](../netlify/functions/record-payment.js#L225-L232)) but nothing acts on it; reminders are manual/none.
**Value:** Faster collections, lower churn, less staff chase-work. The institute already communicates on WhatsApp.
**Complexity:** Medium. A scheduled job queries upcoming/overdue installments and sends templated WhatsApp messages (WhatsApp Business API / provider). Needs a due-query and a message log.
**ROI:** ⭐⭐⭐⭐⭐

## O3 — Trustworthy money core (ledger + server-side math)  🔴 Enabler
**Gap:** Client-computed money, even-split misallocation, two divergent balances, float truncation ([02](02-Data-Model.md), [06](06-Billing-System.md)).
**Value:** Everything financial (dashboard, reports, reconciliation, online pay) is only as trustworthy as this. It's also a security fix (S8).
**Complexity:** Medium-High. Correct money types, single ledger source-of-truth, server recompute, fix allocation, reconcile balances.
**ROI:** ⭐⭐⭐⭐⭐ (prerequisite for O5, O7, dashboard, reports)

## O4 — Secure the backend  🔴 Non-negotiable
**Gap:** No API auth/authz, forgeable tokens, open CORS, XSS, unaudited hard delete ([05](05-Security.md)).
**Value:** Protects student PII (minors — DPDP Act) and money integrity; avoids a breach that could end the business's reputation.
**Complexity:** Medium. Auth middleware + signed tokens + output escaping + CORS + soft-delete/audit.
**ROI:** ⭐⭐⭐⭐⭐ (risk-avoidance; must-do)

## O5 — Student/Parent portal (view dues, pay online, download receipts)  🔷
**Gap:** No self-service at all; `student` user type is vestigial ([12](12-Product-Workflows.md) F15/F16).
**Value:** Shifts payment and receipt delivery off the front desk; convenience drives on-time payment; parents (who often pay) get visibility.
**Complexity:** High (needs O3 + O4 + online gateway). Phase it: read-only "my dues + receipts" first, then online pay.
**ROI:** ⭐⭐⭐⭐

## O6 — Course & fee management UI + roles  🔷
**Gap:** Courses/prices/users are edited in raw Postgres; no roles ([08](08-Admin-Panel.md) F3, [12](12-Product-Workflows.md) F2).
**Value:** Removes developer from routine admin; enables Accountant/Front-desk/Admin separation of duties + audit.
**Complexity:** Low-Medium (CRUD on existing tables + role checks from O4).
**ROI:** ⭐⭐⭐⭐

## O7 — Decision dashboard + core reports  🔷
**Gap:** Vanity totals, no aging/collections/daybook ([09](09-Dashboard.md), [11](11-Reporting.md)).
**Value:** Owner sees health; accountant closes the day; collection effort gets prioritised.
**Complexity:** Medium (needs O3; data mostly exists).
**ROI:** ⭐⭐⭐⭐

## O8 — Server-issued, verifiable receipts (PDF + QR + WhatsApp delivery)  ⚪
**Gap:** Four client-side copies, ephemeral, misleading status, forgeable via offline makers ([07](07-Receipt-System.md)).
**Value:** Trustworthy financial documents; removes reconciliation fraud vector; professional touch.
**Complexity:** Medium.
**ROI:** ⭐⭐⭐

## O9 — Attendance + batches/timetable  ⚪
**Gap:** Not modelled.
**Value:** Early drop-off signal (feeds retention), timetable clarity, foundation for certificates.
**Complexity:** Medium-High (new domain).
**ROI:** ⭐⭐⭐ (later-stage)

## O10 — Certificates & completion  ⚪
**Gap:** Not modelled; the institute markets certification heavily ([index.html](../index.html)).
**Value:** Closes the student lifecycle; marketable artefact.
**Complexity:** Medium (leans on O8's template infra + attendance/completion).
**ROI:** ⭐⭐

---

## The "quick wins" (low complexity, do early)
- Render the **already-computed popular-courses** widget ([dashboard-stats.js:32-39](../netlify/functions/dashboard-stats.js#L32-L39)).
- Fix the **misleading "PAID" receipt status** ([course-registration.html:1083](../course-registration.html#L1083)).
- **Capture leads** (O1) — the forms already have the data.
- **Returning-student lookup** to stop silent overwrites ([10](10-Data-Entry.md)).

## The strategic bets (higher effort, transformational)
- The **trustworthy money core** (O3) + **secure backend** (O4) unlock the **student/parent portal** (O5) and **online payments** — the shift from a back-office tool to a product students and parents touch. That shift is where the institute stops paying for staff time on collections and receipting and starts compounding on convenience.

## Priority summary
- **🔴 Must-do first:** O4 (security), O3 (money core).
- **🔷 Highest business ROI:** O1 (leads), O2 (reminders), O6 (admin/roles), O7 (dashboard/reports), O5 (portal).
- **⚪ Next horizon:** O8 (receipts), O9 (attendance), O10 (certificates).
