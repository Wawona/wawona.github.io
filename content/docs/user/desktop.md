+++
aliases = ["docs/desktop"]
title = "Desktop and LockScreen"
description = "Host DE and greeter — coming soon on macOS and Android; iOS/iPadOS via repo.wawona.io."
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
| macOS | planned | Partial SIP (system debugging enabled) + `.dylib` tweak (`wawona-macos-desktop-host`) |
| Android | planned | Default Home App + LockScreen APIs — **no root**, no fallback tier |
| iOS / iPadOS | website only | Jailbreak tweak from [repo.wawona.io](https://repo.wawona.io) (Sileo source). Still in development. Same story on iPhone and iPad. |
| App Store iOS / iPadOS / tvOS / watchOS / visionOS | forbidden | Not offered in store builds |
| Linux | forbidden | Not supported |

macOS and iOS/iPadOS Desktop/LockScreen tweaks are **still in development**.

## macOS (iland Mode B)

| Mode | Artifact | When |
|------|----------|------|
| A (default) | `libiland_userland.a` | Always legal. In-window compositor. |
| B | `libwayland-mac.dylib` in `wawona-macos-desktop-host` | SIP Disabled or PartiallyDisabled (`Debugging Restrictions: disabled`) **and** Settings → Desktop **and** connecting the Desktop machine |

## Android

Default Home App + LockScreen APIs. **No root required.** No MediaProjection “fallback” for Desktop.

## iOS / iPadOS and repo.wawona.io

Desktop/LockScreen will ship **only** as a jailbreak tweak from **repo.wawona.io** (required Sileo source), for both iPhone and iPad. It is not part of the App Store Wawona app, and App Store / TestFlight materials must not discuss it.

Canonical engineering notes: [iland-mode-a-b-desktop.md](https://github.com/Wawona/Wawona/blob/development/docs/iland-mode-a-b-desktop.md).
