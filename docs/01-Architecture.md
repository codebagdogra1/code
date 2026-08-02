# 01 — Architecture

## Current implementation

A **static-frontend + serverless-functions + managed-Postgres** stack, deployed on Netlify. There is no framework, no bundler, no package manager lockfile, and no build step for the frontend.

```
Browser (vanilla HTML/CSS/JS, no framework)
   │  fetch('/.netlify/functions/*')
   ▼
Netlify Functions (Node.js, AWS Lambda under the hood)   ← netlify/functions/*.js
   │  new Pool({ connectionString: DATABASE_URL })
   ▼
PostgreSQL (external managed DB — Neon/Supabase-class, SSL)
```

### Components

| Layer | Technology | Evidence |
|-------|-----------|----------|
| Frontend | Hand-written HTML + inline `<style>` + inline `<script>`, vanilla JS | All `*.html` at repo root |
| Public assets | Font Awesome + Google Fonts via CDN | [index.html:7-8](../index.html#L7-L8) |
| API | Netlify Functions, CommonJS handlers | [netlify/functions/](../netlify/functions/) |
| DB driver | `pg` ^8.11.3 | [package.json](../package.json) |
| Auth hashing | `bcryptjs` ^2.4.3 | [package.json](../package.json), [auth.js:78](../netlify/functions/auth.js#L78) |
| Database | PostgreSQL over SSL | `new Pool({ ssl: {...} })` in every function |
| Hosting/CI | Netlify (implicit; `/.netlify/functions/` paths) | fetch paths across frontend |

### Configuration state
- **No `netlify.toml`**, **no `_redirects`**, **no `.gitignore`**, **no `package-lock.json`**, **no `node_modules`** committed. Netlify is doing dependency install and function bundling with all-default settings.
- The only runtime configuration is the `DATABASE_URL` environment variable, read in all seven functions.
- **No database schema in the repository** — no `.sql` file, no migration tool. The schema exists *only* inside the live database. This is reconstructed from queries in [02 — Data Model](02-Data-Model.md).

### Routing
There is no router. "Routing" is: static file names (`admin.html`, `login.html`, …) plus a `?page=` query parameter that `login.html` reads to decide where to redirect after login ([login.html:170-180](../login.html#L170-L180)). Access control between pages is a `sessionStorage` check performed in an IIFE at the top of each protected page ([course-registration.html:287-313](../course-registration.html#L287-L313), [admin.html:~500-571](../admin.html)).

### State management
Client state is module-level `let`/`var` globals inside each page's `<script>` (`selectedCourses`, `coursePaymentPlans`, `allRegistrations`, `selectedMonthlyPayments`, `courseInstallments`). Session state is `sessionStorage`. There is no shared state layer and no persistence beyond the DB.

---

## Strengths

- **Genuinely simple and cheap to run.** Static hosting + serverless + managed Postgres has near-zero idle cost and no servers to patch. For an institute of this size this was a sensible instinct.
- **The data model is more thoughtful than the code around it.** Normalised students/registrations/courses, a proper `payment_history` ledger, and a `payment_installment_mapping` join table show real domain thinking (see [02](02-Data-Model.md)).
- **Transactions are used where it matters most** — registration creation and payment recording both wrap their multi-table writes in `BEGIN/COMMIT/ROLLBACK` ([registrations.js:32](../netlify/functions/registrations.js#L32), [record-payment.js:32](../netlify/functions/record-payment.js#L32)).
- **Zero framework churn.** Nothing here will break because a dependency had a major-version bump; the surface area of dependencies is two packages.

## Weaknesses

- **No environment separation.** There is one database and (presumably) one Netlify site. No staging, so every change is tested in production against real student data.
- **A new `pg.Pool` is created per function module** ([every function, lines 4-7]). In a serverless model each cold start opens a fresh pool; under load this exhausts Postgres connection limits unless a serverless-aware pooler (PgBouncer / Neon pooled endpoint) is used. There is no evidence one is configured.
- **`ssl: { rejectUnauthorized: false }`** in every function disables TLS certificate verification to the database — convenient, but it removes protection against a man-in-the-middle on the DB connection.
- **No schema-as-code.** The single source of truth for the data model is a running database nobody can review, diff, or recreate. Onboarding a second developer, or rebuilding after a loss, is a manual archaeology exercise.
- **Frontend and backend share nothing** — no shared types, no shared validation, no shared money/formatting logic. Every rule (e.g. how a due amount is computed) is re-implemented in the browser *and* in SQL, and they already disagree in places.

## Pain points (operational)

- Any change to the admin experience means editing a 3,057-line HTML file by hand, in production.
- There is no way to run the system locally with confidence because the schema isn't in the repo and dependencies aren't pinned.
- Debugging a payment discrepancy means reading two code paths (`record-payment.js` and `update-payment.js`) that both mutate `registrations.paid_amount` differently.

## Opportunities

- Introduce a **thin application framework** (see [17 — Redesign Strategy](17-Redesign-Strategy.md)) without abandoning the cheap hosting model: the serverless + Postgres backbone is worth keeping; it's the *organisation* of code that needs to change.
- Put the **schema under version control** with a migration tool (Prisma/Drizzle/Knex/plain SQL migrations). This alone de-risks everything else.
- Add a **pooled DB connection** and a single shared `db` module instead of seven copies of the same `Pool` boilerplate.

## Recommended direction

Keep the deployment philosophy (static + serverless + managed Postgres) but re-platform the code:

1. **Schema in the repo** with migrations — before anything else.
2. **One shared backend module** for DB access, auth verification, input validation, and money math; functions become thin handlers over it.
3. **A component-based frontend** (a light framework or even Web Components) so the admin surface stops being one giant file.
4. **A staging environment** and a `netlify.toml` that makes builds reproducible.

This is a re-platforming, not a big-bang rewrite — the roadmap phases it so the live system keeps working throughout.

## Priority

**🔴 Foundational (P0).** Schema-in-code, a shared authenticated DB layer, and a staging environment are prerequisites for doing any other work safely. The security fixes in [05](05-Security.md) depend on them.
