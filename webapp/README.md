# CODE — Website + Admin (Next.js)

A single Next.js 16 app that combines the **public website** for the computer centre
(home, courses, offers, events, gallery, about, contact, printable brochure) and the
**admin backend** (dashboard, registrations, payments, receipts, courses, plus the
website content: enquiries, offers, events and gallery photos). One PostgreSQL database.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4)
- **Prisma 7** with the `@prisma/adapter-pg` driver adapter (serverless-friendly)
- **jose** signed httpOnly JWT sessions + bcrypt password hashing
- Deploys on **Netlify** today; portable to **Vercel** with no code changes

## Project layout

```
src/
  app/
    layout.tsx                           → the one root layout (fonts, globals.css)
    (site)/                              → public website (`.site` design world)
      page.tsx, courses, courses/[slug], offers, events, gallery, about, contact, brochure
    admin/login                          → admin sign-in (outside the shell)
    admin/(dashboard)/                   → protected: dashboard, registrations, courses,
                                           enquiries, offers, events, gallery
    admin/(dashboard)/site-actions.ts    → server actions for website content
    api/
      auth/login | auth/logout           → public
      courses                            → public (active courses, JSON)
      contact                            → public (saves an enquiry)
      media/[id]                         → public (serves uploaded images)
      admin/*                            → protected (registrations, payments, courses, register)
  components/site/                       → public website components
  components/admin/                      → website-content managers (offers, events, gallery, enquiries)
  lib/
    site.ts            contact details, hours, map links (single source of truth)
    course-content.ts  per-course copy (summary, syllabus, outcomes) keyed by catalogue name
    content.ts         read models for the public pages
    seo.ts             canonical URL + JSON-LD builders
  src/proxy.ts  route guard for /admin and /api/admin/* (Next 16 renamed middleware→proxy)
prisma/schema.prisma   models mapped to the EXISTING tables via @map/@@map, plus
                       site_media, gallery_images, offers, site_events, enquiries
```

## Editing website content

- **Offers / events / gallery / enquiries** — from `/admin` (nav items 05–08). Public pages
  are cached for 5 minutes and also refreshed immediately after every admin save.
- **Course descriptions & FAQ** — `src/lib/course-content.ts` (keyed by the course name in
  the admin catalogue). Prices, duration and installments always come from the database.
- **Phone, address, hours, map** — `src/lib/site.ts`.
- **Google reviews** — `src/components/site/GoogleReviews.tsx` (verbatim from the listing).

## Setup

1. **Install** (from this `webapp/` folder):
   ```bash
   npm install
   ```

2. **Configure env** — copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — your Postgres connection string (use a **pooled** URL for
     serverless, e.g. Neon's pooler). This is the same database the old app used.
   - `AUTH_SECRET` — a long random string: `openssl rand -base64 32`
   - `NEXT_PUBLIC_SITE_URL` — the public origin (used for canonicals, sitemap, JSON-LD)
   - `GOOGLE_MAPS_API_KEY` (optional) — a Google Cloud key with **Places API (New)**
     enabled. Powers the live Google rating badge and gives the reviews slider the
     five "most relevant" reviews with links. Without it the site shows the curated
     reviews in `src/lib/google-reviews.ts` and the rating constants in `src/lib/site.ts`.
   - `GOOGLE_PLACE_ID` (optional) — pins the listing's Place ID; otherwise it is
     looked up once by text search and cached.
   - `GOOGLE_BUSINESS_*` (optional, five values) — **all** reviews on the listing via
     the Business Profile API. See "All Google reviews" below.

3. **Create / update the tables** (additive — safe to re-run):
   ```bash
   npm run db:push
   ```

4. **Create an admin user** (needed to sign in):
   ```bash
   npm run create-admin -- admin "your-strong-password"
   ```

5. **Run**:
   ```bash
   npm run dev        # http://localhost:3000
   ```

## Deploy on Netlify

- Push this repo. In the Netlify site settings set **Base directory = `webapp`**.
- Add `DATABASE_URL`, `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL` as environment variables
  (plus `GOOGLE_MAPS_API_KEY` and the `GOOGLE_BUSINESS_*` values for live Google reviews).
- The official Next.js runtime plugin (in `netlify.toml`) handles the rest.

## All Google reviews

Google's public Places API returns at most **five** reviews per listing, so the slider
can only show every review through the **Business Profile API**, which is available to
the listing's owner. One-time setup:

1. In [Google Cloud Console](https://console.cloud.google.com/) (the same project as
   the Places key) request Business Profile API access via the
   [prerequisites page](https://developers.google.com/my-business/content/prereqs).
   Google approves this manually; it can take a few days and the quota stays at zero
   until then.
2. **APIs & Services → Library**: enable *Google My Business API*, *My Business Account
   Management API* and *My Business Business Information API*.
3. **OAuth consent screen**: External. Add the Google account that owns the Business
   Profile as a test user, then **publish** the app (while an app is in "testing",
   its refresh tokens expire after seven days).
4. **Credentials → Create credentials → OAuth client ID → Desktop app.** Copy the
   client ID and secret.
5. From `webapp/` run:
   ```bash
   npm run google:reviews-setup
   ```
   It opens a Google sign-in (use the owner account), finds the account and location
   IDs, confirms the review count, and prints the five `GOOGLE_BUSINESS_*` lines to
   add to `.env` and to Netlify's environment variables.

Reviews are cached for six hours. Rating-only reviews (no text) are not shown as cards
but still count towards the total. The curated reviews in `src/lib/google-reviews.ts`
remain the fallback when neither API is configured or Google is unreachable.

## Moving to Vercel later

Import the repo in Vercel, set **Root Directory = `webapp`**, add the same three env
vars. No code changes — uploaded images live in Postgres, not on the host.

## What changed vs. the old system

- The old base64 "token" (forgeable) is replaced with **signed httpOnly JWT sessions**.
- The 7 Netlify functions are now App Router **route handlers**; the giant
  `admin.html` is React pages under `/admin`.
- All original behaviour is preserved: 5-attempt/15-min login lockout, monthly
  installment generation, payment application, FK-safe cascade delete, dashboard stats.
