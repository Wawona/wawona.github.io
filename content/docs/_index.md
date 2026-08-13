+++
title = "Documentation"
render = true
sort_by = "weight"
template = "docs_section.html"
page_template = "docs_page.html"
+++

<style>
.docs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 2rem;
}

.docs-grid a {
    border: 1px solid var(--border-color);
    --pad: 1.25rem;
    border-radius: calc(var(--r-inset) + var(--pad));
    padding: var(--pad);
    background: var(--bg-1);
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    display: block;
    border-bottom: 1px solid var(--border-color);
}

.docs-grid a:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: var(--bg-1);
    color: inherit !important;
}

.docs-grid a strong {
    font-size: 1.05rem;
    display: block;
    margin-bottom: 0.35rem;
    font-family: var(--header-font);
}

.docs-grid a span {
    font-size: 0.88rem;
    color: var(--text-1);
    line-height: 1.45;
    display: block;
}

.docs-section-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 0.25rem;
    font-family: var(--header-font);
    color: var(--text-1);
    letter-spacing: -0.01em;
}

.docs-section-title:first-of-type {
    margin-top: 0.5rem;
}

.docs-intro p:first-child {
    font-size: 1.05rem;
    color: var(--text-1);
    margin-bottom: 1.5rem;
}
</style>

Wawona is a native Wayland compositor for macOS, Linux, Android, and the iOS family (iOS, iPadOS, watchOS, tvOS, visionOS). Users run Machines. Contributors build the flake DAG.

<h3 class="docs-section-title">User guide</h3>
<div class="docs-grid">
<a href="/docs/getting-started/">
<strong>Getting Started</strong>
<span>Download, TestFlight, Discord. CalVer. Build from source is optional.</span>
</a>
<a href="/docs/machines/">
<strong>Machines</strong>
<span>Native, waypipe, terminal, VM, and container profiles. Start and Focus.</span>
</a>
<a href="/docs/usage/">
<strong>Usage</strong>
<span>Nested Weston and Niri. Bundled clients. Multi-Touch.</span>
</a>
<a href="/docs/settings/">
<strong>Settings</strong>
<span>Display backend, graphics, input, Desktop on macOS and Android only.</span>
</a>
<a href="/docs/platforms/">
<strong>Platforms</strong>
<span>Available, planned, blocked, forbidden. Not a yes/no matrix.</span>
</a>
<a href="/docs/waypipe/">
<strong>Waypipe</strong>
<span>OpenSSH on macOS. libssh2 on Apple mobile. OpenSSH portable on Android.</span>
</a>
<a href="/docs/graphics/">
<strong>Graphics</strong>
<span>Vulkan and GLES. SHM fallback. watchOS GPU blocked. tvOS GPU planned.</span>
</a>
<a href="/docs/desktop/">
<strong>Desktop Replacement</strong>
<span>Mode A in-window. Mode B SIP on macOS. anowaW on Android. Never iOS family.</span>
</a>
<a href="/docs/shell/">
<strong>On-device shell</strong>
<span>Bundled zsh and Weston terminal. Not Debian apt.</span>
</a>
</div>

<h3 class="docs-section-title">Contributor guide</h3>
<div class="docs-grid">
<a href="/docs/architecture/">
<strong>Architecture</strong>
<span>Rust core, native UI, FFI. Mission and source layout.</span>
</a>
<a href="/docs/dag/">
<strong>Repo DAG</strong>
<span>L0 toolchain through L4 Wawona. Current flake inputs.</span>
</a>
<a href="/docs/nested-compositors/">
<strong>Nested compositors</strong>
<span>Weston and Niri on every product target. Waypipe equivalence.</span>
</a>
<a href="/docs/iland/">
<strong>iland</strong>
<span>Userspace DRM/KMS/GBM. Mode A archive. Mode B dylib shipping rule.</span>
</a>
<a href="/docs/protocols/">
<strong>Protocol Support</strong>
<span>Generated from the live registry. Status is a catalog field.</span>
</a>
<a href="/docs/compilation/">
<strong>Compilation</strong>
<span>Flake product attributes, TEAM_ID, local-before-CI.</span>
</a>
<a href="/docs/nix-build-system/">
<strong>Nix Build System</strong>
<span>wwn-toolchain substrate, wwn-iland graphics, FlakeHub.</span>
</a>
<a href="/docs/porting/">
<strong>Porting</strong>
<span>wwn-* convention. Substitute the platform, not the client.</span>
</a>
<a href="/docs/debugging/">
<strong>Debugging</strong>
<span>agent-device for UI. Opt-in LLDB. No osascript screenshots.</span>
</a>
<a href="/docs/ci/">
<strong>CI</strong>
<span>development vs master. Gate: packages / products. Ship on master only.</span>
</a>
</div>
