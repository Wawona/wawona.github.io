+++
aliases = ["docs/desktop"]
title = "Desktop Replacement"
description = "macOS Mode B (SIP) and Android anowaW. Never the iOS family."
weight = 10
date = 2026-08-13

+++

Desktop, LockScreen, and anowaW exist on **macOS and Android only**. They are forbidden on iOS, iPadOS, tvOS, watchOS, and visionOS. This is policy, not a missing checkbox.

## macOS

| Mode | Artifact | When |
|------|----------|------|
| A (default) | `libiland_userland.a` | Always legal. In-window. |
| B | `libwayland-mac.dylib` in `wawona-macos-desktop-host` | SIP Disabled or PartiallyDisabled **and** Settings → Desktop **and** connecting the Desktop machine |

Mode B is not jailbreak-on-iOS. It is a SIP-gated WindowServer replacement on macOS desktop-host builds.

## Android

No SIP. **anowaW** tiers:

- Rootless / baseline: MediaProjection
- Power: Shizuku or root

Falls back when power is unavailable. Never a Mode B dylib.

Canonical: [iland-mode-a-b-desktop.md](https://github.com/Wawona/Wawona/blob/development/docs/iland-mode-a-b-desktop.md).
