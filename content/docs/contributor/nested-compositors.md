+++
aliases = ["docs/nested-compositors"]
title = "Nested compositors"
description = "Weston and Niri are mandatory native bundles on every product target."
weight = 22
date = 2026-08-25

+++

Every Wawona product must compile and ship **real** Weston and Niri for that ABI. Fake entry points and compatibility stubs do not count.

Apple mobile links in-process static libraries. macOS may spawn processes. Android uses native artifacts.

tvOS ships ANGLE (OpenGL ES to Metal) and MoltenVK (Vulkan to Metal), same Mode A drivers as iOS. watchOS uses the allowed non-GL fallback (no public Metal). Do not drop either compositor to make CI green.

## Port fidelity

A nested compositor, like any ported client, is judged by **waypipe equivalence**: same protocols and windowing path as upstream on Linux, streamed to Wawona. Substitute libc, EGL→ANGLE, DRM→iland. Do not re-host a Wayland compositor onto KMS. iland already has a Wayland-EGL winsys (`wl_egl_window`); DRM/KMS is the path for upstream DRM clients, not a fallback when Wayland is inconvenient.

Display backend is a user setting (`auto` / `wayland` / `drm`), not a hardcoded nested-only path.
