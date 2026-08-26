+++
aliases = ["docs/iland"]
title = "iland"
description = "Userspace DRM/KMS/GBM. Mode A in-window Metal. Mode B Classic fullscreen Metal without WindowServer."
weight = 23
date = 2026-08-25

+++

[`wwn-iland`](https://github.com/Wawona/wwn-iland) is Wawona's **userspace DRM/KMS/GBM**. It emulates the Linux graphics objects a compositor and clients already know (connector, CRTC, plane, framebuffer, GBM bo) and presents them on the host through IOSurface + Metal (Apple) or AHardwareBuffer (Android).

That is a **runtime** substitution of the platform under the client. It is not a kernel driver, not a `/dev/dri` node, and not a video capture of Aqua.

## Never a real DRM device

Wawona must never open kernel DRM:

- No real `/dev/dri`
- No real `/dev/kgsl`
- No forwarding of kernel DRM/KMS/KGSL ioctls
- No kernel modules or kernel patches

Clients and nested compositors still call the usual KMS/GBM entry points. Those calls terminate **inside iland**. The objects they get are userspace. Present is Metal (or the Android buffer path), not a physical CRTC programmed by XNU.

Mode B's package name `iland-baremetal` is a legacy label for the macOS Desktop dylib. It is still userspace.

## Two present paths (do not conflate)

| | Mode A (default) | Mode B (Desktop Replacement) |
|---|---|---|
| Artifact | `libiland_userland.a` | `libwayland-mac.dylib` |
| Where it ships | Every product target that can present | **`wawona-macos-desktop-host` only** (`Contents/Library/Wawona/iland/`) |
| Host compositor | Apple WindowServer / Aqua stays up | WindowServer **unloaded** for that login (Classic) |
| Present | `iland_drm_set_present_callback` → `WWNIlandPresenter` / **in-window** `CAMetalLayer` | Mach IPC → `framebufferd`. Fullscreen Metal. No Aqua scene |
| Load | Static link | `DYLD_INSERT_LIBRARIES` + Dobby on the **session compositor exec only** |
| SIP | May stay **enabled** | Must be **fully disabled** (`csrutil disable`). Partial SIP is refused |
| App Store / Play | Yes | **No** |

Mode A is always required on macOS. Building or testing Mode B must never break in-window present.

**Wawona Swinging Bridge** is a different product (host apps become Wayland clients). It is not Desktop Replacement and not this dylib.

## Mode A: iland inside a Cocoa window

SIP can stay on. Wawona is a normal macOS app. Nested weston/niri and Wayland clients render into iland's userspace KMS, then iland presents **inside the Wawona window** (AppKit + Metal). WindowServer is still compositing Aqua around that window. That is the store-shaped / notarized `.#wawona-macos` path.

On iOS family and Android, Mode A is the only iland path: in-process present to the host UI toolkit's Metal / AHardwareBuffer surface.

## Mode B: Desktop Replacement as a custom framebuffer

Classic Desktop Replacement on `wawona-macos-desktop-host` is how macOS gets closest to "real" DRM/KMS/GBM **without** a kernel node and **without** drawing Aqua.

After **Replace now** (and only then):

1. **IOWatchdog Path B** (`wwn-iowatchdog`) has a sticky Disable ACK. Unloading `watchdogd` without that panics on macOS 26. See [Desktop and LockScreen](@/docs/user/desktop.md).
2. Apple **WindowServer is not running** for that session. There is no Aqua desktop to composite. Wawona does not render Finder, Dock, or the menu bar.
3. **`wwn-igetty`** owns virtual terminals (`igettyd`, Doorman session, F1-F9). The Desktop machine is a native weston or niri session, not a Linux VM.
4. The **Mode B dylib** (`libwayland-mac.dylib` from `wwn-iland` `iland-baremetal` / `macos-baremetal.nix`) is prefixed on the **session compositor** command only. Never `export DYLD_INSERT_LIBRARIES` in the login shell (Apple `/bin/*` is `arm64e`; a global export kills `date` / `launchctl`).
5. That compositor talks **iland DRM**: weston `--backend=drm`, niri `NIRI_BACKEND=tty`. Clients allocate GBM/KMS as they would on Linux. iland implements the device. Present is a **fullscreen Metal** path (`framebufferd` over Mach), not a CAMetalLayer inside an Aqua window.

So: Linux-shaped DRM/KMS/GBM API in userspace, mapped to a fullscreen Metal view, with WindowServer gone. Logout (or Ctrl+Option+Backspace) returns Aqua. Next login does not auto-engage.

KEEP_WS (`Wawona --mode-b-probe`) leaves WindowServer up on purpose. That is a probe, not Classic. Path C (parked WindowServer for Swinging Bridge + Desktop together) is still planned.

### Who owns which piece

| Piece | Repo | Role |
|-------|------|------|
| Mode A archive | [`wwn-iland`](https://github.com/Wawona/wwn-iland) | `libiland_userland.a`, in-window Metal present |
| Mode B dylib | `wwn-iland` `iland-baremetal` | `libwayland-mac.dylib`. Intercepts the DRM/GBM ABI; Mach → `framebufferd` |
| IOWatchdog Path B | [`wwn-iowatchdog`](https://github.com/Wawona/wwn-iowatchdog) | Sticky Disable ACK before unloading `watchdogd` |
| VTs / getty | [`wwn-igetty`](https://github.com/Wawona/wwn-igetty) | `igettyd`, Doorman session, Ctrl+Option+F1-F9 |
| SIP, Settings, Take Over | [`Wawona`](https://github.com/Wawona/Wawona) | `WWNSipStatus`, `WWNDesktopReplacementController`, `WWNWaypipeRunner` |
| Session weston DRM | [`wwn-weston`](https://github.com/Wawona/wwn-weston) | `--backend=drm` over iland |
| Session niri DRM | [`wwn-niri`](https://github.com/Wawona/wwn-niri) | `NIRI_BACKEND=tty` after Classic |

Friends how-to, install sync, and safety forbids: [Desktop and LockScreen](@/docs/user/desktop.md). After you change this dylib or `wwn-igetty`, run `nix run .#install` or open the new desktop-host app once. See [Compilation: install and updates](@/docs/contributor/compilation.md#install-and-updates-desktop-host).

Inner weston/niri started **inside** a Classic session are ordinary Wayland clients of that session's socket. Do not nest the **session** compositor on Wawona (there is no host Wayland after Classic). Do not `sudo niri` / `sudo weston`.

## Graphics stack (L1)

L1 owns ANGLE, SwiftShader, MoltenVK, KosmicKrisp, Turnip hooks. Substrate 2D (cairo, pango, pixman) stays in `wwn-toolchain` (L0). Consumers that need GLES/Vulkan merge the iland fragment. tvOS ships ANGLE (OpenGL ES to Metal) and MoltenVK (Vulkan to Metal). watchOS has no public Metal and stays on the SHM/CPU fallback. See [Graphics](@/docs/user/graphics.md) and [DAG](@/docs/contributor/dag.md).

Canonical engineering notes: [iland-mode-a-b-desktop.md](https://github.com/Wawona/Wawona/blob/development/docs/iland-mode-a-b-desktop.md).
