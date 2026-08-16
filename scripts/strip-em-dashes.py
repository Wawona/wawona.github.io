#!/usr/bin/env python3
"""Strip Unicode em/en dashes. Never touch indentation or other whitespace."""
from __future__ import annotations

import re
import sys
from pathlib import Path

EM = "\u2014"
EN = "\u2013"
SKIP_DIR = {
    ".git", "result", "target", "node_modules", ".cache", "DerivedData",
    "build", "Pods", ".build", "vendor", "vendor-research", "neovim-rootfs",
    ".nix-deps", "Wawona-gradle-project",
}
EXTS = {
    ".md", ".mdc", ".html", ".css", ".scss", ".toml", ".swift", ".m", ".h",
    ".mm", ".kt", ".kts", ".rs", ".nix", ".yml", ".yaml", ".txt", ".py",
    ".sh", ".json", ".c", ".cpp", ".rb", ".js", ".ts", ".xml", ".plist",
}


def protect(text: str) -> tuple[str, list[str]]:
    held: list[str] = []

    def hold(m: re.Match[str]) -> str:
        held.append(m.group(0))
        return f"\0HOLD{len(held) - 1}\0"

    text = re.sub(r"(?m)^Bad:\s+.*$", hold, text)
    text = re.sub(r"(?m)^.*U\+201[34].*$", hold, text)
    return text, held


def restore(text: str, held: list[str]) -> str:
    for i, chunk in enumerate(held):
        text = text.replace(f"\0HOLD{i}\0", chunk)
    return text


def fix(text: str) -> str:
    text = text.replace("&mdash;", " - ")
    text = text.replace("&#8212;", " - ")
    text = text.replace("&#x2014;", " - ")
    text = text.replace("&ndash;", "-")
    text = text.replace("&#8211;", "-")
    text = text.replace("&#x2013;", "-")
    text = text.replace(f"| {EM} |", "| - |")
    text = text.replace(f"|{EM}|", "|-|")

    def spaced(m: re.Match[str]) -> str:
        ch = m.group(1)
        return ". " + (ch.upper() if ch.islower() else ch)

    text = re.sub(rf" {EM} (.)", spaced, text)
    text = re.sub(rf"{EM}+", "-", text)
    text = re.sub(rf"(\d)\s*{EN}\s*(\d)", r"\1-\2", text)
    text = text.replace(EN, "-")
    return text


def should_skip(path: Path) -> bool:
    if path.name == "strip-em-dashes.py":
        return True
    if any(p.startswith(".derivedData") for p in path.parts):
        return True
    return any(p in SKIP_DIR for p in path.parts)


def process(path: Path) -> bool:
    if path.suffix.lower() not in EXTS:
        return False
    try:
        original = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return False
    if EM not in original and EN not in original and "&mdash;" not in original and "&#8212;" not in original:
        return False
    text = original
    held: list[str] = []
    # Always protect pedagogical / codepoint documentation lines.
    text, held = protect(text)
    fixed = restore(fix(text), held)
    if fixed == original:
        return False
    path.write_text(fixed, encoding="utf-8")
    return True


def main() -> int:
    roots = [Path(a) for a in sys.argv[1:]]
    n = 0
    for root in roots:
        for path in sorted(root.rglob("*")):
            if path.is_file() and not should_skip(path) and process(path):
                n += 1
                print(path)
    print(f"changed: {n}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
