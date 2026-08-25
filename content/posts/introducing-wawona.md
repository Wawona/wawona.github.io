+++
title = "Introducing Wawona: a nested Wayland compositor for macOS"
date = 2026-02-22
[extra]
author = "The Wawona Team"
+++

**Correction (2026-08-24).** This post is the Feb 2026 intro. Product facts now: CalVer (not older 0.x tags). The full Apple family plus Android and Linux. VMs and containers are planned Machine types (forbidden on tvOS/watchOS). macOS Classic Desktop Replacement exists on the desktop-host build; LockScreen greeter and Android Home are still coming soon. iOS/iPadOS Desktop via repo.wawona.io (not the App Store app). Wawona Swinging Bridge is a separate planned app bridge. Graphics libs live in `wwn-*` flake inputs. See [docs](/docs/) and [FAQ](/faq/).

Wawona is a native Wayland compositor for Mac, iPhone, iPad, Apple Watch, Apple TV, visionOS, Android, and Linux. The compositor talks Wayland. The pixels go out through Metal, Vulkan, or a CPU/SHM fallback.

## Why

On a Mac, the usual way to run Wayland apps was a virtual machine or a slow emulator. Wawona implements the compositor in Rust and draws with the platform GPU APIs, so a Linux Wayland client can show up as a native window. You can still start a VM or container Machine when you want a guest OS.

## How it is built

### Rust core

One backend owns protocol state, surfaces, and input. Host UI is SwiftUI/ObjC, JNI/Compose, or GTK. UniFFI exists in `src/ffi`. It is not the only bridge.

### Native graphics

Userspace DRM/KMS/GBM is `wwn-iland`. Apple GPU targets use Metal (IOSurface). Android uses AHardwareBuffer. watchOS has no public Metal (GPU blocked). tvOS GPU is planned.

### Nix

macOS, the iOS family, Android, and Linux each want their own SDK. Nix builds the Rust core and C libraries from sibling `wwn-*` inputs (`wwn-toolchain` substrate, `wwn-iland` graphics, Weston, Niri, waypipe).

## Other platforms

The same core ships across the Apple family and Android. Nested Weston and Niri are mandatory bundles on every product target.

## Try it

CalVer builds: [Download](/download/), TestFlight via Discord, or GitHub `v*` assets. Start with the [docs](/docs/getting-started/) or the [FAQ](/faq/).
