+++
title = "watchOS"
date = 2026-05-20
description = "A real Wayland client on Apple Watch: weston-simple-shm on the wrist."

[extra]
local_image = "/images/wawona-screenshots/watchos-screenshot.jpg"
+++

watchOS runs the same compositor core over the CPU/SHM present path. GPU is blocked by the platform SDK (no public Metal), but clients still launch natively.

{{ screenshot(id="watch-os") }}
