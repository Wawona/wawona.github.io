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
| VM / containers | available | available | available | available | available | forbidden | forbidden |
| Multi-window | available | if OS allows | required | required | single primary | forbidden | forbidden |
| Nested Weston + Niri | available | available | available | available | available | available (non-GL fallback) | available (non-GL fallback) |
| Vulkan / GLES | available | available | available | available | available | planned | blocked |
| Desktop + LockScreen | planned | planned | forbidden | forbidden | forbidden (App Store) | forbidden | forbidden |
| anowaW app bridge | planned | planned | forbidden | forbidden | planned | forbidden | forbidden |

## Notes

- **Desktop / LockScreen** — coming soon on macOS and Android. iOS path is a jailbreak tweak from [repo.wawona.io](https://repo.wawona.io) (website only). Not Linux. Not App Store iOS family. See [Desktop and LockScreen](@/docs/user/desktop.md).
- **anowaW** — separate host-app → Wayland bridge (not Desktop). See [anowaW](@/docs/user/anowaw.md).
- **watchOS GPU** is blocked: no `Metal.framework`, `CAMetalLayer` unavailable. SHM/CPU present path.
- **tvOS GPU** is planned: the SDK has Metal and OpenGLES. Work is unfinished (`WWN_TVOS_GPU`).
- **visionOS** matches macOS product parity for bundled clients, VMs, and Machines UX.
- **macOS** is never limited by App Store feature rules.

More: [macOS](@/docs/user/macos.md), [Android](@/docs/user/android.md).
