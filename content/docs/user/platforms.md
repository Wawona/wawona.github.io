+++
aliases = ["docs/platforms"]
title = "Platforms"
description = "Four gate states: available, planned, blocked, forbidden."
weight = 5
date = 2026-08-14

+++

Never say "unsupported". Each cell is one of four states.

| Mark | State | Meaning |
|------|--------|---------|
| available | Shipping | Keep it green |
| planned | Platform allows it; our work is unfinished | Finish it |
| blocked | We want it; no public API | Re-check SDKs; no private API |
| forbidden | Product or store policy | Never enable |

## Capability matrix

| Capability | macOS | Android | iPadOS | visionOS | iOS | tvOS | watchOS |
|---|---|---|---|---|---|---|---|
| Native machines | available | available | available | available | available | available | available |
| Remote (SSH/waypipe) | available | available | available | available | available | available | available |
| VM / containers | planned | planned | planned | planned | planned | forbidden | forbidden |
| Multi-window | available | if OS allows | required | required | single primary | forbidden | forbidden |
| Nested Weston + Niri | available | available | available | available | available | available (non-GL fallback) | available (non-GL fallback) |
| Vulkan / GLES | available | available | available | available | available | planned | blocked |
| Desktop + LockScreen | planned | planned | forbidden (App Store) | forbidden | forbidden (App Store) | forbidden | forbidden |
| Wawona Swinging Bridge | planned | planned | planned | forbidden | planned | forbidden | forbidden |
| iCloud Drive (shell HOME) | available | omitted | available | available | available | blocked | blocked |

Linux: native + remote available; VM/containers planned; Desktop/LockScreen and Wawona Swinging Bridge forbidden.

## Notes

- **iOS and iPadOS** share the same Desktop/LockScreen and Wawona Swinging Bridge story (store Mode A vs `repo.wawona.io` Mode B). See [Mode A and Mode B](@/docs/user/mode-a-b.md).
- **VM / containers**. Mode A on store iOS / iPadOS / visionOS uses UTM-SE-class **jitless** engines; Mode B Sileo IPA uses **JIT**. macOS: Virtualization + Containerization. Forbidden on tvOS and watchOS. See [VMs and containers](@/docs/user/vms-containers.md).
- **On-device shell**. Bundled zsh (Mode A); Mode B may use unsandboxed jailbreak shell. See [On-device shell](@/docs/user/shell.md).
- **Desktop / LockScreen**. macOS Classic Take Over is implemented on desktop-host; LockScreen greeter and Android Home still planned. iOS/iPadOS via [repo.wawona.io](https://repo.wawona.io) (website only). See [Desktop and LockScreen](@/docs/user/desktop.md).
- **Wawona Swinging Bridge**. Separate host-app → Wayland bridge. See [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md).
- **Wasm packages**. Mode A-safe Runtime packages from `repo.wawona.io/wasm`. See [WASM](@/docs/user/wasm.md).
- **watchOS GPU** is blocked: no `Metal.framework`. **tvOS GPU** is planned.
- **iCloud Drive** (Settings → iCloud Sync for shell HOME) is blocked on tvOS
  and watchOS. Apple QA1935: Drive is unavailable; `ubiquityIdentityToken` is
  always nil. CloudKit and iCloud Key-Value Store exist on tvOS; they are not
  this Settings section. Omit the section on tvOS. See [Settings](@/docs/user/settings.md).
- **visionOS** matches macOS product parity for bundled clients and Machines UX, including planned VM/container kinds (same class as iOS/iPadOS).
- **macOS** is never limited by App Store feature rules.

More: [macOS](@/docs/user/macos.md), [Android](@/docs/user/android.md).
