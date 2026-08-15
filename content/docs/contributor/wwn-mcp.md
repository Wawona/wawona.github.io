+++
aliases = ["docs/wwn-mcp", "docs/mcp"]
title = "WWN-MCP"
description = "Stdio RAG MCP for any agent. Wawona stack knowledge. Not a public URL."
weight = 31
date = 2026-08-14

+++

**Wawona MCP** (`wwn-mcp`) is a local-embeddings RAG + stdio [Model Context Protocol](https://modelcontextprotocol.io/) server for contributors and agents. It indexes the Wawona stack and `wwn-*` repos so any MCP-capable agent can search docs, architecture, patches, and capability gates.

Repo: [Wawona/wwn-mcp](https://github.com/Wawona/wwn-mcp). Not a product flake input — see [Repo DAG](@/docs/contributor/dag.md). Not [mcp-nixos](https://github.com/utensils/mcp-nixos) (same stdio host idea only). Do **not** use `https://mcp.wawona.io/mcp` — that hostname was never shipped.

Works with **any** MCP host that can spawn a stdio server (Cursor, VS Code, Claude Desktop, Windsurf, Antigravity, Zed, custom agents, …). Cursor is one client — not the only one.

## Install

```bash
# Recommended for MCP hosts (fast spawn — avoid nix run --refresh in editor config)
nix profile install github:Wawona/WWN-MCP
wwn-mcp info
wwn-mcp search "watchOS GPU"
```

Bare `wwn-mcp` / `nix run …#wwn-mcp` on a TTY prints MCP host setup help and exits. The agent must spawn the process (piped stdin) for the MCP server.

Or without Nix:

```bash
pip install -e ".[all]"   # from a wwn-mcp checkout
wwn-mcp index --knowledge
wwn-mcp info
```

Home-manager / dendritic:

```nix
programs.wwn-mcp.enable = true;
```

First empty DB auto-indexes shipped `knowledge/` in the background (so Zed/`initialize` is not blocked). Sibling checkouts: `wwn-mcp index --local-siblings`.

## MCP host config

### Cursor / VS Code / Claude Desktop

```json
{
  "mcpServers": {
    "wwn-mcp": { "command": "wwn-mcp", "args": [] }
  }
}
```

### Zed

Zed uses `context_servers` and needs an **absolute** `command` when launched from the Dock:

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

If Zed shows **Context server request timeout**, the config is still spawning a slow `nix run --refresh` — switch to a PATH/absolute binary.

## Useful tools

| Tool | Use |
|------|-----|
| `search` / `search_docs` / `search_code` | Hybrid RAG over the corpus |
| `list_projects` | Indexed projects + chunk counts |
| `list_repos` / `where_to_edit` / `get_capability` | Contribute routing + four-state gates |
| `get_architecture` | Multi-repo architecture fan-out |
| `list_patches` / `get_patch` | Upstream patch inventory |

Full tool list and deployment notes: [wwn-mcp docs](https://github.com/Wawona/wwn-mcp/tree/development/docs).
