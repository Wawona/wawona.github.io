+++
aliases = ["docs/prebuilt-naming"]
title = "Prebuilt binary naming"
description = "Canonical filenames for GitHub Releases, store uploads, and product-build artifacts."
weight = 30
date = 2026-08-14

+++

Ship binaries use one token order: **app → calver → platform → arch → [build] → ext**.

## Three channels

| Channel | Pattern | Build in name? |
|---------|---------|----------------|
| **GitHub Release** (`Ship: GitHub assets` on `v*` tags) | `Wawona-{calver}-{platform}-{arch}.{ext}` | No |
| **Store upload** (`Ship: beta` → TestFlight / Play internal) | `Wawona-{calver}-{platform}-{arch}-{build}.{ext}` | Yes |
| **product-build / Gate** | Short unversioned names until a ship boundary | N/A |

CalVer comes from `VERSION` (for example `26.8.12`, tag `v26.8.12`). Store **build** is `WAWONA_BUILD_NUMBER` / `github.run_number` (same-day re-ships bump build only).

### GitHub examples

- `Wawona-26.8.12-macOS-arm64.dmg`
- `Wawona-26.8.12-iOS-arm64.ipa` (Mode A sideload)
- `Wawona-26.8.12-iOS-arm64.tipa` (TrollStore Mode B)
- `Wawona-26.8.12-iOS-arm64-rootless.deb` / `…-rootful.deb` (Sileo Mode B)
- `Wawona-26.8.12-Android-arm64.apk`
- `Wawona-26.8.12-Linux-x86_64.AppImage`
- `Wawona-26.8.12-Linux-arm64.AppImage` (filename maps `aarch64` → `arm64`)

### Store examples

- `Wawona-26.8.12-iOS-arm64-142.ipa` (also `tvOS`, `visionOS`)
- `Wawona-26.8.12-Android-arm64-142.aab`

### product-build (internal)

Gate may keep `Wawona.apk`, `Wawona.app`, `Wawona-x86_64.AppImage`, `Wawona-aarch64.AppImage`. Those names must not ship on a GitHub Release or as the path passed to TestFlight / Play without renaming.

## What this is not

- Play AAB vs sideload APK: stores use `.aab`; GitHub Android asset is `.apk`.
- Gym / TestFlight metadata still carries marketing version + build inside the binary. ASC and Play key off that, not the filename. The filename is for humans, CI, and download matching.
- macOS is not TestFlight / Mac App Store here. The notarized DMG is the GitHub channel only.
- GHA artifact IDs (`product-android-apk`, `wawona-beta-appimage-*`) stay as-is.

## Where names are produced

| Output | Producer |
|--------|----------|
| GitHub DMG / APK / AppImage / IPA | `.github/workflows/release.yml`, Fastlane `ios github_ipa`, AppImage rename at stage |
| TestFlight IPA | Fastlane `gym_ipa` / `ios beta` |
| Play AAB | Fastlane `android beta` (rename after nix AAB) |
| Short Gate payloads | `product-build.yml` + `appimage-smoke.sh` |

Repo detail: [Wawona `docs/ci.md`](https://github.com/Wawona/Wawona/blob/development/docs/ci.md). Agent rule: `wawona-release-assets`.

## wawona.io download cards

[`/download/`](/download/) fetches `GET /repos/Wawona/Wawona/releases/latest` and matches the GitHub pattern first, then a short legacy pass (`Wawona-macOS-arm64.dmg`, `Wawona.apk`, unversioned AppImages, `…-iOS.ipa`) until the next `v*` tag. The iOS card has a package picker for `.ipa`, `.tipa`, `rootless.deb`, and `rootful.deb`. Static href fallbacks point at the release page, not a hardcoded CalVer path.
