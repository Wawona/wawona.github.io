+++
aliases = ["docs/settings"]
title = "Settings"
description = "Global prefs and per-machine overrides. Text Assist stays."
weight = 4
date = 2026-08-13

+++

Canonical keys live in the [Wawona settings doc](https://github.com/Wawona/Wawona/blob/development/docs/settings.md). Machine overrides beat globals.

A Settings row is a one-line title plus On/Off, a title plus the current
choice, or a title plus the current value (short values on the trailing
edge, longer copy wraps). Never a placeholder ellipsis. Never two helper
paragraphs on one row. On iPhone, iPad, Apple TV, and Vision Pro, a
choice row uses a chevron into a list page. On macOS, a choice row is a
Cocoa popup switcher in the row. No second page.

## Display and windowing

| Setting | Notes |
|---------|--------|
| Enable HDR | On by default. Color profiles / EDR present path |
| Force SSD | Toggle on macOS only (default off). Android and the iOS family always use SSD |
| Display Backend | `auto` / `wayland` / `drm` for nested Weston and Niri |
| Nested compositors | Weston and Niri |

## Graphics

| Setting | Notes |
|---------|--------|
| Vulkan | KosmicKrisp default on Apple Silicon + macOS 26+. Else MoltenVK on Apple. Android: system or SwiftShader. No kernel DRM/KGSL ICDs. No `/dev/kgsl`. |
| OpenGL | ANGLE on Apple GPU targets. |

watchOS has no public Metal. GPU settings do not apply there.

## Machines

Shake, swipe-back, tvOS long-press Menu, session thumbnails, and
VM/container prefs share **Settings → Machines**. One section. Not the
Machines window.

## iCloud Sync

Apple family only. Toggle on Mac / iPhone / iPad / Vision Pro. Status-only on
tvOS and watchOS.

## Local Shell

Reset Shell Dotfiles, Reset System Tree, Import File to Home.

## Dependencies

Packages linked into **this** build. Generated per product. Not another
platform's list.

## Input

| Setting | Notes |
|---------|--------|
| Touch Input Type | Multi-Touch vs Touchpad (iOS family) |
| Touchpad Mode | Android; Off for client taps |
| Text Assist | `enableTextAssist`. iOS still reads it. |
| Dictation | Android |
| Shake / swipe / long-press Menu | Exit the active machine (platform-specific) |

## Desktop and Wawona Swinging Bridge (macOS + Android planned)

Desktop / LockScreen UI is for macOS and Android when it ships. App Store Apple-mobile builds do not expose it. See [Desktop and LockScreen](@/docs/user/desktop.md) and [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md).

## About and diagnostics

**Settings → About** always lists **https://wawona.io**. Author subtext is
Alex Spaulding; tapping that row opens the portfolio. There is no separate
Portfolio row. Version, host OS, and install channel stay on the page.
**Report a Bug on GitHub** opens the Wawona `bug.yml` form with this platform,
version, and recent logs filled, and copies the full report. **Copy Recent Logs**
/ **Copy Active Machine Logs** are clipboard-only. Steps: [Report a bug](@/docs/user/reporting-bugs.md).
