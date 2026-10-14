# CODE — Local Search Forensic & #1 Roadmap

**Why we rank ~#3 for "computer centre in bagdogra" — and the exact path to #1 in Google Maps, Search, and AI answers.**

| | |
|---|---|
| **Business** | CODE — Computer & Digital Excellence, Bagdogra, West Bengal |
| **Target query** | `computer centre in bagdogra` (+ the geo-cluster around it) |
| **Current position** | ~#3 in the Local Pack / Map (per owner) |
| **Report date** | 2026-08-07 |
| **Companion doc** | [`SEO-STRATEGY.md`](./SEO-STRATEGY.md) — the on-site/technical + AEO audit. This doc is the **local/GBP/competitive** layer that sits on top of it. |

---

## 0. Read this first — honest scope & data provenance

This is an *enterprise-grade framework applied to a real one-branch institute*. To keep it useful and not a fantasy, every claim is tagged by how solid it is:

- **[VERIFIED]** — I confirmed it directly (your codebase, or a live competitor listing I pulled).
- **[COLLECT]** — a number that genuinely decides ranking, which **can only be read from a live tool** (Google Business Profile dashboard, Maps, Ahrefs/Semrush, Search Console). I give you the exact place to read it and the target. I have **not** invented a value.
- **[INFERENCE]** — expert judgment from the pattern of this market.

**What I could NOT see from here, and why it matters:** the Google Local Pack for this query is *personalized by the searcher's GPS location*, and the research tooling available to me is US-based — so I cannot reproduce your exact 3-pack, nor read your GBP insights or a backlink index. Anywhere that data is decisive, you'll see a **[COLLECT]** tag with instructions. Do not let anyone hand you a "local SEO audit" full of precise competitor review counts and backlink totals they *didn't* pull live — those are usually fabricated.

**A structural truth about this query.** "Computer centre in bagdogra" is a **Local Pack query**: ~80% of the click goes to the 3 map results, and those are ranked by Google's local triad — **Relevance, Distance, Prominence** — *not* mainly by your website. Your website is a Prominence input and the organic-below-the-map play, but **the fastest path from #3 to #1 runs through Google Business Profile + reviews + citations + proximity**, not through shipping more pages. The existing `SEO-STRATEGY.md` fixes the website; *this* doc wins the map.

---

## Table of contents

1. [Why are we #3? (signal-by-signal)](#1-why-are-we-3)
2. [Competitor comparison](#2-competitor-comparison)
3. [Google Business Profile audit](#3-google-business-profile-audit)
4. [Website audit (local lens)](#4-website-audit)
5. [Local SEO / citations audit](#5-local-seo--citation-audit)
6. [Review strategy](#6-review-strategy)
7. [Content gap analysis](#7-content-gap-analysis)
8. [Entity SEO](#8-entity-seo)
9. [AI search optimization](#9-ai-search-optimization)
10. [Backlink gap](#10-backlink-gap)
11. [Technical improvements](#11-technical-improvements)
12. [90-day action plan](#12-90-day-action-plan)
13. [Probability analysis](#13-probability-analysis)
14. [Success metrics / KPIs](#14-success-metrics)
- [Appendix A: the 30-minute data-collection sheet](#appendix-a)

---

<a name="1-why-are-we-3"></a>
## 1. Why are we #3?

Format per signal: **Current situation · Competitor advantage · Impact · Difficulty · Priority.** Ordered by how much each one is actually holding you at #3.

### 1.1 Reviews — quantity, velocity, and keyword content (the #1 lever) — **P0**
- **Current situation.** **[COLLECT]** your live Google review count/rating/velocity from the GBP dashboard. What I *can* verify: your site carries **no review capture flow at all**, and `PRODUCT.md` states no testimonials/counts exist — so review acquisition is almost certainly ad-hoc. **[VERIFIED]**
- **Competitor advantage.** Skylark Computer Centre (Bagdogra) shows **4.9 with 17 reviews on Justdial + 17 photos** **[VERIFIED]**; the Bagdogra "Computer Training Institutes" category surfaces listings at **5.0 (30 reviews), 4.6 (29), 4.9 (27), 4.1 (53)** **[VERIFIED — Justdial category]**. In this micro-market, *double-digit reviews with recent velocity* is the bar, and it's a low bar you can clear.
- **Impact.** **Very high.** Review count + rating + *recency* + *keyword-in-review* ("computer course", "DCA", "Bagdogra") is the single strongest Prominence signal Google uses to order near-identical local businesses.
- **Difficulty.** Low-Medium (it's a process, not a build). **Priority: P0.**

### 1.2 Google Business Profile completeness & activity — **P0**
- **Current situation.** **[COLLECT]** — is the profile claimed, is the **primary category** exactly "Computer Training School" / "Computer Training Institute", are secondary categories, services, products, hours, photos, and weekly Posts all populated? Given the site's maturity, **[INFERENCE]** the GBP is under-optimized (no Posts cadence, thin categories, few geo-tagged photos).
- **Competitor advantage.** Competitors ranking above you almost certainly have a **claimed, category-correct, photo-rich** profile — that alone beats a half-filled one.
- **Impact.** **Very high** — the GBP *is* the map ranking entity. Primary category is one of the top 3 local ranking factors.
- **Difficulty.** Low. **Priority: P0.**

### 1.3 Proximity / service-area & NAP centroid — **P0 to verify, then P1**
- **Current situation.** **[COLLECT]** your pin's exact placement and how far it is from Bagdogra's search centroid. Distance is a *ranking factor you can partly influence* (accurate pin, correct address, service-area settings) but **cannot fully control** — a searcher standing next to a competitor will see them first.
- **Competitor advantage.** A competitor physically closer to the Bagdogra centroid, or with a more precisely pinned address, gets a distance edge for the bare "in bagdogra" query.
- **Impact.** High for this exact query. **Difficulty.** Low (fix the pin/address) but with a hard ceiling. **Priority: P0 to audit.**

### 1.4 Website gives Google/AI nothing to attach Prominence to — **P0**
- **Current situation. [VERIFIED]** No JSON-LD anywhere, no meta descriptions, no robots/sitemap, no per-course pages, `metadataBase` unset, and the **contact page still ships the physcode "edusmart" demo placeholder** (email-protected stubs, demo address) — there is **no real crawlable NAP on your own site**. See [`SEO-STRATEGY.md §2`](./SEO-STRATEGY.md).
- **Competitor advantage.** Even a thin WordPress competitor with a real address block + a Facebook page gives Google a consistent NAP to corroborate. You currently contradict yourself (placeholder data) — a *negative* trust signal.
- **Impact.** High (it caps Prominence and blocks the Knowledge-Panel/entity resolution AI needs). **Difficulty.** Medium. **Priority: P0.**

### 1.5 Citations / directory presence (NAP corroboration) — **P1**
- **Current situation. [COLLECT]** — search Justdial/Sulekha/IndiaMART/LearnPick/AskLaila for CODE. **[VERIFIED]** competitors appear across these (Skylark on Justdial + Facebook; the market is indexed on Justdial, Sulekha, LearnPick, AskLaila, IndiaMART, siligurionline). If CODE is absent or inconsistent there, prominence is undercut.
- **Competitor advantage.** Broad, consistent directory coverage = more corroborating "votes" for name+address+phone.
- **Impact.** Medium-High. **Difficulty.** Low (data entry). **Priority: P1.**

### 1.6 Backlinks / domain authority — **P1**
- **Current situation. [COLLECT]** referring domains for your site (Ahrefs/Semrush free tier or Search Console links). **[INFERENCE]** near-zero, given the site's newness.
- **Competitor advantage.** Older institutes (e.g. Softech, "30+ years") have accumulated local news, directory, and education-portal links.
- **Impact.** Medium for the *map*, higher for the *organic* result under it. **Difficulty.** Medium-High. **Priority: P1.**

### 1.7 Photos / videos on the profile — **P1**
- **Current situation. [COLLECT]** photo/video count on GBP. Skylark shows **17 photos** **[VERIFIED]**.
- **Competitor advantage.** Fresh, geo-tagged, keyword-named photos correlate with engagement (a behavioral signal) and profile completeness.
- **Impact.** Medium. **Difficulty.** Low. **Priority: P1.**

### 1.8 Behavioral / engagement signals — **P2**
- **Current situation.** Clicks-to-call, direction requests, website taps, "save", and *dwell after click* feed ranking. **[COLLECT]** from GBP insights + GA4 (which you don't yet have wired — see `SEO-STRATEGY §11`).
- **Impact.** Medium and compounding. **Difficulty.** Medium. **Priority: P2** (measure now, optimize later).

> **Bottom line:** you are #3 primarily because of **§1.1 reviews + §1.2 GBP completeness + §1.3 proximity**, amplified by **§1.4 a website that can't lend Prominence**. Fix those four and #1 is realistic *for searchers in/near Bagdogra*; the ones physically beside a competitor are the uncontrollable tail (see §13).

---

<a name="2-competitor-comparison"></a>
## 2. Competitor comparison

**Named competitors confirmed in this micro-market [VERIFIED]:** **Skylark Computer Centre** (Bagdogra), **Gossainpur Youth Computer Centre / YCTC** (Bagdogra–Darjeeling, has own site `gossainpuryctc.com`), **Rainbow Technical Institute** (Bagdogra), plus the Siliguri-corridor giants **Softech Computer** (30+ yrs), **Sarva IT**, **IICD**, **Webel**. **[COLLECT]** — confirm which two actually sit above you in *your* Local Pack by searching the query on a phone physically in Bagdogra (or via a location-set browser).

Legend: ✅ we're better · 🟡 similar · ❌ we're worse · **?** = [COLLECT] live. I've filled only cells I can stand behind; **?** cells are your data-collection homework (Appendix A), not guesses.

| Signal | CODE (us) | Skylark (Bagdogra) | YCTC / others | Verdict for us |
|---|---|---|---|---|
| Website exists | ✅ Yes (Next.js) | Facebook-first, thin/none | YCTC has own site | 🟡 |
| Real NAP on site | ❌ placeholder demo NAP [VERIFIED] | 🟡 FB has address | 🟡 | ❌ **worse** |
| Google review count | **?** [COLLECT] | ~17 (Justdial) [V] | **?** | **?** |
| Average rating | **?** | 4.9 (Justdial) [V] | **?** | **?** |
| Review velocity (last 90d) | **?** | **?** | **?** | **?** |
| Primary category correct | **?** | **?** | **?** | **?** |
| Secondary categories | **?** | **?** | **?** | **?** |
| Services listed on GBP | **?** | **?** | **?** | **?** |
| GBP completeness | **?** (likely low) [INF] | 🟡 | **?** | ❌ **likely worse** |
| Photos | **?** | 17 [V] | **?** | ❌ **likely worse** |
| Videos | **?** | **?** | **?** | **?** |
| Weekly Posts | ❌ none [INF] | **?** | **?** | ❌ |
| JSON-LD schema | ❌ none [V] | ❌ none [INF] | ❌ [INF] | 🟡 (nobody has it → **opportunity**) |
| Per-course landing pages | ❌ none [V] | ❌ [INF] | 🟡 | 🟡 → **opportunity** |
| FAQ / answer content | ❌ none [V] | ❌ | ❌ | 🟡 → **opportunity** |
| Referring domains | **?** (~0 [INF]) | **?** | **?** | **?** |
| Directory citations | **?** (likely sparse) | ✅ Justdial+FB [V] | ✅ | ❌ **likely worse** |
| Core Web Vitals | ❌ WP asset bloat [V] | 🟡 | 🟡 | ❌ |
| Content depth / freshness | ❌ thin/template [V] | ❌ | 🟡 | 🟡 |
| Knowledge Panel | **?** (none [INF]) | **?** | **?** | **?** |
| AI-answer readiness | ❌ (no schema/facts) [V] | ❌ | ❌ | 🟡 → **biggest opportunity** |

**How to read this:** the ❌s that are *ours today* (placeholder NAP, no schema, no course pages, CWV, no Posts) are all **cheap to fix and nobody else in Bagdogra has fixed them either**. The `?` cells are the ones that actually rank the map — **fill them first (Appendix A)**, because you cannot out-plan a review gap you haven't measured.

---

<a name="3-google-business-profile-audit"></a>
## 3. Google Business Profile audit

The GBP is the ranking entity for this query. Audit every field below in the dashboard; each row is **status [COLLECT] → target**.

| Element | Target state | Why it matters | Priority |
|---|---|---|---|
| **Claimed & verified** | Verified, owner-controlled | Unverified = you can't optimize or respond | **P0** |
| **Primary category** | `Computer Training School` (or `Computer Training Institute`) — the single most exact match | Top-3 local ranking factor; wrong/generic category is the most common cause of stuck rankings | **P0** |
| **Secondary categories** | Add all that truly apply: `Software Training Institute`, `Training Centre`, `Computer Support & Services`, `Vocational School` | Expands the queries you're eligible for | **P0** |
| **Business name** | Exactly "CODE — Computer & Digital Excellence" — **no keyword stuffing** (e.g. "…Best Computer Centre Bagdogra") | Name accuracy = trust; stuffing risks suspension and is against guidelines | **P0** |
| **Description (750 char)** | Front-load: what you are, where (Bagdogra), courses (DCA, ADCA, Tally, DTP, MS Office), who it's for. Natural, keyword-honest | Relevance + AI/Knowledge context | **P1** |
| **Services** | List every course as a service with a 1-line description + fee band | Matches long-tail "DCA course" queries; feeds Maps' service filters | **P0** |
| **Products** | Add each course as a Product card w/ photo + price | Products render visually in the profile → engagement | **P1** |
| **Photos** | 20+ real: storefront (for the "is this a real place" signal), classroom, students-at-work, certificates, team. Geo-named files | Completeness + behavioral engagement; Skylark has 17 [V] | **P0** |
| **Videos** | 2–3 short (15–30s): a class in session, a student testimonial (real), a facility tour | Rare among competitors = differentiator | **P2** |
| **Google Posts** | **Weekly** — new batch, offer, course spotlight, success story (real) | Freshness + a direct behavioral surface; almost no local competitor sustains this | **P1** |
| **Q&A** | Seed 8–10 real questions ("What courses? Fees? Duration? Placement?") and answer them as owner | Owner-seeded Q&A is a legitimate AEO surface Google shows inline | **P1** |
| **Offers / Events** | Real admission-season offers and real open-day events only | Extra profile real estate; never fabricate | **P2** |
| **Attributes** | Set every true one: "Wi-Fi", "Wheelchair accessible", "Identifies as…" if applicable, online classes, appointments | Eligibility for attribute-filtered searches | **P2** |
| **Hours (+ special hours)** | Accurate, with holiday hours | "Open now" filters + trust; wrong hours tank engagement | **P0** |
| **Phone** | One consistent primary number (matches site + citations) | NAP consistency is foundational | **P0** |
| **Website link** | Deep-link to the homepage (later: to `/courses`) with a UTM | Passes engagement to a page that must then convert | **P1** |
| **Appointment / booking link** | WhatsApp "enquire" link (your primary channel) | Turns profile views into your real conversion action | **P1** |
| **Messaging** | Turn on GBP messaging, route to WhatsApp/phone with fast reply | Response rate is a visible trust signal | **P2** |
| **Review responses** | Respond to **100%** of reviews within 24–48h, naturally using "computer course/Bagdogra" | Response rate + keyword echo both help; shows an active owner | **P0** |
| **Review keyword mix** | Encourage reviewers to name the *course* and *place* | Keyword-in-review is a strong relevance signal | **P1** |
| **UTM tracking on the site link** | `?utm_source=gbp` | So GA4 can prove GBP → enquiry | **P1** |

**Biggest GBP wins, in order:** (1) verify + fix primary category, (2) 20+ real photos, (3) respond to all reviews + launch a review drive (§6), (4) weekly Posts, (5) full Services/Products from your real course catalogue.

---

<a name="4-website-audit"></a>
## 4. Website audit (local lens)

The deep technical audit already lives in [`SEO-STRATEGY.md §2–§10`](./SEO-STRATEGY.md). Here I only add the **local-ranking-specific** findings and the single most damaging one:

- **🔴 P0 — Placeholder NAP on the live site. [VERIFIED]** `public/home/pages/contact/content.html` still renders the `edusmart.physcode.com` demo (Cloudflare "email protected" stubs, demo address/phone). **Google is reading a contact page that contradicts your real business.** This is the most important website fix for *local* ranking, ahead of everything in the companion doc. Replace with your **real** Name, Address (Bagdogra, with pincode), Phone, WhatsApp, hours — identical strings to GBP and citations.
- **🔴 P0 — No `LocalBusiness`/`EducationalOrganization` JSON-LD** with `address`, `geo`, `openingHours`, `telephone`, `sameAs` (GBP + Facebook + Justdial). This is what lets Google/AI bind your website to your map entity. (`SEO-STRATEGY §4.1`.)
- **🟠 P1 — No embedded Google Map** of the real location on Contact/Home. A same-place-coordinates map embed reinforces the NAP centroid and helps users (and is a mild local signal).
- **🟠 P1 — No per-course pages** = you can't rank the organic slot under the map for "DCA course fees Bagdogra". (`SEO-STRATEGY §4.3`.)
- **🟠 P1 — Title says "Best Computer centre in Bagdogra". [VERIFIED]** Drop "Best" (unsubstantiated superlative, guideline-risky in some jurisdictions) → "Computer Courses in Bagdogra & Siliguri | CODE".
- **🟡 P2 — Images:** multi-MB PNG logos, no `alt` text, no `next/image`. Alt text like "CODE computer training centre classroom, Bagdogra" is a free local + image-search signal. (`SEO-STRATEGY §8`.)
- **🟡 P2 — No breadcrumbs, no `robots.ts`/`sitemap.ts`, admin not `noindex`.** (`SEO-STRATEGY §2.3–2.4, §2.12`.)
- **CTAs:** add a persistent "Enquire on WhatsApp" (pre-filled with course name) + "Call now" above the fold — your real conversion path, and a click-to-call is a *local* action Google likes.

**Verdict:** the website is a *Prominence & conversion* asset, not the map-ranking lever. Do the P0 NAP + LocalBusiness schema first; the rest follows the companion doc's roadmap.

---

<a name="5-local-seo--citation-audit"></a>
## 5. Local SEO / citation audit

**NAP is the currency of local SEO.** Before anything, lock one canonical NAP string (owner to confirm the real values):

```
Name:    CODE — Computer & Digital Excellence
Address: <street>, Bagdogra, Darjeeling, West Bengal <PIN>
Phone:   +91 <10-digit>
Website: https://<canonical-domain>
Hours:   <real>
```

Use it **byte-for-byte identical** everywhere. Then build/claim these (each is [COLLECT] "do we exist here yet?"):

| Citation source | Status | Priority | Notes |
|---|---|---|---|
| **Google Business Profile** | **?** | **P0** | The one that matters most |
| **Bing Places** | **?** | **P1** | Feeds Copilot + Bing Maps; competitors rarely claim it |
| **Apple Maps (Business Connect)** | **?** | **P1** | iPhone "near me" + Siri |
| **Justdial** | **?** (competitors present [V]) | **P0** | The dominant India local directory in this market |
| **Sulekha** | **?** | **P1** | Active for Siliguri/Bagdogra training [V] |
| **IndiaMART** | **?** | **P2** | Present for Siliguri computer coaching [V] |
| **LearnPick** | **?** | **P1** | Education-specific portal indexing Bagdogra [V] |
| **AskLaila / IndiaOnline / siligurionline** | **?** | **P2** | Regional directories [V] |
| **Facebook Page** | **?** | **P0** | Competitors are FB-first [V]; also a `sameAs` entity anchor |
| **Instagram (business)** | **?** | **P1** | Photos/reels = fresh social signal |
| **LinkedIn (company)** | **?** | **P2** | Authority + `sameAs` |
| **YouTube channel** | **?** | **P2** | Host GBP videos; ranks in its own right |
| **JoinCollege / Shiksha / CollegeDekho / Sulekha-edu** | **?** | **P2** | Education aggregators AI models cite |
| **Local WB business directories / chamber** | **?** | **P3** | Extra corroboration + a possible backlink |

**Missing-citation rule:** any row above where you're absent or inconsistent is a direct Prominence leak. Target: **present + identical NAP on all P0/P1 rows within 30 days.** Run a consistency sweep — one wrong old phone number on an abandoned listing actively confuses Google.

---

<a name="6-review-strategy"></a>
## 6. Review strategy

Reviews are the highest-ROI lever for moving #3→#1 in this market.

**Current [COLLECT]:** your count / rating / velocity / keyword mix / response rate — read from GBP.
**Benchmark [VERIFIED]:** the Bagdogra category tops out around **17–30 reviews at 4.6–5.0**; Skylark ≈ 4.9/17. This is a *beatable* bar.

**How many more reviews to realistically reach #1?**
This is **[INFERENCE]**, not a guarantee (Google weights recency and keywords, not just count): if the leader sits near **~20–30 reviews**, target **40–50 genuine Google reviews at ≥4.7, with steady velocity (4–8/month)** to overtake on the Prominence axis for searchers in/near Bagdogra. The *velocity* and *keyword content* matter as much as the total — 30 reviews earned over the last 6 months beats 40 that stopped a year ago.

**Ethical acquisition system (no fabrication — ever):**
1. **Ask at the peak moment** — course completion, certificate handover, first job placement. That's when a real 5-star is natural.
2. **One-tap link.** Generate your GBP "review link" (`g.page/r/...`), turn it into a QR code on the reception desk, the certificate, and a WhatsApp template.
3. **WhatsApp script (your channel):** *"Congrats on finishing your [DCA] course at CODE! A 1-line Google review really helps other students in Bagdogra find us — [link]. Thank you!"* — mentioning the course/place *organically prompts* keyword-rich reviews (never dictate words).
4. **Respond to 100%** within 48h, echoing the course/location naturally.
5. **Cadence, not blast.** A steady 4–8/month reads as authentic; 20 in one week reads as manipulation and can be filtered.
6. **Diversify surfaces** — some Google, some Justdial, some Facebook — so no single profile looks gamed.
7. **Never** buy reviews, incentivize with discounts-for-reviews (against Google policy), or write them yourself. One filtered burst can cost you the ranking you're chasing.

**Handling negatives:** respond calmly, factually, offer to resolve offline. A well-handled 3-star with an owner response builds more trust than a wall of suspiciously perfect 5-stars.

---

<a name="7-content-gap-analysis"></a>
## 7. Content gap analysis

Competitors here are content-thin, so this is **open territory** — but it's the *organic-under-the-map* and *AI-answer* game, not the map itself. Build in this order (validate keywords in Search Console once live):

**Course landing pages (P0 commercial core)** — one per real course:
`/courses/dca`, `/courses/adca`, `/courses/tally`, `/courses/dtp`, `/courses/ms-office`, `/courses/ccc`, `/courses/basic-computer` — each with fees, duration, syllabus, eligibility, career outcomes, next batch, WhatsApp CTA, `Course`+`Offer`+`FAQPage` schema. **These capture "DCA course fees Bagdogra"-type high-intent queries competitors don't target.**

**Location pages (P1):** `/computer-courses-bagdogra`, `/computer-courses-siliguri`, `/computer-courses-matigara` — genuinely differentiated (nearest landmark, who it serves), never doorway-spam clones.

**Answer/FAQ layer (P1 — AEO fuel):**
- Central FAQ hub + per-course FAQs.
- Glossary (`DefinedTerm`): DCA, ADCA, Tally, DTP, CCC, MS Office.
- People-Also-Ask targets: *"What is the DCA course fee in Bagdogra?", "DCA vs ADCA — which is better?", "How many months is ADCA?", "Best computer course after 12th in Siliguri?", "Is Tally certification worth it for jobs in West Bengal?", "computer course with monthly installment near Bagdogra".*

**Guides / career (P2):** "How to choose a computer institute in Bagdogra", "Computer skills for government jobs in West Bengal", "Best course after 12th in North Bengal".

**Success stories (P2 — real only):** with student consent — name, course, outcome. Powerful E-E-A-T + review-adjacent trust. `PRODUCT.md` forbids inventing these; use only genuine ones.

**Comparison content (P2):** "DCA vs ADCA", "Tally vs manual accounting". Do **not** publish "CODE vs [named competitor]" attack pages — legal/reputational risk for a small local brand.

---

<a name="8-entity-seo"></a>
## 8. Entity SEO

**Goal:** make "CODE — Computer & Digital Excellence" a resolvable entity Google and LLMs *know*, so it earns a Knowledge Panel and gets cited.

**Entities to establish/associate (encode in schema + prose + citations):**

```
CODE — Computer & Digital Excellence  (EducationalOrganization ∩ LocalBusiness)
├─ located in → Bagdogra ⊂ Siliguri ⊂ Darjeeling district ⊂ West Bengal ⊂ North Bengal ⊂ India
│                 (near → Bagdogra Airport — a strong local landmark anchor)
├─ offers → DCA · ADCA · Tally · DTP · MS Office · CCC · Basic Computer  (Course entities)
├─ teaches → MS Office · Tally ERP/Prime · GST accounting · DTP/design · typing · programming basics  (Skill/Software entities)
├─ software → Microsoft Office · Tally · Photoshop · CorelDRAW  (well-known entities to associate with)
├─ audience → students · job-seekers · 12th-pass · parents
├─ career outcomes → data entry · accounting/Tally operator · office assistant · DTP operator  (Occupation entities)
└─ sameAs → GBP · Facebook · Instagram · Justdial · LinkedIn · YouTube  (identity corroboration)
```

**Missing entities to add (biggest gaps):** the **geo hierarchy** (Bagdogra→North Bengal), the **airport landmark** anchor, the **software brands** (Tally, MS Office, Photoshop — associating with famous entities strengthens yours), and the **occupation/outcome** entities that AI uses to answer "what job after this course".

**How to build the entity:** consistent `Organization.name` everywhere (never a variant), complete `EducationalOrganization`+`LocalBusiness` JSON-LD with `sameAs` to every real profile, a real About page with a founder `Person` (credentials), and identical NAP across GBP + site + citations. That NAP+`sameAs` consistency *is* the entity graph.

---

<a name="9-ai-search-optimization"></a>
## 9. AI search optimization (AEO / GEO)

**Current visibility [COLLECT]:** query each engine monthly and log if CODE is named — *"best computer centre in Bagdogra", "where can I learn DCA near Bagdogra", "computer course Siliguri"* in **Google AI Overviews, ChatGPT (search), Gemini, Claude, Perplexity, Copilot**. **[INFERENCE]:** you're currently *not* cited — LLMs have no structured facts about you (no schema, placeholder NAP), so they fall back to Justdial/Skylark/aggregators.

**Why competitors get cited and you don't:** LLMs lift from *structured, corroborated, citable* sources. Right now Justdial and directory pages are the corroborated entities in this niche; you are not one.

**What wins each engine:**
- **Google AI Overviews / Gemini** → GBP completeness + `EducationalOrganization`/`LocalBusiness`/`FAQPage` schema + entity consistency. This is the same work as §3/§8, so it double-counts.
- **ChatGPT / Claude / Perplexity** → clean semantic HTML, **atomic quotable facts** ("The DCA course at CODE runs 6 months and costs ₹X"), definition blocks, comparison tables, visible `dateModified`, author attribution.
- **Copilot** → submit to **Bing Webmaster + Bing Places** (competitors ignore Bing = easy win).

**GEO action list:** answer-first formatting; one idea per chunk; question-shaped H2s; per-course + hub FAQ with `FAQPage`; glossary with `DefinedTerm`; get listed/consistent on the aggregators AI *already* cites (Justdial, Sulekha, Shiksha) so your name co-occurs with the query in training/retrieval data. (Full engine table in [`SEO-STRATEGY §3`](./SEO-STRATEGY.md).)

---

<a name="10-backlink-gap"></a>
## 10. Backlink gap

**Current [COLLECT]:** referring domains (Search Console → Links, or Ahrefs/Semrush free). **[INFERENCE]:** near-zero. Older competitors (Softech "30+ yrs") have a natural local link history.

For a local institute, *relevance + locality beats raw DA*. Pursue, in order:

| Opportunity | Type | Effort | Why it works |
|---|---|---|---|
| **Justdial / Sulekha / LearnPick / IndiaMART listings** | Citation + link | Low | Corroboration + a real followed/nofollow link; competitors already there [V] |
| **Facebook / Instagram / LinkedIn / YouTube** profiles | Social + `sameAs` | Low | Entity anchors; some pass link value |
| **Local news / Siliguri portals** (siliguritimes, telegraph NE local, siligurionline) | Editorial | Medium | High local relevance; a batch result / event story |
| **Education aggregators** (Shiksha, CollegeDekho, Sulekha-edu, JoinCollege) | Niche | Medium | AI-cited + topically perfect |
| **Local partners** — schools/colleges you feed, employers who hire your students, a cyber-café/computer-shop network | Relationship | Medium | Genuine, defensible, hard for competitors to copy |
| **Scholarship / free-workshop page** at a nearby school/college | Resource link | Medium | Classic ethical local link-earning |
| **Guest article** on a WB education blog ("choosing a computer course after 12th") | Content | Medium | Topical authority + link |
| **Chamber of commerce / WB skill-development / govt vocational directories** | Authority | Low-Med | `.gov`/`.org` local trust |

**Avoid:** paid link networks, PBNs, irrelevant national directories, comment spam — a small local brand gains nothing and risks a lot.

---

<a name="11-technical-improvements"></a>
## 11. Technical improvements (prioritized by local impact)

Ranked by *what moves the Bagdogra ranking*, not generic best-practice. Details in [`SEO-STRATEGY §2 & §8`](./SEO-STRATEGY.md).

| # | Fix | Impact | Effort | Priority |
|---|---|---|---|---|
| 1 | **Replace placeholder demo NAP** with real, consistent NAP on Contact + Home + footer | Very High (local trust) | S | **P0** |
| 2 | **`LocalBusiness`/`EducationalOrganization` JSON-LD** (address, geo, hours, tel, `sameAs`) | Very High | M | **P0** |
| 3 | **`Course`+`Offer`+`FAQPage` schema** on per-course pages | High (AEO + rich results) | M | **P0** |
| 4 | **Per-course pages** from the DB `Course` table (SSG/ISR) | High | L | **P0** |
| 5 | `robots.ts` + `sitemap.ts` (incl. course URLs); `noindex` admin | High (crawl + privacy) | S | **P0** |
| 6 | `metadataBase` + unique titles/meta descriptions (drop "Best") | High (CTR) | S/M | **P0** |
| 7 | **Compress logos** (1.5 MB→<50 KB) + `next/image` + alt text | High (CWV + image search) | M | **P1** |
| 8 | Embedded Google Map + click-to-call + WhatsApp CTA | Medium-High (conversion + local) | S | **P1** |
| 9 | LCP/CSS pass on `(edu)` (purge ~40 WP stylesheets, eager hero) | High (CWV) | L | **P1** |
| 10 | Breadcrumbs + `BreadcrumbList`; internal hub-spoke linking | Medium | M | **P1** |
| 11 | Open Graph/Twitter (WhatsApp share cards — your channel) | Medium (CTR) | M | **P1** |
| 12 | GA4 + WhatsApp/call click events; Search Console + Bing Webmaster | High (measurement) | S | **P1** |

---

<a name="12-90-day-action-plan"></a>
## 12. 90-Day action plan

Each task: **Priority · Impact · Effort · Depends on · Owner.** "Owner" roles: **Owner** (business), **Mkt** (whoever runs listings/reviews), **Eng**, **Content**.

### Week 1 — Foundation & measurement (nothing ranks until this exists)
- **[COLLECT] Fill Appendix A data sheet** — your + top-2 competitors' review counts, categories, citations. `P0 · unblocks everything · S · — · Mkt`
- **Claim/verify GBP; fix primary category; correct hours/phone.** `P0 · Very High · S · — · Owner+Mkt`
- **Lock canonical NAP string; replace placeholder NAP on site.** `P0 · Very High · S · NAP confirmed · Eng`
- **Set up GA4 + Search Console + Bing Webmaster.** `P1 · High(measure) · S · — · Eng`

### Week 2 — GBP saturation
- **Upload 20+ real geo-named photos + 2 videos.** `P0 · High · S · GBP · Mkt`
- **Add all Services + Products (real courses, fees).** `P0 · High · M · course data · Mkt`
- **Write the 750-char description; seed 8–10 Q&A.** `P1 · Med · S · GBP · Content`
- **Respond to every existing review.** `P0 · High · S · GBP · Owner`

### Week 3 — Reviews engine + top citations
- **Launch review system:** QR + WhatsApp script + ask-at-completion. `P0 · Very High · M · GBP · Owner+Mkt`
- **Claim Justdial, Facebook, Bing Places, Apple Maps** with identical NAP. `P0/P1 · High · M · NAP · Mkt`
- **First weekly GBP Post** (start the cadence). `P1 · Med · S · GBP · Mkt`

### Week 4 — Website local foundation (Eng sprint)
- **`LocalBusiness`/`EducationalOrganization` JSON-LD + `sameAs`.** `P0 · Very High · M · profiles live · Eng`
- **`robots.ts` + `sitemap.ts`; `noindex` admin; `metadataBase`; titles/descriptions.** `P0 · High · S/M · — · Eng`
- **Embed Google Map + WhatsApp/call CTAs.** `P1 · Med-High · S · NAP · Eng`

### Weeks 5–6 — Per-course pages (the commercial core)
- **Build `/courses/{slug}` from DB with `Course`+`Offer` schema, fees, syllabus, CTA.** `P0 · Very High · L · DB · Eng+Content`
- **Compress images + `next/image` + alt text.** `P1 · High · M · — · Eng`
- **Continue reviews (target +8–12 by now) + weekly Posts.** `P0 · Very High · — · system · Owner`

### Weeks 7–8 — Answer layer + secondary citations
- **Per-course FAQ + central FAQ hub + glossary (`FAQPage`/`DefinedTerm`).** `P1 · High(AEO) · M · course pages · Content`
- **Claim Sulekha, LearnPick, IndiaMART, Instagram, LinkedIn, YouTube.** `P1 · Med · M · NAP · Mkt`
- **LCP/CSS performance pass on `(edu)`.** `P1 · High · L · — · Eng`

### Weeks 9–10 — Content authority + local links
- **2–3 cornerstone guides** ("choose a computer institute in Bagdogra", "DCA vs ADCA", "best course after 12th"). `P2 · Med-High · L · — · Content`
- **Location pages** (Bagdogra/Siliguri/Matigara). `P1 · Med-High · M · course pages · Content`
- **Outreach: 3–5 local links** (education portals, a partner school, local news batch story). `P1 · Med · M · content · Owner+Mkt`

### Weeks 11–12 — Optimize, measure, compound
- **Real success-story pages (consented).** `P2 · Med · M · consent · Content`
- **Internal linking system + breadcrumbs.** `P1 · Med · M · pages · Eng`
- **AI-citation audit** across 6 engines; log & iterate. `P2 · Med · S · content live · Mkt`
- **Review the KPI dashboard (§14); re-pull Appendix A to measure movement.** `P0 · — · S · GA4/GBP · Owner`
- **Sustained:** 4–8 reviews/month + weekly Posts + monthly guide — *forever*. This is what holds #1.

---

<a name="13-probability-analysis"></a>
## 13. Probability analysis

Honest, banded — and explicit about what you *can't* control.

| Stage | P(#1 in Local Pack for searchers **in/near Bagdogra**) | Rationale |
|---|---|---|
| **Today** | ~15–25% | You already rank #3, so you're a contender — but review/GBP/NAP gaps cap you. |
| **After P0** (GBP verified + category + 20 photos + review engine + real NAP + LocalBusiness schema) | **~55–70%** | This closes the gaps that actually order the map; most local #3→#1 moves come from exactly this. |
| **After P0+P1** (course pages + citations + reviews at velocity + performance + FAQ) | **~70–85%** | Prominence + relevance + engagement all lifted; you also start owning the organic slot and AI answers. |
| **After P0+P1+P2 sustained 6+ months** | **~80–90%** | Topical + review authority compounds; hard for thin competitors to catch up. |

**What you cannot control (the honest ceiling):**
- **Proximity.** A searcher physically standing beside a competitor may see that competitor #1 *regardless* of your work. "#1 for everyone, everywhere in Bagdogra, always" is not a real target — **"#1 for the large majority of searchers in the Bagdogra service area"** is.
- **A competitor who reacts** (starts their own review drive). Your defensibility is *velocity + schema + content* they won't sustain.
- **Google volatility** and the fact review/citation signals take **4–12 weeks** to re-weight — this is a compounding game, not a switch.

**So:** #1 is a *realistic and defensible* target for the majority of local searches within ~2–4 months of disciplined P0/P1 — not a guarantee for every GPS coordinate.

---

<a name="14-success-metrics"></a>
## 14. Success metrics (KPIs)

Instrument first (Week 1), then track monthly. **North star: organic enquiries (WhatsApp/call clicks) per month** — not sessions.

| KPI | Source | Baseline | 90-day target |
|---|---|---|---|
| **Local Pack rank** — "computer centre in bagdogra" (+5 geo terms) | Manual / local-rank tool, phone in Bagdogra | ~#3 [given] | **#1–#2** for in-area searchers |
| **Organic rank** — "DCA course fees Bagdogra" etc. | Search Console | not ranking | top 5 for 3+ course terms |
| **GBP profile views** | GBP insights | [COLLECT] | +50% |
| **GBP website clicks** | GBP + GA4 (utm) | [COLLECT] | +50% |
| **Phone calls (GBP)** | GBP insights | [COLLECT] | measurable ↑ |
| **Direction requests** | GBP insights | [COLLECT] | measurable ↑ |
| **WhatsApp/call enquiries** (north star) | GA4 click events | 0 (untracked) | tracked + growing |
| **Google reviews (count / rating / velocity)** | GBP | [COLLECT] | **+20–30 reviews, ≥4.7, 4–8/mo** |
| **Review response rate** | GBP | [COLLECT] | 100% within 48h |
| **Referring domains** | Search Console / Ahrefs | ~0 [INF] | +8–12 relevant |
| **Citations live & NAP-consistent** | manual | [COLLECT] | all P0/P1 rows |
| **Indexed course pages** | Search Console | 0 | all real courses |
| **CWV "Good" (mobile)** | Search Console / PSI | failing [V] | LCP<2.5s, INP<200ms, CLS<0.1 |
| **AI citations** — 6 engines, monthly log | manual query | 0 [INF] | named by ≥2 engines |

---

<a name="appendix-a"></a>
## Appendix A — the 30-minute data-collection sheet

Fill this **before Week 2**. It's the `[COLLECT]` data the whole plan needs; do it on a phone physically in Bagdogra (or a location-set browser) so the Local Pack is real.

**1. Your Local Pack reality** — search `computer centre in bagdogra`; record the 3 map results in order, each with: name, rating, review count, primary category (tap the profile).

**2. Your GBP** (dashboard): claimed? primary category? # secondary? # photos? # videos? posting in last 30d? review count / avg / newest review date? response rate? services listed? products? Q&A count? hours correct? website link + UTM?

**3. Top-2 competitors** (from step 1), each: review count, rating, newest-review date (velocity proxy), primary + secondary categories, photo count, whether they post, whether they have a website with real NAP.

**4. Citations** — search each of `CODE Bagdogra` on: Justdial, Sulekha, LearnPick, IndiaMART, Facebook, Bing, Apple Maps. Present? NAP correct?

**5. Backlinks** — Search Console → Links → export referring domains (or Ahrefs free). Count.

**6. AI baseline** — ask ChatGPT / Gemini / Perplexity / Google AI Overview: *"best computer centre in Bagdogra"* and *"where to learn DCA near Bagdogra"*. Are you named? Who is?

Drop the answers into §2's `?` cells and §14's baselines, and the roadmap becomes fully quantified.

---

### The 5 moves that matter most (if you do nothing else)
1. **Verify GBP + fix the primary category** to "Computer Training School."
2. **Launch the review engine** (QR + WhatsApp-at-completion) → +20–30 real reviews at velocity.
3. **Replace the placeholder demo NAP** on the site with real, consistent NAP + add `LocalBusiness` schema.
4. **20+ real photos + weekly Posts** on the profile.
5. **Get on Justdial + Bing Places + Apple Maps** with identical NAP.

Those five alone move the needle from ~#3 to a genuine #1 contender for in-area searchers, usually inside 8–12 weeks. Everything else in this document compounds on top and defends the position once you take it.

---

*Sources for competitor/market data referenced above (public, live-checked):*
*[Justdial — Skylark Computer Centre, Bagdogra](https://www.justdial.com/Bagdogra/Skylark-Computer-Centre-Bagdogra/9999PX353-X353-120506193033-Q4N1_BZDET) · [Justdial — Computer Training Institutes, Bagdogra](https://www.justdial.com/Bagdogra/Computer-Training-Institutes/nct-10124277) · [LearnPick — Bagdogra computer institutes](https://www.learnpick.in/institutes/siliguri/all/computer/bagdogra-area) · [Sulekha — Bagdogra/Siliguri training](https://www.sulekha.com/ui-ux-design-training/bagdogra-siliguri) · [Facebook — Skylark Computer Centre](https://www.facebook.com/p/Skylark-Computer-Centre-100064037170716/) · [Softech Computer, Siliguri](https://www.softechcomputer.in/) · [IndiaMART — Siliguri computer coaching](https://dir.indiamart.com/siliguri/computercoaching.html)). Review counts/ratings cited are as displayed on those third-party listings at time of research and should be re-verified live (Appendix A).*
