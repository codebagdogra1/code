# Homepage Asset Migration — TODO

Legend: `[ ]` pending · `[~]` in progress · `[x]` done · `[!]` needs decision

See [README.md](./README.md) for full context.

## Decisions (locked)

- [x] **Folder layout** — flat `assets/{css,js,images,fonts}/` **+ rewrite `url()`
      inside CSS**. (Alt options considered: keep font subdirs / group by source.)
- [x] **Snippets** — standalone static HTML partials under
      `webapp/public/home/snippets/`. (Alt: React components / defer.)

## Phase 0 — Docs & analysis

- [x] Inventory assets referenced by `index.html` (193 files).
- [x] Identify CSS-internal `url()` entanglement (relative + absolute + data:).
- [x] Confirm serving path (`/` → `/home/index.html` rewrite).
- [x] Write this doc + TODO.

## Phase 1 — Migration script

- [x] Write `webapp/scripts/migrate-home-assets.py`.
- [x] Dry-run; review old→new mapping (collisions, svg font-vs-image split).
      → 241 files in closure, collisions auto-prefixed (e.g. `contact-form-7-index.js`).
- [x] Confirm the google-fonts CSS + its root-copy fonts are pulled into closure.

## Phase 2 — Move assets

- [x] `--apply`: create `assets/{css,js,images,fonts}/`, copy files.
      → css 44, js 39, images 123, fonts 35 = 241.
- [x] Rewrite `index.html` references → `/home/assets/...` (193 refs).
- [x] Rewrite `url()` inside every moved CSS → `/home/assets/fonts|images/...` (110).
- [x] Write `mapping.json` audit file (`assets/mapping.json`).

## Phase 3 — Verify

- [x] `grep '/home/demo-main/wp-' index.html` → only the 2 non-existent wp-emoji refs.
- [x] Every `/home/assets/...` ref (193) resolves to a real file on disk.
- [x] Only 5 `url(` escape `/home/assets/` — all pre-existing dead links (files
      absent from demo-main on disk; 404 before and after).
- [x] Ran app (dev server :3000): `/` + sampled CSS/JS/font/image all return **200**.

## Phase 4 — Snippets

- [x] Extract reusable partials into `snippets/` (via
      `scripts/extract-home-snippets.py`, tag-depth balanced):
  - [x] `header.html` (logo + top bar + primary nav; contains nav)
  - [x] `nav.html` (primary navigation)
  - [x] `footer.html` (logo, link columns, social, app-store badges)
  - [~] `course-card.html` / `testimonial.html` / `cta.html` / `partner-logos.html`
        — deferred: these are deeply id-scoped Elementor blobs with low
        standalone-reuse value; documented as a follow-up in `snippets/README.md`.
- [x] Add `snippets/README.md` documenting each partial + `/home/assets/` deps.

## Phase 5 — Cleanup  (⚠ BLOCKED — needs user approval)

- [!] Remove migrated originals: `demo-main/`, root `wp-content/`, `wp-includes/`.
      `git rm -r` was **blocked by the permission classifier** (destructive). The
      dirs are now fully orphaned (nothing references them except the 2 dead
      wp-emoji links). Awaiting user go-ahead to delete.
- [x] `cdn-cgi/` (Cloudflare email-decode) left as-is (referenced, special path).
- [x] Final `grep` sweep: no surviving asset refs into old dirs (only 2 wp-emoji).
- [ ] Commit (branch `redesign-site`) — pending, after cleanup decision.

## Open items / notes

- [ ] `wp-emoji-loader.min.js` / `wp-emoji-release.min.js` referenced but absent —
      leave inline WP emoji code untouched (not real files).
- [ ] `.svg` split: files under a `webfonts/` or `fonts/` dir → `assets/fonts/`;
      all other svgs → `assets/images/`.
- [ ] Nav links like `/home/demo-main/courses` (no file extension) are page links,
      **not** assets — left unchanged (they 404 in this static mirror already).
