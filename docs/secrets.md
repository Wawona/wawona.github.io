# Site secrets (wawona.io)

Same layout as the Wawona app repo: **names in git**, **values in pass**, **CI gets env**.

## Stripe: sandbox local, live published

Two Stripe accounts. Do not mix them.

| Where | Account | Keys | Session API |
| ---- | ------- | ---- | ----------- |
| Local (`zola serve`, `nix run`, `:1111`) | **Wawona sandbox** | `pk_test_` / `sk_test_` / `rk_test_` | `http://127.0.0.1:4242` |
| Published https://wawona.io | **Wawona** (live) | `pk_live_` in Pages | Public `https://` origin running `stripe/server.py` |

`./scripts/site-env.sh` and the flake apps always load sandbox and force `:4242`. They unset inherited live keys.

Pages `zola build` plus `./scripts/assert-stripe-mode.sh live-build` refuse `pk_test_`, `localhost`, and `:4242`. `./scripts/sync-github-secrets.sh` uploads the live public pair only.

## Public vs private

| Lives in **public** `Wawona/wawona.io` | Lives only in **private** vaults |
| -------------------------------------- | -------------------------------- |
| [`secretspec.toml`](../secretspec.toml): secret **names** | GPG ciphertext in pass |
| `scripts/site-env.sh`, `scripts/sync-github-secrets.sh` | GPG private key + passphrase |
| This doc | Stripe secret / restricted key (`sk_` / `rk_`) |

Forking the public repo does **not** grant Stripe secrets.

- Remote: `git@github.com:aspauldingcode/.password-store.git`
- Sandbox (local): `secretspec/wawona/site/sandbox/<KEY>`, then `secretspec/shared/default/<KEY>`
- Live (published): `secretspec/wawona/site/live/<KEY>`

`pass-stripe-bootstrap` writes the **sandbox** secret to `secretspec/shared/default/STRIPE_SECRET_KEY`.

## What each key is for

| Name | Where it runs | Notes |
| ---- | ------------- | ----- |
| `STRIPE_SECRET_KEY` | Checkout API host only (`stripe/server.py`) | **Never** in Zola, JS, `config.toml`, or GitHub Pages secrets |
| `STRIPE_PUBLISHABLE_KEY` | Zola `get_env` at serve/build | Local: `pk_test_`. Pages: `pk_live_` |
| `STRIPE_CHECKOUT_API` | Zola `get_env` → `data-checkout-api` | Local is always `:4242`. Production must be public `https://` |
| `STRIPE_CHECKOUT_ORIGINS` | Checkout API process | CORS allow-list |
| `SURVEY_DASHBOARD_TOKEN` | Checkout API `/survey/stats` and `/survey/dashboard` | Maintainer graphs; **never** in Zola or GitHub Pages |

GitHub Pages is static. It can know the **live publishable** key and the **https API URL**. It cannot create Checkout Sessions, portal sessions, or store survey rows.

Site-wide donate is `/donate/` (banner + footer). It talks to the same Checkout API:

- `POST /create-checkout-session`
- `POST /create-portal-session` (Stripe Customer Portal: manage or cancel)
- `GET /checkout-session?session_id=`

Activate the Customer Portal in the Stripe Dashboard (sandbox and live) or the manage button returns a Stripe error. Restricted keys need Checkout Sessions plus Billing Portal Sessions.

## Local (sandbox)

```bash
# one-time: sandbox secret in pass (never echo it into chat)
printf '%s\n' "$KEY" | pass-stripe-bootstrap

# sandbox publishable key (pk_test_ is public by design)
printf '%s\n' "pk_test_…" | pass insert -e -f secretspec/wawona/site/sandbox/STRIPE_PUBLISHABLE_KEY

# maintainer survey graphs (token-gated; not in Pages)
openssl rand -hex 24 | pass insert -e -f secretspec/shared/default/SURVEY_DASHBOARD_TOKEN

nix develop
./scripts/site-env.sh zola serve                 # site on :1111, sandbox keys
./scripts/site-env.sh python3 stripe/server.py  # API on :4242, refuses live secrets
# or both:
nix run
```

`./scripts/site-env.sh` is the wawona.io equivalent of Wawona’s `./scripts/release-env.sh`.

## GitHub Pages (live)

1. Host `stripe/server.py` with the **live** `STRIPE_SECRET_KEY` (`sk_live_` / `rk_live_`) and CORS including `https://wawona.io`.
2. Store live public values in pass:

   ```bash
   printf '%s\n' "pk_live_…" | pass insert -e -f secretspec/wawona/site/live/STRIPE_PUBLISHABLE_KEY
   printf '%s\n' "https://checkout-api.example" | pass insert -e -f secretspec/wawona/site/live/STRIPE_CHECKOUT_API
   ```

3. Sync **only** that public pair:

   ```bash
   ./scripts/sync-github-secrets.sh
   ```

4. Deploy on `main` injects those as env. `assert-stripe-mode.sh live` runs before `zola build`. `live-build` greps `public/` so a sandbox bake cannot ship.

Do not `gh secret set STRIPE_SECRET_KEY` on this repo.
Do not sync `pk_test_` or `http://127.0.0.1:4242` to Pages.
