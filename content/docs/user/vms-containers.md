+++
aliases = ["docs/vms", "docs/containers"]
title = "VMs and containers"
description = "Planned Machines kinds for guests — not the local shell."
weight = 3
date = 2026-08-14

+++

**Coming soon / planned.** Virtual machines and containers will be first-class **Machine** kinds in the Wawona GUI: configure them per-machine and start them from Machines.

This is **not** the [on-device shell](@/docs/user/shell.md) (bundled zsh). A local terminal does not require a guest OS.

## Platforms

| Platform | Gate | Planned path |
|----------|------|--------------|
| macOS | planned | Apple [Containerization](https://github.com/apple/container) (`Containerization.framework`) for containers; `Virtualization.framework` for VMs — bundled into Wawona |
| iOS / iPadOS | planned | [UTM-SE](https://github.com/utmapp/UTM) interpreter technology in store-shaped builds. Jailbroken devices: JIT-enabled UTM. Sideloaded Wawona should be easy to run under [TrollStore](https://github.com/opa334/TrollStore) with JIT enabled |
| Android | planned | Containers and VMs through Wawona machine profiles |
| Linux | planned | Containers and VMs through Wawona machine profiles |
| tvOS / watchOS / visionOS | forbidden | Native + remote machine kinds only |

App Store and TestFlight materials for the Wawona iOS/iPadOS app must **not** mention jailbreak, TrollStore, or JIT. This page may.

## Machine kinds

| `type` | Meaning |
|--------|---------|
| `virtual_machine` | Guest VM (`wwn-vms`) |
| `container` | Container runtime (`wwn-containers`) |

See [Machines](@/docs/user/machines.md). Repo notes: [vms-containers.md](https://github.com/Wawona/Wawona/blob/development/docs/vms-containers.md).
