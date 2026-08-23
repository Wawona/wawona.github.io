+++
aliases = ["docs/porting"]
title = "Porting"
description = "Substitute the platform under the client. Waypipe equivalence."
weight = 27
date = 2026-08-13

+++

A ported client must be indistinguishable from the same upstream client built on Linux and streamed to Wawona over waypipe. Same globals, same request order, same windowing path.

## May substitute

libc/POSIX shims, EGL→ANGLE, Vulkan→MoltenVK/KosmicKrisp/SwiftShader, DRM/KMS/GBM→iland, static archives and `main` → `<pkg>_main` on Apple mobile.

## Must not change

Protocols, renderer, geometry, feature set. Do not re-host a Wayland client onto KMS. Upstream that uses `wl_egl_window` stays on iland's Wayland-EGL winsys (`libiland_wayland_egl`). DRM/KMS is for clients that were KMS clients upstream (kmscube). Those are different paths.

Convention: [2026-wwn-porting-convention.md](https://github.com/Wawona/Wawona/blob/development/docs/2026-wwn-porting-convention.md). Planned DE repos (`wwn-gnome` and friends) are not flake inputs yet.
