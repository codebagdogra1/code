#!/usr/bin/env python3
"""Split the EduSmart homepage monolith into React-consumable snippets.

Source of truth
---------------
  public/home/page.shell.html   the full page: <head>, body chrome markers
                                (@@HEADER@@ / @@FOOTER@@) and the 12 Elementor
                                content sections in between.

Outputs (public/home/snippets/)
-------------------------------
  head.html            everything in <head> EXCEPT <script> and <title>
                       (stylesheets + inline <style> + meta/link) — injected
                       into the React <body> top; browsers apply body <link>s.
  sections/01..12.html the 12 top-level `.e-con.e-parent` content sections,
                       each a self-balanced fragment. Concatenated back into the
                       exact `.elementor-10` wrapper by the React page so
                       Elementor's :nth-of-type / direct-child rules still match.
  scripts.json         the ordered runtime: every executable <script> from <head>
                       and the end of <body>, in document order, as either
                       {type:"src", src, attrs} or {type:"inline", id, code}.
                       Host-specific cruft (Cloudflare email-decode) and non-JS
                       data blocks (speculationrules / json / templates) dropped.
  body-class.txt       the original <body> class list (for the (edu) layout).

header.html / footer.html already exist (see extract-home-snippets.py) and are
reused as-is. Run after editing the shell:

    python3 webapp/scripts/split-home.py     (or: npm run split-home)
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
HOME = (HERE / ".." / "public" / "home").resolve()
SHELL = HOME / "page.shell.html"
SNIPPETS = HOME / "snippets"
SECTIONS_DIR = SNIPPETS / "sections"

HEADER_MARKER = "<!-- @@HEADER@@ -->"
FOOTER_MARKER = "<!-- @@FOOTER@@ -->"

# External scripts we deliberately do NOT reload in the React port.
SKIP_SRC_SUBSTR = ("/cdn-cgi/",)  # Cloudflare email-obfuscation shim (404s off-WP)


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8", errors="surrogatepass")


def match_element(text: str, start: int, tag: str) -> int:
    """Given text and the index of a `<tag` opening, return the index just past
    its matching `</tag>` using depth counting over that tag only."""
    open_re = re.compile(rf"<{tag}\b", re.I)
    close_re = re.compile(rf"</{tag}\s*>", re.I)
    depth = 0
    i = start
    n = len(text)
    while i < n:
        m_open = open_re.search(text, i)
        m_close = close_re.search(text, i)
        if m_close is None:
            raise ValueError(f"unbalanced <{tag}> starting at {start}")
        if m_open is not None and m_open.start() < m_close.start():
            depth += 1
            i = m_open.end()
        else:
            depth -= 1
            i = m_close.end()
            if depth == 0:
                return i
    raise ValueError(f"unbalanced <{tag}> starting at {start}")


def split_sections(wrapper_inner: str) -> list[str]:
    """Emit each top-level `.e-con.e-parent` <div> child of the content wrapper."""
    sections: list[str] = []
    i = 0
    n = len(wrapper_inner)
    div_open = re.compile(r"<div\b[^>]*>", re.I)
    while i < n:
        m = div_open.search(wrapper_inner, i)
        if m is None:
            break
        end = match_element(wrapper_inner, m.start(), "div")
        block = wrapper_inner[m.start():end]
        if "e-con e-parent" in m.group(0) or "e-parent" in m.group(0):
            sections.append(block)
        i = end
    return sections


def collect_head(head_css: str) -> list[dict]:
    """Parse the (script-free) <head> into an ordered list of resources so the
    React layout can render them as real elements and let React 19 hoist them
    into <head> in order (no FOUC, no body-injected stylesheets)."""
    out: list[dict] = []
    token = re.compile(
        r"<style\b([^>]*)>(.*?)</style>|<link\b([^>]*?)/?>|<meta\b([^>]*?)/?>",
        re.I | re.S,
    )
    for m in token.finditer(head_css):
        if m.group(0).lower().startswith("<style"):
            out.append({"t": "style", "css": m.group(2)})
        elif m.group(0).lower().startswith("<link"):
            attrs = m.group(3)
            rel = re.search(r'rel\s*=\s*["\']([^"\']+)["\']', attrs, re.I)
            href = re.search(r'href\s*=\s*["\']([^"\']+)["\']', attrs, re.I)
            if rel and "stylesheet" in rel.group(1).lower() and href:
                media = re.search(r'media\s*=\s*["\']([^"\']+)["\']', attrs, re.I)
                out.append({"t": "css", "href": href.group(1),
                            "media": media.group(1) if media else "all"})
            elif href and rel and "icon" in rel.group(1).lower():
                sizes = re.search(r'sizes\s*=\s*["\']([^"\']+)["\']', attrs, re.I)
                out.append({"t": "icon", "rel": rel.group(1), "href": href.group(1),
                            "sizes": sizes.group(1) if sizes else None})
        # bare <meta> generators / feed <link>s are dropped — not needed in the port.
    return out


def collect_scripts(fragment: str) -> list[dict]:
    """Return ordered executable <script> descriptors from an HTML fragment."""
    out: list[dict] = []
    script_re = re.compile(r"<script\b([^>]*)>(.*?)</script>", re.I | re.S)
    for m in script_re.finditer(fragment):
        attrs_raw, body = m.group(1), m.group(2)
        type_m = re.search(r'type\s*=\s*["\']([^"\']+)["\']', attrs_raw, re.I)
        stype = (type_m.group(1).lower() if type_m else "text/javascript")
        # Only real JS runs; skip json / templates / speculationrules / modules-as-data.
        if stype not in ("text/javascript", "application/javascript", "module", ""):
            continue
        src_m = re.search(r'src\s*=\s*["\']([^"\']+)["\']', attrs_raw, re.I)
        if src_m:
            src = src_m.group(1)
            if any(s in src for s in SKIP_SRC_SUBSTR):
                continue
            out.append({
                "type": "src",
                "src": src,
                "async": bool(re.search(r"\basync\b", attrs_raw, re.I)),
                "defer": bool(re.search(r"\bdefer\b", attrs_raw, re.I)),
            })
        else:
            code = body.strip()
            if not code:
                continue
            id_m = re.search(r'id\s*=\s*["\']([^"\']+)["\']', attrs_raw, re.I)
            out.append({
                "type": "inline",
                "id": id_m.group(1) if id_m else "",
                "code": body,
            })
    return out


def main() -> None:
    text = read(SHELL)

    head_inner = re.search(r"<head\b[^>]*>(.*?)</head>", text, re.I | re.S).group(1)
    body_open = re.search(r"<body\b([^>]*)>", text, re.I).group(0)
    body_class = re.search(r'class\s*=\s*["\']([^"\']*)["\']', body_open, re.I).group(1)
    body_inner = re.search(r"<body\b[^>]*>(.*)</body>", text, re.I | re.S).group(1)

    if HEADER_MARKER not in body_inner or FOOTER_MARKER not in body_inner:
        sys.exit("error: header/footer markers missing from shell body")
    mid = body_inner.split(HEADER_MARKER, 1)[1].split(FOOTER_MARKER, 1)[0]
    post_footer = body_inner.split(FOOTER_MARKER, 1)[1]

    # Content wrapper: <div data-elementor-type="wp-page" ... class="elementor elementor-10">
    wrap_m = re.search(r'<div\b[^>]*\bclass="elementor elementor-10"[^>]*>', mid, re.I)
    if not wrap_m:
        sys.exit("error: could not find the .elementor-10 content wrapper")
    wrap_end = match_element(mid, wrap_m.start(), "div")
    wrapper_full = mid[wrap_m.start():wrap_end]
    wrapper_inner = wrapper_full[wrap_m.end() - wrap_m.start():-len("</div>")]

    sections = split_sections(wrapper_inner)
    if len(sections) != 12:
        sys.exit(f"error: expected 12 sections, found {len(sections)}")

    # head.html — stylesheets + inline styles + meta/link, minus scripts + title.
    head_css = re.sub(r"<script\b[^>]*>.*?</script>", "", head_inner, flags=re.I | re.S)
    head_css = re.sub(r"<title\b[^>]*>.*?</title>", "", head_css, flags=re.I | re.S)
    head_css = re.sub(r'<meta\s+charset[^>]*>', "", head_css, flags=re.I)
    head_css = re.sub(r'<meta\s+name="viewport"[^>]*>', "", head_css, flags=re.I)

    scripts = collect_scripts(head_inner) + collect_scripts(post_footer)
    head = collect_head(head_css)

    SECTIONS_DIR.mkdir(parents=True, exist_ok=True)
    (SNIPPETS / "head.json").write_text(
        json.dumps(head, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    (SNIPPETS / "body-class.txt").write_text(body_class.strip() + "\n", encoding="utf-8")
    (SNIPPETS / "scripts.json").write_text(
        json.dumps(scripts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    for idx, block in enumerate(sections, 1):
        (SECTIONS_DIR / f"{idx:02d}.html").write_text(block.strip() + "\n", encoding="utf-8")

    print(f"  head.json        {len(head)} resources "
          f"({sum(h['t']=='css' for h in head)} css, "
          f"{sum(h['t']=='style' for h in head)} inline-style, "
          f"{sum(h['t']=='icon' for h in head)} icon)")
    print(f"  body-class.txt   {body_class[:40]}...")
    print(f"  sections/01..12  {len(sections)} files")
    print(f"  scripts.json     {len(scripts)} scripts "
          f"({sum(s['type']=='src' for s in scripts)} src, "
          f"{sum(s['type']=='inline' for s in scripts)} inline)")


if __name__ == "__main__":
    main()
