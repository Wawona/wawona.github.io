#!/usr/bin/env bash
# Run a command with wawona.io Stripe env loaded.
#
# Local (default): Wawona sandbox + http://127.0.0.1:4242
# CI / Pages:      live Wawona keys already in env (never pass)
#
# Usage:
#   ./scripts/site-env.sh zola serve
#   ./scripts/site-env.sh python3 stripe/server.py
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# GitHub Actions → live. Everywhere else → sandbox.
# Do not inherit SECRETSPEC_PROFILE=ci from a Wawona app shell.
if [[ "${GITHUB_ACTIONS:-}" == "true" ]]; then
  PROFILE=ci
else
  PROFILE="${WWN_SITE_PROFILE:-local}"
fi
export SECRETSPEC_FILE="${SECRETSPEC_FILE:-$ROOT/secretspec.toml}"
export PASSWORD_STORE_DIR="${PASSWORD_STORE_DIR:-$HOME/.password-store}"

# shellcheck source=lib/stripe-env.sh
source "$ROOT/scripts/lib/stripe-env.sh"

if [[ $# -eq 0 ]]; then
  echo "usage: $0 <command> [args...]" >&2
  exit 2
fi

case "$PROFILE" in
  ci)
    export SECRETSPEC_PROVIDER="${SECRETSPEC_PROVIDER:-env://}"
    export STRIPE_MODE=live
    wwn_assert_live
    exec "$@"
    ;;
  local|development|default)
    wwn_load_stripe_sandbox
    exec "$@"
    ;;
  live|publish|sync)
    wwn_load_stripe_live
    exec "$@"
    ;;
  *)
    echo "error: unknown profile=$PROFILE (local|ci|live)" >&2
    exit 1
    ;;
esac
