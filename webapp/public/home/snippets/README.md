# Homepage snippets

Reusable, self-balanced HTML partials extracted from `../index.html` (the static
EduSmart homepage mirror served at `/`). These are **copy/paste** partials — the
page is a plain `.html` file served via a Next.js rewrite, so there is no runtime
include. Regenerate them any time with:

```
python3 webapp/scripts/extract-home-snippets.py
```

The extractor uses tag-depth counting, so each file is a complete, balanced
element (no truncated Elementor nesting).

## Partials

| File          | Source element                         | Notes |
|---------------|----------------------------------------|-------|
| `header.html` | `<header id="masthead">…</header>`     | Full site header: logo, top bar, primary nav. **Contains `nav.html`.** |
| `nav.html`    | `<nav class="width-navigation …">`     | Primary navigation only (a sub-slice of the header). |
| `footer.html` | `<div class="thim-ekit__footer">…</div>` | Site footer: logo, link columns, social icons, app-store badges. |

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
