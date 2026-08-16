+++
aliases = ["docs/android"]
title = "Android"
description = "Compose Machines, OpenSSH portable, planned Desktop Home + Wawona Swinging Bridge."
weight = 7
date = 2026-08-14

+++

Android is a first-class host: Jetpack Compose Machines UI, JNI to the Rust compositor, AHardwareBuffer present.

## SSH and waypipe

Android uses **OpenSSH portable** (`libssh_bin.so` / keygen / scp) from `wwn-ssh`. Apple mobile uses libssh2.

## Graphics

Runtime-only. System Vulkan or SwiftShader. Direct kernel DRM/KGSL ICDs are **forbidden**. No `/dev/kgsl`.

## Desktop / LockScreen (planned)

Coming soon. Default Home App + LockScreen APIs — **no root required**, no fallback tier. Not the same as [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md).

See [Desktop and LockScreen](@/docs/user/desktop.md).

## Wawona Swinging Bridge (planned)

Separate app bridge for Android apps on Wayland. Mode A for Play-shaped builds; Mode B only outside Play requirements. See [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md).

## VMs and containers (planned)

Coming soon as Machine kinds on Android (and macOS / iOS / iPadOS / Linux). Forbidden on tvOS, watchOS, and visionOS. See [VMs and containers](@/docs/user/vms-containers.md).

See [Platforms](@/docs/user/platforms.md).

