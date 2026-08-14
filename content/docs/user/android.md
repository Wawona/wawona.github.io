+++
aliases = ["docs/android"]
title = "Android"
description = "Compose Machines, OpenSSH portable, planned Desktop Home + anowaW."
weight = 7
date = 2026-08-14

+++

Android is a first-class host: Jetpack Compose Machines UI, JNI to the Rust compositor, AHardwareBuffer present.

## SSH and waypipe

Android uses **OpenSSH portable** (`libssh_bin.so` / keygen / scp) from `wwn-ssh`. Apple mobile uses libssh2.

## Graphics

Runtime-only. System Vulkan or SwiftShader. Direct kernel DRM/KGSL ICDs are **forbidden**. No `/dev/kgsl`.

## Desktop / LockScreen (planned)

Coming soon. Default Home App + LockScreen APIs — **no root required**, no fallback tier. Not the same as [anowaW](@/docs/user/anowaw.md).

See [Desktop and LockScreen](@/docs/user/desktop.md).

## anowaW (planned)

Separate app bridge for Android apps on Wayland. Mode A for Play-shaped builds; Mode B only outside Play requirements. See [anowaW](@/docs/user/anowaw.md).

VM and container machine types are allowed when the OS can host them.

See [Platforms](@/docs/user/platforms.md).
