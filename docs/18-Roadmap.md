# 18 — Roadmap

Sequenced so the **catastrophic risks close first**, the **live system never goes down**, and each phase delivers standalone value. Effort is relative (S ≈ days, M ≈ 1-2 weeks, L ≈ 3-6 weeks) for a small team; treat as ordering, not commitments.

---

## Phase 0 — Stop the bleeding (P0, ~1-3 weeks)
> These are urgent enough to do *before* the redesign proper. No new UI required.

| Item | Doc | Effort |
|------|-----|--------|
| Add `requireAuth(role)` guard to **all** data endpoints | [05](05-Security.md) S1 | M |
| Replace base64 token with **signed JWT**, verify server-side | [05](05-Security.md) S2 | S |
| **Escape all output** (kill stored/DOM XSS) | [05](05-Security.md) S3 | M |
| **Recompute money server-side**; stop trusting client totals | [05](05-Security.md) S8, [06](06-Billing-System.md) | M |
| Fix `delete-registration` cascade → **soft-delete + audit** | [03](03-Backend-Audit.md), [05](05-Security.md) S5 | S |
| Lock down **CORS** to own origin; enable **DB TLS verify** | [05](05-Security.md) S4/S7 | S |
| Fix misleading **"PAID"** receipt status | [07](07-Receipt-System.md) | S |
| **Export live schema into repo** (read-only, no migration yet) | [01](01-Architecture.md), [02](02-Data-Model.md) | S |

**Exit criteria:** API rejects unauthenticated/unauthorised calls; no PII readable anonymously; no forgeable tokens; deletes are recoverable and audited; money can't be set by the client.

## Phase 1 — Trustworthy foundation (P0/P1, ~4-6 weeks)
| Item | Doc | Effort |
|------|-----|--------|
| Migrations tooling + **money as paise/`NUMERIC`** | [02](02-Data-Model.md) | M |
| **Single ledger** source-of-truth; balances derived; reconcile the two paths | [06](06-Billing-System.md) | L |
| Fix **even-split allocation** + reconciled rounding | [06](06-Billing-System.md) | S |
| **Shared backend module** (db/auth/validation/money); collapse `update-payment` | [03](03-Backend-Audit.md), [15](15-Technical-Debt.md) | M |
| **Idempotency keys** on registration + payment | [06](06-Billing-System.md) | S |
| **Staging env** + CI + lint + error monitoring + tests for billing math | [15](15-Technical-Debt.md) | M |
| **Design system** tokens + core components (parallel track) | [14](14-Design-System.md) | L |

**Exit criteria:** One honest balance per student; billing math tested; a place to test changes before prod; a component kit ready.

## Phase 2 — The operations platform (P1, ~6-8 weeks)
| Item | Doc | Effort |
|------|-----|--------|
| **App shell + student-centric IA**, on the design system | [08](08-Admin-Panel.md), [17](17-Redesign-Strategy.md) | L |
| **Server-side search / filter / pagination** (retire load-everything) | [08](08-Admin-Panel.md) | M |
| **Roles** (Admin/Accountant/Front-desk) + **audit log view** | [05](05-Security.md), [08](08-Admin-Panel.md) | M |
| **Course & fee management UI** | [08](08-Admin-Panel.md), [16](16-Opportunities.md) O6 | M |
| **Data-entry rebuild**: returning-student lookup, inline validation, date picker, auto-save | [10](10-Data-Entry.md) | M |
| **Decision dashboard** (Today/Risk/Health) + render popular-courses | [09](09-Dashboard.md) | M |
| **Core reports**: Collections, Aging, Daybook, Course Performance | [11](11-Reporting.md) | M |
| **Accessible components** everywhere (modals/states/responsive) | [13](13-UX-Issues.md) | M |

**Exit criteria:** Staff work in one coherent, fast, accessible console; owner/accountant get real numbers; no more DB edits for routine admin.

## Phase 3 — Growth surfaces (P1/P2, ~6-10 weeks)
| Item | Doc | Effort |
|------|-----|--------|
| **Lead capture + CRM pipeline** (forms already collect the data) | [16](16-Opportunities.md) O1 | M |
| **Automated WhatsApp due reminders** + message log | [16](16-Opportunities.md) O2 | M |
| **Server-issued receipts**: one template, PDF, reprint-original, QR verify, WhatsApp/email delivery | [07](07-Receipt-System.md) | M |
| **Discounts/scholarships/refunds/late-fees** as transaction types + reconciliation | [06](06-Billing-System.md) | L |
| Retire duplicate assets (`old-index`, `admission-bkp`, `zxrbmw1250`) | [15](15-Technical-Debt.md) | S |

**Exit criteria:** No leaked leads; collections partly automated; receipts trustworthy and delivered; billing covers real-world money events.

## Phase 4 — Student & parent product (P2, ~8-12 weeks)
| Item | Doc | Effort |
|------|-----|--------|
| **Student/Parent portal** (read-only: dues + receipts) | [16](16-Opportunities.md) O5 | L |
| **Online self-pay** (UPI/Razorpay) + webhooks (idempotent) | [06](06-Billing-System.md) | L |
| **Scheduled push reports** (daily daybook, weekly aging) + Tally export | [11](11-Reporting.md) | M |

**Exit criteria:** Students/parents self-serve dues and payments; front desk offloaded; owner gets numbers pushed to them.

## Phase 5 — Next horizon (P3)
Attendance + batches/timetable ([16](16-Opportunities.md) O9) → Certificates ([16](16-Opportunities.md) O10) → lifecycle/cohort & staff-productivity reporting ([11](11-Reporting.md)). Sequence after the platform is solid and only if the institute's growth calls for it.

---

## Dependency map
```
Phase 0 (security + schema export)
        │
        ▼
Phase 1 (money core + shared module + staging + design system)
        │
        ├───────────────► Phase 2 (ops platform: admin, dashboard, reports, data-entry)
        │
        └───────────────► Phase 3 (leads, reminders, receipts, billing types)
                                    │
                                    ▼
                          Phase 4 (portal + online pay + push reports)
                                    │
                                    ▼
                          Phase 5 (attendance, certificates, advanced reporting)
```

## The one-sentence sequencing rule
**Secure and make money trustworthy (0-1) before making anything prettier (2), and make the internal platform solid (2-3) before opening it to students and parents (4).**

## Immediate next step
Confirm the **live database schema** against the reconstruction in [02](02-Data-Model.md) (including foreign keys and constraints) — it's the single input every Phase 0/1 task depends on, and it's the one thing this audit could only infer, not observe.
