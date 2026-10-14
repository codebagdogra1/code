# Local SEO · AEO · GEO — status board

**Goal:** be the computer institute Google's map pack, AI Overviews, ChatGPT, Perplexity and Gemini name for Bagdogra / Siliguri queries.
**Updated:** 14 October 2026 (third pass). Companion docs: [playbook](./SEO-LOCAL-AEO-GEO-PLAYBOOK.md) (what the site does + why), [keyword map](./SEO-KEYWORDS.md) (query → page), [GBP kit](./GBP-KIT.md) (paste-ready owner text), [strategy](./SEO-STRATEGY.md), [forensic](./LOCAL-SEO-FORENSIC.md).

Legend: `[x]` shipped · `[ ]` open · **Eng** = code · **Owner** = needs the business owner's accounts.

## Engineering (website)

### Shipped 14 Oct — foundation
- [x] metadataBase, unique titles/descriptions, canonicals, OG/Twitter cards, generated share image
- [x] robots.txt with named AI crawlers; sitemap; `/llms.txt`
- [x] `EducationalOrganization`+`LocalBusiness` JSON-LD with geo, hours, areaServed, knowsAbout, languages
- [x] Per-course pages with `Course` schema, "What is X?" definition, course FAQ (`FAQPage`)
- [x] Home: local section (areas served, landmark distances), 10 local FAQs; contact: "How to reach CODE"
- [x] Real favicon/icons; one-liner reused everywhere (entity consistency)

### Shipped 14 Oct — this pass (AEO/GEO content + measurement)
- [x] **Guides hub** `/guides` + 5 cornerstone guides with `Article` + `FAQPage` schema, TL;DR, comparison tables, visible published/updated dates
  - DCA vs ADCA · Which course after Class 10/12 · How to choose a computer institute · How fees & monthly plans work · Courses for shop owners who want to sell online
- [x] **Glossary** `/glossary` with `DefinedTermSet` schema; each term links to its course
- [x] `WebPage` schema with `dateModified` on course pages; visible "Updated" date
- [x] Course pages link to the relevant guides; home gets a "Read before you choose" strip; Guides in nav + footer
- [x] Sitemap: guides + glossary; honest `lastmod` (content dates, not build time)
- [x] `/llms.txt` lists guides + glossary
- [x] Search Console / Bing verification via env (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`)
- [x] Enquiry measurement: WhatsApp / call / email clicks fire GA4 `contact_click` (when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set) and Meta Pixel `Contact`

### Shipped 14 Oct — third pass (keywords, languages, reviews, AI mirror)
- [x] **Five more guides** for the highest-volume course-name and decision queries: DCA course details (full form, syllabus, eligibility, jobs, govt-recognition answer, DCA vs CCC/BCA) · ADCA course details · Basic computer course for beginners (CCA; home-makers, seniors, shop staff) · Computer courses for office, data-entry and computer-operator jobs (skills checklist) · Best computer courses to learn in 2026 (no salary/placement claims). 10 guides total, all with Article + FAQPage + BreadcrumbList schema and real dates
- [x] **Glossary** 20 → 34 terms (Tally, data entry, computer operator, typing speed/WPM, MS Excel, Python, C, domain & hosting, front-end framework, UI/UX, Canva, ChatGPT & Gemini, CCC (NIELIT), BCA); terms now link to the guide that explains them in depth
- [x] **Bengali + Hindi summaries on every course page** (`summaryBn`/`summaryHi`, rendered with `lang="bn"`/`lang="hi"`, duration from the DB) and a bilingual line on the home page; Organization `alternateName` adds "কোড বাগডোগরা" / "कोड बागडोगरा"; WebSite `inLanguage` en-IN/bn/hi. **Owner: proof-read the translations once.**
- [x] **Real Google reviews, all of them** — `src/data/google-reviews.json` is a static snapshot of every public review on the listing (43, 34 with text, captured 14 Oct), refreshed with `npm run google:reviews`; the Google API code is gone. Review text with "Bagdogra", "Siliguri", "North Bengal", "programming", "Diploma" is now on the home and about pages
- [x] `/llms-full.txt` — full Markdown text of every course page, guide and glossary term for assistants that fetch one file; linked from `/llms.txt`
- [x] The temporary `dev-reviews-tmp` page (eighteen invented reviews, indexable) is gone
- [x] [SEO-KEYWORDS.md](./SEO-KEYWORDS.md): query cluster → page map, and how to use Search Console data monthly

### Shipped 14 Oct — fourth pass (area pages, local long-tail)
- [x] **Area hub + 13 area pages** (`src/lib/areas.ts`, `/areas`, `/areas/[slug]`): Upper Bagdogra · Station More · Bihar More · Bhujiapani (Airport More) · Putimari · Gossaipur (Gossainpur) · Buribalason · Kestopur · Shibmandir (NBU) · Medical (Sushrutanagar / NBMC) · Matigara · Siliguri · Naxalbari. Each page: one honest TL;DR ("one centre, in Bagdogra, N km away"), route in, who joins from there, batch-time advice, 3 recommended courses, 4 area-specific FAQs, Bengali + Hindi line, `WebPage` + `FAQPage` + `BreadcrumbList` schema with real dates, `keywords` with spelling variants (Shivmandir, Bhujia Pani, Bihar Mor, Gossainpur…)
- [x] Doorway-page guardrails: no fake branch/address per area (one `LocalBusiness`, `areaServed` extended instead); every page states "CODE has one centre"; no two pages share a body paragraph; distances are straight-line and marked so; no fees, placements, counts or competitor names
- [x] Linked from `/contact` ("How to reach CODE") and `/about`; area pages cross-link; in sitemap and `/llms.txt`. **Deliberately not linked from the home page or nav** (owner decision) — if Search Console shows the pages are crawled but not indexed after 4–6 weeks, add an "Areas we serve" link in the footer
- [ ] **Owner:** confirm the local facts I could not verify from here — Buribalason ≈ 3 km on the Siliguri road (Bagdogra side of the bridge); Putimari ≈ 3 km (Gossaipur GP); — Kestopur is on the Matigara side of the Siliguri road; Bhujiapani ≈ 2 km (by Airport More); Gossaipur ≈ 3 km; Bihar More is "a few minutes" from Lokenath Nagar Road. Edit `distance`/`travel`/`route` in `src/lib/areas.ts` if wrong
- [ ] **Owner:** in Google Business Profile → *Service areas*, add the same localities (Upper Bagdogra, Bihar More, Bhujiapani, Shibmandir, Matigara, Siliguri, Naxalbari) so GBP and the site agree

### Open — engineering
- [ ] Add verified profile URLs to `sameAs` (`src/lib/site.ts` → `SAME_AS`) as the owner claims them (Justdial, Facebook, Instagram, YouTube, Bing Places, Apple)
- [ ] Embed the first YouTube videos on matching course pages + `VideoObject` schema (after Owner #7)
- [ ] Real success stories page (only with written student consent) — `Person`-free, course + outcome
- [ ] Bengali/Hindi: extend from course summaries to the guide TL;DRs once the owner has proof-read the course summaries
- [ ] After the real domain is live: set `NEXT_PUBLIC_SITE_URL`, re-verify Search Console, Change of Address

### Deliberately not done
- No `AggregateRating`/`Review` schema on our own pages: Google treats self-serving review markup on `LocalBusiness`/`Organization` as ineligible. The rating is shown as visible text and linked to Google instead.
- ~~No location pages~~ **Revised 14 Oct (fourth pass):** area pages shipped at `/areas/*` — see below. The doorway risk is managed by content, not avoided by omission.
- No fees online (owner decision); the fees guide explains how plans work without amounts.
- No competitor comparison pages.

## Owner (off-site — this is what actually ranks the map)

### P0 — this week
- [ ] **Search Console**: add property, paste the HTML-tag token into Netlify env `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, verify; URL Inspection → *Request indexing* for `/`, `/courses`, `/guides`, `/glossary`, `/about`, `/contact` and the 9 course URLs; submit `sitemap.xml`
- [ ] **Bing Webmaster Tools**: import from Search Console (one click) or paste token into `NEXT_PUBLIC_BING_SITE_VERIFICATION`; submit sitemap
- [ ] **GA4**: create property, paste `G-XXXX` into `NEXT_PUBLIC_GA_MEASUREMENT_ID`; mark `contact_click` as a key event
- [ ] **Google Business Profile** — apply [GBP-KIT.md](./GBP-KIT.md): categories, 750-char description, every course as a Service, hours, 20+ photos, website link with `?utm_source=gbp`
- [ ] **Review engine**: QR + WhatsApp script from the kit; target 3–5 real reviews/month; reply to every review within 48 h
- [ ] **GBP Q&A**: seed the 10 questions from the kit from the owner account

### P1 — this month
- [ ] **Justdial**: claim the existing listing (5.0 · 30 ratings), match NAP byte-for-byte, send the listing URL to engineering for `sameAs`
- [ ] Facebook Page + Instagram (same one-liner, phone, address) → URLs to engineering
- [ ] Bing Places, Apple Business Connect, Sulekha, LearnPick, IndiaMART with identical NAP
- [ ] Weekly GBP Post (new batch / result / demo class / offer)
- [ ] **YouTube**: 3 shorts — lab walk-through, "DCA vs ADCA", "What you learn in CCA"; say "CODE Bagdogra" + course name in the first 10 s
- [ ] **Buy the domain** (`codebagdogra.in` or similar) → Netlify primary domain → tell engineering

### P2 — this quarter (GEO: being named by assistants)
- [ ] Authentic answers on Quora / local Facebook groups for "computer course Siliguri" questions (no fake accounts, no astroturfing)
- [ ] Ask 3–5 local sites/directories that list Siliguri institutes to include CODE (one honest email each)
- [ ] Monthly 15-query AI audit (playbook §3) — log who is named and which sources are cited; those sources are next month's targets

## KPIs (review monthly)
| Signal | Where | Target by Jan 2027 |
|---|---|---|
| Google reviews | GBP | +12 real reviews, rating held ≥ 4.9 |
| Map pack for "computer centre in bagdogra" (phone, in Bagdogra, logged out) | manual | #1 |
| Indexed URLs | Search Console | all public URLs incl. 10 guides + glossary |
| `contact_click` key events / month | GA4 | tracked, rising month on month |
| AI mentions (15-query audit) | log | named in ≥ 5 queries on ≥ 2 engines |
| Referrals from chatgpt.com / perplexity.ai / gemini | GA4 | non-zero and rising |
