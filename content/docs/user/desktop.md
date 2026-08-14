+++
aliases = ["docs/desktop"]
title = "Desktop and LockScreen"
description = "Host DE and greeter replacement — coming soon on macOS and Android; iOS via repo.wawona.io only."
weight = 10
date = 2026-08-14

+++

**Coming soon / in development.** Desktop and LockScreen replacement are not ready yet.

## What this is

Make Wawona the **host desktop environment** and **lock screen**, with a Wawona **machine picker**. Machine profiles for these roles are **native ports only**.

This is **not** [anowaW](@/docs/user/anowaw.md) (the app bridge). Do not confuse the two.

## Platforms

| Platform | Gate | Mechanism |
|----------|------|-----------|
| macOS | planned | Partial SIP (system debugging enabled) + `.dylib` tweak (`wawona-macos-desktop-host`) |
| Android | planned | Default Home App + LockScreen APIs — **no root**, no fallback tier |
| iOS | website only | Jailbreak tweak from [repo.wawona.io](https://repo.wawona.io) (add as a Sileo source). Still in development. |
| App Store iOS / iPadOS / tvOS / watchOS / visionOS | forbidden | Not offered in store builds |
| Linux | forbidden | Not supported |

macOS and iOS Desktop/LockScreen tweaks are **still in development**. Treat shipping claims as premature until the gates move from planned to available.

## macOS (iland Mode B)

| Mode | Artifact | When |
|------|----------|------|
| A (default) | `libiland_userland.a` | Always legal. In-window compositor. |
| B | `libwayland-mac.dylib` in `wawona-macos-desktop-host` | SIP Disabled or PartiallyDisabled (`Debugging Restrictions: disabled`) **and** Settings → Desktop **and** connecting the Desktop machine |

Mode B is a SIP-gated WindowServer / lock-path replacement on macOS desktop-host builds. It is not shipped in store-shaped `wawona-macos`.

## Android

Android already exposes Default Home App and LockScreen replacement. Wawona will use those APIs directly. **No root required.** There is no “fallback” MediaProjection path for Desktop — that confusion belonged to older anowaW wording.

## iOS and repo.wawona.io

On iOS, Desktop/LockScreen replacement will ship **only** as a jailbreak tweak from **repo.wawona.io** (required Sileo source). It is not part of the App Store Wawona app, and App Store / TestFlight materials must not discuss it.

Canonical engineering notes: [iland-mode-a-b-desktop.md](https://github.com/Wawona/Wawona/blob/development/docs/iland-mode-a-b-desktop.md).
