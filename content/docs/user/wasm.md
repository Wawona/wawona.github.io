+++
aliases = ["docs/wasm"]
title = "WASM / WASI"
description = "Drop a .wasm into Files and run it. The interpreter is in the app; Apple does not sign the module."
weight = 13
date = 2026-08-15

+++

Wawona prefers **native in-process ports** when we can ship them (zsh, uutils, weston-terminal, foot, …). Those are real platform binaries inside the reviewed app.

**Wasm is not platform-native.** That is a real tradeoff: no Mach-O/`dlopen` modules, no Alpine `apk` into a guest Linux userspace, and performance sits behind an interpreter (Pulley on Apple mobile). It is a bummer next to a true native port.

What you get instead is a **portable Wawona Runtime** (`wwn-wasm`) that developers and users can target once and run across Wawona with **full App Store / Play compliance**:

- Compile to **WASI P1 or P2** (`.wasm` bytecode as a document / package)
- Browse and search packages at [`repo.wawona.io/search/?channel=wasm`](https://repo.wawona.io/search/?channel=wasm)
- Install with **`wpm`** (or drop into Files) from that Mode A registry
- The reviewed Runtime in the signed app interprets the module. Apple does not sign the `.wasm`, and there is **no** unsigned Mach-O download path

There is **no Mode B package channel** for Wasm. Jailbreak `.deb` APT is separate (`/jailbreak/`). Store Runtime never needs Mode B to *install* packages.

**Mode B IPAs** ([TrollStore](@/docs/user/mode-a-b.md) or Sileo) may **JIT-execute** the same `/wasm/` packages when the JIT entitlement is present. That is an execute backend on the Mode B IPA, not a second registry. App Store builds stay interpreter-only (no Wasm JIT).

Milestone: [Support WASI P1 P2 WASM!](https://github.com/Wawona/Wawona/milestone/2). Engineering: [wasm-wasi.md](https://github.com/Wawona/Wawona/blob/development/docs/wasm-wasi.md), [wasm-package-manager.md](https://github.com/Wawona/Wawona/blob/development/docs/wasm-package-manager.md).

## On device

1. Browse the catalog at [`repo.wawona.io/search/?channel=wasm`](https://repo.wawona.io/search/?channel=wasm). Put `tool.wasm` in the Wawona Documents folder (Files.app, iTunes File Sharing, or `scp`), **or** install with `wpm`.
2. In the on-device shell:

```text
help
ls $WAWONA_ROOTFS/usr/bin
wasm ./tool.wasm hello
./tool.wasm hello
```

## Compile (no Nix)

```bash
# Rust. Https://rustup.rs
rustup target add wasm32-wasip1
cargo build --target wasm32-wasip1 --release

# Go 1.21+. Https://go.dev/dl/
GOOS=wasip1 GOARCH=wasm go build -o tool.wasm

# Swift 6.2+ wasm SDK (no Foundation)
# see examples/wayland-shm/swift/build.sh
```

**Wayland client** (Rust, Go, or Swift. Same `wl_shm` + xdg window):

```bash
cd examples/wayland-shm
./rust/build.sh    # or ./go/build.sh or ./swift/build.sh
```

Demos: [`wwn-wasm/examples`](https://github.com/Wawona/wwn-wasm/tree/development/examples).

## Package manager (`wpm`)

**`wpm`** is Wawona Runtime’s dedicated package manager: iSH-like UX for **Wasm packages**, not `.deb` and not OCI containers. Default registry: [`repo.wawona.io/wasm/v1`](https://repo.wawona.io/wasm/v1) (store-safe Mode A). The web catalog is [`/search/?channel=wasm`](https://repo.wawona.io/search/?channel=wasm) (same `index.json`). Phase 1 ships the local store + CLI + registry client in `wwn-wasm`.

See [Mode A and Mode B](@/docs/user/mode-a-b.md) and [wasm-package-manager.md](https://github.com/Wawona/Wawona/blob/development/docs/wasm-package-manager.md).

watchOS keeps the runtime off (size). macOS may use Cranelift. Native ports stay first-class whenever we have one.
