+++
aliases = ["docs/mode-a-b", "docs/mode-b"]
title = "Mode A and Mode B"
description = "Store-compliant Mode A vs jailbreak/SIP/root Mode B: VMs, containers, packages, Desktop."
weight = 4
date = 2026-08-16

+++

Wawona has two privilege classes. **App Store / Play builds are always Mode A.** Mode B is for jailbreak, SIP-disabled macOS, and privileged Android. Never inside the store binary.

Canonical: [mode-a-b.md](https://github.com/Wawona/Wawona/blob/development/docs/mode-a-b.md).

## Quick matrix

| | Mode A | Mode B |
|--|--------|--------|
| Who | App Store, TestFlight, Play | Jailbreak / SIP / root |
| iOS VMs & containers | [UTM-SE](https://github.com/utmapp/UTM)-class **jitless** interpreter | **JIT**-enabled UTM/QEMU |
| iOS shell | Sandboxed `wwn-zsh` | Unsandboxed / NewTerm-class + host APT |
| Desktop / LockScreen (iOS) | Not in the store app | [repo.wawona.io](https://repo.wawona.io) |
| Packages | Wasm from `repo.wawona.io/wasm` + Files + `wpm` | Wasm **plus** jailbreak `.deb` APT |

Wasm is **not platform-native** (tradeoff vs a Mach-O port). The payoff is a portable **Wawona Runtime** with full App Store compliance via WASI P1/P2 and **`wpm`**. The Runtime has no Mode B flavor. See [WASM / WASI](@/docs/user/wasm.md).

## Mode B IPA (iOS)

[repo.wawona.io](https://repo.wawona.io) will **automatically package** a **Wawona Mode B IPA** for Sileo. That build can run Containers and VMs with JIT and use jailbreak APT tooling. It is **not** the App Store IPA.

App Store and TestFlight materials must **never** mention jailbreak, Sileo Mode B IPA, or JIT.

## Related

- [VMs and containers](@/docs/user/vms-containers.md)
- [WASM / packages](@/docs/user/wasm.md)
- [Desktop](@/docs/user/desktop.md) · [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md)
- Plans: [vms-mode-a-b](https://github.com/Wawona/Wawona/blob/development/docs/vms-mode-a-b.md), [containers-mode-a-b](https://github.com/Wawona/Wawona/blob/development/docs/containers-mode-a-b.md), [wasm-package-manager](https://github.com/Wawona/Wawona/blob/development/docs/wasm-package-manager.md)
