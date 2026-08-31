+++
aliases = ["docs/compilation"]
title = "Compilation"
description = "Flake product attributes, TEAM_ID, local proof before CI. Xcode script-phase notes."
weight = 25
date = 2026-08-23

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

## Xcode script phases always run

`nix run .#wawona-macos` (and other Apple product builds) drive `xcodebuild`.
Xcode may print notes like:

```text
note: Run script build phase 'Build Rust Backend via Nix' will be run during
every build because the option to run the script phase "Based on dependency
analysis" is unchecked.
```

Those are notes, not errors. The project generator
(`dependencies/generators/xcodegen.nix`) sets `basedOnDependencyAnalysis = false`
on purpose. Xcode then cannot skip the phase from declared inputs and outputs.

On `Wawona-macOS` that includes:

| Phase | Why it always runs |
|---|---|
| Stamp Build Number | Fresh `CURRENT_PROJECT_VERSION` every build |
| Build Rust Backend via Nix | Real graph is the Nix closure. Xcode only sees a few files |
| Bundle Executables | Copy and sign helpers from the Nix store into the app |
| Strip iOS-only keys from Info.plist (#138) | Drop iOS keys after plist processing so a macOS archive is not treated as iOS |

Swift and ObjC compile can still be incremental. These shell phases still fire.
Nix cache (and `WAWONA_BACKEND_OUT*` copy, or `WAWONA_SKIP_NIX_PREBUILD=1` for
UI-only iteration) is what keeps the Rust step cheap when the store is warm.

Repo: [compilation.md](https://github.com/Wawona/Wawona/blob/development/docs/compilation.md).

## Local before CI

Gate queues are long. For link flags, second Rust staticlibs, flake bumps, or `Cargo.lock` skew: `nix build` the failing cell **before** pushing `development`. Parse-only eval is not a link test.

FlakeHub cache: `determinate-nixd login`. Details in the repo `docs/flakehub-cache.md`.

## Install and updates (desktop-host)

`nix run .#install` from the Wawona repo installs the macOS app, LaunchAgents, **and** the Mode B helper + dylib + sudoers for this build. Administrator authorization once. No environment variables or extra CLI flags. Does **not** Take Over. Does **not** run `wwn-iowatchdog disable`/`enable`. Does **not** attach lldb to `watchdogd`.

Opening a desktop-host `Wawona.app` also syncs the helper when it is stale. Classic Desktop Replacement (not [Wawona Swinging Bridge](@/docs/user/swinging-bridge.md)) executes that helper. A new `nix build` of `wwn-iland` or `wwn-igetty` does nothing for Take Over until you install or open the new app.

User-facing notes: [Desktop and LockScreen](@/docs/user/desktop.md#install-and-updates-helper-dylib).
