+++
aliases = ["docs/desktop"]
title = "Desktop and LockScreen"
description = "Host DE and greeter. Coming soon on macOS and Android; iOS/iPadOS via repo.wawona.io."
weight = 10
date = 2026-08-14

+++

**Coming soon / in development.** Desktop and LockScreen replacement are not ready yet.

## What this is

Make Wawona the **host desktop environment** and **lock screen**, with a Wawona **machine picker**. Machine profiles for these roles are **native ports only**.

This is **not** [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md) (the app bridge). Do not confuse the two.

## Platforms

| Platform | Gate | Mechanism |
|----------|------|-----------|
| macOS | planned | SIP fully disabled (`csrutil disable`) + `.dylib` tweak (`wawona-macos-desktop-host`) |
| Android | planned | Default Home App + LockScreen APIs. **no root**, no fallback tier |
| iOS / iPadOS | website only | Jailbreak tweak from [repo.wawona.io](https://repo.wawona.io) (Sileo source). Still in development. Same story on iPhone and iPad. |
| App Store iOS / iPadOS / tvOS / watchOS / visionOS | forbidden | Not offered in store builds |
| Linux | forbidden | Not supported |

macOS and iOS/iPadOS Desktop/LockScreen tweaks are **still in development**.

## macOS (iland Mode B)

| Mode | Artifact | When |
|------|----------|------|
| A (default) | `libiland_userland.a` | Always legal. In-window compositor. |
| B | `libwayland-mac.dylib` in `wawona-macos-desktop-host` | SIP fully disabled (`csrutil disable` in Recovery) **and** Settings → Desktop **and** connecting the Desktop machine. `csrutil enable --without debug` is not enough. |

### Restage helper and dylib

Classic Take Over runs `/Library/Application Support/Wawona/run-modeb.sh` and the copied `libwayland-mac.dylib`, not the app you just built in the nix store. `nix run .#install` updates the app and LaunchAgents only. It **does not** rewrite the helper unless you opt in.

After you change the helper, the Mode B dylib (`wwn-iland`), or `igettyd` (`wwn-igetty`), restage so that directory matches this store:

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

Mode B dylib belongs on `.#wawona-macos-desktop-host`. Default `.#wawona-macos` is Mode A (in-window). Restage does not enable Desktop Replacement; Settings and Path B coverage still apply.

Contributor compile notes: [Compilation](@/docs/contributor/compilation.md#restage-mode-b-helper-and-dylib).

## Android

Default Home App + LockScreen APIs. **No root required.** No MediaProjection “fallback” for Desktop.

## iOS / iPadOS and repo.wawona.io

Desktop/LockScreen will ship **only** as a jailbreak tweak from **repo.wawona.io** (required Sileo source), for both iPhone and iPad. It is not part of the App Store Wawona app, and App Store / TestFlight materials must not discuss it.

Canonical engineering notes: [iland-mode-a-b-desktop.md](https://github.com/Wawona/Wawona/blob/development/docs/iland-mode-a-b-desktop.md).
