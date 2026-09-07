+++
aliases = ["docs/shell"]
title = "On-device shell"
description = "Bundled zsh and Weston terminal. Not a VM or container."
weight = 12
date = 2026-08-14

+++

Wawona ships a bundled **zsh** plus Weston `terminal.c` on Apple mobile (and a constrained zsh on watchOS). That is an **on-device local shell**: a native port path inside the app sandbox. No guest OS required.

It is **not** a [VM or container](@/docs/user/vms-containers.md) machine. Those are separate, planned Machine kinds for running guests.

Also bundled where the target allows: coreutils, foot, neovim.

Type `help` in the shell for the catalog. `ls $WAWONA_ROOTFS/usr/bin` (or `ls ../usr/bin` from `HOME`) lists in-process names.

## WASM / WASI

**Wasm is not platform-native** (tradeoff vs a true in-process port), but it
gives a **portable Wawona Runtime** with full App Store compliance: WASI P1/P2
modules plus **`wpm`**. Drop a `.wasm` into Documents (Files / File Sharing) or
install from the catalog at [`repo.wawona.io/search/?channel=wasm`](https://repo.wawona.io/search/?channel=wasm), then run:

```text
wasm ./tool.wasm hello
./tool.wasm hello
```

The module is a document. Apple does not sign it. The interpreter (Wasmtime
Pulley on iPhone) is inside the reviewed app. Native ports stay first-class.
See [WASM / WASI](@/docs/user/wasm.md) and
[wasm-wasi.md](https://github.com/Wawona/Wawona/blob/development/docs/wasm-wasi.md).

## What is not shipping

There is no Debian/`apt` or StoreKit ODR module catalog. Optional long-tail
software is [WASM / WASI](@/docs/user/wasm.md) for Wawona Runtime (Files drop-in
or the bundled Wasm package client). Linux containers are a separate planned
[Machines kind](@/docs/user/vms-containers.md).

## watchOS

zsh ships with constrained UX. coreutils is excluded. See [WATCHOS-SCOPE](https://github.com/Wawona/Wawona/blob/development/docs/ios-local-shell/WATCHOS-SCOPE.md).

Hub: [ios-local-shell](https://github.com/Wawona/Wawona/blob/development/docs/ios-local-shell/README.md).
