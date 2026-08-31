+++
aliases = ["docs/mode-a-b", "docs/mode-b", "docs/trollstore", "docs/sileo-mode-b"]
title = "Mode A and Mode B"
description = "Store Mode A vs TrollStore JIT vs Sileo full Mode B: VMs, containers, Wasm, Desktop, Swinging Bridge."
weight = 4
date = 2026-08-16

+++

Wawona has two privilege classes. **App Store / Play builds are always Mode A.** Mode B is for TrollStore sideload, jailbreak (Sileo), SIP-disabled macOS, and privileged Android. Never inside the store binary.

Canonical: [mode-a-b.md](https://github.com/Wawona/Wawona/blob/development/docs/mode-a-b.md). Agent rule: [iOS Mode B channels](https://github.com/Wawona/Wawona/blob/development/docs/agent-rules/wawona-ios-mode-b-channels.md).

## iOS / iPadOS: three install channels

| Channel | How you install | VMs / containers / Wasm | Desktop + LockScreen | Swinging Bridge |
|--|--|--|--|--|
| **App Store / TestFlight** | Apple | **Jitless** QEMU-TCTI (interpreter). Wasm **without** JIT | No | No |
| **TrollStore** | Sideload IPA (website) | **JIT** for VMs, containers, and Wasm | Not by itself | Not by itself |
| **Sileo (`repo.wawona.io`)** | Jailbreak + Sileo | **JIT** for VMs, containers, and Wasm | **Yes** (out of the box) | **Yes** (Mode B, out of the box) |

App Store and TestFlight materials must **never** mention TrollStore, Sileo, jailbreak, or JIT. This site and [repo.wawona.io](https://repo.wawona.io) may.

### TrollStore

[TrollStore](https://github.com/opa334/TrollStore) can grant the **JIT entitlement** without a full jailbreak. Use a website-documented Wawona IPA so:

- Virtual machines run QEMU/UTM **with JIT**
- Containers run container-in-VM **with JIT**
- Wasm packages may execute with **Wasm JIT**

TrollStore alone does **not** install Desktop replacement, LockScreen replacement, or Wawona Swinging Bridge Mode B.

### Sileo (full Mode B)

On a jailbroken device, install from [repo.wawona.io](https://repo.wawona.io). The Mode B IPA and tweaks enable **out of the box**:

- JIT VMs, containers, and Wasm (same JIT class as TrollStore)
- **Desktop replacement**
- **LockScreen replacement**
- **Wawona Swinging Bridge** (Mode B)
- Unsandboxed shell and host APT (`.deb` from `/jailbreak/`)

The repo **auto-packages** the Mode B IPA for Sileo. It is not the App Store IPA.

## QEMU on iOS (interpreter vs JIT)

```text
App Store          →  QEMU-TCTI / TCG interpreter (UTM SE). No MAP_JIT.
TrollStore / Sileo →  QEMU/UTM + JIT (separate Mode B IPA flavor).
```

Same guest images and Machines UI. Different compile flavor. Never a store binary with a hidden “enable JIT” switch.

## Quick matrix (all platforms)

| | Mode A | Mode B |
|--|--------|--------|
| Who | App Store, TestFlight, Play | TrollStore / Sileo / SIP / root |
| iOS VMs and containers | Jitless QEMU-TCTI | JIT QEMU/UTM |
| iOS shell | Sandboxed `wwn-zsh` | Unsandboxed / NewTerm-class + host APT (Sileo) |
| Desktop / LockScreen (iOS) | Not in the store app | Sileo / jailbreak |
| Packages | Wasm from `repo.wawona.io/wasm` + Files + `wpm` | Wasm (JIT OK in B IPA) **plus** jailbreak `.deb` on Sileo |

Wasm packages stay **bytecode** on `/wasm/`. Mode A never JIT-executes them. Mode B IPAs may. See [WASM / WASI](@/docs/user/wasm.md).

## Related

- [VMs and containers](@/docs/user/vms-containers.md)
- [WASM / packages](@/docs/user/wasm.md)
- [Desktop](@/docs/user/desktop.md) · [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md)
- Plans: [vms-mode-a-b](https://github.com/Wawona/Wawona/blob/development/docs/vms-mode-a-b.md), [containers-mode-a-b](https://github.com/Wawona/Wawona/blob/development/docs/containers-mode-a-b.md)
