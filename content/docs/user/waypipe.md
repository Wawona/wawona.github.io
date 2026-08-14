+++
aliases = ["docs/waypipe"]
title = "Waypipe"
description = "Remote Wayland over SSH. Machines GUI, not env vars."
weight = 8
date = 2026-08-13

+++

Waypipe streams a remote (or VM) Wayland client into Wawona. Configure the machine as `ssh_waypipe`. Do not rely on exported variables.

## SSH backends (`wwn-ssh`)

| Host | Transport |
|------|-----------|
| macOS | OpenSSH process |
| iOS / iPadOS / tvOS / watchOS / visionOS | libssh2 in-process only |
| Android | OpenSSH portable (`libssh_bin.so`) |

SSH is OpenSSH on macOS, libssh2 on Apple mobile, OpenSSH portable on Android.

## GPU vs SHM

With a working Vulkan ICD, waypipe can use GPU transport. Without one, force `--no-gpu` SHM. watchOS stays on the SHM/CPU path.

## Keys

Generate ed25519 / ecdsa / rsa from Settings or the in-app PTY. Apple mobile keygen uses libssh2 CLI. Android uses OpenSSH portable.
