+++
aliases = ["docs/desktop"]
title = "Desktop and LockScreen"
description = "macOS Classic Take Over is implemented. LockScreen greeter and Android Home still planned. Not Wawona Swinging Bridge."
weight = 10
date = 2026-08-24

+++

**macOS Classic Desktop Replacement exists** on `wawona-macos-desktop-host`. For one login session Wawona unloads Apple WindowServer (after IOWatchdog coverage) and presents a native compositor or kmscube on iland userspace DRM/KMS/GBM. Logout returns Aqua. **LockScreen** (the greeter) and **Android** Default Home + LockScreen APIs are still in development.

This is **not** [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md) (the app bridge). Do not confuse the two.

## What this is

Make Wawona the **host desktop environment** and, later, the **lock screen**, with a Wawona **machine picker**. Machine profiles for these roles are **native ports only**.

## Platforms

| Platform | Gate | What exists today |
|----------|------|-------------------|
| macOS | planned (LockScreen unfinished) | Classic Take Over on `wawona-macos-desktop-host`. SIP fully disabled. KEEP_WS probe. Path C planned. |
| Android | planned | Default Home App + LockScreen APIs. **no root**, no fallback tier |
| iOS / iPadOS | website only | Jailbreak tweak from [repo.wawona.io](https://repo.wawona.io) (Sileo). Still in development. Same story on iPhone and iPad. |
| App Store iOS / iPadOS / tvOS / watchOS / visionOS | forbidden | Not offered in store builds |
| Linux | forbidden | Not supported |

## macOS: Mode A vs Mode B

| Mode | Artifact | When |
|------|----------|------|
| A (default) | `libiland_userland.a` | Always legal. In-window compositor. SIP may stay on. |
| B | `libwayland-mac.dylib` in `wawona-macos-desktop-host` | SIP **fully disabled** (`csrutil disable` in Recovery) **and** Settings → Desktop **and** Replace now. `csrutil enable --without debug` is not enough. |

Default `.#wawona-macos` never ships the Mode B dylib. Mode A must keep working while you test Mode B.

### WindowServer options

| Option | WindowServer | Status |
|--------|--------------|--------|
| Classic | Unloaded; Mode B owns the panel | Implemented (kmscube proof; weston DRM / niri tty) |
| KEEP_WS | Left up; Aqua stays | Implemented (`Wawona --mode-b-probe`) |
| Path C | Parked; Cocoa still has WS for Swinging Bridge | Planned after multi-TTY |

## How to use Classic (friends path)

Needs the **desktop-host** build, SIP fully disabled, and administrator once for Path B / restage.

1. Settings → Desktop → **Enable Desktop Replacement**. That runs doctor, heal, and Path B (`claim-install --path-b`), then the native Restart sheet. It does **not** take over the screen.
2. Reboot. Confirm `/var/db/wwn-iowatchdog/claim-ok` shows `path=b sticky=1` **and** live Disable (marker or Path B sock `done=1`). `claim-ok` alone can be stale.
3. Restage the helper so it matches this nix store (opt-in; see below).
4. Choose a Desktop machine: **weston** or **niri**. Demo clients (`kmscube`, `weston-terminal`, `foot`) are not eligible as the Desktop machine. F7 still overlays kmscube **inside** a Classic session.
5. Settings or the menubar → **Replace now**. Classic unloads WindowServer only after IOWatchdog Disable ACK.
6. Logout, or Ctrl+Option+Backspace (Fn+Ctrl+Option+Backspace on a MacBook), to return Aqua. Next login does not auto-engage.

CLI equivalents:

```bash
Wawona --mode-b-prepare    # same as Enable
Wawona --mode-b-ready
Wawona --mode-b-engage     # Replace now
Wawona --mode-b-probe      # KEEP_WS, WindowServer stays up
Wawona --mode-b-stage      # copy helper + dylib for this store
```

### After Take Over

`wwn-igetty` owns VTs. Ctrl+Option+F1-F6 switches. F7-F9 overlay kmscube, gbm-es2-demo, vkcube-kms. Type `weston` or `niri` in a text VT. Wrappers detect Classic because **WindowServer is down**. They prefix `DYLD_INSERT_LIBRARIES` on that exec only (never export it in the login shell; Apple `/bin/*` is `arm64e`).

Session compositor uses iland userspace DRM:

- weston `--backend=drm`
- niri `NIRI_BACKEND=tty`

Inner weston/niri started **inside** that session stay nested Wayland clients. Do not `sudo niri` / `sudo weston`. Do not nest the **session** compositor on Wawona (there is no host Wayland after Classic).

While Aqua is up, honour Display Backend: `auto` is nested Wayland. Leaked `WWN_MODEB_TTY` in Aqua is a bug.

### Restage helper and dylib

Classic Take Over runs `/Library/Application Support/Wawona/run-modeb.sh` and the copied `libwayland-mac.dylib`, not the app you just built in the nix store. `nix run .#install` updates the app and LaunchAgents only. It **does not** rewrite the helper unless you opt in.

After you change the helper, the Mode B dylib (`wwn-iland`), or `igettyd` (`wwn-igetty`):

```bash
# From the Wawona repo. Administrator once.
# Copies helper + dylib + sudoers for this build.
# Does not take over the screen. Does not unload WindowServer or watchdogd.
WAWONA_MODEB_STAGE=1 nix run .#install
```

Same restage without a full install, once that build is already the live `Wawona` binary:

```bash
Wawona --mode-b-stage
```

If the helper still points at a previous `/nix/store/…-wawona-macos` path, Classic Take Over uses the old `igettyd` and old dylib. Stage fails closed in that case: fix the helper, do not Take Over with a mixed store.

Restage does not enable Desktop Replacement. Settings and Path B coverage still apply.

Contributor compile notes: [Compilation](@/docs/contributor/compilation.md#restage-mode-b-helper-and-dylib).

### Safety (macOS 26)

Never Take Over / unload `watchdogd` without sticky Path B ACK and live Disable. Never attach a debugger to `watchdogd` or WindowServer. Never `kickstart -k` watchdogd. Never `export DYLD_INSERT_LIBRARIES` in the login shell. Stage must never run `wwn-iowatchdog disable`.

## How it was implemented

| Piece | Repo | Role |
|-------|------|------|
| Mode A archive | [`wwn-iland`](https://github.com/Wawona/wwn-iland) | `libiland_userland.a`, in-window present |
| Mode B dylib | `wwn-iland` `iland-baremetal` | `libwayland-mac.dylib`, Mach IPC → `framebufferd` |
| IOWatchdog Path B | [`wwn-iowatchdog`](https://github.com/Wawona/wwn-iowatchdog) | Sticky Disable ACK before unloading `watchdogd` |
| VTs / getty | [`wwn-igetty`](https://github.com/Wawona/wwn-igetty) | `igettyd`, Doorman session, F1-F9 |
| SIP + Settings + Take Over | [`Wawona`](https://github.com/Wawona/Wawona) | `WWNSipStatus`, `WWNDesktopReplacementController` |
| Session weston DRM | [`wwn-weston`](https://github.com/Wawona/wwn-weston) | `--backend=drm` over iland |
| Session niri DRM | [`wwn-niri`](https://github.com/Wawona/wwn-niri) | `NIRI_BACKEND=tty` after Classic |

Userspace only. Virtual `/dev/dri` terminates in iland. Never a kernel module.

## Still planned

- LockScreen greeter (Phase E)
- Path C parked WindowServer (needed for Swinging Bridge + Desktop together)
- Android Default Home + LockScreen APIs
- iOS/iPadOS jailbreak tweak (`repo.wawona.io` only)

## Android

Default Home App + LockScreen APIs. **No root required.** No MediaProjection "fallback" for Desktop.

## iOS / iPadOS and repo.wawona.io

Desktop/LockScreen will ship **only** as a jailbreak tweak from **repo.wawona.io** (required Sileo source), for both iPhone and iPad. It is not part of the App Store Wawona app, and App Store / TestFlight materials must not discuss it.

Canonical engineering notes: [iland-mode-a-b-desktop.md](https://github.com/Wawona/Wawona/blob/development/docs/iland-mode-a-b-desktop.md).
