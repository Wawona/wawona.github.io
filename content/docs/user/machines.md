+++
aliases = ["docs/machines"]
title = "Machines"
description = "Native, waypipe, terminal, VM, and container profiles. Start, Focus, minimize."
weight = 2
date = 2026-08-13

+++

A **Machine** is a saved session: how clients reach this compositor. Configure it in the Machines window. Do not export env vars to make it work.

## Kinds

| `type` | What it is |
|--------|------------|
| `native` | Clients on this device against Wawona's socket |
| `ssh_waypipe` | Remote Wayland over SSH + waypipe |
| `ssh_terminal` | SSH shell only |
| `virtual_machine` | Guest VM (`wwn-vms`) |
| `container` | OCI container (`wwn-containers`) |

VM and container kinds are **forbidden** on tvOS and watchOS.

## Start, Focus, minimize

- **Start** launches the session.
- **Focus** shows the compositor again after you leave it.
- **Minimize** parks the session in Machines without killing the client (fill-primary hosts). watchOS stubs ignore host WM requests.

Per-machine overrides beat global Settings.

## Display backend

Nested Weston and Niri both have a real DRM backend. Settings **Display Backend** (`CompositorBackend`) is `auto`, `wayland`, or `drm`. Wawona maps that onto `weston --backend=` and `NIRI_BACKEND`. Do not pin nested-only.

See [machine-profiles.md](https://github.com/Wawona/Wawona/blob/development/docs/machine-profiles.md) in the repo.
