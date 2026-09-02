+++
aliases = ["docs/vms", "docs/containers"]
title = "VMs and containers"
description = "Planned Machines kinds. Mode A jitless on store iOS; Mode B JIT via TrollStore or Sileo."
weight = 3
date = 2026-08-16

+++

**Coming soon / planned.** Virtual machines and containers will be first-class **Machine** kinds. This is **not** the [on-device shell](@/docs/user/shell.md) and **not** [Wasm Runtime packages](@/docs/user/wasm.md).

Read [Mode A and Mode B](@/docs/user/mode-a-b.md) first (App Store vs TrollStore vs Sileo).

## iOS / iPadOS / visionOS

| Channel | Engine |
|-------|--------|
| **App Store** (Mode A) | **Jitless** QEMU-TCTI / TCG interpreter for VMs; containers run **inside** that VM after OCI pull |
| **TrollStore** (`.tipa` + `ldid`) | **JIT** QEMU/UTM for VMs and containers (Wasm JIT allowed). **Desktop/LockScreen** via IOMFB in-app. **No** Swinging Bridge |
| **Sileo** ([repo.wawona.io](https://repo.wawona.io)) | Same **JIT** engines **plus** Desktop, LockScreen, Swinging Bridge, host APT, and ElleKit out of the box |

Mode B is never shipped inside the App Store app. Store / TestFlight copy must not mention jailbreak, TrollStore, or JIT. This page may.

## Platforms

| Platform | Gate | Path |
|----------|------|------|
| macOS | planned | QEMU + HVF (`Hypervisor.framework`) + Apple [Containerization](https://github.com/apple/container) |
| iOS / iPadOS / visionOS | planned | Mode A jitless / Mode B JIT (above) |
| Android | planned | QEMU + KVM when available, else TCG+JIT (`wwn-vms` / `wwn-containers`) |
| Linux | planned | Same |
| tvOS / watchOS | forbidden | Native + remote only |

## Machine kinds

| `type` | Meaning |
|--------|---------|
| `virtual_machine` | Guest VM (`wwn-vms`) |
| `container` | OCI runtime (`wwn-containers`) |

Repo: [vms-containers.md](https://github.com/Wawona/Wawona/blob/development/docs/vms-containers.md).
