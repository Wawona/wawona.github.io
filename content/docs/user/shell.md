+++
aliases = ["docs/shell"]
title = "On-device shell"
description = "Bundled zsh and Weston terminal — not a VM or container."
weight = 12
date = 2026-08-14

+++

Wawona ships a bundled **zsh** plus Weston `terminal.c` on Apple mobile (and a constrained zsh on watchOS). That is an **on-device local shell**: a native port path inside the app sandbox. No guest OS required.

It is **not** a [VM or container](@/docs/user/vms-containers.md) machine. Those are separate, planned Machine kinds for running guests.

Also bundled where the target allows: coreutils, foot, neovim.

## What is not shipping

`wwn-apt` (StoreKit modules) is **not** a Wawona flake input. Do not expect Debian `apt install` on iPhone.

## watchOS

zsh ships with constrained UX. coreutils is excluded. See [WATCHOS-SCOPE](https://github.com/Wawona/Wawona/blob/development/docs/ios-local-shell/WATCHOS-SCOPE.md).

Hub: [ios-local-shell](https://github.com/Wawona/Wawona/blob/development/docs/ios-local-shell/README.md).
