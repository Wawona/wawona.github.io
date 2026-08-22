+++
aliases = ["docs/iland"]
title = "iland"
description = "Userspace DRM/KMS/GBM. Mode A archive. Mode B macOS dylib only."
weight = 23
date = 2026-08-13

+++

[`wwn-iland`](https://github.com/Wawona/wwn-iland) emulates KMS objects (connector, CRTC, plane, FB) over IOSurface+Metal (Apple) or AHardwareBuffer (Android). Runtime only. Never open real `/dev/dri` or `/dev/kgsl`. Never ship kernel code.

## Mode A vs Mode B

| | Mode A | Mode B |
|---|---|---|
| Artifact | `libiland_userland.a` | `libwayland-mac.dylib` |
| Platforms | All product targets (tvOS/watchOS stubs / fallback) | macOS desktop-host only |
| App Store | Yes | No |

Mode B ships only in `.#wawona-macos-desktop-host`. Default `.#wawona-macos` and all mobile/Android artifacts omit the dylib.

After you change this dylib or `wwn-igetty`, restage the live helper. Default `nix run .#install` does not. See [Compilation: restage Mode B](@/docs/contributor/compilation.md#restage-mode-b-helper-and-dylib).

L1 owns ANGLE, SwiftShader, MoltenVK, KosmicKrisp. Substrate 2D (cairo, pango, pixman) stays in `wwn-toolchain`.

Canonical: [iland-mode-a-b-desktop.md](https://github.com/Wawona/Wawona/blob/development/docs/iland-mode-a-b-desktop.md).
