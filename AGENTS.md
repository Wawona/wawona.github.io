# wawona.io

Static site (Zola) for https://wawona.io. This file is for agents working in `wawona.io/`.

## Voice

Public copy, docs, templates, UI strings, and comments that ship in HTML must sound like a person wrote them.

- No em dash (Unicode U+2014) and no `&mdash;` / `&#8212;`. No en dash between words. Use a period, comma, colon, or parentheses. Ranges use a hyphen: `5-15 GB`. Org-wide: `.cursor/rules/wawona-no-em-dash.mdc`.
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

The site has no payment secrets. Do not add Stripe, Checkout Session APIs, or `sk_` / `rk_` keys.
The download beta survey posts to `survey_endpoint` (Vercel). The GitHub write
token is `SURVEY_GITHUB_TOKEN` in pass and Vercel only. Private inbox:
`Wawona/beta-survey`. Raw answers stay private. Aggregate use-case, device, and
value graphs are published on wawona.io twice a year. Device typeahead uses
`static/data/device-catalog.json` (Apple marketing names + filtered Android /
Linux). Details: `docs/secrets.md`.

## Donate

GitHub Sponsors is the primary path. Ko-fi is the alternative.

Build the Sponsors URL from the slider:

`https://github.com/sponsors/{user}/sponsorships?sponsor={user}&frequency=recurring|one-time&amount={usd}`

Do not add a Checkout Session server. Do not put payment keys in `config.toml` or Pages.

## Prebuilt binaries

Download cards resolve GitHub Release assets named
`Wawona-{calver}-{platform}-{arch}.{ext}` (legacy names until the next `v*` tag).
Developer reference: `/docs/prebuilt-naming/`. Do not hardcode unversioned
`/latest/download/Wawona.apk` (or alias DMG) fallbacks.

## Product boundaries

Keep these distinct in docs and templates: **Wawona Swinging Bridge** (formerly
anowaW), **Desktop / LockScreen**, **VMs / containers**, and **Wawona Runtime**
Wasm packages. Runtime package management is always App Store / Play compliant
(no Mode B Runtime). Store/TestFlight copy must never pitch jailbreak.

See `.cursor/rules/wawona-product-map.mdc` and `.cursor/rules/wawona-io-product-map.mdc`.
Public URL updates need a push to **`main`** (not only `development`).
