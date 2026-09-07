+++
aliases = ["docs/packages", "docs/wpm", "docs/sileo"]
title = "Packages"
description = "Search and install extra software: App Store / Play wasm with wpm, Sileo debs on jailbroken iOS (rootless/rootful), Termux debs on sideloaded Android. Termux is not jailbreak. Two catalogs, never one list."
weight = 13
date = 2026-09-07

+++

Extra software on Wawona comes from **two catalogs**. They do not share an index. App Store / Play compliance is **wasm only**. Store `wpm` never sees `.deb`. Sileo never installs WASI blobs from `/wasm/v1`.

Start at [repo.wawona.io/search](https://repo.wawona.io/search/). That page is a **chooser**. Pick a lane before you search.

| Lane | Website | Install with | Who |
|------|---------|--------------|-----|
| **Wasm** | [`/search/?channel=wasm`](https://repo.wawona.io/search/?channel=wasm) | `wpm` in the Wawona shell | **App Store / Play** (store compliance). macOS `wpm` too. |
| **Sileo debs** | [`/search/?channel=deb`](https://repo.wawona.io/search/?channel=deb) | Sileo / Zebra, or `apt` in NewTerm | **Jailbroken iOS / iPadOS**. Rootless and rootful. **Not** Termux. **Not** App Store. |
| **Termux debs** | [`/termux/`](https://repo.wawona.io/termux/) | Termux `apt` | **Sideloaded Android**. **Not jailbreak.** **Not Play.** |

Sileo and Termux share the APT source [`https://repo.wawona.io/`](https://repo.wawona.io/) (`Packages`). Architecture splits them: `iphoneos-arm64` / `iphoneos-arm` for Sileo, `aarch64` for Termux.

Machine APIs stay split: [`/wasm/v1`](https://repo.wawona.io/wasm/v1/index.json) for `wpm`, [`/Packages`](https://repo.wawona.io/Packages) for APT. The website lists each catalog. It does not mix them into one results list.

## Search on the website

1. Open [repo.wawona.io/search](https://repo.wawona.io/search/).
2. Choose **App Store / Play wasm** or the deb catalog. Bookmarks: [`/wasm/`](https://repo.wawona.io/wasm/), [`/deb/`](https://repo.wawona.io/deb/), [`/jailbreak/`](https://repo.wawona.io/jailbreak/) (Sileo iOS), [`/termux/`](https://repo.wawona.io/termux/) (Termux Android). APT source URL stays `https://repo.wawona.io/`.
3. Type a name. Expand a card for install commands, digest, and maintainers.
4. Copy the command for **that** audience. Do not paste a Sileo URL into `wpm`, and do not paste a `wpm install` line into apt.

OpenSearch (browser search) also lands on the chooser so you pick a lane first.

## Wasm with `wpm` (App Store / Play)

Use this path in the **store Wawona app** (App Store, Play). Packages are WASI bytecode. This is the **only** extra-software channel that is store-compliant. It is **not** `apt`, not Sileo, and not Termux.

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

Default registry: `https://repo.wawona.io/wasm/v1`. Same `index.json` the website reads. Store builds must **never** probe `/jailbreak/`, `/termux/`, or `/Packages`.

See [WASM / WASI](@/docs/user/wasm.md) and [On-device shell](@/docs/user/shell.md).

## Sileo debs (jailbroken iOS)

Use this path on a **jailbroken iPhone / iPad**. These are `.deb` packages for Sileo / Zebra. Rootless (`iphoneos-arm64`) and rootful (`iphoneos-arm`). Optional RootHide (`iphoneos-arm64e`). **Not** Termux. **Not** App Store.

1. Open [repo.wawona.io](https://repo.wawona.io/) (the Sileo landing page).
2. Tap **Add to Sileo** or **Add to Zebra**, or add the source by hand:

```text
https://repo.wawona.io/
```

3. Refresh sources. Search in Sileo, or browse [`/search/?channel=deb`](https://repo.wawona.io/search/?channel=deb) and filter `iphoneos-*`.
4. Install from Sileo. The website card copies `apt install <name>` for NewTerm.

```text
sudo apt edit-sources
# add: deb https://repo.wawona.io/ stable main

sudo apt update
sudo apt install com.aspauldingcode.hello
```

Host APT and Mode B IPA extras (Desktop, LockScreen, Swinging Bridge) are **Sileo Mode B** only. See [Mode A and Mode B](@/docs/user/mode-a-b.md).

## Termux debs (sideloaded Android)

Use this path in **sideloaded Termux** on Android. These are `.deb` packages for Termux `apt`. This is **not jailbreak**, **not Magisk**, and **not Play Store**. Play Wawona still uses wasm + `wpm` only.

```text
apt edit-sources
# add: deb https://repo.wawona.io/ stable main

apt update
apt install com.aspauldingcode.hello
```

Bookmark: [`/termux/`](https://repo.wawona.io/termux/). Same APT URL as Sileo. Filter architecture `aarch64`.

## Do not mix

- One website list with both `.wasm` and `.deb`: the chooser forbids it.
- `wpm install` of a `.deb`, or `apt install` of a wasm package.
- Teaching store `wpm` to read `/jailbreak/`, `/termux/`, or `/Packages`.
- Calling Termux debs jailbreak, or putting Sileo URLs inside the App Store / Play app.

Wasm stays store-safe data. Sileo debs stay jailbroken iOS APT. Termux debs stay sideloaded Android APT. [WASM / WASI](@/docs/user/wasm.md) is the Runtime story. This page is how you **find and install** software from each audience.
