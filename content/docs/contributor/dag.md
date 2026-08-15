+++
aliases = ["docs/dag"]
title = "Repo DAG"
description = "Acyclic L0-L4 flake inputs. Never invert."
weight = 21
date = 2026-08-13

+++

Canonical: [wwn-repo-dag.md](https://github.com/Wawona/Wawona/blob/development/docs/wwn-repo-dag.md).

{% mermaid() %}
flowchart BT
  toolchain["L0 wwn-toolchain"]
  iland["L1 wwn-iland"]
  kmscube["L2 wwn-kmscube"]
  weston["L3 wwn-weston"]
  peers["L3' waypipe ssh zsh niri vms wasm"]
  app["L4 Wawona"]
  toolchain --> iland --> kmscube --> weston --> app
  toolchain --> peers --> app
  iland --> app
{% end %}

## Wawona flake inputs today

`wwn-toolchain`, `wwn-iland`, `wwn-kmscube`, `wwn-weston`, `wwn-zsh`, `wwn-ssh`, `wwn-waypipe`, `wwn-anowaW`, `wwn-coreutils`, `wwn-foot`, `wwn-fastfetch`, `wwn-phoon-rs`, `wwn-neovim`, `wwn-wasm`, `wwn-niri`, `wwn-vms`, `wwn-containers`, plus nixpkgs, rust-overlay, crate2nix, microvm, nix-appimage.

L0 never imports L1+. Graphics keys (ANGLE, SwiftShader, MoltenVK, KosmicKrisp) live in L1. cairo/pango/pixman stay L0.

## Not flake-wired

`wwn-apt` (not shipping), DE skeletons, [wwn-mcp](@/docs/contributor/wwn-mcp.md) (contributor Cursor RAG — stdio install), this site. Do not document them as product inputs.

Never treat [repo.wawona.io](https://github.com/Wawona/repo.wawona.io) (jailbreak Procursus APT) as Wawona docs.
