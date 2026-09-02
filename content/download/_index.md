+++
title = "Download"
description = "Download Wawona for macOS, Linux, Android, and the iOS family (.ipa, .tipa, rootless/rootful .deb)"
+++

Wawona for macOS, Linux, Android, and the iOS family.

**Beta testing:** Find TestFlight and Play beta links on the [Wawona Discord](https://discord.gg/wHVSV52uw5).

### iOS package picker

On the iOS card, choose the install flavor (GitHub Release names):

| Flavor | File | Who |
|--------|------|-----|
| Mode A sideload | `Wawona-{calver}-iOS-arm64.ipa` | Sideload without TrollStore / jailbreak. No JIT, no IOMFB, no Desktop, no Swinging Bridge |
| TrollStore | `Wawona-{calver}-iOS-arm64.tipa` | JIT + IOMobileFramebuffer Desktop/LockScreen in-app. **No** Swinging Bridge |
| Sileo rootless | `Wawona-{calver}-iOS-arm64-rootless.deb` | Full Mode B (`/var/jb`). Swinging Bridge + host APT + ElleKit |
| Sileo rootful | `Wawona-{calver}-iOS-arm64-rootful.deb` | Full Mode B (prefix `/`). Same Mode B class as rootless |

App Store / TestFlight builds stay Mode A only and are not these GitHub assets. Details: [Mode A and Mode B](@/docs/user/mode-a-b.md). Naming: [Prebuilt binary naming](@/docs/contributor/prebuilt-naming.md).

Something broken after install? [Report a bug](@/docs/user/reporting-bugs.md). TestFlight testers: send Beta Feedback in the TestFlight app, and paste copied logs on GitHub.

{{ download_cards() }}
