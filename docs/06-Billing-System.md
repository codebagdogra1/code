# 06 — Billing System

## Current implementation

The billing model has three moving parts:

1. **At registration** ([registrations.js:63-127](../netlify/functions/registrations.js#L63-L127)): a `registrations` row stores `total_amount`, `admission_fees`, `discount_amount`, `paid_amount`, `due_amount`. For every `monthly` course, a full schedule of `monthly_installments` is generated up front (`installment_amount = course_fee / N`), and any amount paid on day one becomes an `initial` `payment_history` row.
2. **Later payments** ([record-payment.js](../netlify/functions/record-payment.js)): staff pick specific month cards in the admin UI; the payment is recorded in `payment_history`, allocated to those months via `payment_installment_mapping`, and the registration balance is bumped.
3. **A second, quick path** ([update-payment.js](../netlify/functions/update-payment.js)): adds to `registrations.paid_amount` directly.

Supported today: **full vs. monthly plans**, **admission fees**, **flat discount amount**, **partial payments**, **five payment methods** (Cash/UPI/Card/Bank Transfer/Cheque), **overdue detection** (derived at read time), and **skipped-month warnings**.

## What a modern fee product needs — gap analysis

| Capability | Today | Gap |
|-----------|-------|-----|
| Fee collection | ✅ manual entry | No online/self-pay |
| Installments | ✅ generated up front | Even-division rounding; no reschedule |
| Due tracking | ⚠️ derived on read | Two disagreeing balances |
| Discounts | ⚠️ flat amount only | No %-based, no coupon, no reason/approval |
| Scholarships | ❌ | No concept |
| Late fees | ❌ | Overdue is shown, never charged |
| Refunds | ❌ | No negative transactions |
| Partial payments | ✅ | Even-split misallocates |
| Multiple methods | ✅ label only | No gateway, no reconciliation, no txn ref |
| Failed payments | ❌ | N/A (all manual) |
| Payment history | ✅ ledger exists | Not the source of truth |
| Transaction timeline | ⚠️ list only | No unified per-student timeline |
| Accounting workflow | ❌ | No daybook, no reconciliation, no export to Tally |

---

## Strengths
- A **real double-entry-ish structure exists**: a ledger (`payment_history`) plus an allocation table (`payment_installment_mapping`). Most systems at this scale don't have this.
- **Installment scheduling is automatic** on monthly plans — good product instinct.
- **Overdue and skipped-month awareness** already exists ([record-payment.js:91-103, 225-232](../netlify/functions/record-payment.js#L91-L103)).
- Partial payments and mixed admission-fee + course-fee receipts are handled.

## Weaknesses (evidence-backed)
- 🔴 **Client-computed money is trusted** — the server stores `total_amount`/`due_amount` from the browser ([registrations.js:69-72](../netlify/functions/registrations.js#L69-L72)); no recomputation from `courses`.
- 🔴 **Even-split misallocation** — `amountPerMonth = amount / month_ids.length` ([record-payment.js:127](../netlify/functions/record-payment.js#L127)) ignores that months can have different amounts, corrupting per-month `paid_amount`/status.
- 🔴 **Two balances that drift** — `record-payment` and `update-payment` both mutate `registrations.paid_amount`, but only the former touches installments/ledger. No reconciliation job exists.
- 🟠 **Float money** — `parseInt`/`parseFloat` and `parseInt(SUM())` drop paise ([dashboard-stats.js:48](../netlify/functions/dashboard-stats.js#L48)).
- 🟠 **Rounding never reconciled** — `course_fee / N` for N∌{divisors} leaves a residue; months won't sum to the fee.
- 🟠 **Discount is a flat rupee amount only**, applied globally with no reason, cap, or approval trail ([course-registration.html:588](../course-registration.html#L588)).
- 🟠 **Warnings are advisory** — a payment that skips earlier months still commits.
- 🟡 **No transaction reference** captured for UPI/Card/Cheque — reconciliation against a bank statement is impossible.
- 🟡 **Receipt claims "PAID"** even when a due remains ([course-registration.html:1083](../course-registration.html#L1083)).

## Pain points (operational)
- An accountant cannot close the day: there's no "collections today by method" and the two balances can't be trusted for a cash-up.
- Reconciling a student who paid via both paths yields a nonsensical balance.
- Correcting a mis-entered payment means a manual DB edit — there's no reversal/void.

## Opportunities — think like a fintech ledger
- **Single immutable ledger as source of truth.** Every money event (charge, payment, discount, refund, late fee, write-off) is an append-only transaction with a signed amount, method, reference, actor, and timestamp. Balances are *derived*, never stored-and-mutated.
- **Proper money type** — integer paise or `NUMERIC`, one server-side money module.
- **Installment engine** that supports reschedule, pause, custom amounts, and reconciled rounding (residual on the last/first installment).
- **Discounts & scholarships as first-class transactions** with type, reason, approver, and validity — auditable, reportable.
- **Late-fee policy** (grace days, flat/%, cap) that generates a charge transaction when an installment goes overdue.
- **Refunds & voids** as negative transactions, never deletions.
- **Payment method reconciliation** — capture UPI/cheque/txn references; a daily reconciliation screen matches ledger to bank.
- **Online payments** (Razorpay/UPI intent) so students self-pay and the ledger updates via webhook — with idempotency keys to prevent double-posting (a real gap today: double form submit = double registration/payment).
- **Accounting export** (Tally XML / CSV) for the institute's bookkeeper.

## Recommended direction
Re-found billing on an **append-only transaction ledger** with server-computed, correctly-typed money. Collapse the two payment paths into one. Make installments a schedule that the ledger settles against, with reconciled rounding and reschedule support. Layer discounts, scholarships, late fees, and refunds as transaction types. Then add online self-pay via a gateway with webhooks and idempotency.

## Priority
- **🔴 P0:** server-side money, single ledger source-of-truth, fix even-split, fix drift, correct money type, idempotency.
- **🟠 P1:** discounts/scholarships/refunds/late-fees as transactions, reconciliation, txn references.
- **🟡 P2:** online self-pay gateway, accounting export.
