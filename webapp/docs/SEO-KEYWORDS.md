# Keyword map — what people search, and which page answers it

**Updated:** 14 October 2026. Companion to [SEO-TODO.md](./SEO-TODO.md) (status) and [GBP-KIT.md](./GBP-KIT.md) (owner text).

No paid keyword tool was available, so volumes are **not** quoted. The clusters below are the recurring query shapes for a one-branch computer institute in India, localised to Bagdogra, Siliguri and the surrounding towns; they match the questions students actually ask at the desk and the review text on the Google listing ("best computer centre in bagdogra", "computer centre in Siliguri", "Diploma in Computer", "programming"). Use Search Console → Performance → Queries after indexing to replace guesswork with real impressions, and add rows here as they appear.

Rules that still apply: one page per intent (no doorway pages per town), no fees online, no placement or salary claims, no competitor names.

## 1. Local commercial — the map pack and "near me"

| Query shape | Example queries | Page that answers it |
|---|---|---|
| Institute + place | computer institute in bagdogra · computer centre bagdogra · computer training centre siliguri · computer classes near bagdogra airport · computer institute near matigara / naxalbari | `/` (H1, local section, 10 local FAQs), `/contact` ("How to reach CODE"), `/about`; GBP primary category *Computer Training School* |
| Course + place | dca course in siliguri · adca course bagdogra · web design course siliguri · digital marketing course bagdogra · ecommerce course siliguri · ai course siliguri · basic computer course bagdogra | the nine `/courses/[slug]` pages (titles "… Course in Bagdogra — …") |
| Price intent | computer course fees siliguri · dca course fees bagdogra · computer course with monthly fees | `/guides/computer-course-fees-and-monthly-plans`, course FAQ "Can I pay monthly?" |
| Language | computer course in bengali · বাগডোগরা কম্পিউটার কোর্স · बागडोगरा कंप्यूटर कोर्स · hindi medium computer class siliguri | Bengali/Hindi summary block on every course page (`lang="bn"`/`lang="hi"`), bilingual line on `/`, home FAQ "In which language…", Organization `alternateName` in bn/hi |
| Brand | CODE bagdogra · code computer centre bagdogra · computer and digital excellence bagdogra reviews | `/` (WebSite + Organization schema, alternateName list), Google reviews section (real review text, newest first) |

## 2. Course-name informational — what AI Overviews and assistants quote

| Query shape | Example queries | Page |
|---|---|---|
| Full form / what is | dca full form · what is dca course · adca full form · cca full form · what is adca | `/guides/dca-course-details`, `/guides/adca-course-details`, `/glossary` (DefinedTermSet), course page "What is X?" |
| Syllabus / duration | dca syllabus · dca course duration · adca syllabus · adca course duration 1 year · dca subjects | the two course-details guides (module tables), course pages (syllabus outline, duration from DB) |
| Eligibility | dca course eligibility · can i do dca after 10th · adca after 12th | course-details guides, FAQ on `/courses/dca` and `/courses/adca` |
| Comparison | dca vs adca · difference between dca and adca · adca vs bca · dca or ccc · which is better dca or adca | `/guides/dca-vs-adca`, comparison tables in both course-details guides, glossary terms "BCA", "CCC (NIELIT)" |
| Jobs / scope | jobs after dca · dca job opportunities · adca scope · computer operator course · data entry course · computer course for govt job | `/guides/dca-course-details` ("Jobs after DCA", "Is DCA government-recognised?"), `/guides/computer-courses-for-office-and-data-entry-jobs` |
| Accounting | tally course siliguri · computerised accounting course | glossary "Tally" (honest: DCA/ADCA cover accounting fundamentals; ask which package the batch uses), `/courses/dca` |

## 3. Decision informational — parents and first-timers

| Query shape | Example queries | Page |
|---|---|---|
| After school | computer course after 12th · best computer course after 10th · which computer course is best after 12th for job | `/guides/which-computer-course-after-class-10-or-12` |
| Beginners | basic computer course · computer course for beginners · computer classes for housewives · computer course for senior citizens · how long to learn basic computer | `/guides/basic-computer-course-for-beginners`, `/courses/cca` |
| Choosing | best computer institute in siliguri · how to choose a computer institute · is this computer centre genuine | `/guides/how-to-choose-a-computer-institute-in-bagdogra` (no competitor names; evidence checklist) |
| Future / demand | best computer course for future · computer course with high demand · best short term computer course · ai course without coding | `/guides/best-computer-courses-for-the-future` |
| Business owners | sell on amazon flipkart course · shopify course siliguri · digital marketing for small business · meta ads course | `/guides/computer-courses-for-shop-owners-sell-online`, ecommerce and digital-marketing course pages |

## 4. Where the words come from

- Course facts: `src/lib/course-content.ts` (English + `summaryBn`/`summaryHi`), durations from the database.
- Guides and glossary: `src/lib/guides.ts` — each guide has `seoTitle`, a quotable `tldr`, question-shaped H2s, a table and its own FAQ (FAQPage schema).
- Machine-readable mirror for assistants: `/llms.txt` (index) and `/llms-full.txt` (full text of courses, guides, glossary).
- Review text (user-generated keywords): `src/data/google-reviews.json`, refreshed with `npm run google:reviews`.

## 5. What to do with Search Console data (monthly)

1. Performance → Queries, filter *Impressions > 0*, sort by impressions. Any query with impressions but position > 10 is a page to strengthen, not a new page to create.
2. Queries containing a town name we do not mention yet (e.g. "Kharibari", "Phansidewa") → add to `AREAS_SERVED` in `src/lib/site.ts` only if students genuinely commute from there.
3. Questions we do not answer → add to the matching guide's FAQ (bump its `updated` date) before writing a new guide.
4. Log the monthly 15-query AI audit from the playbook next to this file's date.
