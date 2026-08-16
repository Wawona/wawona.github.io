+++
aliases = ["docs/anowaw", "docs/swinging-bridge", "docs/wawona-swinging-bridge"]
title = "Wawona Swinging Bridge"
description = "Cocoa / Android / UIKit apps as Wayland clients over waypipe. Coming soon. Not Desktop or LockScreen."
weight = 11
date = 2026-08-16

+++

**Coming soon / in development.** Formerly named **anowaW**.

## What it is

**Wawona Swinging Bridge** makes **macOS (Cocoa/AppKit)** and **Android** applications speak **Wayland** so they can be forwarded with **waypipe-rs** (`wwn-waypipe`) onto a **Linux** machine and render inside a real Wayland compositor (niri, weston, …) with proper resize, placement, text entry, mouse, and other HID. Not a dumb whole-screen mirror.

The same bridge can attach **locally** to a nested compositor inside Wawona so host apps tile beside Linux clients on-device.

**Future:** UIKit **iOS** apps (planned).

## What it is not

- Not [Desktop / LockScreen replacement](@/docs/user/desktop.md)
- Not MediaProjection “mirror the device as the desktop”
- Not a [VM or container](@/docs/user/vms-containers.md)

It *helps* Desktop replacement later (e.g. Wawona as Android home app while Android apps still appear as Wayland surfaces inside niri). That home/DE path remains Desktop/LockScreen. Separate product.

## Platforms

| Platform | Gate |
|----------|------|
| macOS | planned (Mode A + Mode B) |
| Android | planned (Mode A + Mode B) |
| iOS / iPadOS | planned **Mode B only** (jailbreak / [repo.wawona.io](https://repo.wawona.io)). Not in the App Store IPA |
| tvOS / watchOS / visionOS / Linux | forbidden |

## Mode A vs Mode B

**Neither implemented yet.** Design both; never ship Mode B in store/Play binaries.

| | Mode A | Mode B |
|--|--------|--------|
| Intent | App Store / Play-compliant path (stream-like bridge) | Privileged full surface bridge |
| macOS | Store-safe / notarized methods | Partial SIP (system debugging), same bar as Desktop `.dylib` |
| Android | Play-approved methods | Root / privileged paths outside Play |
| iOS / iPadOS | Not in the store app | Jailbreak / Sileo. UIKit apps as Wayland clients |

App Store and TestFlight copy must **never mention jailbreak**. This page and repo.wawona.io may describe Mode B.

## Repo

Engineering: [Wawona-Swinging-Bridge](https://github.com/Wawona/Wawona-Swinging-Bridge) · [swinging-bridge.md](https://github.com/Wawona/Wawona/blob/development/docs/swinging-bridge.md).
