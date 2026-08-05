# Homepage snippets

Reusable, self-balanced HTML partials for the EduSmart homepage.

## Current: the React route (`src/app/(edu)`)

`/` is now a **real React route**, not a static file — the EduSmart monolith
ported into `src/app/(edu)/` (its own root layout, isolated from the main app's
Tailwind). `scripts/split-home.py` is the source-of-truth → snippets step:

```
page.shell.html ─┐
snippets/header.html ─┼─► split-home.py ─► head.json · body-class.txt
snippets/footer.html ─┘                    sections/01..12.html · scripts.json
                                            │
                              src/app/(edu)/page.tsx reads them at build,
                              injects header + 12 sections + footer, and
                              EduScripts.tsx replays scripts.json in order.
```

```
npm run split-home            # from webapp/  (regenerate after editing the shell/snippets)
```

Outputs consumed by the route (all in this folder):

| File              | Consumed by            | Contents |
|-------------------|------------------------|----------|
| `head.json`       | `(edu)/EduHead.tsx`    | Ordered `<head>` CSS: 38 stylesheets + 11 inline `<style>` + icons. React 19 hoists them into `<head>`. |
| `sections/NN.html`| `(edu)/page.tsx`       | The 12 top-level Elementor `.e-con.e-parent` sections; injected as direct children of `.elementor-10`. |
| `scripts.json`    | `(edu)/EduScripts.tsx` | 54 runtime scripts (jQuery → Elementor → swiper → custom-script) in exact WP order, replayed client-side after mount. |
| `body-class.txt`  | `(edu)/layout.tsx`     | The original `<body>` class list. |
| `header.html` / `footer.html` | `(edu)/page.tsx` | Site chrome (below). |

## Legacy: the static `index.html` build (`build-home.py`)

The section below documents the **previous** static-mirror flow. `../index.html`
is no longer served (the `/` → `/home/index.html` rewrite was removed), so
`build-home.py` is vestigial — kept for history / re-deriving the shell. Editing
snippets now feeds `split-home.py`, above.

Reusable, self-balanced HTML partials for the static EduSmart homepage mirror
that used to be served at `/`. The page was a plain `.html` file served via a
Next.js rewrite, so there was no runtime include — instead a **build step**
stitched these partials into `../index.html` at author time, which made
`header.html` and `footer.html` the single source of truth for the site chrome.

## Build flow (source of truth → page)

```
snippets/header.html ─┐
                      ├─►  build-home.py  ─►  index.html   (the served page)
snippets/footer.html ─┤
page.shell.html      ─┘   (page <head>, sections, scripts,
                           with @@HEADER@@ / @@FOOTER@@ markers)
```

Edit `header.html`, `footer.html`, or `../page.shell.html`, then regenerate:

```
npm run build-home            # from webapp/  (or: python3 scripts/build-home.py)
npm run build-home:check      # CI/pre-commit: fail if index.html is stale
```

`build-home.py` substitutes the two markers in `page.shell.html` with the header
and footer snippets. The nav lives **inside** `header.html`, so it is not injected
separately.

## Regenerating the snippets themselves

The partials were originally sliced out of `index.html` by the extractor, which
uses tag-depth counting so each file is a complete, balanced element (no truncated
Elementor nesting):

```
npm run home:extract          # (or: python3 scripts/extract-home-snippets.py)
```

Run this only to re-derive the snippets from the page — e.g. after a bulk edit
made directly in `index.html`. In the normal flow the snippets are the source and
`index.html` is the output, so you edit the snippets and run `build-home`, not the
other way around. `nav.html` is a read-only sub-extract of `header.html` produced
by this extractor; nothing consumes it at build time.

## Partials

| File          | Source element                         | Notes |
|---------------|----------------------------------------|-------|
| `header.html` | `<header id="masthead">…</header>`     | Full site header: logo, top bar, primary nav. **Contains `nav.html`.** Injected at `@@HEADER@@`. |
| `nav.html`    | `<nav class="width-navigation …">`     | Primary navigation only (a sub-slice of the header). Read-only extract; not injected. |
| `footer.html` | `<div class="thim-ekit__footer">…</div>` | Site footer: logo, link columns, social icons, app-store badges. Injected at `@@FOOTER@@`. |

The remaining page content (the `<head>`, all body sections, and the closing
scripts) lives in [`../page.shell.html`](../page.shell.html) with `<!-- @@HEADER@@ -->`
and `<!-- @@FOOTER@@ -->` markers where the two partials are spliced in.

## Asset dependencies

All assets referenced by these partials live under `/home/assets/` (migrated out
of `demo-main/wp-content` — see [../../../docs/home-assets/README.md](../../../docs/home-assets/README.md)):

- **Images** — `/home/assets/images/` (e.g. `new-logo.png`, `edulearn1*.jpg`,
  `App-store-gg-play*.png`).
- **Styling** — the partials rely on the same global CSS the page loads from
  `/home/assets/css/` (Elementor + thim-elementor-kit + theme). To reuse a
  partial on another page, include those stylesheets or it will be unstyled.
- **Icons/fonts** — icon markup (`<i class="tk …">`, Font Awesome) needs the
  font CSS in `/home/assets/css/` and glyph files in `/home/assets/fonts/`.

## Caveats

- Markup is Elementor-generated: class names are element-id-scoped
  (`.elementor-250 .elementor-element-…`), so styling only fully matches when the
  page's inline `<style id="elementor-post-*">` blocks are also present. These
  partials are best used within this same site, not as standalone components.
- Internal page links still point at `/home/demo-main/...` routes (nav menu,
  footer links). Those are page URLs, not assets, and were intentionally left
  unchanged by the asset migration.
