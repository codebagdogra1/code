#!/usr/bin/env python3
"""Assemble the static homepage from its parts so the extracted snippets are the
single source of truth for the header and footer.

Sources of truth
----------------
  public/home/page.shell.html   the page body: <head>, hero/sections, scripts —
                                with two markers where the shared chrome goes:
                                    <!-- @@HEADER@@ -->
                                    <!-- @@FOOTER@@ -->
  public/home/snippets/header.html   full site header (contains the primary nav)
  public/home/snippets/footer.html   full site footer

Output
------
  public/home/index.html        the served page (a Next.js rewrite maps / to it)

Edit a snippet or the shell, then run this to regenerate index.html:

    python3 webapp/scripts/build-home.py      (or: npm run build-home)

The primary nav lives inside header.html and is injected with it; there is no
separate nav snippet.
"""
from __future__ import annotations

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
HOME = (HERE / ".." / "public" / "home").resolve()
SHELL = HOME / "page.shell.html"
INDEX = HOME / "index.html"
SNIPPETS = HOME / "snippets"

MARKERS = {
    "<!-- @@HEADER@@ -->": SNIPPETS / "header.html",
    "<!-- @@FOOTER@@ -->": SNIPPETS / "footer.html",
}


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8", errors="surrogatepass")


def build() -> str:
    if not SHELL.exists():
        sys.exit(
            f"error: {SHELL.relative_to(HOME.parent.parent)} not found.\n"
            "Generate it once from index.html with: python3 scripts/build-home.py --init"
        )
    out = read(SHELL)
    for marker, snippet in MARKERS.items():
        count = out.count(marker)
        if count != 1:
            sys.exit(f"error: expected exactly one {marker} in the shell, found {count}")
        out = out.replace(marker, read(snippet).rstrip("\n"))
    return out


def init() -> None:
    """One-time: derive page.shell.html from the current index.html by swapping the
    header and footer blocks for their markers. Verifies each snippet appears
    exactly once so nothing is silently dropped."""
    idx = read(INDEX)
    shell = idx
    for marker, snippet in MARKERS.items():
        block = read(snippet).rstrip("\n")
        count = shell.count(block)
        if count != 1:
            sys.exit(
                f"error: {snippet.name} appears {count} times in index.html "
                "(expected 1). Re-run extract-home-snippets.py so the snippets "
                "match the current index.html, then retry --init."
            )
        shell = shell.replace(block, marker)
    SHELL.write_text(shell, encoding="utf-8", errors="surrogatepass")
    print(f"  wrote {SHELL.relative_to(HOME.parent.parent)}  ({len(shell)} bytes)")


def main() -> None:
    if "--init" in sys.argv[1:]:
        init()
    rebuilt = build()
    check_only = "--check" in sys.argv[1:]
    current = read(INDEX) if INDEX.exists() else None
    if check_only:
        if rebuilt != current:
            sys.exit("error: index.html is out of date — run: npm run build-home")
        print("  index.html is up to date")
        return
    INDEX.write_text(rebuilt, encoding="utf-8", errors="surrogatepass")
    status = "unchanged" if rebuilt == current else "updated"
    print(f"  wrote public/home/index.html  ({len(rebuilt)} bytes, {status})")


if __name__ == "__main__":
    main()
