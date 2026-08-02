# 13 — UX Issues

Concrete, observed usability defects in the internal tools (login, registration, admin). The public site is largely exempt — it's the polished half of the product.

## Navigation & information architecture
- **No real navigation.** The admin is a single screen; there are no sections, no breadcrumbs, no way to move between "students," "payments," "courses," "reports" (they don't exist as places). Movement is via `<a href="course-registration.html">` links ([admin.html:616](../admin.html#L616)).
- **Receipt-centric, not student-centric** — you navigate by receipt rows, so a person's history is scattered (see [08](08-Admin-Panel.md)).

## Feedback & states
- **Loading:** only spinners ([admin.html:626-629](../admin.html#L626-L629)); no skeletons, no progress for the multi-page load.
- **Empty:** bare text ("No registrations found," [admin.html:771](../admin.html#L771)); no guidance or CTA.
- **Error:** red text or `alert()`; **no retry**, no error detail, no offline handling ([admin.html:757](../admin.html#L757)).
- **Success:** transient `showAlert` banners that auto-hide after 5s ([course-registration.html:625-627](../course-registration.html#L625-L627)) — easy to miss the receipt number.

## Modals & focus
- Modals are `<div>` overlays injected into the DOM ([admin.html:1890-1899](../admin.html#L1890-L1899)). **No focus trap, no `Esc`-to-close, no return-focus, no `role="dialog"`/`aria-modal`.** Close is click-outside or an `×` button.
- Confirmation via **native `alert`/`confirm`/`prompt`** ([admin.html:1419](../admin.html#L1419), [:1717](../admin.html#L1717)) — unstyled, blocking, and inconsistent with the app.

## Forms
- **Submit-time validation** with one `alert()` per error ([course-registration.html:646-668](../course-registration.html#L646-L668)); no inline messages, no field highlighting beyond focus.
- **DOB** as 3 controls with invalid-date and 2010-ceiling bugs ([course-registration.html:374-375](../course-registration.html#L374-L375)).
- **No autosave/draft**, so a refresh loses everything.
- Course selection is **mouse-only** (click cards); not keyboard-operable.

## Accessibility (largely absent in tools)
- **Icons are emoji** used as the only affordance on action buttons (👁️ 💳 🖨️ 📋 🗑️, [admin.html:792-808](../admin.html#L792-L808)) — screen readers announce emoji names; `title` attrs help sighted mouse users only.
- **No ARIA landmarks/roles**, no `alt` discipline, no skip links.
- **Colour-only status** — Paid/Partial/Pending by badge colour ([admin.html:1484-1495](../admin.html#L1484-L1495)); fails for colour-blind users without the text (text is present, but the month grid relies heavily on colour, [:1829-1846](../admin.html#L1829-L1846)).
- **Contrast** — muted greys on white and white-on-light-purple are borderline against WCAG AA.
- **No focus-visible styling** beyond default; modal focus management absent (above).

## Mobile / responsive
- The **admin registrations table has 10 columns** ([admin.html:648-659](../admin.html#L648-L659)) with no responsive strategy — horizontal scroll or squeeze on phones. Front-desk staff on a tablet/phone will struggle.
- The public site and registration form *are* responsive; the admin is not.

## Consistency
- **Two visual languages** (premium public vs. template internal) — the app doesn't feel like one product ([04](04-Frontend-Audit.md)).
- **Inconsistent controls** — native dialogs mixed with custom banners and overlays.

## Microcopy & trust
- Receipt says **"Payment Status: PAID"** regardless of balance ([course-registration.html:1083](../course-registration.html#L1083)) — actively misleading.
- Destructive delete copy is good (type "DELETE") but the action itself is unsafe (no undo/audit, [05](05-Security.md)).

---

## Strengths
- The **live totals table** during registration is excellent real-time feedback.
- The **month-grid payment selector** with a legend is intuitive and well-considered.
- Delete has **deliberate friction**.
- Transient success/error banners are unobtrusive (when caught).

## Recommended direction
Adopt the [14 — Design System](14-Design-System.md) and rebuild the tools with: a real navigation shell; consistent, accessible modal and dialog components (focus trap, Esc, ARIA); inline form validation; genuine empty/loading/error states with retry; responsive tables (card layout on small screens); non-emoji icons with labels; and WCAG AA contrast + keyboard operability throughout. Fix the misleading receipt status immediately.

## Priority
- **🔴 P0:** misleading "PAID" status; XSS-prone rendering ([05](05-Security.md)).
- **🟠 P1:** accessible modals/dialogs, inline validation, real states, responsive admin.
- **🟡 P2:** full WCAG AA pass, keyboard operability, icon system.
