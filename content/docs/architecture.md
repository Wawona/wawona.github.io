+++
title = "Architecture"
date = 2026-02-22
weight = 2
+++

# Architecture

Wawona acts as a bridge between the Wayland protocol and the macOS Quartz Compositor.

## Core Components

- **Wayland Server**: Handles the Wayland protocol and client connections.
- **Quartz Backend**: Translates Wayland buffers and surfaces into Quartz layers.
- **Input Bridge**: Forwards macOS mouse and keyboard events to Wayland clients.

## Rendering

Rendering is performed using native macOS APIs to ensure low latency and high performance.
