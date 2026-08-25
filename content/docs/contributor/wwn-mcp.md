+++
aliases = ["docs/wwn-mcp", "docs/mcp", "docs/ai", "docs/ai-contributors"]
title = "AI + MCP"
description = "How contributors wire wwn-mcp and companion MCPs so AI agents stop guessing about Wawona."
weight = 20
date = 2026-08-16

+++

Use AI on Wawona only with **retrieval**. The stack (Wayland, Smithay, iland, Apple OS 26, store gates, multi-repo DAG) largely post-dates model training. Without MCP, agents invent wrong repos, wrong gates, and wrong windowing paths.

**WWN-MCP** (`wwn-mcp`) is a local-embeddings RAG + stdio [Model Context Protocol](https://modelcontextprotocol.io/) server. Any MCP host that can spawn a process works (Cursor, VS Code, Claude Desktop, Windsurf, Zed, …). There is **no** `https://mcp.wawona.io`. Transport is stdio only, same idea as [mcp-nixos](https://github.com/utensils/mcp-nixos).

Repo: [Wawona/wwn-mcp](https://github.com/Wawona/wwn-mcp). Not a product flake input. See [Repo DAG](@/docs/contributor/dag.md).

## Quick start

1. Install the binary (prefer a profile install so the editor spawn is fast):

```bash
nix profile install github:Wawona/WWN-MCP
wwn-mcp info
wwn-mcp search "watchOS GPU"
```

2. Point your MCP host at it:

```json
{
  "mcpServers": {
    "wwn-mcp": { "command": "wwn-mcp", "args": [] },
    "nixos": { "command": "uvx", "args": ["mcp-nixos"] }
  }
}
```

3. Tell the agent (or keep `AGENTS.md` / Cursor rules) to **query `wwn-mcp` before editing**. Especially `list_repos`, `where_to_edit`, `get_capability`, and `search_docs`.

First empty DB auto-indexes shipped `knowledge/`. Full multi-repo corpus:

```bash
wwn-mcp fetch
wwn-mcp index
# or, with sibling checkouts under ~/Wawona:
wwn-mcp index --local-siblings
```

Bare `wwn-mcp` on a TTY prints host-setup help and exits. The agent must spawn it with piped stdin for the MCP server.

Without Nix: `pip install -e ".[all]"` from a checkout, then `wwn-mcp index --knowledge`. Home-manager: `programs.wwn-mcp.enable = true;`.

### Zed

Zed needs an **absolute** `command` when launched from the Dock:

```json
{
  "context_servers": {
    "wwn-mcp": {
      "command": "/Users/YOU/.nix-profile/bin/wwn-mcp",
      "args": [],
      "env": {}
    }
  }
}
```

Avoid `nix run --refresh` in editor config. It times out Context Servers.

## Agent workflow (what to ask MCP)

Before changing code, have the agent run this loop:

| Step | Tool | Why |
|------|------|-----|
| 1. Where does this change live? | `where_to_edit` / `list_repos` | Stops edits in the wrong `wwn-*` repo |
| 2. Is the feature allowed here? | `get_capability(platform, feature)` | Four states: `available` \| `planned` \| `blocked` \| `forbidden` |
| 3. What do docs say? | `search_docs` / `get_architecture` | Mission, DAG, Mode A/B, port fidelity |
| 4. Where is the symbol / recipe? | `search_code` / `find_symbol` / `get_patch` | Code + patch inventory |
| 5. Wayland surface? | `list_protocols` / `get_protocol` | Interfaces, not guesswork |
| 6. Open the file | `read_document` | Citation → exact path/lines |

Trust retrieved docs over model priors. Port fidelity: a ported client must match the same upstream client over **waypipe**. Substitute platform under the ABI, never the client's protocols or windowing path.

### Prompt examples to give your agent

- “Use `where_to_edit` for ‘zsh iOS patch’, then `get_patch` on that software.”
- “`get_capability` for watchos + gpu and visionos + vm before proposing UI.”
- “`search_docs` Mode A vs Mode B vs Wawona Swinging Bridge. Do not conflate.”
- “`search_docs` Classic Desktop Replacement Path B claim-ok. Enable is not Take Over.”
- “`where_to_edit` for igettyd / iowatchdog / libwayland-mac.”
- “`list_repos` then edit only the layer that owns this change.”

## Companion MCPs (not served by wwn-mcp)

Wire these in the same host config. They are separate stdio processes.

| MCP name | Install / spawn | Use for |
|----------|-----------------|--------|
| **`wwn-mcp`** | `wwn-mcp` on PATH | Wawona + `wwn-*` RAG, patches, gates, protocols |
| **`nixos`** | `uvx mcp-nixos` | Live nixpkgs / options / versions (not Wawona recipes) |
| **`xcodebuild`** | [XcodeBuildMCP](https://github.com/getsentry/XcodeBuildMCP) | Build / install / run Apple sim + device (macOS + Xcode) |
| **`lldb`** | [lldb-mcp](https://github.com/stass/lldb-mcp) | Attach, breakpoints, backtraces on device crashes |
| **`agent-device`** | local CLI / MCP | App UI automation. [Debugging](@/docs/contributor/debugging.md) |

UI evidence uses **agent-device**, not `osascript` / `screencapture`. Wayland client taps need Multi-Touch. See [Debugging](@/docs/contributor/debugging.md).

## What the corpus covers

Wayland protocols, Weston / Niri / Smithay, iland DRM/KMS/GBM, ANGLE / MoltenVK / KosmicKrisp, Apple + Android UI stacks, store compliance, Fastlane / GHA, and the org repos (`wwn-toolchain` … `Wawona`, `wawona.io`, Runtime Wasm, …).

Product boundaries agents must not mix: **Wawona Swinging Bridge**, **Desktop / LockScreen**, **VMs / containers**, **Wawona Runtime** (`wpm` / Wasm. Always Mode A, no Mode B Runtime).

## Useful tools (cheat sheet)

| Tool | Use |
|------|-----|
| `search` / `search_docs` / `search_code` | Hybrid RAG |
| `list_projects` | Indexed projects + chunk counts |
| `list_repos` / `where_to_edit` / `get_capability` | Routing + four-state gates |
| `get_architecture` | Multi-repo architecture fan-out |
| `list_patches` / `get_patch` | Upstream patch inventory |
| `list_protocols` / `get_protocol` | Wayland XML knowledge |
| `find_symbol` / `read_document` | Jump to definitions / file ranges |

Full tool schemas: [wwn-mcp `docs/mcp-tools.md`](https://github.com/Wawona/wwn-mcp/blob/development/docs/mcp-tools.md). Architecture: [overview](https://github.com/Wawona/wwn-mcp/blob/development/docs/overview.md).

## Keep knowledge fresh

Curated prose for agents lives in `wwn-mcp/knowledge/`. After editing and pushing that repo:

```bash
cd ~/Wawona/wwn-mcp && git pull
wwn-mcp fetch --only wwn-knowledge-wawona   # or full fetch
wwn-mcp index --only wwn-knowledge-wawona
```

Sibling working trees: `wwn-mcp index --local-siblings` so agents see your local `Wawona/` and `wwn-*` tips.

## Rules already in the repos

Each product repo ships `AGENTS.md` and Cursor rules (e.g. port fidelity, branch workflow, product map). The agent should load those **and** query MCP. Rules are policy; MCP is facts that change faster than training data.
