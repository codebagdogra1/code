# 08 — Admin Panel

## Current implementation

The entire operational surface is one file — [admin.html](../admin.html), 3,057 lines. It renders:
- A **stats strip** (5 cards) from `dashboard-stats`.
- A **free-text search box** (client-side filter).
- A **registrations table** (10 columns: receipt, name, phone, date, total, admission, paid, due, status, actions).
- Per-row actions: **View**, **Pay** (if due>0), **Print**, **History**, **Delete** ([admin.html:790-808](../admin.html#L790-L808)).
- Modals (built as `<div>` overlays) for details, payment (with a monthly-installment grid), and payment history.
- CSV export of all registrations ([admin.html:3038](../admin.html#L3038)).

### How search "works" (the scalability landmine)
On first load, `loadRegistrations` fetches page 1, then **loops through every remaining page sequentially** to build an in-memory `allRegistrations` array purely so the search box can filter client-side ([admin.html:737-748](../admin.html#L737-L748)). Search then filters that array ([:1553-1558](../admin.html#L1553-L1558)). At 50 registrations this is invisible; at 5,000 it's 500 serial round-trips on every dashboard open.

## Capability gap for an operations cockpit

| Need | Today |
|------|-------|
| Student management | ⚠️ only via registration records; no student profile view |
| Course management | ❌ no UI (edit `courses` in DB by hand) |
| Fee management | ⚠️ per-registration only |
| Payment verification | ❌ everything is trusted manual entry |
| Attendance | ❌ |
| Notifications | ❌ |
| Reporting | ⚠️ one CSV dump |
| Permissions / roles | ❌ (only "admin" gate, client-side) |
| Audit logs | ❌ |
| Search | ⚠️ client-side, loads everything |
| Filters | ❌ (free-text only) |
| Bulk operations | ❌ |
| Keyboard shortcuts | ❌ (only Enter=search, [:3020](../admin.html#L3020)) |
| Quick actions | ⚠️ per-row buttons only |

---

## Strengths
- **Everything an operator needs day-to-day is reachable** — view, pay, print, history, delete — from one screen.
- The **monthly-installment payment grid** is a genuinely good idea: visual month cards, colour-coded status, click-to-select, live total, skipped-month warnings ([admin.html:1779-1856, 1911-2008](../admin.html#L1779-L1856)).
- **CSV export** exists for offline analysis.
- **Delete has friction** (type "DELETE" + a second confirm, [:1419-1430](../admin.html#L1419-L1430)) — the intent to prevent accidents is right.

## Weaknesses
- 🔴 **Unmaintainable file** — duplicate function definitions (`showRegistrationDetails` [:816](../admin.html#L816)/[:1596](../admin.html#L1596), `generateCourseRegistrationReceipt` [:929](../admin.html#L929)/[:2689](../admin.html#L2689), `closePaymentModal` [:2250](../admin.html#L2250)/[:2658](../admin.html#L2658), `showPaymentHistory`, `closeHistoryModal`), copy-paste comments, 186 inline styles. See [15](15-Technical-Debt.md).
- 🔴 **No server-side auth** behind any action (see [05](05-Security.md)); the "admin" gate is `sessionStorage` only.
- 🟠 **Load-everything search** doesn't scale ([:737-748](../admin.html#L737-L748)); there is no server search/filter endpoint.
- 🟠 **No student-centric view** — you manage *receipts*, not *students*. A student with three registrations is three unrelated rows; there's no single profile with full history and balance.
- 🟠 **No course/fee admin UI** — catalogue changes require raw DB edits.
- 🟠 **Destructive delete with no audit and a real cascade bug** (see [03](03-Backend-Audit.md)).
- 🟡 **No filters** (by status, date range, course, overdue), **no bulk actions**, **no quick "collect due" from the row without opening a modal chain**.
- 🟡 **Modals lack focus trap / Esc / ARIA** (see [13](13-UX-Issues.md)).

## Pain points (from the operator's chair)
- To collect an installment: find the row → click Pay → wait for a separate fetch → pick month cards → confirm → confirm print → dismiss popup. Many clicks for the most common daily task.
- To see "who owes money this week," an operator must eyeball the table or export CSV and open Excel.
- Managing courses/prices is not self-service — it's a developer task.
- There is no way to know **who** recorded a payment or deleted a record.

## Opportunities — reimagine the cockpit
- **Student-centric information architecture:** a `Students` list → student profile with identity, all registrations, unified ledger, next due, quick "record payment" and "send reminder." Registrations become a tab, not the top-level object.
- **Server-side search + filters + saved views:** by status, overdue bucket, course, batch, date range, payment method; paginated, indexed.
- **Operational queues, not just a table:** "Dues due this week," "Overdue >30 days," "Follow-ups," "Today's collections."
- **Bulk operations:** send reminders to all overdue, export a filtered set, bulk fee updates.
- **Keyboard-first:** global command palette (⌘K) to jump to a student, `/` to search, `n` for new registration, arrow-key row nav, single-key actions.
- **Roles & permissions:** Admin / Accountant / Front-desk / (read-only) with server-enforced scopes; hide Delete from non-admins.
- **Audit log view:** every privileged action, who/when/what, searchable.
- **Inline quick-collect:** record a full or partial payment from the row with one popover, no modal chain.
- **Course & fee management UI** with effective-dated pricing.

## Recommended direction
Rebuild the admin as a **component-based, student-centric operations console** on the new design system ([14](14-Design-System.md)), backed by **server-side search/filter/pagination** and **role-based, audited** actions. Replace the load-everything pattern immediately. Elevate the good monthly-grid idea into a first-class payment flow with one-click quick-collect.

## Priority
- **🔴 P0:** server auth + roles behind actions; fix delete; kill load-everything search; stop the duplicate-function rot before extending.
- **🟠 P1:** student-centric IA, server search/filters, operational queues, audit log view, course/fee UI.
- **🟡 P2:** command palette, bulk ops, saved views, keyboard shortcuts.
