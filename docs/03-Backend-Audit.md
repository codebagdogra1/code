# 03 — Backend Audit

Seven Netlify functions. All share the same boilerplate: create a `pg.Pool` at module load with `ssl.rejectUnauthorized: false`, set `Access-Control-Allow-Origin: *`, handle `OPTIONS`, branch on `httpMethod`. **None of them authenticate or authorise the caller.**

| Function | Methods | Auth check | Transaction | Notable risk |
|----------|---------|-----------|-------------|--------------|
| [auth.js](../netlify/functions/auth.js) | POST | n/a (is the login) | no | Issues an **unsigned** token |
| [courses.js](../netlify/functions/courses.js) | GET | ❌ none | no | Low (public catalogue) |
| [registrations.js](../netlify/functions/registrations.js) | GET/POST | ❌ none | POST only | PII exposure; trusts client money |
| [record-payment.js](../netlify/functions/record-payment.js) | GET/POST | ❌ none | POST only | Even-split bug; open money writes |
| [update-payment.js](../netlify/functions/update-payment.js) | PUT | ❌ none | no | Divergent balance path |
| [delete-registration.js](../netlify/functions/delete-registration.js) | DELETE | ❌ none | yes | Orphans rows; open to anyone |
| [dashboard-stats.js](../netlify/functions/dashboard-stats.js) | GET | ❌ none | no | Leaks revenue; 6 full scans/call |

---

## auth.js — login
**Current:** Looks up user by username, enforces `is_active`, lockout after 5 failed attempts for 15 minutes ([auth.js:85-93](../netlify/functions/auth.js#L85-L93)), verifies bcrypt hash, resets counters and stamps `last_login`. Returns a "token".

- ✅ **Strengths:** bcrypt, lockout, active-flag, generic error messages, failed-attempt counter — this is the *best-designed* function in the codebase.
- 🔴 **The token is `Buffer.from(JSON.stringify(payload)).toString('base64')`** ([auth.js:19](../netlify/functions/auth.js#L19)) — base64, **not signed**. The code comment even says *"In production, use proper JWT with secret key."* Anyone can hand-craft `base64({userType:'admin'})`. Because no other endpoint verifies it, this is moot for the API but fatal for the client-side page gates.
- 🟠 No `signup`/user-management action (`action` is read but only `login` is handled, [auth.js:39](../netlify/functions/auth.js#L39)); users must be inserted into Postgres by hand.
- 🟠 CORS `*` — the login accepts credentials from any origin.

## courses.js — catalogue
**Current:** `SELECT * FROM courses WHERE is_active = TRUE ORDER BY name`.
- ✅ Simple, correct, the one endpoint that *should* be public.
- 🟡 `SELECT *` couples the API to column order; no caching despite being near-static.

## registrations.js — create + list + fetch one
**Current:** POST creates the whole enrolment in a transaction (see [02](02-Data-Model.md)). GET with a receipt in the path returns one registration with courses + installments aggregated via `json_agg`; GET without returns a paginated list plus overdue counts.
- ✅ Correct use of a transaction; thoughtful `json_agg ... FILTER` aggregation ([registrations.js:153-176](../netlify/functions/registrations.js#L153-L176)).
- 🔴 **Trusts client-supplied money.** `total_amount`, `discount_amount`, `paid_amount`, `due_amount` come straight from the browser and are stored unverified ([registrations.js:69-72](../netlify/functions/registrations.js#L69-L72)). The server never recomputes from `courses`.
- 🔴 **Silent student overwrite** on existing `phone_number` ([registrations.js:43-52](../netlify/functions/registrations.js#L43-L52)) — data-loss/identity-collision.
- 🟠 **Path parsing by string split** (`event.path.split('/')`, [registrations.js:144-145](../netlify/functions/registrations.js#L144-L145)) is brittle.
- 🟠 `installment_amount = course_fee / monthlyInstallments` produces repeating decimals (e.g. /3), and the last installment isn't reconciled, so months won't sum exactly to the fee ([registrations.js:93](../netlify/functions/registrations.js#L93)).
- 🟡 List query does a `GROUP BY` join across all installments for every page — fine now, scales poorly.

## record-payment.js — record installment payments + read schedule/history
**Current:** POST validates the monthly breakdown sums to the total, inserts a `payment_history` row, applies to each month, writes mappings, updates registration totals. GET returns either the monthly schedule (with derived OVERDUE/`days_overdue`) or the payment history.
- ✅ Validates breakdown vs. total ([record-payment.js:106-114](../netlify/functions/record-payment.js#L106-L114)); warns about unpaid earlier months ([:91-103](../netlify/functions/record-payment.js#L91-L103)); derives overdue at read time.
- 🔴 **Even split bug:** `amountPerMonth = amount / month_ids.length` ([record-payment.js:127](../netlify/functions/record-payment.js#L127)) divides a lump sum equally across selected months **even when those months have different `installment_amount`s**, so a month can end up `PAID` with the wrong figure while another is left short.
- 🟠 **No auth** — anyone can inflate `paid_amount` / mark dues cleared.
- 🟠 Validation returns 400 **inside an open transaction without ROLLBACK** for the mismatch branch ([:106-114]) — relies on the outer `catch`/`finally` to release; the early `return`s at [:42-48](../netlify/functions/record-payment.js#L42-L48) and [:56-62] also skip an explicit rollback (BEGIN already ran).
- 🟡 Warnings are computed but a payment with unpaid earlier months still proceeds — advisory only.

## update-payment.js — "quick add payment"
**Current:** PUT adds `additional_payment` to `registrations.paid_amount`, recomputes `due_amount`/`payment_status`.
- 🔴 **Divergent path:** updates the registration balance but **not** `monthly_installments` or `payment_history` — so a payment made here leaves the ledger and the schedule stale and creates a balance that disagrees with `record-payment.js`'s view. Two endpoints, two behaviours, one column.
- 🟠 No auth; no transaction (single statement, so acceptable, but no audit row is written at all).
- ❓ **Possibly dead code** — the admin UI calls `record-payment` for payments ([admin.html:1719](../admin.html#L1719)); confirm whether `update-payment` is still wired anywhere before relying on it.

## delete-registration.js — hard delete
**Current:** In a transaction, deletes `payment_history`, then `course_registrations`, then the `registration`, then the `student` if they have no other registrations.
- 🔴 **Does not delete `monthly_installments` or `payment_installment_mapping`.** If FKs exist, the `DELETE FROM registrations` (or students) **throws** and the whole delete fails; if FKs don't exist, those tables are left **orphaned** forever. Either way it's broken ([delete-registration.js:69-87](../netlify/functions/delete-registration.js#L69-L87)).
- 🔴 **Hard delete, no auth, no audit.** Anyone on the internet can permanently erase a paying student and their entire payment history with one request. There is no soft-delete and no record of who did it.

## dashboard-stats.js — metrics
**Current:** Six aggregate queries in `Promise.all` (counts, revenue sum, pending sum, this-month count, top-5 courses).
- 🟠 **No auth** — total revenue and pending dues are exposed publicly.
- 🟠 `parseInt(SUM(...))` truncates money ([:48-49](../netlify/functions/dashboard-stats.js#L48-L49)).
- 🟡 Six full-table scans on every dashboard load, uncached; will slow as data grows.

---

## Cross-cutting recommendations
1. **Add an auth middleware** every data function calls first — verify a *signed* token and the caller's role. (P0)
2. **Recompute all money server-side** from `courses` + persisted state; never trust client totals. (P0)
3. **One shared `db` module** (pooled connection, query helpers) instead of seven copies of the Pool boilerplate. (P1)
4. **Fix `delete-registration`** to cascade correctly (or switch to soft-delete + audit). (P0)
5. **Collapse `update-payment` into `record-payment`** so there is one payment path and one ledger. (P1)
6. **Validate & sanitise all input** (types, ranges, required fields) at the boundary. (P1)

## Priority
**🔴 P0** for auth, money-recompute, and the delete bug; **🟠 P1** for consolidation and the shared module.
