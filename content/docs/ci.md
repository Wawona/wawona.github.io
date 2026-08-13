+++
title = "CI"
description = "development vs master. Gate vs Ship. No secret procedures."
weight = 29
date = 2026-08-13

[extra]
section = "dev"
+++

Work lands on **`development`**. **`master`** is the green/release branch.

## Gates (required on development before promote)

- **Gate: packages** (`nix.yml`)
- **Gate: products** (`device-gate.yml`)

## Ship (master only)

- **Ship: beta (stores)** on push to `master`: TestFlight + Play internal
- **Ship: GitHub assets** on `v*` tags: dmg / ipa / apk / AppImage

Do not treat Ship workflows as development gates. Do not ship stores from `development`.

Promote with a fast-forward of a green tip. Never force-push `master` or `development`.

Secrets stay in `docs/maintainers/secrets.md` (not on this site). Full matrix: [ci.md](https://github.com/Wawona/Wawona/blob/development/docs/ci.md).
