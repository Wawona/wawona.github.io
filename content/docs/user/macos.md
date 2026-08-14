+++
aliases = ["docs/macos"]
title = "macOS"
description = "Mode A in-window compositor. Planned SIP Mode B desktop-host. Planned anowaW."
weight = 6
date = 2026-08-14

+++

macOS is a first-class host. It is **not** an App Store feature sandbox.

## Two artifacts

| Flake | Role |
|-------|------|
| `wawona-macos` | Store-shaped / notarized. Mode A only. No Mode B dylib. |
| `wawona-macos-desktop-host` | Ships `libwayland-mac.dylib`. SIP-gated Desktop / LockScreen (planned). |

## Present path

- **Mode A** (default): static `libiland_userland.a`. Present via `WWNIlandPresenter` / CAMetalLayer.
- **Mode B** (Desktop/LockScreen, coming soon): `DYLD_INSERT_LIBRARIES` + bundled dylib. Needs SIP Disabled or PartiallyDisabled (`Debugging Restrictions: disabled`) and Settings → Desktop.

Host chrome is AppKit (zoom, fullscreen, miniaturize). CSD and forced SSD are both legal.

SSH is regular **OpenSSH**. Waypipe can use IOSurface/Mach.

## anowaW (planned)

Separate app bridge for macOS apps on Wayland. Mode A in notarized builds as available; Mode B bundled on 3rd-party macOS under the same partial-SIP bar as Desktop. See [anowaW](@/docs/user/anowaw.md).

See [Desktop and LockScreen](@/docs/user/desktop.md) and [iland](@/docs/contributor/iland.md).
