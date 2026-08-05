#!/usr/bin/env python3
"""Download the page-specific assets split-pages.py flagged as missing.

Sub-pages reference thumbnail sizes / images the homepage build never localized.
This resolves each missing basename's ORIGINAL url from the demo-main HTML (a
single corpus pass), downloads it from the live origin into the flat
/home/assets/<bucket>/ tree, and — for any WxH variant the origin lacks —
regenerates it from the full-size base with `sips` (macOS).

Run after split-pages.py:  python3 webapp/scripts/fetch-missing-assets.py
"""
from __future__ import annotations

import os
import re
import subprocess
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = (HERE / ".." / "..").resolve()
DEMO = ROOT / "demo-main"
ASSETS = (HERE / ".." / "public" / "home" / "assets").resolve()
PAGES_DIR = (HERE / ".." / "public" / "home" / "pages").resolve()
ORIGIN = "https://edusmart.physcode.com"

REF = re.compile(r"/home/assets/(css|js|fonts|images)/([^\s\"'()<>,\\?#]+)")
SIZE_RE = re.compile(r"^(?P<stem>.+)-(?P<w>\d+)x(?P<h>\d+)(?P<ext>\.[a-zA-Z]+)$")


def missing_refs() -> set[tuple[str, str]]:
    out: set[tuple[str, str]] = set()
    # Scan both the page content AND its head.json: per-page inline styles carry
    # asset URLs too (e.g. Elementor section background-image url()s like faq-bg),
    # and those are just as "missing" as content images if never localized.
    for pat in ("*/content.html", "*/head.json"):
        for f in PAGES_DIR.glob(pat):
            for bucket, name in REF.findall(f.read_text(encoding="utf-8")):
                if not (ASSETS / bucket / name).exists():
                    out.add((bucket, name))
    return out


def build_url_index(basenames: set[str]) -> dict[str, str]:
    """One pass over demo-main HTML: map each wanted basename to a fetchable URL."""
    want = {b: None for b in basenames}
    pat = re.compile(
        r"([^\s\"'()<>,\\]*wp-(?:content|includes|themes)/[^\s\"'()<>,\\]*?"
        r"(" + "|".join(re.escape(b) for b in basenames) + r"))"
    )
    remaining = set(basenames)
    for html in DEMO.rglob("*.html"):
        if not remaining:
            break
        text = html.read_text(encoding="utf-8", errors="replace")
        for m in pat.finditer(text):
            ref, base = m.group(1), m.group(2)
            if base in remaining:
                want[base] = ref_to_url(ref)
                remaining.discard(base)
    return {k: v for k, v in want.items() if v}


def ref_to_url(ref: str) -> str:
    """Resolve a demo asset reference (absolute URL, or ../ / /demo-main relative)
    to a fetchable origin URL."""
    if ref.startswith(("http://", "https://")):
        return ref
    ref = re.sub(r"^(\.\./)+", "", ref).lstrip("/")
    ref = re.sub(r"^demo-main/", "", ref)
    return f"{ORIGIN}/{ref}"


def download(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            if r.status != 200:
                return False
            data = r.read()
        if dest.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif"} and \
           data[:15].lstrip().lower().startswith(b"<!doctype"):
            return False
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        return True
    except Exception:
        return False


def sips_variant(base: Path, dest: Path, w: int, h: int, ext: str) -> bool:
    try:
        subprocess.run(
            ["sips", "-s", "format", ext.lstrip(".").replace("jpg", "jpeg"),
             "-z", str(h), str(w), str(base), "--out", str(dest)],
            check=True, capture_output=True,
        )
        return dest.exists()
    except Exception:
        return False


def main() -> None:
    miss = sorted(missing_refs())
    if not miss:
        print("nothing missing")
        return

    # Basenames we need URLs for: the missing files themselves plus, for any WxH
    # variant, its full-size base (so we can regenerate the variant if absent).
    wanted: set[str] = set()
    for bucket, name in miss:
        wanted.add(name)
        m = SIZE_RE.match(name)
        if m and bucket == "images":
            wanted.add(f"{m['stem']}{m['ext']}")
    print(f"resolving urls for {len(wanted)} basenames (one corpus pass)…")
    urls = build_url_index(wanted)

    downloaded = regenerated = failed = 0
    fails: list[str] = []
    for bucket, name in miss:
        dest = ASSETS / bucket / name
        if dest.exists():
            continue
        # 1) direct download if the origin has this exact file
        if name in urls and download(urls[name], dest):
            downloaded += 1
            print(f"  ↓ {bucket}/{name}")
            continue
        # 2) WxH variant: fetch the base, then resample
        m = SIZE_RE.match(name)
        if m and bucket == "images":
            base_name = f"{m['stem']}{m['ext']}"
            base = ASSETS / "images" / base_name
            if not base.exists() and base_name in urls:
                download(urls[base_name], base)
            if not base.exists():
                # try the largest sibling variant already on disk
                sibs = sorted(ASSETS.glob(f"images/{m['stem']}-*x*{m['ext']}"),
                              key=lambda p: p.stat().st_size, reverse=True)
                base = sibs[0] if sibs else base
            if base.exists() and sips_variant(base, dest,
                                              int(m["w"]), int(m["h"]), m["ext"]):
                regenerated += 1
                print(f"  ✎ {bucket}/{name}  (sips)")
                continue
        failed += 1
        fails.append(f"{bucket}/{name}")

    print(f"\ndownloaded={downloaded} regenerated={regenerated} failed={failed}")
    if fails:
        print("STILL MISSING:")
        for f in fails:
            print(f"   {f}")


if __name__ == "__main__":
    main()
