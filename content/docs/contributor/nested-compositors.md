+++
aliases = ["docs/nested-compositors"]
title = "Nested compositors"
description = "Weston and Niri are mandatory native bundles on every product target."
weight = 22
date = 2026-08-13

+++

Every Wawona product must compile and ship **real** Weston and Niri for that ABI. Fake entry points and compatibility stubs do not count.

Apple mobile links in-process static libraries. macOS may spawn processes. Android uses native artifacts.

tvOS and watchOS use the allowed non-GL fallback. Do not drop either compositor to make CI green.

## Port fidelity

A nested compositor, like any ported client, is judged by **waypipe equivalence**: same protocols and windowing path as upstream on Linux, streamed to Wawona. Substitute libc, EGL→ANGLE, DRM→iland. Do not re-host a Wayland compositor onto KMS because the winsys is unfinished.

Display backend is a user setting (`auto` / `wayland` / `drm`), not a hardcoded nested-only path.
