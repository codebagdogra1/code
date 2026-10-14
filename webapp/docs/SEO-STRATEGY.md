# CODE — Search & AI-Search Growth Strategy

**A master implementation roadmap for turning code into an AI-ready, search-first platform**

| | |
|---|---|
| **Prepared for** | CODE — Computer & Digital Excellence, Bagdogra, West Bengal |
| **Scope** | `webapp/` — Next.js 16 App Router application (public marketing site + admin) |
| **Audit date** | 2026-08-07 |
| **Document status** | v1 — baseline audit + roadmap. Strategy only; contains no code. |
| **Owner (proposed)** | Product/Eng lead + one content owner |

> **A note on honest scope.** CODE is *one* computer-training institute serving one region of North Bengal. This document deliberately does **not** promise "millions of monthly organic visitors" — that would be a lie for this business, and chasing it would burn the team's time. The realistic, and genuinely valuable, prize here is **owning every commercial and informational search for computer courses across the Bagdogra–Siliguri–Matigara corridor and the Darjeeling/Jalpaiguri districts**, plus **being the answer AI assistants cite** when a parent asks "which computer course should my child take in Siliguri." That is winnable, defensible, and compounds. The framework below is enterprise-grade; the *targets* are sized to the real business.

---

## Table of contents

1. [Executive Summary](#1-executive-summary)
2. [Complete Technical SEO Audit](#2-complete-technical-seo-audit)
3. [AI Search Optimization (AEO / GEO)](#3-ai-search-optimization-aeo--geo)
4. [Schema Strategy](#4-schema-strategy)
5. [Semantic SEO Strategy](#5-semantic-seo-strategy)
6. [Content Strategy](#6-content-strategy)
7. [E-E-A-T Improvements](#7-e-e-a-t-improvements)
8. [Technical Performance](#8-technical-performance)
9. [Internal Linking Strategy](#9-internal-linking-strategy)
10. [AI Content Readiness](#10-ai-content-readiness)
11. [Conversion SEO](#11-conversion-seo)
12. [Competitive Strategy](#12-competitive-strategy)
13. [Prioritized Roadmap](#13-prioritized-roadmap)
14. [Appendix: Measurement & Governance](#14-appendix-measurement--governance)

---

## 1. Executive Summary

### 1.1 Current SEO maturity: **Level 0 of 5 — "Invisible"**

The site is technically live but is, for search purposes, a blank surface. Concretely, from the codebase:

- **Every public page ships only a `<title>`.** There is not a single meta description, canonical tag, Open Graph tag, or Twitter Card anywhere in `src/app/(edu)/`.
- **No `robots.txt` and no sitemap** exist (no `robots.ts`, `sitemap.ts`, or static files in `public/`).
- **Zero structured data.** No JSON-LD is emitted on any route. Google and AI engines have no machine-readable statement of what CODE is, where it is, or what it sells.
- **`metadataBase` is unset**, so even if OG/canonical tags were added they would resolve to broken relative URLs.
- **The real product — the course catalogue — is not indexable.** Course names, prices, and durations live in Postgres (`Course` model), but `/courses` renders a static WordPress template mirror (`EduPage slug="courses"`). There are **no per-course URLs**, so the exact pages that would rank for "DCA course fees Siliguri" do not exist.
- **The homepage is a ported WordPress "EduSmart" theme** with ~40 stylesheets and multi-megabyte PNG logos in the critical path — a Core Web Vitals liability before a single visitor arrives.

In plain terms: a well-run competitor with a Google Business Profile and three blog posts currently outranks CODE on every query, because CODE has given search engines nothing to work with.

### 1.2 Biggest opportunities (ranked by ROI)

| # | Opportunity | Why it's the prize |
|---|---|---|
| 1 | **Individual, schema-rich course pages** (`/courses/dca`, `/courses/adca`, `/courses/tally`, …) generated from the DB you already have | This is the single highest-leverage move. It converts data you already own into the pages that capture high-intent commercial searches ("DCA course fees near Bagdogra"). Each page can carry `Course`/`Offer` schema and feed AI answers directly. |
| 2 | **Local SEO foundation** — `EducationalOrganization` + `LocalBusiness` schema, NAP consistency, Google Business Profile alignment | ~40–60% of this institute's winnable traffic is "near me" / geo-modified. Local pack + map presence is where the enrolments are. |
| 3 | **AEO/GEO answer content** — FAQ, glossary, and "which course" comparison content | Parents and students increasingly ask ChatGPT/Gemini/AI Overviews before they search. Being the cited source is a durable moat competitors won't have. |
| 4 | **Technical foundation** — metadata, sitemap, robots, canonicals | Cheap, fast, unblocks everything else. |
| 5 | **Performance** — replace the WordPress asset bloat on the marketing routes | Directly moves CWV, which is both a ranking input and a conversion input on the mobile connections your audience uses. |

### 1.3 Biggest risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Admin surface (`/admin`, `/admin/login`) indexed or leaked.** `proxy.ts` gates access but emits no `noindex`; the login page is crawlable and could rank for the brand, and any receipt/registration URL that ever leaks is real student PII. | **High** | `noindex` all `(main)` non-marketing routes; `Disallow` in robots; never expose receipt URLs publicly. See §2. |
| **Thin/duplicate content from the template mirror.** Several `(edu)` routes render near-identical template scaffolding, risking "thin content" and cannibalization. | Medium | Give each page a unique H1, intro, and purpose; canonicalize; consolidate or `noindex` placeholder pages (`coming-soon`). |
| **Fabricated trust signals.** `PRODUCT.md` is explicit: *no testimonials, benchmarks, or customer counts exist — do not invent them.* E-E-A-T must be built from real facts (years operating, real courses, real address), never invented reviews. | **High (brand/legal)** | §7 uses only verifiable claims. |
| **Two root layouts, inconsistent `lang`** (`en-US` on `(edu)`, `en` on `(main)`) and full reloads between worlds. | Low–Medium | Standardize `lang`, ensure crawlable HTML on both. |

### 1.4 Expected organic growth potential (honest, banded)

Assuming disciplined execution of P0–P1 over ~4 months and steady content thereafter:

- **Months 0–3:** From effectively 0 indexed value → full technical foundation + local presence. Expect to start ranking for **brand + long-tail course/geo terms**. Realistic early state: **low hundreds of organic sessions/month**, high intent.
- **Months 3–9:** Course pages + local pack + first AI citations. **Mid-hundreds to low-thousands of sessions/month** is a credible band for this catalogue and geography.
- **Months 9–18:** Topical authority on "computer courses in North Bengal" + review velocity → **local category leadership**. The ceiling is bounded by regional search volume, not by effort — which is exactly why AEO and conversion optimization matter more than chasing raw volume.

**The KPI that actually matters is enrolment enquiries, not sessions.** A page that ranks #1 for "ADCA course Bagdogra fees" and converts is worth more than 10,000 informational pageviews.

### 1.5 Technical debt (SEO-relevant)

- WordPress "EduSmart" template carried over verbatim: ~40 stylesheets, inline WP CSS blocks, `wp-*` classes, WP lazy-loading — none of it uses `next/image` or Next font optimization on the `(edu)` routes.
- Multi-megabyte unoptimized PNGs in `public/` (`CODE Logo.png` 1.5 MB, `code_bg_transparent.png` 1.3 MB, `logo.png` 1.3 MB).
- No shared metadata utility; each page hand-rolls a bare `title`.
- Course data and course *presentation* are decoupled — the DB is not wired to public rendering.

### 1.6 Competitive positioning

Local computer institutes in the Siliguri/Bagdogra market typically compete on a Google Business Profile + a Facebook page + a thin WordPress site. **None of them will have schema-rich course pages, an FAQ/glossary answer layer, or AEO content.** This is a wide-open, low-cost moat. CODE can become the *structured, machine-readable* authority in a market where everyone else is unstructured. That is a durable, compounding advantage.

---

## 2. Complete Technical SEO Audit

Format per finding: **Priority · Problem · Why it matters · Recommended solution · Estimated impact.**
Priorities: **P0** launch-blocker · **P1** high · **P2** medium · **P3** nice-to-have.

### 2.1 Metadata, titles, descriptions

**[P0] No meta descriptions on any public page.**
*Problem:* `src/app/(edu)/*/page.tsx` set only `title`. `description` appears once, on the `(main)` layout (admin), where it's useless.
*Why it matters:* The description is the SERP sales copy and a strong CTR lever; AI engines also use it as a summary hint. Absent, Google auto-generates from thin template text.
*Solution:* Add a unique, benefit-led, ~150-char `description` to every indexable route via a shared metadata helper. Include primary keyword + location.
*Impact:* High CTR uplift on existing impressions; zero ranking risk.

**[P0] Titles are generic and un-targeted.**
*Problem:* `"Courses — CODE"`, `"About Us — CODE"`, `"Gallery — CODE"`. The homepage title is decent (`"Computer & Digital Excellence | Best Computer centre in Bagdogra"`) but "Best" is a subjective claim to soften.
*Why it matters:* The title is the #1 on-page ranking and CTR signal.
*Solution:* Template titles as `{Primary Keyword} in {Location} | CODE`. E.g. `"Computer Courses in Bagdogra & Siliguri | CODE"`, `"DCA Course — Fees, Syllabus & Duration | CODE"`. Keep ≤ 60 chars.
*Impact:* High.

**[P1] No `metadataBase` set.**
*Problem:* Unset in both root layouts.
*Why it matters:* Canonical and OG URLs will render relative/broken once added; social shares and canonical signals fail silently.
*Solution:* Set `metadataBase` to the production origin (env-driven) in each root layout.
*Impact:* Foundational — unblocks canonicals/OG.

### 2.2 Canonicals

**[P0] No canonical tags anywhere.**
*Why it matters:* With a WordPress template heritage, trailing-slash, `www`, and query-param variants are easy to generate; without a self-referencing canonical, ranking signals split and duplicates get indexed.
*Solution:* Emit a self-referencing `alternates.canonical` on every indexable route. Decide one host + one slash convention and 301 the rest.
*Impact:* High — protects against silent duplicate dilution.

### 2.3 Robots (directives + file)

**[P0] No `robots.txt`.**
*Solution:* Add `src/app/robots.ts` — `Allow` public routes, `Disallow: /admin`, `/api/`, receipt paths; reference the sitemap URL.
*Impact:* High — controls crawl budget and keeps private paths out.

**[P0] Admin and login pages have no `noindex`.**
*Problem:* `proxy.ts` protects `/admin/**` behavior but sends no indexing directive; `/admin/login` is reachable and indexable.
*Why it matters:* Login pages ranking for brand terms is a poor result; any receipt/registration URL leaking is a **student-PII exposure**, not just an SEO issue.
*Solution:* Add `robots: { index: false, follow: false }` metadata to the `(main)` admin subtree; enforce via robots.txt too (defense in depth).
*Impact:* High (privacy + brand).

**[P2] `coming-soon` page is indexable.**
*Solution:* `noindex` it, or remove it from the sitemap until it has real content.

### 2.4 Sitemap

**[P0] No sitemap.**
*Solution:* Add `src/app/sitemap.ts` that emits static routes **plus dynamically generated course URLs** from the `Course` table (`where isActive`). Include `lastModified`. Submit in Search Console + Bing Webmaster.
*Impact:* High — accelerates discovery, especially for the new course pages.

### 2.5 Open Graph & Twitter Cards

**[P1] No OG or Twitter tags on any page.**
*Why it matters:* WhatsApp is the institute's primary enquiry channel (`PRODUCT.md`). Links shared to WhatsApp/Facebook currently render with no title, image, or description — a direct conversion leak in the exact channel the business relies on.
*Solution:* Default OG/Twitter in each root layout + per-page overrides; generate a branded OG image (static or `opengraph-image`). Course pages get course-specific OG.
*Impact:* High for social/WhatsApp CTR; the cheapest conversion win available.

### 2.6 Structured data

**[P0] Zero JSON-LD anywhere.** Full plan in §4. This is the biggest AEO/GEO gap.

### 2.7 Heading hierarchy

**[P2] Template-inherited heading structure unaudited; likely multiple/again-styled H1s.**
*Why it matters:* One clear H1 per page stating the page's topic + location is a primary relevance and passage-ranking signal.
*Solution:* Audit each `(edu)` page for exactly one H1 carrying the target phrase; demote decorative headings.
*Impact:* Medium.

### 2.8 Internal linking

**[P1] No deliberate internal linking; only template nav/footer.**
*Why it matters:* Internal links distribute authority and define topical relationships — critical once course pages and blog content exist. See §9.
*Impact:* High (compounds).

### 2.9 Crawlability & indexability

**[P1] Course catalogue is not crawlable HTML.** `/courses` renders a static mirror; the DB catalogue is invisible to crawlers. **This is the central indexability failure** — the most valuable content isn't in the index at all.
*Solution:* Server-render course pages (see §4/§6). Prefer static generation or ISR so bots get full HTML.
*Impact:* Very high.

### 2.10 URL structure

**[P2] Clean but incomplete.** Existing routes are readable (`/about`, `/courses`, `/blog`). Missing: the `/courses/{slug}` hierarchy and topic-hub paths.
*Solution:* Adopt `/courses/{course-slug}`, `/guides/{slug}`, `/glossary/{term}`. Stable, lowercase, hyphenated slugs; never change them without a 301.
*Impact:* Medium (foundational for scale).

### 2.11 Pagination

**[P3] Not yet relevant** (one blog post). When the blog grows, use crawlable `<a href>` pagination (not JS-only) and self-referencing canonicals per page.

### 2.12 Breadcrumbs

**[P1] None.** Add visible breadcrumbs + `BreadcrumbList` schema on course pages, guides, blog posts. Improves SERP appearance, internal linking, and AI context.
*Impact:* Medium-high.

### 2.13 Redirects

**[P2] Good start, one gap.** `next.config.ts` 301s legacy `.html` URLs — well done. But confirm host/slash canonicalization redirects (`www`↔apex, trailing slash) exist at the platform edge.
*Impact:* Medium.

### 2.14 Performance & Core Web Vitals

**[P1] WordPress asset bloat on marketing routes.** ~40 stylesheets + inline WP CSS via `EduHead`; multi-MB PNGs. LCP and INP on mobile (your audience's context) are at risk.
*Solution:* See §8 — purge unused CSS, convert images to `next/image` + AVIF/WebP, compress the logos (1.5 MB → <50 KB), inline critical CSS.
*Impact:* High (ranking + conversion).

### 2.15 Lazy loading

**[P2] WP-style lazy-loading is carried over but not applied to the LCP image.** Ensure the hero/LCP image is **eager**; lazy-load only below-the-fold media.
*Impact:* Medium (LCP).

### 2.16 Image optimization

**[P1] Unoptimized PNGs, no `next/image` on `(edu)`.** See §8. Add descriptive `alt` text (also an accessibility + image-search win).
*Impact:* High.

### 2.17 Accessibility (SEO-adjacent)

**[P2] Unaudited.** Alt text, color contrast, focus order, form labels. Accessibility overlaps heavily with crawlability and E-E-A-T signals.
*Impact:* Medium.

### 2.18 Mobile optimization

**[P1] Verify.** Confirm a correct `viewport` meta is emitted (Next default), tap targets, and no horizontal scroll on the ported template. Google is mobile-first; this audience is mobile-majority.
*Impact:* High.

---

## 3. AI Search Optimization (AEO / GEO)

**Goal:** be the source AI engines *cite* when someone asks about computer courses in North Bengal. AI answers reward clear entities, direct answers, structured data, and citable facts — precisely the things CODE lacks today.

### 3.1 Engine-by-engine roadmap

| Engine | What it rewards | CODE's priority actions |
|---|---|---|
| **Google AI Overviews** | Passage-level clarity, FAQ/HowTo schema, entity consistency, strong local signals | Course FAQ schema; answer-first course/guide copy; `EducationalOrganization` + local NAP consistency |
| **ChatGPT (search)** | Well-structured, citable pages; clear headings; unambiguous facts | Fact-dense course pages with explicit fee/duration/eligibility; a glossary of terms (DCA, ADCA, Tally, etc.) |
| **Gemini** | Google entity graph + freshness | Google Business Profile + schema alignment; keep course data current |
| **Claude** | Clean semantic HTML, direct definitions, no fluff | Definition blocks, comparison tables, honest scoped claims |
| **Perplexity** | Citable, sourced, recently-updated pages | Author/organization attribution, `dateModified`, references |
| **Copilot** | Bing index + schema | Submit to Bing Webmaster; same schema layer serves it |

### 3.2 AEO/GEO task list

- **Entity optimization:** Establish "CODE — Computer & Digital Excellence" as a consistent named entity everywhere (schema `Organization.name`, `sameAs` to real social/GBP profiles, identical NAP). Never vary the name.
- **Semantic relationships:** Explicitly relate entities — *CODE* → *offers* → *DCA course* → *teaches* → *MS Office, Tally, DTP*. Encode via schema and prose.
- **Topical authority:** Cover the "computer courses" topic exhaustively for this region (see §5 clusters).
- **Question–answer architecture:** Every course and guide page answers the real questions ("What is the DCA course fee?", "How long is ADCA?", "Is Tally certification valuable?") as explicit Q&A.
- **Knowledge-graph readiness:** Complete `Organization`/`EducationalOrganization` schema with logo, address, `geo`, `sameAs`, `ContactPoint` → this is what populates a Knowledge Panel.
- **Citation optimization:** State facts atomically and quotably ("The DCA course at CODE runs for 6 months and costs ₹X.") so AI can lift them cleanly.
- **Passage ranking:** Use descriptive H2/H3 sub-heads so individual passages can rank/answer independently.
- **Content chunking:** Short, self-contained sections; one idea per block; front-load the answer.
- **AI-friendly page structure:** Answer → detail → context. Tables for comparisons, lists for steps/eligibility.
- **Conversational search:** Target natural-language phrasings ("which computer course is best for a beginner in Siliguri").
- **Retrieval optimization:** Keep pages focused and de-duplicated so the right chunk is retrievable.
- **Context windows:** Keep each page's core facts near the top; don't bury the fee below 1,500 words of theme filler.
- **FAQ strategy:** Real FAQs per course + a central FAQ hub, all with `FAQPage` schema. See §6/§10.
- **Natural-language optimization:** Write how parents/students actually speak, not marketing-ese.

---

## 4. Schema Strategy (JSON-LD)

Implement JSON-LD via a small set of typed helpers, injected server-side. Below: **where · required props · recommended props · priority · benefit.**

### 4.1 Global (every page) — **P0**

**`Organization` / `EducationalOrganization`** (sitewide, in the `(edu)` root layout)
- *Required:* `name` ("CODE — Computer & Digital Excellence"), `url`, `logo`.
- *Recommended:* `description`, `address` (`PostalAddress`, Bagdogra), `email`/`telephone`, `sameAs` (real Facebook/Instagram/GBP), `areaServed`, `foundingDate` (if verifiable).
- *Benefit:* Knowledge Panel eligibility; the anchor entity all AI engines resolve to.

**`WebSite`** (sitewide) with `potentialAction` → **`SearchAction`** (once on-site search exists)
- *Benefit:* Sitelinks search box eligibility; declares the site entity.

**`LocalBusiness`** (or the `EducationalOrganization` doubling as one) — **P0**
- *Required:* `name`, `address`, `geo` (lat/long), `openingHours`, `telephone`.
- *Benefit:* Local pack + map relevance; this is where enrolment traffic converts.

### 4.2 Homepage — **P1**

- **`WebPage`** + reference to the `Organization`.
- **`ItemList`** of featured courses (each linking to its course page).
- *Benefit:* Helps engines understand the site's core offering at a glance.

### 4.3 Course pages (`/courses/{slug}`) — **P0, highest value**

- **`Course`**: `name`, `description`, `provider` (→ the Organization).
- **`Course.hasCourseInstance`** (`CourseInstance`): `courseMode` (onsite), `location`, `courseWorkload`/`duration` (from `Course.duration`).
- **`Offer`**: `price` (`Course.fullPrice`), `priceCurrency: "INR"`, `availability`, `category`. Represent the monthly-installment option honestly (`priceSpecification`).
- **`BreadcrumbList`**.
- *Optional:* `FAQPage` for course-specific FAQs; `AggregateRating` **only if real, verifiable reviews exist** — do **not** fabricate (per `PRODUCT.md`).
- *Benefit:* Rich course results, price visibility, and the exact structured facts AI Overviews/ChatGPT quote. **Build this first.**

### 4.4 Courses listing (`/courses`) — **P1**
- **`CollectionPage`** + **`ItemList`** of `Course` items.
- *Benefit:* Signals a curated catalogue; distributes crawl equity to course pages.

### 4.5 Blog / guides — **P1**
- **`BlogPosting`** / **`Article`** / **`TechArticle`** (guides): `headline`, `datePublished`, `dateModified`, `author` (→ `Person`), `image`, `publisher`.
- **`BreadcrumbList`**.
- *Benefit:* Article rich results, freshness signals, author E-E-A-T, Perplexity/Copilot citation.

### 4.6 FAQ & glossary — **P1**
- **`FAQPage`** on FAQ hub and per-course FAQs.
- **`DefinedTerm`** / **`DefinedTermSet`** on the glossary (DCA, ADCA, Tally, DTP, MS Office…).
- *Benefit:* FAQ rich results + prime AEO fodder ("People Also Ask", AI answers).

### 4.7 Contact / About — **P1**
- **`ContactPoint`** (phone, WhatsApp, email, `contactType: "admissions"`), **`AboutPage`**.
- *Benefit:* Reinforces the local entity and trust.

### 4.8 Navigation & media — **P2**
- **`SiteNavigationElement`** for primary nav; **`ImageObject`** for key images; **`VideoObject`** if/when demo or testimonial video exists; **`Speakable`** on FAQ answers for voice.

### 4.9 Not applicable / defer
- **`Product`/`Review`/`AggregateRating`** — only with real reviews. **`Event`** — only for real open-day/admission events. **`Dataset`** — n/a. Never emit schema for data that doesn't exist; false schema is a manual-action risk.

---

## 5. Semantic SEO Strategy

### 5.1 Core entity map

```
CODE (EducationalOrganization, Bagdogra)
├── offers → Courses
│   ├── DCA (Diploma in Computer Applications)
│   ├── ADCA (Advanced DCA)
│   ├── Tally / Accounting
│   ├── DTP / Design
│   ├── MS Office / Basic Computer
│   └── [other real catalogue courses]
├── located in → Bagdogra ∈ Siliguri ∈ Darjeeling district ∈ North Bengal
├── teaches → Skills (accounting, office productivity, design, programming basics)
└── serves → audiences (students, job-seekers, parents)
```
*(Populate leaf courses from the real `Course` table — do not invent courses.)*

### 5.2 Topic clusters (hub → spokes)

| Pillar (hub) | Supporting spokes |
|---|---|
| **Computer courses in Bagdogra/Siliguri** (pillar) | Each `/courses/{slug}` page; "which course for X" comparisons |
| **DCA course** | fees, syllabus, duration, eligibility, career scope, DCA vs ADCA |
| **Tally / accounting course** | Tally syllabus, GST in Tally, jobs after Tally, Tally vs manual accounting |
| **Career & skills** | "computer skills for government jobs", "best course after 12th in Siliguri", "typing/CCC" |
| **Local guides** | "computer institutes in Siliguri — how to choose", admission process, fee/installment guidance |

### 5.3 Parent–child & internal linking

- Pillar links **down** to every spoke; every spoke links **up** to its pillar and **laterally** to sibling courses ("DCA" ↔ "ADCA").
- Courses listing → each course; each course → related guides and FAQ. See §9.

### 5.4 Search-intent mapping

| Intent | Example queries | Target page |
|---|---|---|
| Commercial (high value) | "DCA course fees Bagdogra", "computer course near me Siliguri" | Course pages, `/courses`, homepage |
| Informational | "what is ADCA course", "DCA vs ADCA difference" | Guides, glossary, FAQ |
| Navigational | "CODE computer institute Bagdogra" | Homepage, About |
| Comparative | "best computer institute in Siliguri" | Comparison/guide (honest, non-defamatory) |

### 5.5 Long-tail, question & PAA opportunities

Cluster the real questions (validate against Search Console once live): *"Is DCA course good for jobs?", "How many months is ADCA?", "Which computer course has scope in West Bengal?", "computer course fees monthly installment", "beginner computer classes near Bagdogra"*. Each becomes an FAQ item and/or an H2 on the relevant page.

---

## 6. Content Strategy

**Principle:** depth over volume. For a single-institute local business, **10 excellent, structured pages beat 100 thin ones.** Every page must earn its place with real information a prospect needs.

### 6.1 Content roadmap (build order)

| Tier | Pages | Notes |
|---|---|---|
| **Foundation (P0)** | Per-course pages (`/courses/{slug}`) from the DB; upgraded `/courses` catalogue; upgraded homepage; real About; real Contact | The commercial core. Real fees, durations, syllabus outlines, eligibility, installment options. |
| **Answer layer (P1)** | Central **FAQ** hub; **Glossary** (DCA, ADCA, Tally, DTP, CCC, MS Office…); 3–5 **guides** ("How to choose a computer course", "DCA vs ADCA", "Best course after 12th") | AEO/GEO engine. |
| **Authority layer (P2)** | Case-style **success stories** *(only real ones — no fabrication)*; **blog** on a light, sustainable cadence; **downloadable syllabus/brochure** as a lead magnet | Builds E-E-A-T + links. |
| **Evergreen/seasonal (P3)** | Admission-season landing content; "new batch starting" updates | Aligns to enrolment cycles. |

### 6.2 Page types explicitly in scope

Landing (homepage + course pages), Feature/benefit sections, **Comparison** pages (DCA vs ADCA), **Use-case** ("computer skills for bank jobs"), FAQ, Glossary, Guides, Success stories (real), Resources (syllabus PDF, brochure), Blog.

### 6.3 Explicitly deferred / out of scope
"Alternative to competitor X" pages (risky/defamatory for a small local brand), Industry vertical pages, a full Help Center/Docs (this isn't a SaaS), Templates. Revisit only if data justifies.

### 6.4 Topic calendar (lightweight)
Publish 1 substantial guide + refresh course pages **monthly**. Tie one piece to each admission season. Sustainability > velocity; a stale blog signals a stale institute.

---

## 7. E-E-A-T Improvements

> **Constraint (from `PRODUCT.md`): no testimonials, benchmarks, customer counts, or press exist — do not invent them.** Every trust signal below must be *verifiable fact*. Fabricated reviews/ratings are a policy violation and a manual-action risk.

| Signal | Action | Basis |
|---|---|---|
| **Experience** | State real, verifiable facts: years operating, real courses taught, real address, real batches. Photos of the actual centre/classroom. | Real |
| **Expertise** | Real instructor/founder bio(s) with genuine credentials; `Person`/`Author` schema. Only real qualifications. | Requires input from owner |
| **Authority** | Consistent NAP across site + Google Business Profile + real social profiles (`sameAs`). Local citations/directories. | Real |
| **Trust** | Clear Contact (address, phone, WhatsApp, hours, map), transparent fees, an editorial/updated-date on content, privacy policy, and honest scoped claims. | Real |
| **Author pages** | A real `/about` with the founder/instructors; link articles to author `Person`. | Requires input |
| **Editorial policy** | A short "how we keep course info accurate" note + visible `dateModified`. | Buildable |
| **Citations/references** | When guides cite facts (e.g., government job eligibility), link authoritative sources. | Buildable |
| **Social proof** | Collect **real** Google reviews going forward (process, not fabrication); surface only when genuine. | Future |
| **Policies** | Privacy policy (needed anyway — you handle student PII), terms, fee/refund clarity. | P1, also compliance |

**Soften subjective superlatives.** "Best Computer centre in Bagdogra" in the homepage title should become a defensible phrasing ("Computer & Digital Excellence — Computer Courses in Bagdogra") unless "best" is substantiated by a real, citable award.

---

## 8. Technical Performance

Target **Core Web Vitals "Good"** on mobile: LCP < 2.5 s, INP < 200 ms, CLS < 0.1.

| Area | Task | Priority |
|---|---|---|
| **Images** | Convert PNGs → AVIF/WebP via `next/image`; compress the 1.3–1.5 MB logos to <50 KB; explicit width/height to kill CLS; descriptive `alt`. | P1 |
| **LCP** | Identify hero/LCP element; mark it eager + `priority`; preload the LCP image and hero font. | P1 |
| **CLS** | Reserve space for images/embeds; avoid late-injected banners. | P1 |
| **INP** | Audit the ported WP JS (`EduScripts`); drop unused jQuery/plugins; defer non-critical scripts. | P2 |
| **CSS** | The ~40 EduSmart stylesheets are the biggest render-blocker. Audit with coverage tooling; purge unused; inline critical CSS; load the rest async. | P1 |
| **JS / hydration** | Keep marketing pages as static/server components; ship minimal client JS. Course pages should be static/ISR, not client-fetched. | P1 |
| **Fonts** | `(main)` already self-hosts via `next/font` — good. Do the same on `(edu)` (remove any Google Fonts CDN calls in the template head); `font-display: swap`. | P2 |
| **Caching / edge** | Static-generate/ISR public pages so they serve from CDN edge; long-cache immutable assets. | P1 |
| **Compression** | Ensure Brotli/gzip at the platform (Netlify/Vercel default — verify). | P3 |
| **Preloading** | Preconnect/preload only what's critical; remove template's speculative preloads. | P3 |

*Framework note:* the prompt mentions Astro — **this project is Next.js 16**, so optimizations are Next-specific (App Router static generation, `next/image`, `next/font`, route-group-scoped CSS).

---

## 9. Internal Linking Strategy

**Hub-and-spoke, enforced in code so it can't rot.**

- **Hub pages:** `/courses` (catalogue hub) and each pillar guide. Hubs link to every relevant spoke.
- **Contextual links:** In course/guide prose, link the first mention of a related course/term to its page (e.g., "…builds on the **DCA course**…").
- **Related pages:** Every course page ends with "Related courses" (siblings) + "Helpful guides".
- **Navigation:** Ensure primary nav exposes Courses, About, Contact, Blog/Guides as crawlable `<a href>` (not JS-only). Add `SiteNavigationElement` schema.
- **Breadcrumbs:** Home → Courses → {Course}, with schema (see §2.12/§4).
- **Anchor text:** Descriptive and varied ("DCA course fees", "Advanced DCA syllabus") — never "click here".
- **Footer:** A curated footer with top courses + key pages (site-wide equity + UX), not a link dump.
- **Sidebar:** On guides/blog, a "Popular courses" + "Related reading" block.
- **Orphan prevention:** Every course page must be reachable from `/courses` and the sitemap.

---

## 10. AI Content Readiness

Make every page trivially quotable by an AI engine:

- **Answer-first formatting:** Lead each section with the direct answer, then elaborate. ("The DCA course at CODE takes 6 months. It covers…")
- **Structured sections:** Consistent H2/H3 with question-shaped headings.
- **Definition blocks:** For every term (DCA, ADCA, Tally…), a one-sentence definition an AI can lift → also `DefinedTerm` schema.
- **Comparison tables:** DCA vs ADCA; course-by-course fee/duration/eligibility. Tables are highly extractable.
- **Lists:** Eligibility, what-you'll-learn, career outcomes as scannable lists.
- **Entity-rich writing:** Name courses, tools, and the location explicitly and consistently.
- **Citation readiness:** Atomic, self-contained factual sentences; visible `dateModified`.
- **Snippet / featured-snippet optimization:** A concise 40–55-word answer right under question H2s.
- **Zero-click / AI-Overview optimization:** Accept that some queries answer on the SERP; make sure *your* facts and brand are the ones shown, with a compelling reason to click through (fees, enrol CTA).

---

## 11. Conversion SEO

Rankings without enquiries are vanity. The institute's enquiry path is **WhatsApp** (`PRODUCT.md`) — optimize for it and start measuring it.

| Lever | Action |
|---|---|
| **Trust** | Real address + map + phone + hours above the fold; centre photos; transparent fees. |
| **CTA placement** | Persistent "Enquire on WhatsApp" + "Enrol / Visit" CTA on every course page (top, mid, end). Pre-fill the WhatsApp message with the course name. |
| **Information hierarchy** | Fee, duration, eligibility, "what you'll learn", next batch — in that order, before theme filler. |
| **UX** | Fast mobile pages (§8), tap-friendly CTAs, no intrusive interstitials. |
| **Engagement / dwell** | Complete answers keep users on-page; comparison tables and FAQs reduce pogo-sticking. |
| **Bounce reduction** | Match page intent to query; put the answer where the eye lands. |
| **Measurement (critical gap)** | Today enquiries route to WhatsApp with **no capture** (`PRODUCT.md`). Add click tracking on WhatsApp/call CTAs (GA4 events) so organic → enquiry is measurable. Consider a lightweight, consented lead capture later (currently out of scope — get owner sign-off). |

---

## 12. Competitive Strategy

**Likely competitor posture (regional computer institutes):** a Google Business Profile, a Facebook page, and a thin WordPress site with no schema, no per-course pages, no FAQ/answer content, and weak performance.

| Gap to exploit | CODE's move |
|---|---|
| **Content gap** | No competitor has fact-dense, per-course pages with fees/syllabus/eligibility. Build them. |
| **Schema gap** | None will have `Course`/`Offer`/`FAQ`/`LocalBusiness` JSON-LD. This alone can win rich results + AI citations. |
| **Authority gap** | Consistent NAP + real reviews velocity + guides → out-authority thin sites. |
| **Keyword gap** | Own the long tail ("DCA course monthly installment Siliguri", "computer course after 12th North Bengal") competitors ignore. |
| **Entity gap** | Be the only clearly-defined machine-readable entity → Knowledge Panel + AI resolve to CODE. |
| **Performance gap** | A fast mobile site beats their WordPress bloat on CWV and conversion. |

**Do not** publish attack/"alternative to competitor" pages — for a small local brand this invites reputational and legal risk with little upside.

---

## 13. Prioritized Roadmap

Each task: **effort** (S ≤0.5d, M ≤2d, L >2d) · **impact** · **dependencies** · **owner** · checkbox.

### P0 — Critical (foundation / launch-blockers)

- [ ] **Set `metadataBase` + shared metadata helper** — S · High · none · Eng
- [ ] **Add unique title + meta description to every indexable page** — M · High · metadata helper · Eng + Content
- [ ] **Add self-referencing canonical to all indexable routes** — S · High · metadataBase · Eng
- [ ] **Create `robots.ts`** (allow public, disallow `/admin`, `/api`, receipts; link sitemap) — S · High · none · Eng
- [ ] **`noindex` the entire admin `(main)` subtree + confirm no receipt/PII URL is public** — S · High (privacy) · none · Eng
- [ ] **Create dynamic `sitemap.ts`** (static routes + course URLs from DB) — M · High · course pages · Eng
- [ ] **Build per-course pages `/courses/{slug}` from the `Course` table** (SSG/ISR, real fees/duration/syllabus) — L · **Very High** · DB access · Eng + Content
- [ ] **Add `Organization`/`EducationalOrganization` + `LocalBusiness` JSON-LD sitewide** — M · High · real NAP from owner · Eng
- [ ] **Add `Course` + `Offer` JSON-LD to course pages** — M · Very High · course pages · Eng
- [ ] **Confirm one clean H1 per page** across `(edu)` routes — S · Medium · none · Eng

### P1 — High impact

- [ ] **Default + per-page Open Graph / Twitter tags** (+ branded OG image); course-specific OG — M · High (WhatsApp CTR) · metadataBase · Eng
- [ ] **Upgrade `/courses` to a real `CollectionPage` + `ItemList`** linking course pages — M · High · course pages · Eng
- [ ] **Breadcrumbs (visible + `BreadcrumbList`)** on courses/guides/blog — S · Med-High · course pages · Eng
- [ ] **FAQ hub + per-course FAQs with `FAQPage` schema** — M · High (AEO) · content · Content + Eng
- [ ] **Glossary with `DefinedTerm`** (DCA, ADCA, Tally, DTP, CCC…) — M · High (AEO) · content · Content
- [ ] **3–5 cornerstone guides** ("choose a course", "DCA vs ADCA", "best course after 12th") with `Article` schema — L · High · content · Content
- [ ] **Real About page + author/founder `Person` schema** — M · High (E-E-A-T) · owner input · Content
- [ ] **Real Contact page + `ContactPoint`** (phone/WhatsApp/hours/map) — S · High · owner input · Content
- [ ] **Image optimization: `next/image` + AVIF/WebP + compress logos + alt text** — M · High (CWV) · none · Eng
- [ ] **LCP/CSS performance pass on `(edu)`** (eager LCP, purge unused CSS, inline critical) — L · High · none · Eng
- [ ] **Static-generate/ISR all public marketing pages** — M · High · none · Eng
- [ ] **Internal linking system** (hub-spoke, related-courses, footer) — M · High · course pages · Eng + Content
- [ ] **WhatsApp/call CTA click tracking (GA4 events)** — S · High (measurement) · analytics setup · Eng
- [ ] **Google Business Profile + Search Console + Bing Webmaster setup, NAP consistency** — M · High · owner input · Marketing

### P2 — Medium impact

- [ ] `noindex` or enrich `coming-soon`; de-thin any template-mirror pages — S · Medium · Eng
- [ ] Host/slash canonicalization redirects at the edge — S · Medium · Eng
- [ ] `SiteNavigationElement` + `WebSite`/`SearchAction` schema — S · Medium · Eng
- [ ] Standardize `lang` (`en-IN`?) across both root layouts — S · Low · Eng
- [ ] Accessibility audit (alt, contrast, labels, focus) — M · Medium · Eng
- [ ] Font optimization on `(edu)` (self-host, remove CDN calls) — S · Medium · Eng
- [ ] `ImageObject`/`Speakable` on key pages/FAQ — S · Medium · Eng
- [ ] Success-story pages (**real only**) with schema — M · Medium · owner input · Content
- [ ] Downloadable syllabus/brochure lead magnet — M · Medium · Content

### P3 — Nice to have

- [ ] Blog cadence + crawlable pagination when it grows — ongoing · Content
- [ ] `VideoObject` if demo/testimonial video is produced — S · Eng
- [ ] Seasonal admission landing content — S · Content
- [ ] Consented lightweight lead capture (needs owner sign-off; currently out of scope) — M · Product

---

## 14. Appendix: Measurement & Governance

**Instrument before optimizing.**
- Google Search Console + Bing Webmaster Tools (submit sitemap; monitor coverage, queries, CWV).
- GA4 with WhatsApp/call CTA events as the primary conversion.
- Google Business Profile insights (calls, direction requests, profile views).

**North-star & guardrail metrics:**
- North star: **organic enquiries (WhatsApp/call clicks) per month.**
- Supporting: indexed course pages, non-brand organic clicks, local-pack impressions, CWV "Good" rate, AI-citation spot-checks (query the assistants monthly for "computer course Bagdogra/Siliguri" and log whether CODE is cited).

**Governance:**
- One content owner keeps course fees/durations accurate (also an AEO trust signal).
- Never fabricate reviews, ratings, counts, or credentials (`PRODUCT.md`); schema must reflect only real facts.
- Slugs are permanent once live; any change ships with a 301.
- Re-audit quarterly against this document; check off completed items.

---

### Immediate next 5 moves (if you do nothing else)
1. `metadataBase` + real titles/descriptions on every page.
2. `robots.ts` + `noindex` the admin subtree (privacy + crawl control).
3. Per-course pages from the DB with `Course`/`Offer` schema.
4. `Organization`/`LocalBusiness` schema + Google Business Profile.
5. Compress the images and fix the LCP/CSS on the homepage.

*These five convert CODE from search-invisible to search-competitive in the region, and everything else compounds on top.*
