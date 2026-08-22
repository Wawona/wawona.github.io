+++
aliases = ["docs/compilation"]
title = "Compilation"
description = "Flake product attributes, TEAM_ID, local proof before CI."
weight = 25
date = 2026-08-13

+++

Nix flakes. Apple Silicon host. See [Nix build system](@/docs/contributor/nix-build-system.md) for layers.

`--rebuild` is not a Wawona flag. Nix's own `nix build --rebuild` forces a derivation rebuild.

## Products

```bash
nix run .#wawona-macos
nix build .#wawona-macos-desktop-host
nix run .#wawona-ios
nix build .#wawona-watchos-app-sim
nix build .#wawona-tvos-sim
nix build .#wawona-visionos-sim
nix run .#wawona-android
nix run .#wawona-linux
```

iOS family signing: `TEAM_ID` in `.envrc`.

## Local before CI

Gate queues are long. For link flags, second Rust staticlibs, flake bumps, or `Cargo.lock` skew: `nix build` the failing cell **before** pushing `development`. Parse-only eval is not a link test.

FlakeHub cache: `determinate-nixd login`. Details in the repo `docs/flakehub-cache.md`.

## Restage Mode B helper and dylib

`nix run .#install` from the Wawona repo installs the macOS app and LaunchAgents. That is Mode A. It **skips** rewriting `/Library/Application Support/Wawona` (helper script, `libwayland-mac.dylib`, sudoers) unless you set the opt-in flag.

Classic Desktop Replacement (not [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md)) executes that helper. A new `nix build` of `wwn-iland` or `wwn-igetty` does nothing for Take Over until restage:

```bash
WAWONA_MODEB_STAGE=1 nix run .#install
```

Or `Wawona --mode-b-stage` from the binary you just installed. Administrator once. Does **not** Take Over. Does **not** run `wwn-iowatchdog disable`/`enable`. Does **not** attach lldb to `watchdogd`.

User-facing notes: [Desktop and LockScreen](@/docs/user/desktop.md#restage-helper-and-dylib).
