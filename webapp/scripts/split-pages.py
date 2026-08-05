#!/usr/bin/env python3
"""Extract EduSmart demo *sub-pages* (contact, about, courses, blog, …) into
React-consumable content snippets, reusing the homepage's already-localized
theme asset graph.

Why this is simpler than split-home.py
--------------------------------------
Every demo page is the SAME EduSmart theme, so the <head> stylesheet set and the
end-of-body runtime <script> set are (for our purposes) identical to the
homepage's. We therefore REUSE public/home/snippets/{head.json,scripts.json,
header.html,footer.html} for all sub-pages and only extract each page's unique
*main content* — the markup between the shared <header id="masthead"> and the
shared <div class="thim-ekit__footer">.

For each page we:
  1. slice out the main content (header→footer),
  2. rewrite every wp-content/wp-includes asset URL (images, background-image
     url()s, srcset) to the flat /home/assets/<bucket>/<basename> the homepage
     migration produced,
  3. write it to public/home/pages/<slug>/content.html,
  4. report any referenced asset basenames that are NOT present on disk (these
     are page-specific images that still need sourcing).

Coming-soon (maintenance) is an Elementor *canvas* page with no shared header/
footer; it is extracted whole (full <body> content minus scripts) and flagged
standalone in the manifest.

Run:  python3 webapp/scripts/split-pages.py   (or: npm run split-pages)
"""
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = (HERE / ".." / "..").resolve()          # repo root
DEMO = ROOT / "demo-main"
PUBLIC = (HERE / ".." / "public").resolve()     # webapp/public
ASSETS = PUBLIC / "home" / "assets"
SNIPPETS_DIR = PUBLIC / "home" / "snippets"
OUT = PUBLIC / "home" / "pages"

# slug -> (source html relative to demo-main, standalone?)
PAGES = {
    "contact":     ("contact/index.html", False),
    "about":       ("about-us/index.html", False),
    # NOTE: courses/indexaff3.html renders its grid purely via LearnPress AJAX
    # (the static HTML is only skeletons), so a static mirror can't show cards.
    # courses/index.html is the server-rendered variant with real course cards.
    "courses":     ("courses/index.html", False),
    "blog":        ("category/education/index.html", False),
    "blog-post":   ("how-online-courses-changed-my-life/index.html", False),
    "not-found":   ("404-page.html", False),
    "coming-soon": ("maintenance/index.html", True),
}

FOOTER_OPEN = '<div class="thim-ekit__footer">'
BACK_TO_TOP = re.compile(r'<div id="back-to-top"', re.I)

FONT_EXT = {".woff2", ".woff", ".ttf", ".eot"}
IMG_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}
CSS_EXT = {".css"}
JS_EXT = {".js"}


def bucket_for(ext: str) -> str | None:
    ext = ext.lower()
    if ext in CSS_EXT:
        return "css"
    if ext in JS_EXT:
        return "js"
    if ext in FONT_EXT:
        return "fonts"
    if ext in IMG_EXT:
        return "images"
    return None


# Any wp-content / wp-includes / wp-themes asset reference — absolute
# (https://host/…, optionally with a /demo-main/ segment) or relative (any depth
# of ../, or the old /home/demo-main/ form) — ending in a known asset extension.
# The whole matched URL (including any scheme+host+/demo-main/ prefix) is replaced
# so nothing is left dangling in front of the rewritten /home/assets path.
ASSET_REF = re.compile(
    r"""[^\s"'()<>,\\]*?wp-(?:content|includes|themes)/[^\s"'()<>,\\]+?"""
    r"""\.(?:css|js|png|jpe?g|webp|gif|svg|woff2?|ttf|eot)""",
    re.IGNORECASE,
)


def rewrite_assets(html: str, referenced: set[str]) -> str:
    """Rewrite wp-* asset URLs to /home/assets/<bucket>/<basename>. Records the
    basename of every rewritten reference in `referenced`."""

    def repl(m: re.Match) -> str:
        url = m.group(0)
        base = os.path.basename(url)          # keeps ?ver=… out? no — strip query
        base = base.split("?")[0].split("#")[0]
        ext = os.path.splitext(base)[1]
        bucket = bucket_for(ext)
        if not bucket:
            return url
        referenced.add(f"{bucket}/{base}")
        return f"/home/assets/{bucket}/{base}"

    return ASSET_REF.sub(repl, html)


def match_element(text: str, start: int, tag: str) -> int:
    """Index just past the </tag> matching the <tag at `start` (depth-counted)."""
    open_re = re.compile(rf"<{tag}\b", re.I)
    close_re = re.compile(rf"</{tag}\s*>", re.I)
    depth, i, n = 0, start, len(text)
    while i < n:
        mo = open_re.search(text, i)
        mc = close_re.search(text, i)
        if mc is None:
            return n
        if mo is not None and mo.start() < mc.start():
            depth += 1
            i = mo.end()
        else:
            depth -= 1
            i = mc.end()
            if depth == 0:
                return i
    return n


# ThimPress theme-demo chrome (floating "Demos"/"Buy Now" panel, buy popup,
# progress overlay) — never part of the real site. Match by the root markers.
CHROME_MARKERS = ("tp_sidebar", "tp_chameleon_overlay", "tp_chameleon_progress",
                  "tp-buy-popup", "tp-demos-wrapper")


def strip_chrome(html: str) -> str:
    """Remove every <div> (at any nesting depth) whose opening tag carries a
    demo-chrome marker, using balanced matching so the whole element goes with
    it. Repeats from the start after each removal so an outer removal subsumes any
    inner markers."""
    div_open = re.compile(r"<div\b[^>]*>", re.I)
    while True:
        for m in div_open.finditer(html):
            if any(mk in m.group(0) for mk in CHROME_MARKERS):
                end = match_element(html, m.start(), "div")
                html = html[:m.start()] + html[end:]
                break
        else:
            return html


def first_block(html: str, marker: str) -> tuple[int, int] | None:
    """(start, end) of the first <div> whose opening tag contains `marker`."""
    for m in re.finditer(r"<div\b[^>]*>", html, re.I):
        if marker in m.group(0):
            return m.start(), match_element(html, m.start(), "div")
    return None


def courses_grid_from_home() -> str:
    """Harvest the static LearnPress course-card grid from the homepage's course
    section (snippets/sections/04.html). The demo's own Courses archive renders
    its grid purely via AJAX (skeletons only), so we splice in these real cards —
    same theme, already-localized images — to give a populated Courses page."""
    sec = (SNIPPETS_DIR / "sections" / "04.html").read_text(encoding="utf-8")
    span = first_block(sec, "learn-press-courses")
    if not span:
        return ""
    return sec[span[0]:span[1]]


def inject_courses_grid(content: str) -> str:
    """Replace the Courses archive's AJAX skeleton list with the harvested grid."""
    grid = courses_grid_from_home()
    span = first_block(content, "lp-list-courses-default")
    if not grid or not span:
        return content
    replacement = f'<div class="lp-list-courses-default">{grid}</div>'
    return content[:span[0]] + replacement + content[span[1]:]


def collect_head_styles(head_html: str, referenced: set[str]) -> list[dict]:
    """Inline <style> blocks from a page <head>, asset URLs (fonts / background
    images inside url()) rewritten to /home/assets. We deliberately IGNORE
    stylesheet <link>s: every theme stylesheet a demo page links is already in
    the homepage's shared head.json (only under a differently-hashed filename),
    so re-linking them would just 404. The page-unique styling that actually
    matters — the `#elementor-post-<id>` block with each page's section spacing,
    backgrounds and header offset — lives in these inline blocks."""
    out: list[dict] = []
    for m in re.finditer(r"<style\b[^>]*>(.*?)</style>", head_html, re.I | re.S):
        css = rewrite_assets(m.group(1), referenced)
        out.append({"t": "style", "css": css})
    return out


def shared_style_keys() -> set[str]:
    """Normalized inline-style bodies already in the homepage's shared head.json,
    so per-page heads only carry the delta."""
    shared = json.loads(
        (PUBLIC / "home" / "snippets" / "head.json").read_text(encoding="utf-8")
    )
    return {re.sub(r"\s+", "", r["css"]) for r in shared if r["t"] == "style"}


def extract_main(body_inner: str, slug: str, standalone: bool) -> str:
    if standalone:
        # Elementor canvas: no shared header/footer. Take everything from the
        # first real content div to just before back-to-top / end, dropping the
        # leading no-js script + popup shim.
        start = body_inner.find('<div data-elementor-type')
        if start == -1:
            sys.exit(f"{slug}: could not find elementor canvas wrapper")
        m = BACK_TO_TOP.search(body_inner, start)
        end = m.start() if m else len(body_inner)
        return body_inner[start:end].strip()

    # Shared-chrome page: content is between </header> and the footer open.
    he = body_inner.find("</header>")
    if he == -1:
        sys.exit(f"{slug}: no </header> found")
    start = he + len("</header>")
    fi = body_inner.find(FOOTER_OPEN, start)
    if fi == -1:
        sys.exit(f"{slug}: no footer open ({FOOTER_OPEN!r}) found")
    main = body_inner[start:fi]
    # Drop the leading "<!-- #masthead -->" comment if present.
    main = re.sub(r"^\s*<!--\s*#masthead\s*-->\s*", "", main)
    return main.strip()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict] = {}
    all_missing: dict[str, list[str]] = {}
    shared_styles = shared_style_keys()

    for slug, (rel, standalone) in PAGES.items():
        src = DEMO / rel
        if not src.exists():
            sys.exit(f"{slug}: source not found: {src}")
        text = src.read_text(encoding="utf-8", errors="surrogatepass")
        head_inner = re.search(r"<head\b[^>]*>(.*?)</head>", text, re.I | re.S).group(1)
        body_inner = re.search(r"<body\b[^>]*>(.*)</body>", text, re.I | re.S).group(1)
        body_class = re.search(r'<body\b[^>]*class="([^"]*)"', text, re.I)
        title = re.search(r"<title>(.*?)</title>", text, re.I | re.S)

        content = extract_main(body_inner, slug, standalone)
        # Drop <script> tags: they never execute when injected via innerHTML, and
        # the shared scripts.json (EduScripts) provides the real runtime. Leaving
        # them in only litters dead nodes pointing at un-localized JS.
        content = re.sub(r"<script\b[^>]*>.*?</script>", "", content, flags=re.I | re.S)
        # Strip the ThimPress theme-demo switcher chrome ("Demos"/"Buy Now" float,
        # quick-view / buy popups) — never part of the real site.
        content = strip_chrome(content)
        # The Courses archive grid is AJAX-only in the demo (skeletons); splice in
        # the homepage's real static course cards so the page is populated.
        if slug == "courses":
            content = inject_courses_grid(content)
        referenced: set[str] = set()
        content = rewrite_assets(content, referenced)

        # Per-page head = the page's own inline styles minus what the shared head
        # already carries. This includes the crucial `#elementor-post-<id>` block
        # that defines each page's section spacing / backgrounds / header offset.
        head_ref: set[str] = set()
        page_head = [
            r for r in collect_head_styles(head_inner, head_ref)
            if re.sub(r"\s+", "", r["css"]) not in shared_styles
        ]
        referenced |= head_ref

        page_dir = OUT / slug
        page_dir.mkdir(parents=True, exist_ok=True)
        (page_dir / "content.html").write_text(content + "\n", encoding="utf-8")
        (page_dir / "head.json").write_text(
            json.dumps(page_head, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )

        # which referenced assets are missing on disk?
        missing = sorted(
            rel_ for rel_ in referenced if not (ASSETS / rel_).exists()
        )
        if missing:
            all_missing[slug] = missing

        manifest[slug] = {
            "source": rel,
            "standalone": standalone,
            "bodyClass": body_class.group(1).strip() if body_class else "",
            "title": (title.group(1).strip() if title else ""),
            "bytes": len(content),
            "headResources": len(page_head),
            "assetsReferenced": len(referenced),
            "assetsMissing": len(missing),
        }
        print(f"  {slug:12s} {len(content):>7d} bytes  head={len(page_head):<3d} "
              f"refs={len(referenced):<3d} missing={len(missing)}")

    (OUT / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )

    if all_missing:
        print("\nMISSING page-specific assets (need sourcing):")
        for slug, miss in all_missing.items():
            print(f"  {slug}:")
            for m in miss:
                print(f"      {m}")


if __name__ == "__main__":
    main()
