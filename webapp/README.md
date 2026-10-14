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
- Add `DATABASE_URL`, `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL` as environment variables.
- The official Next.js runtime plugin (in `netlify.toml`) handles the rest.

## Moving to Vercel later

Import the repo in Vercel, set **Root Directory = `webapp`**, add the same three env
vars. No code changes — uploaded images live in Postgres, not on the host.

## What changed vs. the old system

- The old base64 "token" (forgeable) is replaced with **signed httpOnly JWT sessions**.
- The 7 Netlify functions are now App Router **route handlers**; the giant
  `admin.html` is React pages under `/admin`.
- All original behaviour is preserved: 5-attempt/15-min login lockout, monthly
  installment generation, payment application, FK-safe cascade delete, dashboard stats.
