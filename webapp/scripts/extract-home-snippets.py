#!/usr/bin/env python3
"""Extract reusable, balanced HTML partials from the static homepage into
webapp/public/home/snippets/. Uses tag-depth counting so nested Elementor
markup stays balanced (line-range guessing would truncate mid-element).

Usage: python3 extract-home-snippets.py
"""
from __future__ import annotations

import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
HOME = (HERE / ".." / "public" / "home").resolve()
INDEX = HOME / "index.html"
OUT = HOME / "snippets"

html = INDEX.read_text(encoding="utf-8", errors="surrogatepass")

TAG_RE = re.compile(r"<(/?)([a-zA-Z][\w-]*)([^>]*?)(/?)>")
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}


def extract_balanced(text: str, start: int, tag: str) -> tuple[int, int]:
    """Return (start, end) covering a balanced <tag>...</tag> beginning at the
    first `<tag` at or after `start`."""
    open_at = text.index("<" + tag, start)
    depth = 0
    i = open_at
    while i < len(text):
        m = TAG_RE.search(text, i)
        if not m:
            break
        closing, name, _attrs, selfclose = m.groups()
        if name.lower() == tag.lower():
            if closing:
                depth -= 1
                if depth == 0:
                    return open_at, m.end()
            elif not (selfclose or name.lower() in VOID):
                depth += 1
        i = m.end()
    raise ValueError(f"no balanced </{tag}> found from {start}")


def find_after(marker: str) -> int:
    idx = html.find(marker)
    if idx < 0:
        raise ValueError(f"marker not found: {marker!r}")
    return idx


OUT.mkdir(parents=True, exist_ok=True)

jobs = [
    # (output file, opening-marker to seek, tag to balance)
    ("header.html", '<header id="masthead"', "header"),
    ("footer.html", '<div class="thim-ekit__footer">', "div"),
]

results = []
for fname, marker, tag in jobs:
    start = find_after(marker)
    s, e = extract_balanced(html, start, tag)
    block = html[s:e]
    (OUT / fname).write_text(block + "\n", encoding="utf-8", errors="surrogatepass")
    results.append((fname, block.count("\n") + 1, len(block)))

for fname, lines, chars in results:
    print(f"  wrote snippets/{fname:14} {lines:>5} lines  {chars:>7} bytes")
