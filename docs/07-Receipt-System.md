# 07 — Receipt System

## Current implementation

Receipts are **generated on the client** by writing a full HTML document into a popup window and calling `window.print()`. There are **four separate implementations** of essentially the same receipt:

1. Registration receipt — [course-registration.html:765-1105](../course-registration.html#L765-L1105) (`window.open` + `document.write`).
2. Admin reprint — [admin.html generateCourseRegistrationReceipt](../admin.html#L929) (and a **second, duplicate** definition at [:2689](../admin.html#L2689)).
3. Payment receipt — [admin.html generateEnhancedMonthlyReceipt:2367](../admin.html#L2367).
4. Standalone offline makers — [zxrbmw1250.html](../zxrbmw1250.html) and [admission-bkp.html](../admission-bkp.html), which produce receipts **without any database record**.

Receipt numbers: registrations use `CODE-<year>-<6-digit-timestamp>` ([registrations.js:10-15](../netlify/functions/registrations.js#L10-L15)); payments use `PMT-<yyyymm>-<6-digit-timestamp>` ([record-payment.js:9-15](../netlify/functions/record-payment.js#L9-L15)).

The layout itself is competent: institute header with address/phone/email, receipt + student info blocks, a courses table, a totals block, payment method, footer. Print CSS sets A4 and `-webkit-print-color-adjust: exact` ([course-registration.html:800-804](../course-registration.html#L800-L804)).

## What a receipt system should do — gap analysis

| Feature | Today |
|---------|-------|
| Professional layout | ✅ (decent) |
| Printable | ✅ |
| PDF export | ❌ (relies on "Print → Save as PDF") |
| Stored / re-issuable server-side | ❌ (rebuilt in browser each time) |
| QR verification | ❌ |
| Duplicate / "DUPLICATE" marking | ❌ |
| Tax fields (GST/HSN) | ❌ |
| Institute branding (logo) | ⚠️ text only, no logo |
| Email delivery | ❌ |
| WhatsApp delivery | ❌ |
| Download portal (student self-serve) | ❌ |

---

## Strengths
- The printed output is **clean and institute-appropriate** — clear header, itemised courses, admission-fee row, totals, print-optimised CSS.
- Receipt **numbers are generated and stored** on the records, so a receipt is at least identifiable.
- Both a **registration receipt** and a **per-payment receipt** exist conceptually.

## Weaknesses
- 🔴 **Four duplicate implementations** (two of them literally the same function defined twice in `admin.html`) — any change to branding or layout must be made in four places, and they've already diverged.
- 🟠 **Receipts are ephemeral** — never rendered or stored server-side. If the popup is dismissed ([course-registration.html:747](../course-registration.html#L747) offers print via a `confirm()` that, if declined, loses the moment), the staff must reprint from admin. There is no canonical PDF artefact.
- 🟠 **"Payment Status: PAID" is hard-coded** even when a balance remains ([course-registration.html:1083](../course-registration.html#L1083)) — a materially misleading document.
- 🟠 **Offline makers can mint receipts with no DB record** ([zxrbmw1250.html](../zxrbmw1250.html)) — a fraud/reconciliation hazard; a "receipt" is not evidence of a recorded payment.
- 🟡 **No logo, no QR, no tax fields, no duplicate watermark, no delivery** (email/WhatsApp) — students get a printout in person or nothing.
- 🟡 **XSS**: student data is `document.write`-n unescaped (see [05](05-Security.md) S3).

## Pain points
- Reprinting requires opening the admin panel, finding the record, and triggering a popup that browsers may block.
- A student who paid an installment remotely has no way to receive their receipt.
- Because receipts are re-generated from current data, a **reprint can differ from the original** if any underlying value changed — there is no immutable snapshot.

## Opportunities — redesign the receipt as a first-class artefact
- **Server-rendered, immutable receipt** stored at issue time (HTML/PDF snapshot + a stable ID). A reprint returns the *original*, never a recomputation.
- **PDF generation server-side** (e.g. a serverless PDF render) so there's a real downloadable file, not "print to PDF".
- **One templating source** for all receipt types, with the institute **logo** and consistent branding.
- **QR verification** — QR encodes a public verify URL (`/verify/<receipt_id>`) that returns "issued ₹X on <date> to <name>, status <settled/partial>". Kills the offline-maker fraud vector.
- **"DUPLICATE" watermark** on any re-issue; original vs. duplicate is explicit.
- **Tax fields** if/when the institute is GST-registered (GSTIN, HSN/SAC, tax breakup) — designed in now even if hidden.
- **Delivery**: auto-email + one-tap **WhatsApp** send (the institute already lives on WhatsApp — [index.html:168](../index.html#L168)) + a **student download portal**.
- **Accurate status** derived from the ledger, never hard-coded.

## Recommended direction
Make receipts server-issued, immutable, verifiable (QR), and deliverable (WhatsApp/email/portal), from a single branded template. Retire the four client-side copies and the offline makers. This turns the receipt from a printout into a trustworthy financial document and removes an entire class of reconciliation risk.

## Priority
- **🔴 P0:** stop hard-coding "PAID"; escape receipt data (security).
- **🟠 P1:** single server-rendered immutable template + PDF + reprint-original + logo.
- **🟡 P2:** QR verification, WhatsApp/email delivery, student portal download, tax fields.
