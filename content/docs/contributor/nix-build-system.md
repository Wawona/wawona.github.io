+++
aliases = ["docs/nix-build-system"]
title = "Nix Build System"
description = "L0 substrate, L1 graphics, crate2nix, FlakeHub. Libs are not in this repo."
weight = 26
date = 2026-08-13

+++

Library recipes do **not** live in `Wawona/dependencies/libs/`. Substrate is `wwn-toolchain`. GLES/Vulkan ICDs are `wwn-iland`. Wawona merges registries upward.

```
Layer 3  App packaging (xcodegen, Gradle, AppImage)
Layer 2  Rust backend (crate2nix)
Layer 1  Native libs from wwn-* flake inputs
```

Inputs: see [Repo DAG](@/docs/contributor/dag.md). `follows` keep the graph acyclic.

macOS waypipe is a real backend (IOSurface/Mach). Do not document it as missing.

Binary cache: org FlakeHub cache after `determinate-nixd login`.
