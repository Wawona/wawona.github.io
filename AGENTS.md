# Agent notes

## Product boundaries

Public docs must keep Swinging Bridge, Desktop/LockScreen, VMs/containers, and Wasm Runtime packages distinct. See `.cursor/rules/wawona-product-map.mdc`. Wawona Runtime package management is always App Store compliant (no Mode B Runtime). Deploy public docs via `main` when URLs must update.
