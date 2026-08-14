+++
aliases = ["docs/shell"]
title = "On-device shell"
description = "Bundled zsh and Weston terminal. Not StoreKit apt."
weight = 11
date = 2026-08-13

+++

Wawona ships a bundled **zsh** plus Weston `terminal.c` on Apple mobile (and a constrained zsh on watchOS). This is an App Store-compliant local shell: no jailbreak, no remote host required.

Also bundled: coreutils, foot, neovim (where the target allows). That is the on-device story.

## What is not shipping

`wwn-apt` (StoreKit modules) is **not** a Wawona flake input. Do not expect Debian `apt install` on iPhone.

## watchOS

zsh ships with constrained UX. coreutils is excluded. See [WATCHOS-SCOPE](https://github.com/Wawona/Wawona/blob/development/docs/ios-local-shell/WATCHOS-SCOPE.md).

Hub: [ios-local-shell](https://github.com/Wawona/Wawona/blob/development/docs/ios-local-shell/README.md).
