# Local SEO, AEO and GEO playbook — CODE, Bagdogra

**Date:** 14 October 2026 (updated same day with the guides/glossary/measurement layer) · **Status board:** [`SEO-TODO.md`](./SEO-TODO.md) · **Owner kit:** [`GBP-KIT.md`](./GBP-KIT.md) · **Companion docs:** [`SEO-STRATEGY.md`](./SEO-STRATEGY.md) (site audit), [`LOCAL-SEO-FORENSIC.md`](./LOCAL-SEO-FORENSIC.md) (map-pack analysis), [`SEO-AEO-GEO-HANDOFF.md`](./SEO-AEO-GEO-HANDOFF.md) (previous release notes).

This file records what the website now does for local search, answer engines (Google AI Overviews, featured snippets) and generative engines (ChatGPT, Perplexity, Gemini, Copilot, Claude), and the work only the owner can do. The split matters: for a one-branch institute, the map pack and AI answers are decided mostly **off** the website (Google Business Profile, reviews, listings, mentions). The website's job is to be the clean, quotable, consistent source those systems bind to.

---

## 0. Urgent: the stale Google result

Google currently shows the **old template site** for `codebagdogra.netlify.app`: title "CODE — Computer & Digital Excellence Institute | Bagdogra", snippet "Bagdogra's #1 Computer Institute 200+ students…", site name "Netlify" with the Netlify favicon. None of that text exists in the current code; it is Google's cached crawl from before the 14 October rebuild. The live page already serves the new title, description, favicon and JSON-LD.

Do this today (10 minutes):

1. **Google Search Console** → add the property `https://codebagdogra.netlify.app/` (URL-prefix) if not already verified. Verification: the DNS method is not available on a Netlify subdomain, so use the HTML tag method and paste the token into Netlify's environment as a meta tag request (or ask engineering to add `verification.google` to the root metadata).
2. **URL Inspection** → paste the home URL → **Request indexing**. Repeat for `/courses`, `/about`, `/contact` and the nine course URLs. This is the only way to force a recrawl; the sitemap now carries `lastmod` so the rest follows within days.
3. **Sitemaps** → submit `https://codebagdogra.netlify.app/sitemap.xml`.
4. **Bing Webmaster Tools** → import the Search Console property (one click), submit the same sitemap. Bing feeds Copilot and historically ChatGPT retrieval.
5. **Buy the real domain** (`codebagdogra.in` does not resolve today). While the site lives on `*.netlify.app`, Google can group it under the Netlify brand for the site name and favicon, and every listing/citation points at a URL you do not own. After purchase: add the domain in Netlify, set `NEXT_PUBLIC_SITE_URL=https://www.codebagdogra.in`, redirect the netlify.app host to it (Netlify does this automatically for the primary domain), then add the new property in Search Console and use the **Change of address** tool.

Expect the snippet to update within 2–7 days of the indexing request; the site name and favicon can take longer because Google refreshes those on a slower cycle.

---

## 1. What the website now does (shipped 14 Oct 2026)

| Layer | Change | Why |
|---|---|---|
| Crawl | `robots.txt` names OAI-SearchBot, ChatGPT-User, GPTBot, PerplexityBot, Perplexity-User, ClaudeBot, Claude-SearchBot, Claude-User, Google-Extended, Bingbot, Applebot, DuckAssistBot with explicit allow. | A future blanket rule can never silently remove the site from AI retrieval. |
| Crawl | `/llms.txt` — plain-text index of NAP, hours, languages, areas served, every course with URL and summary, and the FAQ. Regenerates hourly. | Convenience for assistants that look for it; costs nothing. |
| Entity | One business one-liner (`ONE_LINER` in `src/lib/site.ts`) reused in JSON-LD, footer and llms.txt. `WebSite.alternateName` "CODE Bagdogra". | Same description everywhere is the strongest entity signal we control; also the site-name signal Google uses instead of "Netlify". |
| Local schema | `LocalBusiness`/`EducationalOrganization` now carries `areaServed` (Bagdogra, Upper Bagdogra, Bihar More, Gossaipur, Matigara, Naxalbari, Siliguri), `knowsLanguage` bn/hi/en, `knowsAbout`, `sameAs` (Maps listing), real photos as `image`, `slogan`, `currenciesAccepted`. | Binds the site to the Maps entity and tells engines which queries it is relevant for. |
| Course schema | `Course` gains `educationalLevel`, `teaches`, `syllabusSections`, `timeRequired` (ISO, parsed from the catalogue duration), `coursePrerequisites`, `audience`, `inLanguage`, `educationalCredentialAwarded`, `Offer` (category Paid, INR, no price). | The atomic facts an answer engine quotes. |
| AEO content | Every course page opens with **"What is X?"** — one quotable definition paragraph plus where/taught-in/fee facts — and ends with **4–5 course-specific FAQs** rendered as real `h3` questions and emitted as `FAQPage` JSON-LD. | Passage-level answers for "what is DCA", "DCA vs ADCA", "do I need coding for web design", etc. |
| Local content | Home page H1 "Computer courses in Bagdogra, taught the practical way"; new section "A computer institute in Bagdogra, within reach of Siliguri" with areas served and landmark distances (station 1.5 km, airport 2 km, Matigara 5 km, Siliguri Jn 10 km, Naxalbari 12 km). Contact page gets a "How to reach CODE" card. Five new local FAQs (near airport, from Siliguri/Matigara/Naxalbari, languages, how to enrol, visiting first). | Local relevance in visible text, not just schema. Distances are computed from public coordinates. |
| Titles | Home title no longer doubles "CODE Bagdogra"; course titles are now "DCA Course in Bagdogra — Diploma in Computer Application \| CODE" style; contact title carries the street. | Click-through and query match. |
| Sharing | Generated 1200×630 Open Graph / Twitter card with the headline, course list, address and phone. | WhatsApp and Facebook previews were showing a 4600×2600 logo PNG. |
| Sitemap | `lastmod` on every URL. | Recrawl priority. |
| Guides (AEO/GEO) | `/guides` hub + five cornerstone guides (`src/lib/guides.ts`): DCA vs ADCA, which course after Class 10/12, how to choose an institute, how fees and monthly plans work, courses for shop owners who sell online. Each opens with a quotable "short answer", uses question-shaped H2s and comparison tables, ends with its own FAQ, and emits `Article` + `FAQPage` + `BreadcrumbList` with the organisation as author and real published/updated dates. Durations are injected from the database so a guide can never contradict a course page. | These are the pages assistants and AI Overviews quote for informational queries; course pages alone only answer commercial ones. |
| Glossary | `/glossary` — 20 one-sentence definitions (CCA, DCA, ADCA, SQL, HTML/CSS, Shopify, Meta Ads, GBP, prompt engineering…) as `DefinedTermSet`/`DefinedTerm`, each linked to the course that teaches it. | Definition-shaped passages are the easiest thing for an engine to lift. |
| Freshness | Visible "updated" dates on course pages and guides; `WebPage.dateModified`; sitemap `lastmod` now comes from content dates (`SITE_CONTENT_UPDATED`, `COURSE_CONTENT_UPDATED`, per-guide `updated`), never the build time. | Google only trusts `lastmod` when it is verifiably accurate; recency lifts AI citation. Bump the constants when words change. |
| Internal links | Guides in header nav and footer; "Helpful guides" block on every course page; "Read before you choose" strip on the home page; glossary terms link to courses; guides link to courses. | Hub-and-spoke so no answer page is an orphan. |
| Verification | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_BING_SITE_VERIFICATION` env → `<meta>` tags. | Owner can verify Search Console and Bing without a code change. |
| Measurement | `Analytics` component: GA4 (when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set) with `contact_click` events for WhatsApp / call / email / Maps taps; Meta Pixel `Contact` on the same taps. | The north-star KPI is enquiries, not sessions. |
| Entity | `SAME_AS` in `src/lib/site.ts` is the single list for `Organization.sameAs`. | Add Justdial, Facebook, Instagram, YouTube URLs here as they go live. |
| AEO content (3rd pass) | Five more guides for the highest-volume course-name queries — DCA details, ADCA details, basic computer course for beginners, courses for office/data-entry jobs, best courses for 2026 — plus 14 glossary terms (Tally, data entry, CCC, BCA, Python…). Query → page map in [`SEO-KEYWORDS.md`](./SEO-KEYWORDS.md). | "dca full form", "jobs after dca", "basic computer course", "computer operator course" are the queries parents and students type most; the site now has a quotable, dated answer for each. |
| Languages | Every course page carries the same summary in Bengali and Hindi (`lang="bn"`/`"hi"`), the home page a bilingual line, the Organization Bengali/Hindi alternate names. | Many local searches are typed in Bengali or Hindi; classes are explained in those languages, so the page should say so in them. |
| Reviews | `src/data/google-reviews.json` — every public review on the listing, refreshed with `npm run google:reviews`; shown newest first. No Google API or key involved. | Real review text is user-generated keyword content ("best computer centre in bagdogra") and the trust signal visitors recognise. |
| GEO | `/llms-full.txt` mirrors every course page, guide and glossary term as one Markdown file. | Assistants that fetch one file get everything quotable. |

Nothing above states a fee, a placement claim, a student count or a rating that is not already on the Google listing.

---

## 2. Owner actions, in priority order

### P0 — this week

1. **Google Business Profile.** Primary category *Computer Training School*; secondary *Software Training Institute*, *Education Center*. Description = the one-liner from the website. Services: add each course by name. Hours Mon–Sat 11:00–21:00, Sunday closed. Attributes: languages spoken. Add 20+ real photos (lab, batches, certificates being handed over). Website field = the canonical URL. Pin must match the map coordinates on the site.
2. **Review engine.** Ask every finishing student in person, with a QR code to the review link, and a WhatsApp follow-up the same evening. Ask them to mention the course name and "Bagdogra" naturally. Reply to every review within 48 hours. Target: 3–5 new reviews a month, every month. Never incentivise or script.
3. **GBP Q&A.** Seed the Questions section with the same questions as the site FAQ and answer them from the owner account.
4. **Search Console + Bing Webmaster** as in section 0.

### P1 — this month

5. **Citations with identical NAP** (copy the exact strings from the site footer): Justdial, Sulekha, IndiaMART, LearnPick, Bing Places, Apple Business Connect, Facebook Page, Instagram bio. Once each is live and matching, send the URLs to engineering to add to `sameAs`.
6. **Weekly GBP Posts.** New batch starting, a student result, a demo class, an offer. Posts expire; cadence matters more than polish.
7. **YouTube channel.** Three short videos to start: a lab walk-through, "DCA vs ADCA — which should you take?" and "What you learn in CCA in 3 months". Put "CODE Bagdogra" and the course name in each title and say them aloud in the first 10 seconds (transcripts are indexed). Embed them on the matching course pages.
8. **Facebook/Instagram** — same one-liner in the bio, same phone, same address. Post the GBP content there too.

### P2 — this quarter (GEO: being named by AI assistants)

9. **Be the answer where AI looks.** AI engines cite community sources far more than business sites. Authentic participation only: answer "which computer course in Siliguri" style questions on Quora and local Facebook groups with specific, useful detail and a mention of the centre only where relevant. No fake accounts, no posting as students.
10. **Get listed in "computer institutes in Siliguri/Bagdogra" round-ups** — local news sites, student blogs, LearnPick-style directories. One honest email each.
11. **Two cornerstone guides on the site** (engineering + owner): "How to choose a computer course after Class 10/12 in Siliguri" and "DCA vs ADCA: syllabus, duration and jobs" with `Article` schema, named author and a visible updated date. These target the questions parents ask ChatGPT.
12. **Monthly prompt audit** (section 3). Log results; do not guess share of voice.

---

## 3. Monthly AI-visibility audit (15 minutes)

Run each query in a fresh session in Google (look for AI Overview and the map pack), ChatGPT with search, Perplexity and Gemini. Record: is CODE named, how is it described, which sources are cited.

1. computer institute in Bagdogra
2. best computer training centre near Bagdogra airport
3. DCA course in Siliguri
4. ADCA course Bagdogra fees
5. which computer course after class 12 in Siliguri
6. difference between DCA and ADCA
7. web design course in Siliguri
8. digital marketing course Bagdogra
9. ecommerce course Siliguri Shopify Amazon
10. AI prompt engineering course Siliguri
11. computer classes for beginners Bagdogra
12. computer course with monthly fees Siliguri
13. Bengali medium computer course Bagdogra
14. CODE Computer and Digital Excellence Bagdogra reviews
15. computer institute near Matigara / Naxalbari

The sources those engines cite are next month's listing targets. Expect a lag of several weeks between a change and a visible result; judge trends over quarters.

---

## 4. KPIs

| Signal | Where | Target by Jan 2027 |
|---|---|---|
| Google reviews | GBP | +12 real reviews, rating held at 5.0/4.9 |
| Map pack position for "computer centre in bagdogra" (searched from Bagdogra) | phone, logged out | #1 |
| Indexed pages | Search Console | all 16 public URLs |
| Clicks + impressions for "bagdogra"/"siliguri" queries | Search Console | month-on-month growth |
| GBP calls, directions, website clicks | GBP Insights | month-on-month growth |
| AI mentions (audit above) | log | named in ≥ 5 of 15 queries on at least two engines |
| Referrals from chatgpt.com / perplexity.ai | analytics | non-zero and rising |
