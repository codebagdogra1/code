# 15 — Technical Debt

## Current implementation

The codebase grew by **incremental copy-paste in production**. The evidence is in the code itself — comments and duplication that document the process:
- *"Replace the entire `<script>` section in your admin.html file with this updated version"* ([admin.html:677](../admin.html#L677))
- *"REPLACES your current one"* / *"Enhanced ... - REPLACES your current one"* ([admin.html:1754-1758](../admin.html#L1754-L1758))
- *"Create a new file: netlify/functions/delete-registration.js"* ([delete-registration.js:1](../netlify/functions/delete-registration.js#L1))
- Recent commit messages: *"Make the variable global of addPayment function"*, *"Pay button dashboard fix test"* — point fixes on a fragile core.

## Debt inventory

### 🔴 Duplicate function definitions in `admin.html`
The same function is defined **twice** in one file; the second definition wins, the first is dead code (and confusing when editing):
- `showRegistrationDetails` — [:816](../admin.html#L816) and [:1596](../admin.html#L1596)
- `generateCourseRegistrationReceipt` — [:929](../admin.html#L929) and [:2689](../admin.html#L2689)
- `showPaymentHistory` — [:1274](../admin.html#L1274) and [:2260](../admin.html#L2260)
- `closeHistoryModal` — [:1476](../admin.html#L1476) and [:2336](../admin.html#L2336)
- `closePaymentModal` — [:2250](../admin.html#L2250) and [:2658](../admin.html#L2658)

**Impact:** editing the wrong copy silently does nothing; the file is a trap.

### 🔴 Four near-duplicate receipt implementations
Registration receipt ([course-registration.html:765](../course-registration.html#L765)), admin reprint ([admin.html:929](../admin.html#L929)/[:2689](../admin.html#L2689)), payment receipt ([admin.html:2367](../admin.html#L2367)), and two standalone offline makers ([zxrbmw1250.html](../zxrbmw1250.html), [admission-bkp.html](../admission-bkp.html)). Any branding change = five edits; they've already diverged. See [07](07-Receipt-System.md).

### 🔴 Monolithic files
`admin.html` = 3,057 lines of HTML+CSS+JS in one file, with **186 inline `style=` attributes**. `zxrbmw1250.html` = 1,414, `course-registration.html` = 1,135. No modules, no components, no separation of concerns.

### 🟠 Divergent duplicate logic across the stack
- Money math implemented in the browser **and** in SQL, disagreeing ([02](02-Data-Model.md)).
- Two payment endpoints mutating the same column differently (`record-payment` vs `update-payment`, [03](03-Backend-Audit.md)).
- The auth gate copy-pasted into three pages ([04](04-Frontend-Audit.md)).
- Seven copies of the `pg.Pool` + CORS + OPTIONS boilerplate.

### 🟠 No schema in version control
The data model lives only in the live DB — no `.sql`, no migrations ([01](01-Architecture.md), [02](02-Data-Model.md)). Rebuilding or reviewing the schema is archaeology.

### 🟠 No engineering safety net
- **No tests** (unit, integration, or e2e) anywhere.
- **No CI** (no workflow files).
- **No linting/formatting** config.
- **No build step / bundling / minification** for the frontend.
- **No types** (plain JS, no JSDoc, no TS).
- **No error monitoring** — failures are `console.error` into the void ([auth.js:131](../netlify/functions/auth.js#L131) etc.).
- **No dependency pinning** — no `package-lock.json`; `pg`/`bcryptjs` float on `^`.

### 🟡 Dead / orphaned assets & code
- `old-index.html` (superseded landing), `admission-bkp.html` (a backup checked into main).
- The **popular-courses** query is computed but never rendered ([dashboard-stats.js:32-39](../netlify/functions/dashboard-stats.js#L32-L39)).
- `exportPaymentHistory` is a stub ("feature coming soon", [admin.html:1465-1473](../admin.html#L1465-L1473)).
- `action` param in `auth.js` accepts values it never handles ([auth.js:37-39](../netlify/functions/auth.js#L37-L39)).
- Obfuscated filename `zxrbmw1250.html` as pseudo-access-control.

### 🟡 Hardcoded values in markup
WhatsApp number `+919635809537`, address, email, and a dated offer ("before Sept 30", [index.html:319](../index.html#L319)) are baked into HTML across files.

---

## Strengths (debt that *isn't* there)
- **No SQL injection** — parameterised queries throughout. Genuinely good discipline.
- **Tiny dependency surface** (2 packages) — little to audit or break.
- **Transactions** used for the multi-write operations that matter.
- The **data model** is sound enough to build on (the debt is in the code, less in the schema shape).

## Business & technical impact
- **Velocity:** each new feature is slower and riskier than the last; the admin file actively resists edits.
- **Reliability:** point fixes ("Pay button dashboard fix test") indicate regressions land in production because there's no test net or staging.
- **Onboarding:** a second engineer cannot safely ramp without the schema and without a way to run it locally.
- **Correctness:** duplicate/divergent logic is *why* the two balances disagree and receipts mislead.

## Recommended direction (order matters)
1. **Schema into the repo + migrations** — unblocks everything ([01](01-Architecture.md)).
2. **Shared backend module** (db/auth/validation/money) — delete the seven-way boilerplate and the divergent payment path.
3. **One receipt template**, one auth module, one money component — kill the four/three/N-way duplication.
4. **Component-based frontend** to dissolve `admin.html`.
5. **Add the safety net incrementally:** lint + format, a test harness starting with billing math, CI on push, error monitoring (Sentry-class), dependency pinning, a staging site.
6. **Delete dead assets** (`old-index`, `admission-bkp`, `zxrbmw1250`) once superseded.

## Priority
- **🔴 P0:** schema-in-repo, shared secure backend module, remove duplicate/divergent billing logic (correctness + security depend on it).
- **🟠 P1:** receipt/auth/money consolidation, component frontend, error monitoring, tests for money.
- **🟡 P2:** CI/lint/format, dependency pinning, dead-asset cleanup, config-drive hardcoded values.
