+++
aliases = ["docs/getting-started"]
title = "Getting Started"
description = "Install Wawona from Download, TestFlight, or Discord. Build from source if you need to."
weight = 1
date = 2026-08-13

+++

Wawona is a native Wayland compositor. You do not need Nix to run a binary.

Versioning is CalVer `YY.M.D` (see GitHub tags like `v26.8.12`). Older 0.x marketing versions are retired.

macOS is not a store feature target. Do not wait for a Mac store listing.

## Get a build

1. **[Download](/download/)** for GitHub assets (dmg, ipa, apk, AppImage) when a `v*` tag ships.
2. **TestFlight / Play internal** — find beta testing links on the [Wawona Discord](https://discord.gg/wHVSV52uw5). Store builds ship from [Ship: beta (stores)](https://github.com/Wawona/Wawona) on `master`.
3. Apple family schemes exist for iOS, iPadOS, tvOS, watchOS, and visionOS. Android and Linux too.

## First run

Open Wawona. Create or pick a **Machine**. Start it. Use **Focus** to show the compositor.

Before tapping Weston panel icons or nested clients, set **Touch Input Type** to Multi-Touch (iOS family) or turn **Touchpad Mode** off (Android). See [Usage](@/docs/user/usage.md).

## Build from source

Contributors: [Compilation](@/docs/contributor/compilation.md) and [Nix](@/docs/contributor/nix-build-system.md). You need Determinate Nix, Xcode on Apple, and `TEAM_ID` in `.envrc` for signed iOS family builds.

```bash
nix run .#wawona-macos
nix run .#wawona-ios
nix run .#wawona-android
nix run .#wawona-linux
```

Other attributes: `wawona-macos-desktop-host`, `wawona-watchos-app-sim`, `wawona-tvos-sim`, `wawona-visionos-sim`.
