+++
title = "FAQ"
render = true
sort_by = "none"
template = "faq_section.html"
+++

<style>
.faq-content details {
    margin-bottom: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--r-card);
    background: var(--bg-1);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    overflow: hidden;
    scroll-margin-top: var(--site-chrome-offset, 100px);
}

.faq-content details:hover:not([open]) {
    border-color: var(--primary-color);
}

.faq-content details[open] {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.faq-content details summary {
    padding: 1rem 1.25rem;
    font-weight: 600;
    font-size: 1.05rem;
    font-family: var(--header-font);
    color: var(--text-0);
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 0.2s ease;
    background: none;
    /* Closed: full card radius. Expanded: square bottom against the answer (instant). */
    border-radius: var(--r-card);
}

.faq-content details summary:hover,
.faq-content details summary:focus-visible {
    /* Beat theme summary:hover { color: #fff !important; background: primary }. */
    background-color: var(--bg-2) !important;
    color: var(--text-0) !important;
}

.faq-content details[open] summary {
    color: var(--text-0) !important;
    border-radius: var(--r-card) var(--r-card) 0 0;
}

.faq-content details summary::-webkit-details-marker {
    display: none;
}

.faq-content details summary::before {
    content: "▶";
    font-size: 0.7rem;
    color: var(--text-2);
    transition: transform 0.2s ease;
    flex-shrink: 0;
}

.faq-content details[open] summary::before {
    transform: rotate(90deg);
    color: var(--primary-color);
}

.faq-content .faq-share {
    margin-left: auto;
    background: var(--bg-2);
    border: 1px solid var(--border-color);
    border-radius: var(--r-control);
    padding: 6px 10px;
    font-size: 0.75rem;
    color: var(--text-2);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
    opacity: 0;
    position: relative;
    z-index: 2;
    pointer-events: auto;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
}

.faq-content details summary:hover .faq-share {
    opacity: 1;
}

@media (hover: none) {
    .faq-content .faq-share {
        opacity: 1;
    }
}

.faq-content .faq-share:hover {
    background: var(--bg-1);
    border-color: var(--primary-color);
    color: var(--primary-color) !important;
}

.faq-content .faq-share svg {
    width: 12px;
    height: 12px;
}

.faq-content .faq-share.copied,
.faq-content .faq-share.copied:hover,
.faq-content .faq-share.copied:focus-visible {
    color: #4CAF50 !important;
    border-color: #4CAF50;
    background: var(--bg-1);
}

.faq-content details .faq-answer {
    padding: 0 1.25rem 1.25rem 1.25rem;
    border-top: 1px solid var(--border-color);
    margin-top: 0;
    font-size: 0.925rem;
    line-height: 1.6;
}

.faq-content details .faq-answer p:first-child {
    margin-top: 1rem;
}

.faq-content details .faq-answer table {
    width: 100%;
    margin: 0.75rem 0;
    font-size: 0.85rem;
}

.faq-content details .faq-answer table th {
    text-align: left;
    font-size: 0.85rem;
    background: var(--bg-2);
}

.faq-category {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-1);
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    font-family: var(--header-font);
    letter-spacing: -0.01em;
}

.faq-category:first-of-type {
    margin-top: 0.5rem;
}

.faq-intro {
    font-size: 1.05rem;
    color: var(--text-1);
    margin-bottom: 1.5rem;
}
</style>

<p class="faq-intro">Common questions about running and building Wawona.</p>

<h3 class="faq-category">Using Wawona</h3>

<details id="what-is-a-machine">
<summary>
    What is a Machine?
    <button type="button" class="faq-share" data-faq-id="what-is-a-machine" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

A Machine is a saved session in the Machines window. Kinds: `native`, `ssh_waypipe`, `ssh_terminal`, `virtual_machine`, `container`. Start launches it. Focus shows the compositor again. See [Machines](/docs/machines/).

</div>
</details>
<details id="platforms-gates">
<summary>
    Which platforms, and what is forbidden vs planned vs blocked?
    <button type="button" class="faq-share" data-faq-id="platforms-gates" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

The full Apple family plus Android and Linux. Four states: available, planned, blocked, forbidden. Never "unsupported".

Desktop and LockScreen are **coming soon** on macOS and Android. iOS/iPadOS Desktop/LockScreen will be a jailbreak tweak from [repo.wawona.io](https://repo.wawona.io) (website docs only. Not in the App Store app). [Wawona Swinging Bridge](/docs/swinging-bridge/) is a separate planned app bridge (macOS / Android / iOS / iPadOS). [VMs and containers](/docs/vms/) are planned on macOS, iOS, iPadOS, Android, and Linux. Forbidden on tvOS, watchOS, and visionOS. The [on-device shell](/docs/shell/) is bundled zsh, not a VM. watchOS GPU is blocked (no public Metal). tvOS GPU is planned (SDK has Metal). See [Platforms](/docs/platforms/).

</div>
</details>
<details id="weston-and-niri">
<summary>
    Do Weston and Niri both ship?
    <button type="button" class="faq-share" data-faq-id="weston-and-niri" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

Yes. Both are mandatory native bundles on every product target. Display backend is a setting (`auto` / `wayland` / `drm`), not a hardcoded nested-only path.

</div>
</details>
<details id="local-shell">
<summary>
    Is there a local shell on iPhone?
    <button type="button" class="faq-share" data-faq-id="local-shell" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

Yes. Bundled zsh plus Weston terminal. watchOS gets a constrained zsh. That is the **on-device shell**, not a VM or container. See [On-device shell](/docs/shell/) and [VMs and containers](/docs/vms/).

</div>
</details>
<details id="desktop-replacement">
<summary>
    How does Desktop Replacement work?
    <button type="button" class="faq-share" data-faq-id="desktop-replacement" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

**Coming soon.** Desktop and LockScreen make Wawona the host DE and greeter (native-port machine profiles only). macOS: SIP fully disabled (`csrutil disable`) + `.dylib` on `wawona-macos-desktop-host`. Android: Default Home App + LockScreen APIs, no root. iOS and iPadOS: jailbreak tweak from [repo.wawona.io](https://repo.wawona.io) only (not in the App Store app). Not Linux. Not the same as [Wawona Swinging Bridge](/docs/swinging-bridge/). See [Desktop and LockScreen](/docs/desktop/).

</div>
</details>
<details id="swinging-bridge">
<summary>
    What is Wawona Swinging Bridge?
    <button type="button" class="faq-share" data-faq-id="swinging-bridge" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

**Coming soon** (formerly anowaW). **Wawona Swinging Bridge** turns macOS and Android apps into Wayland clients and can forward them with waypipe-rs onto a Linux compositor (resize, placement, HID). Future: UIKit iOS apps. **Not** Desktop or LockScreen. Mode A (store/Play, stream-like) and Mode B (privileged) are planned; **iOS is Mode B only** (not in the App Store IPA). See [Wawona Swinging Bridge](/docs/swinging-bridge/).

</div>
</details>
<details id="vms-containers">
<summary>
    Do VMs and containers work in Machines?
    <button type="button" class="faq-share" data-faq-id="vms-containers" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

**Coming soon.** Machines will gain `virtual_machine` and `container` profiles on macOS, iOS, iPadOS, Android, and Linux. Store iOS uses UTM-SE-class **jitless** engines (Mode A); jailbreak **Mode B IPA** from [repo.wawona.io](https://repo.wawona.io) may use JIT. macOS: Virtualization + Containerization. Forbidden on tvOS, watchOS, and visionOS. See [Mode A/B](/docs/mode-a-b/) and [VMs and containers](/docs/vms/).

</div>
</details>
<details id="pre-built-binaries">
<summary>
    Are there pre-built binaries? How do I get a build without Nix?
    <button type="button" class="faq-share" data-faq-id="pre-built-binaries" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

Yes. CalVer `YY.M.D` (for example `v26.8.12`). [Download](/download/) for GitHub assets on `v*` tags. Ship: beta (stores) on `master` is TestFlight and Play internal. Find beta testing links on the [Wawona Discord](https://discord.gg/wHVSV52uw5). macOS is not an App Store feature target. Filename scheme for developers: [Prebuilt binary naming](/docs/prebuilt-naming/).

</div>
</details>

<h3 class="faq-category">Help</h3>

<details id="report-a-bug">
<summary>
    How do I report a bug?
    <button type="button" class="faq-share" data-faq-id="report-a-bug" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

On Apple, Android, and Linux: Settings → About → Report a Bug on GitHub. That copies recent Wawona logs and opens the GitHub bug form with this platform, version, and host OS filled. **TestFlight:** crashes go to App Store Connect; for hangs, send Beta Feedback from the TestFlight app *and* use Report a Bug on GitHub (install channel TestFlight (Beta)). Sideloaded IPAs have no TestFlight crash mail. Those copied logs are the report. Full steps: [Report a bug](/docs/reporting-bugs/). Discord: [Wawona Discord](https://discord.gg/wHVSV52uw5).

</div>
</details>

<h3 class="faq-category">Building</h3>

<details id="nix-build-time">
<summary>
    Why does the Nix build take so long?
    <button type="button" class="faq-share" data-faq-id="nix-build-time" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

Cold builds compile C/C++ substrate in `wwn-toolchain` and graphics in `wwn-iland`, plus the Rust compositor, Weston, and Niri. Package and crate counts in older posts are stale. After `determinate-nixd login`, the org FlakeHub cache hits many store paths. See [Nix](/docs/nix-build-system/).

</div>
</details>
<details id="storage-space">
<summary>
    How much disk space does a build need?
    <button type="button" class="faq-share" data-faq-id="storage-space" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

Plan tens of gigabytes for a full Apple-family plus Android tree (Xcode SDKs dominate). Linux-only is smaller. ANGLE and SwiftShader are owned by `wwn-iland` (L1), not the compositor repo. tvOS, watchOS, visionOS, and Linux are first-class targets alongside macOS, iOS, and Android.

</div>
</details>
<details id="why-nix">
<summary>
    Why Nix? Do users need it?
    <button type="button" class="faq-share" data-faq-id="why-nix" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

Users do not need Nix to run a downloaded binary. Nix is how we cross-compile hermetically. Libraries live in flake inputs (`wwn-toolchain`, `wwn-iland`, …), not as 27 C libraries in this repo. Determinate Nix plus FlakeHub is the documented path.

</div>
</details>
<details id="intel-macs">
<summary>
    Does Wawona support Intel Macs?
    <button type="button" class="faq-share" data-faq-id="intel-macs" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

The flake dropped `x86_64-darwin` (nixpkgs 26.11 throws). Apple Silicon only for Darwin hosts.

</div>
</details>
<details id="ios-signing">
<summary>
    How do I sign Apple-family builds?
    <button type="button" class="faq-share" data-faq-id="ios-signing" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

Set `TEAM_ID` in `.envrc`. Schemes exist for iOS, iPadOS, tvOS, watchOS, and visionOS, not iOS-only. See [Compilation](/docs/compilation/).

</div>
</details>

<h3 class="faq-category">Protocols and ports</h3>

<details id="protocol-support">
<summary>
    What Wayland protocols are supported?
    <button type="button" class="faq-share" data-faq-id="protocol-support" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

See the generated matrix: [Protocol Support](/docs/protocols/). The live registry count changes with `ProtocolProfile` (store-safe vs desktop-host). Plasma globals are advertised on desktop-host. Status (Functional / Partial / Stub) is a catalog field, not inferred by CI.

</div>
</details>
<details id="port-linux-software">
<summary>
    How do I port Linux software?
    <button type="button" class="faq-share" data-faq-id="port-linux-software" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

Three delivery paths: native port, container, or VM/remote over waypipe. A native port must match the Linux client streamed over waypipe (same protocols, same windowing path). Recipes live in `wwn-*` repos, not `Wawona/dependencies/libs/`. X11 is remote or nested XWayland only. No local X server. See [Porting](/docs/porting/).

</div>
</details>
<details id="contribute-protocols">
<summary>
    How do I contribute protocol implementations?
    <button type="button" class="faq-share" data-faq-id="contribute-protocols" title="Copy link to this question" aria-label="Copy link to this question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span class="faq-share-label">Link</span>
    </button>
</summary>
<div class="faq-answer">

Start from the live registry and `PROTOCOL_CATALOG` in `src/core/wayland/catalog.rs`. CI fails if an advertised global has no catalog row. Status stays human-reviewed. Spec links go to [wayland.app](https://wayland.app/). Regenerate with `scripts/gen-protocol-status.sh`.

</div>
</details>
