+++
title = "Introducing Wawona: A Nested Wayland Compositor for macOS"
date = 2026-02-22
[extra]
author = "The Wawona Team"
+++

Wawona is a groundbreaking new project that brings a "Nested" Wayland compositor to macOS. 

## What is a Nested Compositor?

A nested compositor is one that runs as a client inside another display server or compositor. In the case of Wawona, it runs under **Quartz**, the native macOS windowing system.

This allows developers to:
- Test Wayland clients on macOS.
- Build Wayland-native interfaces that leverage macOS's performance.
- Seamlessly integrate Linux-style workflows within the macOS ecosystem.

## How it works

Wawona hooks into the Quartz event loop and translates macOS inputs into Wayland events, while rendering Wayland surfaces using native macOS graphics APIs.

Stay tuned for more updates on our development progress!
