# Homepage Asset Migration

Reorganize the static homepage (`webapp/public/home/index.html`) so its CSS, JS,
images, and fonts live in one clean, dedicated `assets/` tree instead of the deep
`demo-main/wp-content/...` WordPress-export layout — and extract repeated HTML
blocks into reusable snippets.

> Companion checklist: [TODO.md](./TODO.md)

---

## Background

`webapp/public/home/index.html` is an exact static mirror of the EduSmart demo. It
is served at `/` by a `beforeFiles` rewrite in
[`webapp/next.config.ts`](../../next.config.ts):

```ts
rewrites() {
  return { beforeFiles: [{ source: "/", destination: "/home/index.html" }], ... };
}
```

Because it is a plain `.html` file (not a React page), there is **no runtime
include mechanism**. Snippets are therefore standalone partial files for
copy/paste reuse and documentation, not server-side includes.

## Current state (before migration)

- **`index.html`** — 380 KB, ~2,687 lines.
- All real asset references use absolute paths:
  - `/home/demo-main/wp-content/...`
  - `/home/demo-main/wp-includes/...`
  - → resolve on disk to `webapp/public/home/demo-main/...`
- **193 distinct asset files** are referenced directly from `index.html`:

  | Type   | Count |
  |--------|-------|
  | `.jpg` | 59    |
  | `.css` | 44    |
  | `.js`  | 41    |
  | `.png` | 39    |
  | `.svg` | 7     |
  | `.webp`| 3     |
  | `.woff2`| 2    |

- 2 referenced files do **not** exist on disk (`wp-emoji-loader.min.js`,
  `wp-emoji-release.min.js`) — these come from inline WordPress emoji bootstrap
  code and are left untouched.

### Entanglement risk (why this isn't a plain `mv`)

CSS files reference their **own** fonts/images internally, so moving a `.css`
without fixing those references silently breaks fonts:

- **Relative** `url(../webfonts/...)` / `url(../fonts/...)` — Font Awesome,
  thim-elementor-kit, WooCommerce, etc.
- **Absolute** `url(/home/wp-content/uploads/elementor/google-fonts/fonts/...)` —
  Google font CSS (points at the **root** `public/home/wp-content` copy, 12 MB,
  which is otherwise unreferenced and only reached through these `url()`s).
- **`data:` URIs** — inlined SVG/PNG/woff; location-independent, left as-is.

The migration therefore computes the **transitive closure** (index.html refs +
everything those CSS files pull in) and rewrites every `url()` too.

## Target state (after migration)

```
webapp/public/home/
  index.html                 # all refs now point at /home/assets/...
  assets/
    css/                     # every .css (internal url() rewritten)
    js/                      # every .js
    images/                  # png jpg jpeg webp gif + icon svgs
    fonts/                   # woff2 woff ttf eot + font svgs
  snippets/                  # reusable static HTML partials
    header.html, footer.html, nav.html, course-card.html, ...
```

- **Layout chosen:** flat, by asset type, with `url()` inside CSS rewritten to
  `/home/assets/fonts|images/...`. (Cleanest end-state.)
- **Naming:** files keep their basename; on a basename collision within a target
  folder (e.g. three `frontend.css`, two `index.js`, two `style.css`) the losing
  file is prefixed with a short source token, e.g. `thim-ekits-frontend.css`.
- The old `demo-main/wp-content`, `demo-main/wp-includes`, and the orphan root
  `wp-content` / `wp-includes` copies are removed **only after** verification.

## How the migration runs

A single deterministic script does the whole thing and can be dry-run first:

```
webapp/scripts/migrate-home-assets.py --dry-run   # prints full old->new plan, no writes
webapp/scripts/migrate-home-assets.py --apply     # copies files + rewrites index.html & CSS
```

The script:
1. Parses `index.html` for every `/home/...*.{css,js,img,font}` reference.
2. Parses each referenced CSS for `url()` (skipping `data:`), resolving relative
   and absolute forms to disk to extend the closure with fonts/images.
3. Assigns collision-safe new paths under `assets/{css,js,images,fonts}/`.
4. Copies files (CSS written with rewritten `url()`), rewrites `index.html`.
5. Writes `mapping.json` (old→new for every file) for audit + rollback.

## Verification

- `grep -c '/home/demo-main/wp-' index.html` → **0** asset refs remain.
- Every `/home/assets/...` reference resolves to a file on disk.
- No `url(` inside `assets/css/` points outside `/home/assets/` (except `data:`).
- Visual check of `/` in the running app (fonts, icons, images, layout intact).

## Rollback

Everything is under git. `mapping.json` records every move. To revert:
`git checkout -- webapp/public/home` (before old copies are deleted), or reverse
the mapping.
