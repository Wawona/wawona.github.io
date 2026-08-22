+++
aliases = ["docs/macos"]
title = "macOS"
description = "Mode A in-window compositor. Planned SIP Mode B desktop-host. Planned Wawona Swinging Bridge."
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
- **Mode B** (Desktop/LockScreen, coming soon): `DYLD_INSERT_LIBRARIES` + bundled dylib. Needs SIP fully disabled (`csrutil disable` in Recovery) and Settings → Desktop. `csrutil enable --without debug` is not enough.

Host chrome is AppKit (zoom, fullscreen, miniaturize). CSD and forced SSD are both legal.

SSH is regular **OpenSSH**. Waypipe can use IOSurface/Mach.

## Wawona Swinging Bridge (planned)

Separate app bridge for macOS apps on Wayland. Mode A in notarized builds as available. Swinging Bridge Mode B is a privileged path of its own. **Desktop Mode B** (WindowServer replacement) needs SIP **fully disabled** (`csrutil disable` in Recovery). `csrutil enable --without debug` is refused. See [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md).

## VMs and containers (planned)

Machines will add guest profiles using Apple `Virtualization.framework` and Containerization. See [VMs and containers](@/docs/user/vms-containers.md).

See [Desktop and LockScreen](@/docs/user/desktop.md) (including how to restage the Mode B helper and dylib) and [iland](@/docs/contributor/iland.md).
