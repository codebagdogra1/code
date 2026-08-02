# CODE — Course Registration + Admin (Next.js)

A single Next.js 16 app that combines the **public website** (course registration,
brochure) and the **admin backend** (dashboard, registrations, payments, courses).
It talks to the same PostgreSQL database as the old Netlify-functions version.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4)
- **Prisma 7** with the `@prisma/adapter-pg` driver adapter (serverless-friendly)
- **jose** signed httpOnly JWT sessions + bcrypt password hashing
- Deploys on **Netlify** today; portable to **Vercel** with no code changes

## Project layout

```
src/
  app/
    page.tsx / register / brochure       → public site
    admin/login                          → admin sign-in (outside the shell)
    admin/(dashboard)/                    → protected: dashboard, registrations, courses
    api/
      auth/login | auth/logout           → public
      courses                            → public (active courses)
      register                           → public (create a registration)
      admin/*                            → protected (registrations, payments, dashboard, courses)
  lib/       db (Prisma), auth (JWT), serialize, format, receipts, types
  proxy.ts   route guard for /admin and /api/admin/* (Next 16 renamed middleware→proxy)
prisma/schema.prisma   models mapped to the EXISTING tables via @map/@@map
```

## Setup

1. **Install** (from this `webapp/` folder):
   ```bash
   npm install
   ```

2. **Configure env** — copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — your Postgres connection string (use a **pooled** URL for
     serverless, e.g. Neon's pooler). This is the same database the old app used.
   - `AUTH_SECRET` — a long random string: `openssl rand -base64 32`

3. **Sync Prisma with the live database** (recommended, since the schema here was
   reconstructed from the old SQL). This overwrites `schema.prisma` from the real DB:
   ```bash
   npm run db:pull && npx prisma generate
   ```
   Skip this only if you're creating the database fresh from `schema.prisma`.

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
- Add `DATABASE_URL` and `AUTH_SECRET` as environment variables.
- The official Next.js runtime plugin (in `netlify.toml`) handles the rest.

## Moving to Vercel later

Import the repo in Vercel, set **Root Directory = `webapp`**, add the same two env
vars. No code changes — Prisma's pg adapter and the App Router work as-is.

## What changed vs. the old system

- The old base64 "token" (forgeable) is replaced with **signed httpOnly JWT sessions**.
- The 7 Netlify functions are now App Router **route handlers**; the giant
  `admin.html` is React pages under `/admin`.
- All original behaviour is preserved: 5-attempt/15-min login lockout, monthly
  installment generation, payment application, FK-safe cascade delete, dashboard stats.
