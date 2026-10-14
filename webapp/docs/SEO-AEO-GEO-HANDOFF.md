# SEO, AEO, GEO and citation handoff

Implemented in this release:

- Crawl control and discovery: `robots.txt` blocks private/admin/API paths and points to a focused XML sitemap.
- Canonicals, unique page titles/descriptions, Open Graph/Twitter cards, and noindex protection for imported placeholder blog/gallery/coming-soon pages.
- A single canonical business entity: `CODE — Computer & Digital Excellence`, address, phone, email, hours, logo and contact point are shared by page content and JSON-LD.
- Truthful `EducationalOrganization`/`LocalBusiness`, `WebSite`, `BreadcrumbList`, `Course`/`ItemList`, `ContactPage`, `AboutPage`, and visible-FAQ JSON-LD.
- Answer-first FAQ copy and a course catalogue that no longer exposes imported foreign addresses, prices, enrolment numbers or provider links.

## What current guidance actually supports

- Google says the same SEO foundations apply to AI Overviews and AI Mode; there is no separate AI markup or machine-readable AI file required. Pages must be indexable, crawlable, useful, and their structured data must match visible text.
- Bing says accessible, original, well-structured content supports grounding and citations across Bing and Copilot. It explicitly warns against keyword stuffing, deceptive structured data, scaled low-value AI content, and attempts to manipulate AI systems.
- Schema helps machines understand accurate entities and page relationships. It is not a promise of a rich result, ranking, grounding or citation.

Primary references:

- Google, [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- Google, [Search Essentials](https://developers.google.com/search/docs/essentials)
- Google, [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- Bing, [Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)

## External work that requires the business owner

Website code cannot create third-party citations or change map rankings by itself. Claim or correct these profiles with the identical canonical NAP, then link verified profiles in the organization `sameAs` field:

1. Google Business Profile — primary category, accurate map pin/hours, every real service, current photos, and review responses.
2. Bing Places and Apple Business Connect — supports Bing/Copilot, Maps and Siri discovery.
3. Justdial, Facebook, Instagram, Sulekha and LearnPick — only claim listings that are real and maintain their NAP consistently.
4. Google Search Console and Bing Webmaster Tools — submit the sitemap after deployment, monitor indexed URLs, and use Bing's AI Performance report for citation/grounding data when available.

Before claiming citations, confirm the exact business name, street address/map pin, phone, opening hours and public website domain against the Business Profile. Do not add social or directory URLs to structured data until they are verified.
