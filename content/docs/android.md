+++
title = "Android"
description = "Compose Machines, OpenSSH portable, anowaW Desktop."
weight = 7
date = 2026-08-13

[extra]
section = "user"
+++

Android is a first-class host: Jetpack Compose Machines UI, JNI to the Rust compositor, AHardwareBuffer present.

## SSH and waypipe

Android uses **OpenSSH portable** (`libssh_bin.so` / keygen / scp) from `wwn-ssh`. Apple mobile uses libssh2.

## Graphics

Runtime-only. System Vulkan or SwiftShader. Direct kernel DRM/KGSL ICDs are **forbidden**. No `/dev/kgsl`.

## Desktop / LockScreen

macOS + Android only. **anowaW**: rootless (MediaProjection) vs power (Shizuku/root). Auto-fallback. No SIP. No Mode B dylib.

VM and container machine types are allowed when the OS can host them.

See [Desktop Replacement](/docs/desktop/) and [Platforms](/docs/platforms/).
