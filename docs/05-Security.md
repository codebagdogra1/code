# 05 — Security

> This is the most important document in the package. The system currently offers **no meaningful protection of student data or money**. The following is written for a defensive, remediation purpose.

## Threat model in one line
The public internet can read every student's PII and freely mutate financial records, because authentication is cosmetic and authorization does not exist.

---

## Findings (ranked by severity)

### 🔴 S1 — No server-side authentication or authorization on any data endpoint
`registrations`, `record-payment`, `update-payment`, `delete-registration`, `dashboard-stats`, and `courses` never inspect a token, cookie, or role. Any unauthenticated HTTP client that knows the function URL can:
- **Read all students' PII** — `GET /.netlify/functions/registrations` returns names, phones, emails, addresses, DOBs ([registrations.js:205-217](../netlify/functions/registrations.js#L205-L217)).
- **Read financials** — `GET /.netlify/functions/dashboard-stats` returns total revenue and outstanding dues.
- **Record fake payments / clear dues** — `POST /.netlify/functions/record-payment` ([record-payment.js:31](../netlify/functions/record-payment.js#L31)).
- **Permanently delete** any registration + student — `DELETE /.netlify/functions/delete-registration` ([delete-registration.js:21](../netlify/functions/delete-registration.js#L21)).

**Impact:** Total confidentiality and integrity loss of student and financial data. Under India's DPDP Act 2023, the institute is a Data Fiduciary handling minors' personal data; this is a reportable exposure.
**Fix:** A shared `requireAuth(event, role)` guard at the top of every data handler, verifying a signed token and role, returning 401/403 otherwise. **P0.**

### 🔴 S2 — Authentication tokens are unsigned (forgeable)
`generateToken` returns `base64(JSON.stringify(payload))` ([auth.js:10-20](../netlify/functions/auth.js#L10-L20)). There is no secret, no signature, no expiry claim enforced server-side. An attacker crafts `btoa(JSON.stringify({userType:'admin',...}))` and is "logged in". The client-side gates that decode this ([course-registration.html:297](../course-registration.html#L297)) therefore verify nothing.
**Fix:** Real JWT (HS256/RS256) with a server secret and server-side verification, short expiry + refresh. **P0.**

### 🔴 S3 — Stored/DOM XSS in the internal tools
User-controlled fields (`full_name`, `address`, `email`, `notes`, `course.name`) are interpolated unescaped into `innerHTML` and `document.write` receipts, and into `onclick="fn('${value}')"` attributes ([admin.html:775-812](../admin.html#L775-L812), [course-registration.html:1024-1027](../course-registration.html#L1024-L1027)). A student named `"><img src=x onerror=...>` executes script in the admin's session — and the admin session is the keys to the kingdom.
**Fix:** Escape on output (or render via `textContent`/a templating layer that auto-escapes); never build attributes from raw data. **P0.**

### 🟠 S4 — CORS wide open on every function
`Access-Control-Allow-Origin: *` everywhere (e.g. [auth.js:24](../netlify/functions/auth.js#L24)). Combined with S1 this means any website a staff member visits can script calls to the API.
**Fix:** Restrict to the site's own origin(s). **P1.**

### 🟠 S5 — Destructive, unaudited hard delete
`delete-registration.js` permanently removes financial records with no soft-delete and no audit trail. There is no `deleted_by`, no recovery, and (per [03](03-Backend-Audit.md)) it's also functionally broken. A disgruntled or compromised actor erases paying customers silently.
**Fix:** Soft-delete + immutable audit log; restrict to admin role; require reason. **P0/P1.**

### 🟠 S6 — No audit logging of privileged actions
Nothing records who created a registration, recorded a payment, changed a balance, or deleted data (no `created_by`/`actor` columns, no log). Financial disputes and insider misuse are uninvestigable.
**Fix:** Append-only audit table capturing actor, action, entity, before/after, timestamp. **P1.**

### 🟠 S7 — Database TLS verification disabled
`ssl: { rejectUnauthorized: false }` in all seven functions accepts any certificate on the DB connection — man-in-the-middle exposure of the entire database stream.
**Fix:** Use the provider CA / `verify-full`. **P1.**

### 🟡 S8 — Money integrity trusted to the client
Totals and dues are computed in the browser and stored verbatim ([registrations.js:69-72](../netlify/functions/registrations.js#L69-L72)); an attacker sets `paid_amount` = full and `due_amount` = 0 for free enrolment. (Also a correctness issue — see [06](06-Billing-System.md).)
**Fix:** Recompute all money server-side from the catalogue. **P0.**

### 🟡 S9 — Login hardening gaps
Good: bcrypt + lockout + active flag. Missing: rate limiting per IP (lockout is per-username, so credential-stuffing across many usernames is unthrottled), CAPTCHA, and the account-enumeration-safe generic error is undone by `attemptsRemaining` being returned ([auth.js:100](../netlify/functions/auth.js#L100)).
**Fix:** Per-IP throttling, drop `attemptsRemaining` from the response, consider CAPTCHA after N failures. **P2.**

### 🟡 S10 — Security-by-obscurity assets
`zxrbmw1250.html` is an unlisted but publicly reachable tool. Obscure URLs are not access control.
**Fix:** Put all internal tools behind real auth; remove standalone ones. **P1.**

### 🟡 S11 — No security headers / secrets hygiene
No CSP, HSTS, `X-Content-Type-Options`, etc. (no `netlify.toml` to set them). Third-party CDN scripts on the public site widen the supply-chain surface.
**Fix:** Add a headers config; self-host or SRI-pin third-party assets. **P2.**

---

## Strengths (credit where due)
- Passwords are **bcrypt-hashed**, never stored plaintext.
- **Account lockout** after 5 failures for 15 minutes is implemented and correct.
- **Parameterised queries** everywhere — there is **no SQL injection** (the code consistently uses `$1,$2,...`). This is a real bright spot.
- Login **error messages are generic** ("Invalid username or password").

## Recommended direction (sequence)
1. **Put the API behind auth** (S1) with **signed tokens** (S2) and **server-side money** (S8) — these three together close the catastrophic holes.
2. **Escape all output** (S3) and **lock down CORS** (S4).
3. **Soft-delete + audit log** (S5, S6), **DB TLS** (S7).
4. **Login hardening** (S9), **remove obscurity assets** (S10), **security headers** (S11).

## Compliance note
The institute handles **minors' personal data** (DOB, address, phone). India's **DPDP Act 2023** obliges purpose limitation, security safeguards, and breach notification. The current state would not survive scrutiny. This is a business/legal risk, not just a technical one.

## Priority
**🔴 P0** — S1, S2, S3, S8, S5(delete-safety). Nothing else in the redesign should ship before these.
