# wawona.io

Static site (Zola) for https://wawona.io. This file is for agents working in `wawona.io/`.

## Voice

Public copy, docs, templates, UI strings, and comments that ship in HTML must sound like a person wrote them.

- No em dash (Unicode U+2014) and no `&mdash;` / `&#8212;`. No en dash between words. Use a period, comma, colon, or parentheses. Ranges use a hyphen: `5-15 GB`.
- No AI cadence. Do not use: seamless, robust, leverage, utilize, delve, empower, cutting-edge, next-generation, from the ground up, designed from day one, simply, effortlessly, revolutionary, catalyst, frontier, orchestrate, first-class citizen, unlock (metaphor), monolithic, the future of.
- Short sentences. Concrete nouns. Name the thing (GitHub, Discord, Support). Do not rebrand buttons ("Forge the Source").
- Do not sell. Say what it is and how to use it.

See `.cursor/rules/wawona-io-voice.mdc`.

## Selection and hover

Orange fill plus white text is for **text selection only**. Text links
stay orange and underline on hover. No orange background on link hover.
Buttons, nav icons, and cards keep their own hover. See
`.cursor/rules/wawona-io-selection.mdc`.

## Radii

No square corners. No `border-radius: 0` on visible chrome. Nested shells
stay concentric (parent radius = child radius + padding). Keep the existing
look (cards 12-26px, buttons 10-12px, pills 100px). Do not rewrite radii to
tokens or `calc(inset + pad)`. See `.cursor/rules/wawona-io-radii.mdc`.

## Secrets

Never put `sk_` / `rk_` in git, `config.toml`, or Pages. Stripe and survey tokens go through `secretspec.toml` and `./scripts/site-env.sh`. Details: `docs/secrets.md`.

## Stripe Checkout (sandbox local, live published)

Local development always uses the **Wawona sandbox** Stripe account (`pk_test_` / `sk_test_` / `rk_test_`) and `http://127.0.0.1:4242`.

Published https://wawona.io always uses the **Wawona** live Stripe account (`pk_live_`) and a public `https://` Checkout Session API.

Do not mix them. `./scripts/site-env.sh` and `nix run` force sandbox. Pages `zola build` plus `./scripts/assert-stripe-mode.sh live-build` refuse test keys and localhost. Sync live public values only: `./scripts/sync-github-secrets.sh`.

See `.cursor/rules/wawona-io-stripe.mdc`.
