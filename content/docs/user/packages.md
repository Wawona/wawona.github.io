+++
aliases = ["docs/packages", "docs/wpm", "docs/sileo"]
title = "Packages"
description = "Search and install extra software: Mode A wasm with wpm, Mode B jailbreak debs with Sileo or Termux apt. Two catalogs, never one list."
weight = 13
date = 2026-09-07

+++

Extra software on Wawona comes from **two catalogs**. They do not share an index. Store `wpm` never sees jailbreak debs. Sileo never installs WASI blobs from `/wasm/v1`.

Start at [repo.wawona.io/search](https://repo.wawona.io/search/). That page is a **chooser**. Pick a lane before you search.

| Lane | Website | Install with | Who |
|------|---------|--------------|-----|
| **Mode A wasm** | [`/search/?channel=wasm`](https://repo.wawona.io/search/?channel=wasm) | `wpm` in the Wawona shell, or drop a `.wasm` into Files | App Store, Play, macOS. Store-safe. |
| **Mode B debs** | [`/search/?channel=deb`](https://repo.wawona.io/search/?channel=deb) | Sileo / Zebra, or `apt` in NewTerm / Termux | Jailbroken iOS, Termux. **Not** App Store binaries. |

Machine APIs stay split: [`/wasm/v1`](https://repo.wawona.io/wasm/v1/index.json) for `wpm`, [`/Packages`](https://repo.wawona.io/Packages) for APT. The website lists each catalog. It does not mix them into one results list.

## Search on the website

1. Open [repo.wawona.io/search](https://repo.wawona.io/search/).
2. Choose **App Store / Play wasm** or **Jailbreak debs**. Bookmarks: [`/wasm/`](https://repo.wawona.io/wasm/) and [`/deb/`](https://repo.wawona.io/deb/) redirect into those lanes.
3. Type a name. Expand a card for install commands, digest, and maintainers.
4. Copy the command for **that** lane. Do not paste a Sileo URL into `wpm`, and do not paste a `wpm install` line into apt.

OpenSearch (browser search) also lands on the chooser so you pick a lane first.

## Mode A. Wasm with `wpm` (store-safe)

Use this path in the **Wawona app** (App Store, Play, macOS). Packages are WASI bytecode. Apple does not sign the `.wasm`. The Runtime in the reviewed app runs it. This is **not** `apt`, not Sileo, and not a Linux container.

1. Browse [`/search/?channel=wasm`](https://repo.wawona.io/search/?channel=wasm).
2. In the on-device shell:

```text
wpm search hello
wpm install hello-wasi
wpm list
wasm hello-wasi
```

Or drop `tool.wasm` into Wawona Documents (Files.app, iTunes File Sharing, or `scp`) and run:

```text
wasm ./tool.wasm hello
./tool.wasm hello
```

Default registry: `https://repo.wawona.io/wasm/v1`. Same `index.json` the website reads. Store builds must **never** probe `/jailbreak/` or `/Packages`.

See [WASM / WASI](@/docs/user/wasm.md) and [On-device shell](@/docs/user/shell.md).

## Mode B. Jailbreak debs with Sileo or apt

Use this path on a **jailbroken iPhone / iPad** (Sileo or Zebra) or **Termux** on Android. These are `.deb` packages. They are **not** for App Store or Play Wawona.

### Sileo or Zebra

1. Open [repo.wawona.io](https://repo.wawona.io/) (the Sileo landing page).
2. Tap **Add to Sileo** or **Add to Zebra**, or add the source by hand:

```text
https://repo.wawona.io/
```

3. Refresh sources. Search in Sileo, or browse the same packages on the website at [`/search/?channel=deb`](https://repo.wawona.io/search/?channel=deb).
4. Install from Sileo. The website card copies `apt install <name>` for NewTerm.

### apt (NewTerm on jailbroken iOS, Termux on Android)

```text
# iOS NewTerm (sudo as designed on that jailbreak)
sudo apt edit-sources
# add: deb https://repo.wawona.io/ stable main

sudo apt update
sudo apt install com.aspauldingcode.hello
```

```text
# Android Termux
apt edit-sources
# add: deb https://repo.wawona.io/ stable main

apt update
apt install com.aspauldingcode.hello
```

One-click CLI from the repo landing page is also available. After the source is added, `apt search` and Sileo search both see the APT index. The website deb catalog is the same `Packages` file, labeled Mode B so it cannot be confused with wasm.

Host APT and Mode B IPA extras (Desktop, LockScreen, Swinging Bridge) are **Sileo Mode B** only. See [Mode A and Mode B](@/docs/user/mode-a-b.md).

## Do not mix

- One website list with both `.wasm` and `.deb`: the chooser forbids it.
- `wpm install` of a `.deb`, or `apt install` of a wasm package.
- Teaching store `wpm` to read `/jailbreak/` or `/Packages`.
- Putting jailbreak copy or Sileo URLs inside the App Store app.

Wasm stays Mode A data. Jailbreak debs stay Mode B APT. [WASM / WASI](@/docs/user/wasm.md) is the Runtime story. This page is how you **find and install** software from each catalog.
