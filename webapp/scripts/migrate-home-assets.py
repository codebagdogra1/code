#!/usr/bin/env python3
"""Migrate the static homepage asset graph out of demo-main/wp-content into a
clean webapp/public/home/assets/{css,js,images,fonts} tree, rewriting every
reference in index.html and every url() inside the moved CSS.

Usage:
    python3 migrate-home-assets.py --dry-run   # print plan, write nothing
    python3 migrate-home-assets.py --apply      # perform the migration

See webapp/docs/home-assets/README.md for the rationale.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
PUBLIC = (HERE / ".." / "public").resolve()          # webapp/public
HOME = PUBLIC / "home"                                 # webapp/public/home
INDEX = HOME / "index.html"
ASSETS = HOME / "assets"

CSS_EXT = {".css"}
JS_EXT = {".js"}
FONT_EXT = {".woff2", ".woff", ".ttf", ".eot"}
IMG_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
ALL_EXT = CSS_EXT | JS_EXT | FONT_EXT | IMG_EXT | {".svg"}

# Referenced but absent on disk (inline WP emoji bootstrap) -> never touch.
SKIP_BASENAMES = {"wp-emoji-loader.min.js", "wp-emoji-release.min.js"}

# Match /home/... asset paths ending in a known extension.
REF_RE = re.compile(
    r"/home/[^\s\"'()<>,]+?\.(?:css|js|png|jpe?g|webp|gif|svg|woff2?|ttf|eot)",
    re.IGNORECASE,
)
# url(...) inside CSS (single/double/no quotes).
URL_RE = re.compile(r"""url\(\s*(['"]?)([^'")]+)\1\s*\)""", re.IGNORECASE)


def web_to_disk(web: str) -> Path | None:
    """Map a /home/... web path to a disk Path under PUBLIC (None if outside)."""
    if not web.startswith("/home/"):
        return None
    return (PUBLIC / web.lstrip("/")).resolve()


def target_dir_for(disk: Path) -> str:
    ext = disk.suffix.lower()
    if ext in CSS_EXT:
        return "css"
    if ext in JS_EXT:
        return "js"
    if ext in FONT_EXT:
        return "fonts"
    if ext == ".svg":
        # svg living under a font dir is a font glyph set, else it's an image.
        parts = {p.lower() for p in disk.parts}
        return "fonts" if ("webfonts" in parts or "fonts" in parts) else "images"
    return "images"


def source_token(disk: Path) -> str:
    """Short disambiguation token derived from the plugin/theme/source dir."""
    parts = disk.parts
    for key in ("plugins", "themes"):
        if key in parts:
            i = parts.index(key)
            if i + 1 < len(parts):
                return parts[i + 1].replace(".", "-")
    if "wp-includes" in parts:
        return "wp"
    if "uploads" in parts:
        return "uploads"
    return "misc"


def main() -> int:
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--dry-run", action="store_true")
    g.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    if not INDEX.exists():
        print(f"ERROR: {INDEX} not found", file=sys.stderr)
        return 1

    html = INDEX.read_text(encoding="utf-8", errors="surrogatepass")

    # ---- 1. direct references from index.html -------------------------------
    closure: dict[Path, str] = {}   # disk path -> target subdir
    missing: set[str] = set()
    for web in REF_RE.findall(html):
        disk = web_to_disk(web)
        if disk is None:
            continue
        if disk.name in SKIP_BASENAMES or not disk.exists():
            missing.add(web)
            continue
        closure[disk] = target_dir_for(disk)

    # ---- 2. transitive closure through CSS url() ----------------------------
    # css_internal[css_disk] = list of (original_url_text, resolved_disk)
    css_internal: dict[Path, list[tuple[str, Path]]] = {}
    for disk in [d for d in list(closure) if d.suffix.lower() == ".css"]:
        text = disk.read_text(encoding="utf-8", errors="surrogatepass")
        entries: list[tuple[str, Path]] = []
        for _q, raw in URL_RE.findall(text):
            url = raw.strip()
            if url.startswith("data:") or url.startswith(("http://", "https://")):
                continue
            clean = url.split("?")[0].split("#")[0]
            if not clean:
                continue
            ext = os.path.splitext(clean)[1].lower()
            if ext not in ALL_EXT:
                continue
            if clean.startswith("/"):
                resolved = (PUBLIC / clean.lstrip("/")).resolve()
            else:  # relative to the css file's own directory
                resolved = (disk.parent / clean).resolve()
            if resolved.exists():
                closure.setdefault(resolved, target_dir_for(resolved))
                entries.append((url, resolved))
            else:
                entries.append((url, resolved))  # record for reporting
        css_internal[disk] = entries

    # ---- 3. assign collision-safe new names ---------------------------------
    used: dict[str, set[str]] = {"css": set(), "js": set(), "images": set(), "fonts": set()}
    new_rel: dict[Path, str] = {}   # disk -> "css/name.ext" (relative to assets/)
    # deterministic order for stable naming
    for disk in sorted(closure, key=lambda p: str(p).lower()):
        sub = closure[disk]
        name = disk.name
        if name in used[sub]:
            name = f"{source_token(disk)}-{disk.name}"
            n = 2
            while name in used[sub]:
                name = f"{source_token(disk)}-{n}-{disk.name}"
                n += 1
        used[sub].add(name)
        new_rel[disk] = f"{sub}/{name}"

    def new_web(disk: Path) -> str:
        return f"/home/assets/{new_rel[disk]}"

    # ---- 4. build index.html replacement map (web string -> new web) --------
    html_map: dict[str, str] = {}
    for web in set(REF_RE.findall(html)):
        disk = web_to_disk(web)
        if disk is None or disk not in new_rel:
            continue
        html_map[web] = new_web(disk)

    # ---- report -------------------------------------------------------------
    print(f"index.html direct refs resolved : {sum(1 for _ in html_map)}")
    print(f"total files in closure          : {len(closure)}")
    by_sub: dict[str, int] = {}
    for sub in new_rel.values():
        k = sub.split('/')[0]
        by_sub[k] = by_sub.get(k, 0) + 1
    print(f"  by target folder              : {by_sub}")
    collisions = [v for v in new_rel.values() if os.path.basename(v) not in
                  {os.path.basename(k) for k in [str(d.name) for d in closure]}]
    print(f"missing / skipped refs          : {len(missing)}")
    for m in sorted(missing):
        print(f"    (skip) {m}")

    # count url() that will be rewritten
    url_rewrites = 0
    url_unresolved: list[str] = []
    for disk, entries in css_internal.items():
        for original, resolved in entries:
            if resolved in new_rel:
                url_rewrites += 1
            elif not original.startswith("data:"):
                url_unresolved.append(f"{disk.name}: url({original})")
    print(f"css url() rewrites              : {url_rewrites}")
    if url_unresolved:
        print(f"css url() UNRESOLVED (left as-is): {len(url_unresolved)}")
        for u in url_unresolved[:20]:
            print(f"    {u}")

    if args.dry_run:
        # dump a sample of the mapping
        print("\n--- sample mapping (first 25) ---")
        for disk in sorted(closure, key=lambda p: str(p).lower())[:25]:
            rel = str(disk.relative_to(PUBLIC))
            print(f"  /{rel}\n     -> {new_web(disk)}")
        print("\n(dry-run: nothing written)")
        return 0

    # ---- 5. APPLY -----------------------------------------------------------
    for sub in ("css", "js", "images", "fonts"):
        (ASSETS / sub).mkdir(parents=True, exist_ok=True)

    # copy files; CSS written with rewritten url()
    for disk in closure:
        dest = ASSETS / new_rel[disk]
        if disk.suffix.lower() == ".css":
            text = disk.read_text(encoding="utf-8", errors="surrogatepass")
            entries = css_internal.get(disk, [])
            # replace longest url texts first to avoid partial overlap
            for original, resolved in sorted(entries, key=lambda e: -len(e[0])):
                if resolved in new_rel:
                    text = text.replace(f"({original}", f"({new_web(resolved)}")
                    text = text.replace(f"('{original}'", f"('{new_web(resolved)}'")
                    text = text.replace(f'("{original}"', f'("{new_web(resolved)}"')
            dest.write_text(text, encoding="utf-8", errors="surrogatepass")
        else:
            dest.write_bytes(disk.read_bytes())

    # rewrite index.html (longest keys first)
    new_html = html
    for web in sorted(html_map, key=len, reverse=True):
        new_html = new_html.replace(web, html_map[web])
    INDEX.write_text(new_html, encoding="utf-8", errors="surrogatepass")

    # audit file
    mapping = {
        "index_html_refs": html_map,
        "files": {str(d.relative_to(PUBLIC)): new_web(d) for d in closure},
        "skipped": sorted(missing),
        "css_url_rewrites": url_rewrites,
    }
    (ASSETS / "mapping.json").write_text(json.dumps(mapping, indent=2), encoding="utf-8")
    print(f"\nAPPLIED. Wrote {len(closure)} files to {ASSETS}, rewrote index.html.")
    print(f"Audit: {ASSETS / 'mapping.json'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
