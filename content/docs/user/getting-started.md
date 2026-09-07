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

{{ screenshot(id="machines-macos", margin_top="1.25rem") }}

## Get a build

1. **[Download](/download/)** for GitHub assets (`Wawona-{calver}-{platform}-{arch}.{ext}`: dmg, ipa, apk, AppImage) when a `v*` tag ships. See [Prebuilt binary naming](@/docs/contributor/prebuilt-naming.md).
2. **TestFlight / Play internal**. Find beta testing links on the [Wawona Discord](https://discord.gg/wHVSV52uw5). Store builds ship from [Ship: beta (stores)](https://github.com/Wawona/Wawona) on `master` (filenames include the build number; see the same naming doc).
3. Apple family schemes exist for iOS, iPadOS, tvOS, watchOS, and visionOS. Android and Linux too.

{{ screenshot(id="machines-ipados", margin_top="1.25rem") }}

{{ screenshot(id="machines-visionos", margin_top="1.25rem") }}

## First run

Open Wawona. Create or pick a **Machine**. Start it. Use **Focus** to show the compositor.

Before tapping Weston panel icons or nested clients, set **Touch Input Type** to Multi-Touch (iOS family) or turn **Touchpad Mode** off (Android). See [Usage](@/docs/user/usage.md).

## Extra software

Two catalogs. Pick a lane at [repo.wawona.io/search](https://repo.wawona.io/search/).

- **App Store / Play:** search wasm, then `wpm install` in the Wawona shell.
- **Jailbreak / Termux:** add `https://repo.wawona.io/` in Sileo or apt.

See [Packages](@/docs/user/packages.md).

## Build from source

Contributors: [Compilation](@/docs/contributor/compilation.md), [Nix](@/docs/contributor/nix-build-system.md), and [AI + MCP](@/docs/contributor/wwn-mcp.md) (wire `wwn-mcp` so agents retrieve Wawona knowledge). You need Determinate Nix, Xcode on Apple, and `TEAM_ID` in `.envrc` for signed iOS family builds.

```bash
nix run .#wawona-macos
nix run .#wawona-ios
nix run .#wawona-android
nix run .#wawona-linux
```

Other attributes: `wawona-macos-desktop-host`, `wawona-watchos-app-sim`, `wawona-tvos-sim`, `wawona-visionos-sim`.

## Report a bug

If a machine does nothing after Start, copy logs from **Settings → About** and open a GitHub issue. See [Report a bug](@/docs/user/reporting-bugs.md).
