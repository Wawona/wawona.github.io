#!/usr/bin/env python3
"""Sync data/gallery.toml from content/gallery/*.md and check site refs."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
TEMPLATES = ROOT / "templates"
GALLERY = CONTENT / "gallery"
CATALOG = ROOT / "data" / "gallery.toml"

SRC_SHOT = re.compile(
    r"""(?:screenshot\s*\(\s*src\s*=|optimized_image\s*\(\s*path\s*=\s*["']images/wawona-screenshots)""",
)
GALLERY_ID = re.compile(r'screenshot\(\s*id\s*=\s*"([^"]+)"')
FROM_GAL = re.compile(r"never-match-optimized_from_gallery")
HOTLINK = re.compile(r"/images/wawona-screenshots/")


def parse_front_matter(path: Path) -> dict:
    text = path.read_text()
    parts = text.split("+++")
    if len(parts) < 3:
        raise ValueError(f"{path}: missing +++ front matter")
    fm: dict = {"extra": {}}
    extra = False
    for raw in parts[1].splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line == "[extra]":
            extra = True
            continue
        if "=" not in line:
            continue
        key, val = line.split("=", 1)
        key = key.strip()
        val = val.strip()
        if val.startswith('"') and val.endswith('"'):
            parsed = val[1:-1]
        else:
            try:
                parsed = int(val)
            except ValueError:
                parsed = val
        if extra:
            fm["extra"][key] = parsed
        else:
            fm[key] = parsed
    return fm


def toml_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def write_catalog(entries: dict[str, dict]) -> None:
    CATALOG.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Generated from content/gallery/*.md by scripts/check-gallery-refs.py",
        "# Do not edit by hand. Gallery markdown is the source of truth.",
        "",
    ]
    for slug in sorted(entries):
        e = entries[slug]
        lines.append(f'[entries."{slug}"]')
        for key in ("title", "description", "local_image", "alt", "permalink"):
            if e.get(key):
                lines.append(f'{key} = "{toml_escape(str(e[key]))}"')
        if e.get("width"):
            lines.append(f"width = {int(e['width'])}")
        if e.get("height"):
            lines.append(f"height = {int(e['height'])}")
        lines.append("")
    CATALOG.write_text("\n".join(lines))


def load_gallery_entries() -> tuple[dict[str, dict], list[str]]:
    errors: list[str] = []
    entries: dict[str, dict] = {}
    for p in sorted(GALLERY.glob("*.md")):
        if p.name == "_index.md":
            continue
        slug = p.stem
        fm = parse_front_matter(p)
        extra = fm.get("extra") or {}
        desc = (fm.get("description") or "").strip()
        local = (extra.get("local_image") or "").strip()
        if not desc:
            errors.append(f"{p.relative_to(ROOT)}: missing description")
        if not local:
            errors.append(f"{p.relative_to(ROOT)}: missing extra.local_image")
        body = p.read_text().split("+++", 2)[-1]
        if "screenshot(src=" in body:
            errors.append(f"{p.relative_to(ROOT)}: body must use screenshot(id=)")
        entries[slug] = {
            "title": fm.get("title") or slug,
            "description": desc,
            "local_image": local,
            "alt": extra.get("alt") or fm.get("title") or slug,
            "permalink": f"/gallery/{slug}/",
            "width": extra.get("width") or 0,
            "height": extra.get("height") or 0,
        }
    write_catalog(entries)
    return entries, errors


def iter_site_files():
    for base in (CONTENT, TEMPLATES):
        for p in base.rglob("*"):
            if not p.is_file() or p.suffix not in {".md", ".html"}:
                continue
            rel = str(p.relative_to(ROOT))
            if rel.startswith("content/gallery/") and p.suffix == ".md":
                continue
            if p.name in {"screenshot.html"}:
                continue
            yield p


def main() -> int:
    slugs_map, errors = load_gallery_entries()
    slugs = set(slugs_map)
    for p in iter_site_files():
        rel = str(p.relative_to(ROOT))
        text = p.read_text()
        if p.suffix == ".md" and HOTLINK.search(text):
            errors.append(f"{rel}: hotlink /images/wawona-screenshots/ (add a Gallery page and screenshot(id=))")
        if "screenshot(src=" in text or 'optimized_image(path="images/wawona-screenshots' in text:
            errors.append(f"{rel}: raw screenshot path; use Gallery id")
        for m in GALLERY_ID.finditer(text):
            if m.group(1) not in slugs:
                errors.append(f"{rel}: unknown gallery id {m.group(1)!r}")
        for m in FROM_GAL.finditer(text):
            if m.group(1) not in slugs:
                errors.append(f"{rel}: unknown gallery id {m.group(1)!r}")
    if errors:
        print("gallery catalog check failed:", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
        return 1
    print(f"gallery catalog ok ({len(slugs)} entries) wrote {CATALOG.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
