+++
title = "Graphics"
description = "Driver picker, SHM vs GPU, watchOS blocked, tvOS planned."
weight = 9
date = 2026-08-13

[extra]
section = "user"
+++

Pixels come from `wl_shm` (CPU) or GPU buffers imported through userspace DRM/KMS/GBM ([iland](/docs/iland/)).

## Drivers

| API | Apple GPU targets | Android |
|-----|-------------------|--------|
| Vulkan | KosmicKrisp (Apple Silicon + macOS 26+ default), else MoltenVK | System or SwiftShader |
| GLES / GL | ANGLE | ANGLE or system |

No kernel DRM/KGSL ICDs. No opening `/dev/dri` or `/dev/kgsl`.

## Platform ceilings

- **watchOS GPU** is blocked. No public Metal. Present is SHM/CPU (`wwn-iland-apple-fallback`).
- **tvOS GPU** is planned. The SDK has Metal and OpenGLES. The product gate is unfinished work, not policy.

Settings → Graphics picks the ICD. Nested clients and waypipe follow that choice.
