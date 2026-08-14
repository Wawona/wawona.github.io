#!/usr/bin/env bash
# Sync *live* public Stripe config from pass -> GitHub repo secrets.
# Never uploads STRIPE_SECRET_KEY (GitHub Pages cannot hold it).
# Never uploads pk_test_ or a localhost API.
#
# Usage:
#   ./scripts/sync-github-secrets.sh
#
# See docs/secrets.md.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

GITHUB_REPO="${GITHUB_REPO:-Wawona/wawona.io}"
export PASSWORD_STORE_DIR="${PASSWORD_STORE_DIR:-$HOME/.password-store}"

# shellcheck source=lib/stripe-env.sh
source "$ROOT/scripts/lib/stripe-env.sh"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI required" >&2
  exit 1
fi
if ! command -v pass >/dev/null 2>&1; then
  echo "pass required" >&2
  exit 1
fi

gh auth status >/dev/null

unset STRIPE_SECRET_KEY
wwn_load_stripe_live

set_secret() {
  local name="$1"
  local value="$2"
  printf '%s' "$value" | gh secret set "$name" --repo "$GITHUB_REPO"
  echo "Set $name"
}

set_secret STRIPE_PUBLISHABLE_KEY "$STRIPE_PUBLISHABLE_KEY"
set_secret STRIPE_CHECKOUT_API "$STRIPE_CHECKOUT_API"

echo "Done. Verify: gh secret list --repo $GITHUB_REPO"
echo "STRIPE_SECRET_KEY stays in pass / the live Checkout API host: never GitHub Pages."
