+++
aliases = ["docs/anowaw"]
title = "anowaW"
description = "Host-app → Wayland bridge. Coming soon. Not Desktop or LockScreen."
weight = 11
date = 2026-08-14

+++

**Coming soon / in development.**

## What it is

**anowaW** is an **application bridge**: run **macOS, Android, or iOS** apps inside a Wayland desktop hosted by Wawona. The goal is a zero-copy (or near zero-copy) surface bridge for HID, resize, and compositing of UIKit / AppKit / Android window surfaces onto Wayland surfaces, so host apps can tile beside other Wayland clients (for example inside a native [niri](@/docs/user/platforms.md) session).

## What it is not

- Not [Desktop / LockScreen replacement](@/docs/user/desktop.md)
- Not MediaProjection “mirror the screen as the desktop”

## Platforms

| Platform | Gate |
|----------|------|
| macOS | planned (Mode A + Mode B) |
| Android | planned (Mode A + Mode B) |
| iOS | planned (Mode A in the store app; Mode B via repo.wawona.io) |
| iPadOS / tvOS / watchOS / visionOS / Linux | forbidden |

## Mode A vs Mode B

| | Mode A | Mode B |
|--|--------|--------|
| App Store / Play | Ships in store-shaped builds | **Forbidden** in App Store IPA and Play AAB/APK |
| macOS | Store-safe / notarized methods as available | Bundled on 3rd-party macOS; needs **partial SIP** (system debugging), same bar as the Desktop `.dylib` |
| Android | Play-approved bridge methods | Privileged / root paths outside Play requirements |
| iOS | Mode A only inside the App Store Wawona app | Jailbreak tweak from **[repo.wawona.io](https://repo.wawona.io)** (Sileo): UIKit apps as Wayland clients under nested Wawona |

App Store and TestFlight copy for the Wawona iOS app must **never mention jailbreak**. This page and repo.wawona.io may describe Mode B.

## iOS Mode B on repo.wawona.io

A planned jailbreak tweak will present UIKit apps as Wayland clients on a nested Wayland compositor inside Wawona on iOS — so iOS apps can sit beside other Wayland apps under compositors such as niri. Distributed only from repo.wawona.io, never from the App Store IPA.

Canonical engineering notes: [anowaw.md](https://github.com/Wawona/Wawona/blob/development/docs/anowaw.md).
