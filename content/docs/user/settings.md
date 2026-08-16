+++
aliases = ["docs/settings"]
title = "Settings"
description = "Global prefs and per-machine overrides. Text Assist stays."
weight = 4
date = 2026-08-13

+++

Canonical keys live in the [Wawona settings doc](https://github.com/Wawona/Wawona/blob/development/docs/settings.md). Machine overrides beat globals.

## Display and windowing

| Setting | Notes |
|---------|--------|
| Force SSD | Android and the iOS family force server-side decorations. macOS can do CSD or forced SSD. |
| Display Backend | `auto` / `wayland` / `drm` for nested Weston and Niri |
| Nested compositors | Weston and Niri |

## Graphics

| Setting | Notes |
|---------|--------|
| Vulkan | KosmicKrisp default on Apple Silicon + macOS 26+. Else MoltenVK on Apple. Android: system or SwiftShader. No kernel DRM/KGSL ICDs. No `/dev/kgsl`. |
| OpenGL | ANGLE on Apple GPU targets. |
| DmaBuf | IOSurface / AHardwareBuffer import |

watchOS has no public Metal. GPU settings do not apply there.

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
