+++
aliases = ["docs/waypipe"]
title = "Waypipe"
description = "Remote Wayland over SSH with waypipe-rs 0.11.0. Machines GUI, not env vars."
weight = 8
date = 2026-08-25

+++

Waypipe streams a remote (or VM) Wayland client into Wawona. Configure the machine as **SSH + Waypipe** (`ssh_waypipe`) in the Machines GUI. Do not rely on exported variables.

Wawona speaks **waypipe-rs v0.11.0** ([mstoeckl/waypipe](https://gitlab.freedesktop.org/mstoeckl/waypipe) tag `v0.11.0`). The guest must run that same Rust implementation. A different `waypipe` (the older C tool, or another version) will not interoperate.

## SSH backends (`wwn-ssh`)

| Host | Transport |
|------|-----------|
| macOS | OpenSSH process |
| iOS / iPadOS / tvOS / watchOS / visionOS | libssh2 in-process only |
| Android | OpenSSH portable (`libssh_bin.so`) |

## GPU vs SHM

Waypipe **GPU transport is the default**. Remote/container clients keep their
own OpenGL, Vulkan, ANGLE, Mesa, or software (llvmpipe) stacks; the host
translates dmabuf into IOSurface for Wawona (MoltenVK / KosmicKrisp /
SwiftShader / ANGLE stay available for the compositor and native clients).

Turn on **Disable GPU** on that machine only to force Waypipe `--no-gpu`
(shared memory). Software clients that already speak `wl_shm` do not need that
toggle. tvOS can use MoltenVK. watchOS stays on the SHM/CPU path.

See [`wwn-waypipe`](https://github.com/Wawona/wwn-waypipe).

## Keys

Generate ed25519 / ecdsa / rsa from Settings or the in-app PTY. Apple mobile keygen uses libssh2 CLI. Android uses OpenSSH portable.

## Tutorial: Fedora VM

Example: a Fedora guest (UTM, VirtualBox, virt-manager, cloud VM) whose Wayland apps should appear in Wawona. The in-tree `virtual_machine` machine kind is still [planned](@/docs/user/vms-containers.md). Until that ships, use **SSH + Waypipe** against whatever already runs the VM.

### 1. On Fedora: SSH and waypipe-rs 0.11.0

Enable SSH and confirm you can log in from the host (Terminal.app is fine for this check):

```bash
sudo systemctl enable --now sshd
```

Install **waypipe-rs 0.11.0** on the guest. Fedora's `dnf install waypipe` may be a different binary. Check:

```bash
waypipe --version
# Need the Rust waypipe, version 0.11.0
```

If it is not 0.11.0 Rust waypipe, install that tag. Cargo:

```bash
cargo install --git https://gitlab.freedesktop.org/mstoeckl/waypipe.git --tag v0.11.0 --locked
```

Or Nix on the guest:

```bash
nix profile install github:Wawona/wwn-waypipe/development#waypipe
which waypipe
```

Put `~/.cargo/bin` or `~/.nix-profile/bin` on `PATH` for the SSH user Wawona will use.

Pick a Wayland client to run under waypipe (anything that talks Wayland on Fedora): `weston-simple-shm`, `foot`, `gtk4-demo`, and so on. That string is **Remote Command** in Wawona, not a local env var.

### 2. Find the IP and SSH port

Wawona **Host** is whatever the Wawona device can route to. **Port** is the SSH port as seen from that device (default **22** unless you forwarded it).

**Bridged / shared LAN** (guest has its own address on your network):

```bash
hostname -I
# or
ip -4 addr show
```

Use that IPv4 in Host. Port `22` if `sshd` listens on the default.

**NAT with port forward** (UTM, VirtualBox, QEMU user networking): the guest is not on your LAN. Forward host port `2222` (any free port) to guest `22`, then in Wawona:

- Host: `127.0.0.1` (same Mac as the hypervisor) or the hypervisor machine's LAN IP if Wawona runs on another device
- Port: `2222` (the **host** forward, not 22)

Hypervisor UIs label this differently (UTM: port forwarding; VirtualBox: NAT adapter → port forwarding; `virt-manager`: NIC + hostfwd). The idea is the same: Wawona connects to an address:port that SSHD answers.

**Cloud VMs:** use the public IPv4 (or a VPN address) and the security-group SSH port.

Do not put `user@host` in the Host field. User is its own row.

### 3. In Wawona: create the machine (GUI)

All of this is per-machine. Global Settings → Waypipe / SSH are defaults. The profile wins.

1. Open **Machines**.
2. **Add** a machine (or **Edit** an existing one). This is the identity editor (name, type, SSH, remote command).
3. **Type**: **SSH + Waypipe**. Not Native. Not SSH-only terminal (`ssh_terminal` has no Wayland proxy).
4. **SSH + Waypipe** section:
   - **Host**: Fedora IP or `127.0.0.1`
   - **User**: Fedora login (for example `fedora` or your account)
   - **Port**: `22` or the forwarded host port
   - **Auth Method**: Password or Public Key
   - **Password** or **SSH Key Path** / passphrase
   - **Remote Command**: the guest Wayland client, for example `weston-simple-shm`
5. **Waypipe Overrides** (same editor): compression (`lz4` is a reasonable start). If frames never appear, enable **Disable GPU**.
6. **Save**.

**Machine Settings** (the per-machine overrides sheet, not Add/Edit) is for Display Backend, graphics ICDs, input, and similar keys that should beat **Settings** globals for this session only. SSH Host/Port live on Add/Edit.

### 4. Start

Back on Machines, select the profile → **Start**. Wawona SSHs, runs waypipe-rs 0.11.0, and the remote client's surfaces show in the compositor. **Focus** brings that view back if you left it.

If SSH works in Terminal but Wawona does not: the guest `waypipe` on `PATH` is wrong, Remote Command is not a Wayland client, or GPU import failed (try Disable GPU).

## Related

- [Machines](@/docs/user/machines.md)
- [Settings](@/docs/user/settings.md)
- [VMs and containers](@/docs/user/vms-containers.md) (planned in-app VM kind; this tutorial is the available remote path)
