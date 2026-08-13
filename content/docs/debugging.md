+++
title = "Debugging"
description = "agent-device for UI. Opt-in LLDB. No osascript or screencapture."
weight = 28
date = 2026-08-13

[extra]
section = "dev"
+++

Launching Wawona, starting a machine, and capturing UI evidence is **agent-device** on every platform, including macOS.

```text
agent-device --version
agent-device help workflow
open → snapshot -i → press/gesture → verify → close
```

Do not use `osascript` System Events clicks, `screencapture` of a window, or `open -n …/Wawona.app`. Those lose the instance lock and hit the wrong surface.

Wayland client content needs Multi-Touch. Use `press` / `gesture`, not `click --button`.

## LLDB

Flake apps launch without a debugger. Pass `--debug` (or `--debug-attach` on macOS).

```bash
nix run .#wawona-macos -- --debug
```

Repo: [debugging.md](https://github.com/Wawona/Wawona/blob/development/docs/debugging.md).
