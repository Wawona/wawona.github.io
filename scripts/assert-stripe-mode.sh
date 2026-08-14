#!/usr/bin/env bash
# Assert Stripe Checkout mode. Used by local wrappers and Pages CI.
#
#   ./scripts/assert-stripe-mode.sh sandbox
#   ./scripts/assert-stripe-mode.sh live
#   ./scripts/assert-stripe-mode.sh live-build [public-dir]
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=lib/stripe-env.sh
source "$ROOT/scripts/lib/stripe-env.sh"

mode="${1:-}"
case "$mode" in
  sandbox|local|test)
    wwn_assert_sandbox
    ;;
  live|publish|ci)
    wwn_assert_live
    ;;
  live-build)
    wwn_assert_live_build "${2:-$ROOT/public}"
    ;;
  *)
    echo "usage: $0 sandbox|live|live-build [public-dir]" >&2
    exit 2
    ;;
esac
