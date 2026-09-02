+++
aliases = ["docs/mode-a-b", "docs/mode-b", "docs/trollstore", "docs/sileo-mode-b"]
title = "Mode A and Mode B"
description = "Store Mode A vs TrollStore (JIT + IOMFB Desktop) vs Sileo full Mode B: VMs, containers, Wasm, Desktop, Swinging Bridge."
weight = 4
date = 2026-08-16

+++


Wawona has two privilege classes. **App Store / Play builds are always Mode A.** Mode B is for TrollStore sideload, jailbreak (Sileo), SIP-disabled macOS, and privileged Android. Never inside the store binary.

Canonical: [mode-a-b.md](https://github.com/Wawona/Wawona/blob/development/docs/mode-a-b.md). Agent rule: [iOS Mode B channels](https://github.com/Wawona/Wawona/blob/development/docs/agent-rules/wawona-ios-mode-b-channels.md).

## iOS / iPadOS: three install channels

Do **not** treat Mode B as one binary. Three user-facing channels:

| Channel | JIT | IOMobileFramebuffer | Desktop + LockScreen | Swinging Bridge |
|--|--|--|--|--|
| **App Store / TestFlight** | No | No | No | No |
| **TrollStore (`.tipa` + `ldid`)** | Yes | Yes | Yes (in-app own-display) | No |
| **Sileo (`repo.wawona.io`)** | Yes | Yes | Yes (+ SpringBoard tweaks) | Yes + host APT |

| Channel | How you install | VMs / containers / Wasm |
|--|--|--|
| **App Store / TestFlight** | Apple | **Jitless** QEMU-TCTI (interpreter). Wasm **without** JIT |
| **TrollStore** | Website `.tipa` + TrollStore | **JIT** for VMs, containers, and Wasm |
| **Sileo (`repo.wawona.io`)** | Jailbreak + Mode B IPA / `.deb` | **JIT** for VMs, containers, and Wasm |

App Store and TestFlight materials must **never** mention TrollStore, Sileo, jailbreak, JIT, or framebuffer SPI. This site and [repo.wawona.io](https://repo.wawona.io) may.

### App Store / TestFlight (Mode A only)

- No JIT, no IOMobileFramebuffer, no Desktop / LockScreen, no Wawona Swinging Bridge
- VMs and containers: UTM-SE-class **jitless** interpreter
- Present: public Metal only
- Packages: Wasm from `repo.wawona.io/wasm` + Files + `wpm` (no Wasm JIT)

### TrollStore (`.tipa` with `ldid`)

[TrollStore](https://github.com/opa334/TrollStore) installs a Mode B IPA signed with `ldid`. That path enables:

- QEMU/UTM **with JIT** for VMs
- Containers as container-in-VM **with JIT**
- Wasm packages with **Wasm JIT** when the entitlement is present
- **Desktop + LockScreen** via **IOMobileFramebuffer** own-display (in-app greeter). Not SpringBoard injection
- **No** Wawona Swinging Bridge, **no** host APT, **no** ElleKit

Ship name: `Wawona-{calver}-iOS-arm64.tipa` on GitHub Releases. Never through TestFlight / Ship: beta.

### Sileo (full Mode B)

On a jailbroken device, install from [repo.wawona.io](https://repo.wawona.io). The Mode B IPA and tweaks enable **out of the box**:

- JIT VMs, containers, and Wasm (same JIT class as TrollStore)
- **Desktop replacement** (IOMFB and/or SpringBoard tweak + ElleKit on rootless)
- **LockScreen replacement**
- **Wawona Swinging Bridge** (Mode B)
- Unsandboxed shell and host APT (`.deb` from `/jailbreak/`)

Rootless (`…-rootless.deb`, prefix `/var/jb`) and rootful (`…-rootful.deb`, prefix `/`) are **separate builds**. The repo **auto-packages** Mode B for Sileo. It is not the App Store IPA. Never link ElleKit into store IPA or TrollStore `.tipa`.

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
| iOS shell | Sandboxed `wwn-zsh` | Sideload sandbox (TrollStore) or unsandboxed + host APT (Sileo) |
| Desktop / LockScreen (iOS) | Not in the store app | TrollStore (IOMFB in-app) and Sileo (+ ElleKit tweaks) |
| Swinging Bridge (iOS) | Forbidden | **Sileo only** (not TrollStore) |
| Packages | Wasm from `repo.wawona.io/wasm` + Files + `wpm` | Wasm (JIT OK in B IPA) **plus** jailbreak `.deb` on Sileo |

Wasm packages stay **bytecode** on `/wasm/`. Mode A never JIT-executes them. Mode B IPAs may. See [WASM / WASI](@/docs/user/wasm.md).

macOS is **never** App Store feature-gated. See [macOS](@/docs/user/macos.md).

## Related

- [VMs and containers](@/docs/user/vms-containers.md)
- [WASM / packages](@/docs/user/wasm.md)
- [Desktop](@/docs/user/desktop.md) · [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md)
- [linux-dmabuf zero-copy](@/docs/contributor/linux-dmabuf.md) (IOMFB present sink)
- Download picker: [Download](@/download/_index.md) (`.ipa` / `.tipa` / rootless / rootful)
- Plans: [vms-mode-a-b](https://github.com/Wawona/Wawona/blob/development/docs/vms-mode-a-b.md), [containers-mode-a-b](https://github.com/Wawona/Wawona/blob/development/docs/containers-mode-a-b.md)
