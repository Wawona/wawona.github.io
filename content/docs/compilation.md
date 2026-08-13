+++
title = "Compilation"
description = "Flake product attributes, TEAM_ID, local proof before CI."
weight = 25
date = 2026-08-13

[extra]
section = "dev"
+++

Nix flakes. Apple Silicon host. See [Nix build system](/docs/nix-build-system/) for layers.

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
