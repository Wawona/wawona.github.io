+++
aliases = ["docs/graphics"]
title = "Graphics"
description = "Driver picker, SHM vs GPU, userspace DRM/KMS/GBM, tvOS ANGLE/MoltenVK on Metal, watchOS blocked."
weight = 9
date = 2026-08-25

+++

Pixels come from `wl_shm` (CPU) or GPU buffers imported through userspace DRM/KMS/GBM ([iland](@/docs/contributor/iland.md)). iland emulates connector/CRTC/plane/GBM. It never opens `/dev/dri` or `/dev/kgsl`.

On macOS **Mode A**, present is an in-window Metal layer while Aqua stays up. On **Classic Desktop Replacement** (Mode B dylib + `wwn-igetty`), WindowServer is down and iland presents fullscreen Metal. See [iland](@/docs/contributor/iland.md) and [Desktop and LockScreen](@/docs/user/desktop.md).

## Drivers

| API | Apple GPU targets | Android |
|-----|-------------------|--------|
| Vulkan | KosmicKrisp (Apple Silicon + macOS 26+ default), else MoltenVK | System or SwiftShader |
| GLES / GL | ANGLE | ANGLE or system |

KosmicKrisp is macOS only. iOS, iPadOS, visionOS, and tvOS use MoltenVK. No kernel DRM/KGSL ICDs. No opening `/dev/dri` or `/dev/kgsl`.

## Platform ceilings

- **tvOS GPU** is available. OpenGL ES goes through ANGLE to Metal. Vulkan goes through MoltenVK to Metal. The Vulkan loader does not work on tvOS, so clients dispatch straight to the ICD (`WWN_VULKAN_LIBRARY`). No KosmicKrisp. No IOKit.
- **watchOS GPU** is blocked. No public Metal. Present is SHM/CPU (`wwn-iland-apple-fallback`).

Settings → Graphics picks the ICD. Nested clients and waypipe follow that choice.
