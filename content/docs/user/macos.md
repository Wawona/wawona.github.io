+++
aliases = ["docs/macos"]
title = "macOS"
description = "Mode A in-window compositor. Classic Desktop Replacement on desktop-host. Planned Wawona Swinging Bridge."
weight = 6
date = 2026-08-24

+++

macOS is a first-class host. It is **not** an App Store feature sandbox.

## Two artifacts

| Flake | Role |
|-------|------|
| `wawona-macos` | Store-shaped / notarized. Mode A only. No Mode B dylib. |
| `wawona-macos-desktop-host` | Ships `libwayland-mac.dylib`. SIP-gated Desktop. Classic Take Over is implemented. LockScreen greeter still planned. |

## Present path

- **Mode A** (default): static `libiland_userland.a`. Present via `WWNIlandPresenter` / CAMetalLayer. SIP may stay **enabled**. In-window nested compositors and clients still work.
- **Mode B** (Classic Desktop Replacement): prefix `DYLD_INSERT_LIBRARIES` on the **session compositor exec only**. Needs SIP fully disabled (`csrutil disable` in Recovery), Settings → Desktop → Enable (Path B), then **Replace now**. `csrutil enable --without debug` is not enough.

Host chrome is AppKit (zoom, fullscreen, miniaturize). CSD and forced SSD are both legal.

SSH is regular **OpenSSH**. Waypipe can use IOSurface/Mach.

## Desktop Replacement (Classic)

On the desktop-host build: Enable arms Path B; Replace now unloads WindowServer after IOWatchdog coverage. Logout or Ctrl+Option+Backspace returns Aqua. Session weston uses `--backend=drm`; niri uses `NIRI_BACKEND=tty`. Inner compositors stay nested Wayland clients.

KEEP_WS probe: `Wawona --mode-b-probe` (WindowServer stays up). Path C (parked WindowServer) is planned.

How to restage the helper, Path B checks, and safety forbids: [Desktop and LockScreen](@/docs/user/desktop.md).

## Wawona Swinging Bridge (planned)

Separate app bridge for macOS apps on Wayland. Mode A in notarized builds as available. Swinging Bridge Mode B is a privileged path of its own. **Desktop Mode B** (WindowServer replacement) needs SIP **fully disabled**. `csrutil enable --without debug` is refused. See [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md).

## VMs and containers (planned)

Machines will add guest profiles using Apple `Virtualization.framework` and Containerization. See [VMs and containers](@/docs/user/vms-containers.md).

See [iland](@/docs/contributor/iland.md).
