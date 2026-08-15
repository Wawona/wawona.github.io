+++
aliases = ["docs/wasm"]
title = "WASM / WASI"
description = "Drop a .wasm into Files and run it. The interpreter is in the app; Apple does not sign the module."
weight = 13
date = 2026-08-15

+++

Wawona prefers **native in-process ports** (zsh, uutils, weston-terminal, foot, …). WASM is the long-tail escape hatch: compile a tool to WASI, copy the `.wasm` onto the device, run it.

The module is a **document**. Apple does not sign it. The interpreter (Wasmtime Pulley on iPhone) is inside the reviewed app — no JIT, no unsigned Mach-O.

Milestone: [Support WASI P1 P2 WASM!](https://github.com/Wawona/Wawona/milestone/2). Full compile guide: [wasm-wasi.md](https://github.com/Wawona/Wawona/blob/development/docs/wasm-wasi.md).

## On device

1. Put `tool.wasm` in the Wawona Documents folder (Files.app, iTunes File Sharing, or `scp`).
2. In the on-device shell:

```text
help
ls $WAWONA_ROOTFS/usr/bin
wasm ./tool.wasm hello
./tool.wasm hello
```

## Compile

```bash
# Rust WASI P1
rustup target add wasm32-wasip1
cargo build --target wasm32-wasip1 --release

# Rust WASI P2
rustup target add wasm32-wasip2
cargo build --target wasm32-wasip2 --release

# Go
GOOS=wasip1 GOARCH=wasm go build -o tool.wasm
```

Demos live in [`wwn-wasm/examples`](https://github.com/Wawona/wwn-wasm/tree/development/examples).

watchOS keeps the runtime off (size). macOS may use Cranelift. Native ports stay first-class.
