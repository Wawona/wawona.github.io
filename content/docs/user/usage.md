+++
aliases = ["docs/usage"]
title = "Usage"
description = "Nested Weston and Niri, bundled clients, Multi-Touch."
weight = 3
date = 2026-08-13

+++

Use [Machines](@/docs/user/machines.md) to start a session. CLI toggles are not the product path.

## Nested compositors

Weston and Niri both ship on every product target (macOS, iOS family, Android). They are real compositors, not stubs.

Pick **Display Backend** `auto` / `wayland` / `drm` in Settings or on the machine.

## Bundled clients

Typical catalog: Weston terminal, foot, cubes, zsh. Extra software: [Packages](@/docs/user/packages.md) (`wpm` for App Store / Play wasm; Sileo for jailbroken iOS debs; Termux for sideloaded Android debs, not jailbreak). A ported client must match the same upstream client streamed over waypipe. See [Porting](@/docs/contributor/porting.md).

## Multi-Touch

Wayland clients (Weston panel, nested compositors, terminals) need **direct touch**.

- iOS / iPadOS / visionOS: Settings → Touch Input Type = Multi-Touch (not Touchpad).
- Android: Touchpad Mode Off.

`click` with a virtual pointer often no-ops even when the tool reports success.

## Linux host

```bash
nix run .#wawona-linux
```

GTK UI. The compositor is the same Rust core.

## Report a bug

Copied logs and the GitHub form: [Report a bug](@/docs/user/reporting-bugs.md).

## Local Wayland socket (macOS)

Settings → Connection shows `XDG_RUNTIME_DIR` and `WAYLAND_DISPLAY`. Point a local client at that socket while Wawona is running.
