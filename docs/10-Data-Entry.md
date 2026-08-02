# 10 — Data Entry

The system's throughput is bounded by one screen: [course-registration.html](../course-registration.html). Front-desk staff live in this form. Every second and every error here multiplies across every enrolment.

## Current implementation

A single long form ([course-registration.html:338-465](../course-registration.html#L338-L465)):
- **Personal info:** full name, phone, email (optional), DOB (3 controls: month `<select>`, day `<input number>`, year `<input number>`), address `<textarea>`.
- **Course selection:** clickable course cards fetched from `courses`, each with Full/Monthly price options ([:498-529](../course-registration.html#L498-L529)).
- **Payment:** method `<select>`, admission fees, discount, amount paid; a live totals table.
- **Submit:** validates required fields, posts, shows the receipt via a `confirm()` popup.

## Field-by-field problems

| Field | Issue | Evidence |
|-------|-------|----------|
| Phone | No format/length validation; becomes a natural key that silently overwrites an existing student | [registrations.js:38-52](../netlify/functions/registrations.js#L38-L52) |
| DOB | Three controls; day accepts 1-31 for every month; year hard-capped at 2010 (`max="2010"`, so anyone born after 2010 can't enrol) | [course-registration.html:374-375](../course-registration.html#L374-L375) |
| Email | Optional, unvalidated beyond `type=email` | [:353](../course-registration.html#L353) |
| Money fields | `parseInt` — decimals silently dropped; no min/logic checks (paid can exceed total) | [:586-591](../course-registration.html#L586-L591) |
| Discount | Flat number, no reason/cap | [:588](../course-registration.html#L588) |
| Duplicate student | No detection surfaced; server silently overwrites | [:no check] |
| Validation timing | All-at-once on submit, one `alert()` at a time, scroll-to-top | [:646-668](../course-registration.html#L646-L668) |

## What fast, safe data entry needs — gap analysis

| Capability | Today |
|-----------|-------|
| Better field grouping | ⚠️ grouped, but one long column |
| Smart defaults | ❌ (admission fee defaults 0) |
| Inline validation | ❌ (submit-time `alert()` only) |
| Auto-complete (returning student) | ❌ |
| Keyboard-first workflow | ❌ (mouse-driven cards) |
| Bulk import | ❌ |
| CSV support | ⚠️ export only, no import |
| Duplicate detection | ❌ (silent overwrite) |
| Draft saving | ❌ |
| Auto-save | ❌ |

---

## Strengths
- **Logical grouping** (personal → courses → payment) and a **live totals table** that updates as you type ([:576-609](../course-registration.html#L576-L609)) — good feedback.
- **Course cards with explicit Full/Monthly pricing** make the plan choice tangible.
- Required-field validation with focus-to-field exists ([:646-653](../course-registration.html#L646-L653)).
- A **responsive layout** for the form on mobile ([:268-280](../course-registration.html#L268-L280)).

## Weaknesses
- 🔴 **Silent duplicate overwrite** — the #1 data-integrity risk in daily use; a mistyped phone clobbers a real student ([registrations.js:43-52](../netlify/functions/registrations.js#L43-L52)).
- 🟠 **DOB entry is slow and buggy** — three fields, invalid dates possible (31 Feb), and a **hard 2010 ceiling** that will reject young enrollees.
- 🟠 **Validation is submit-time and modal** — errors come one `alert()` at a time after the user thinks they're done.
- 🟠 **No returning-student lookup** — re-enrolling an existing student means retyping everything (and risks the overwrite).
- 🟡 **No draft/auto-save** — a browser refresh mid-entry loses everything.
- 🟡 **No bulk/CSV import** — onboarding an existing batch is one-by-one.

## Pain points
- Peak admission season = repetitive typing, no autocomplete, no bulk path.
- The most dangerous action (overwriting a student) has the least friction.
- A long form with end-of-form error reporting causes rework.

## Opportunities — a keyboard-first, forgiving entry experience
- **Returning-student autocomplete:** type a phone/name → match existing students → confirm "Is this <Name>?" before creating/updating. Turn the silent overwrite into an explicit, safe choice.
- **Single-control date picker** with real calendar validation and a sane age range.
- **Inline, real-time validation** with field-level messages; disable submit until valid; summarise remaining errors non-modally.
- **Smart defaults:** remember the last admission-fee amount and payment method per operator; pre-select the most common plan.
- **Keyboard-first:** Tab order that flows top-to-bottom, course selection reachable by keyboard, Enter-to-advance, a "save & new" shortcut for back-to-back admissions.
- **Draft auto-save** to local storage keyed by phone, restored on reload.
- **Bulk CSV import** with a preview, **duplicate detection**, and per-row validation for migrating existing students/batches.
- **Server-side recompute** so the operator can't accidentally create an inconsistent total (also a security fix, [05](05-Security.md) S8).

## Recommended direction
Rebuild the entry form as a **guided, inline-validated, keyboard-first flow** that starts with a **returning-student lookup**, uses smart defaults and auto-save, and hands money math to the server. Add a **bulk CSV importer** with duplicate detection for onboarding and season peaks. This directly raises front-desk throughput and eliminates the silent-overwrite class of data loss.

## Priority
- **🔴 P0:** returning-student lookup + explicit duplicate handling (stops data loss); server-side money.
- **🟠 P1:** inline validation, single date picker, smart defaults, auto-save.
- **🟡 P2:** bulk CSV import, per-operator preferences, keyboard shortcuts.
