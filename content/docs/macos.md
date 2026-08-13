+++
title = "macOS"
description = "Mode A in-window compositor. Optional SIP Mode B desktop-host only."
weight = 6
date = 2026-08-13

[extra]
section = "user"
+++

macOS is a first-class host. It is **not** an App Store feature sandbox.

## Two artifacts

| Flake | Role |
|-------|------|
| `wawona-macos` | Store-shaped / notarized. Mode A only. No Mode B dylib. |
| `wawona-macos-desktop-host` | Ships `libwayland-mac.dylib`. SIP-gated Desktop Replacement. |

## Present path

- **Mode A** (default): static `libiland_userland.a`. Present via `WWNIlandPresenter` / CAMetalLayer.
- **Mode B**: `DYLD_INSERT_LIBRARIES` + bundled dylib. Needs SIP Disabled or PartiallyDisabled (`Debugging Restrictions: disabled`) and Settings → Desktop.

Host chrome is AppKit (zoom, fullscreen, miniaturize). CSD and forced SSD are both legal.

SSH is regular **OpenSSH**. Waypipe can use IOSurface/Mach.

See [Desktop Replacement](/docs/desktop/) and [iland](/docs/iland/).
