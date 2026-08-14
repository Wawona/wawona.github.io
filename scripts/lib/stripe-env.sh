# shellcheck shell=bash
# Shared Stripe mode helpers for wawona.io.
# Source from site-env.sh / flake wrappers. Do not exec this file.
#
# Sandbox (local): Wawona sandbox account, :4242
# Live (published): Wawona live account, public https API

wwn_pass_first() {
  local val="" p
  for p in "$@"; do
    val="$(pass show "$p" 2>/dev/null | head -n1 | tr -d '[:space:]' || true)"
    if [[ -n "$val" ]]; then
      printf '%s' "$val"
      return 0
    fi
  done
  return 1
}

wwn_is_test_key() {
  case "${1:-}" in
    pk_test_*|sk_test_*|rk_test_*) return 0 ;;
    *) return 1 ;;
  esac
}

wwn_is_live_key() {
  case "${1:-}" in
    pk_live_*|sk_live_*|rk_live_*) return 0 ;;
    *) return 1 ;;
  esac
}

wwn_is_local_checkout_api() {
  case "${1:-}" in
    *127.0.0.1*|*localhost*) return 0 ;;
    *) return 1 ;;
  esac
}

wwn_assert_sandbox() {
  local secret="${STRIPE_SECRET_KEY:-}"
  local pub="${STRIPE_PUBLISHABLE_KEY:-}"
  local api="${STRIPE_CHECKOUT_API:-}"
  if wwn_is_live_key "$secret" || wwn_is_live_key "$pub"; then
    echo "error: local wawona.io must use Wawona sandbox Checkout (pk_test_/sk_test_/rk_test_). Live keys are for published wawona.io only." >&2
    return 1
  fi
  if [[ -n "$pub" ]] && ! wwn_is_test_key "$pub"; then
    echo "error: STRIPE_PUBLISHABLE_KEY for local serve must be pk_test_." >&2
    return 1
  fi
  if [[ -n "$secret" ]] && ! wwn_is_test_key "$secret"; then
    echo "error: STRIPE_SECRET_KEY for local Checkout API must be sk_test_ or rk_test_." >&2
    return 1
  fi
  if [[ -n "$api" ]] && ! wwn_is_local_checkout_api "$api"; then
    echo "error: local Checkout API must be http://127.0.0.1:4242, not $api" >&2
    return 1
  fi
  return 0
}

wwn_assert_live() {
  local pub="${STRIPE_PUBLISHABLE_KEY:-}"
  local api="${STRIPE_CHECKOUT_API:-}"
  if wwn_is_test_key "$pub" || wwn_is_test_key "${STRIPE_SECRET_KEY:-}"; then
    echo "error: published wawona.io must use live Wawona Checkout. Refusing pk_test_/sk_test_/rk_test_." >&2
    return 1
  fi
  if [[ -z "$pub" ]] || ! wwn_is_live_key "$pub"; then
    echo "error: published build needs STRIPE_PUBLISHABLE_KEY=pk_live_ (pass: secretspec/wawona/site/live/STRIPE_PUBLISHABLE_KEY)." >&2
    return 1
  fi
  if [[ -z "$api" ]] || wwn_is_local_checkout_api "$api" || [[ "$api" != https://* ]]; then
    echo "error: published build needs STRIPE_CHECKOUT_API as a public https origin (not localhost)." >&2
    return 1
  fi
  return 0
}

wwn_assert_live_build() {
  local root="${1:-public}"
  if [[ ! -d "$root" ]]; then
    echo "error: live-build check: $root is not a directory" >&2
    return 1
  fi
  if grep -R -E --binary-files=without-match 'pk_test_|sk_test_|rk_test_|127\.0\.0\.1:4242|localhost:4242' "$root" >/dev/null; then
    echo "error: built site contains sandbox Checkout (pk_test_ or :4242). Published wawona.io must be live." >&2
    return 1
  fi
  if ! grep -R --binary-files=without-match 'pk_live_' "$root" >/dev/null; then
    echo "error: built site has no pk_live_. Pages must bake the live publishable key." >&2
    return 1
  fi
  if ! grep -R -E --binary-files=without-match 'data-checkout-api="https://[^"]+"' "$root" >/dev/null; then
    echo "error: built site has no https data-checkout-api. Pages cannot use localhost." >&2
    return 1
  fi
  return 0
}

wwn_load_stripe_sandbox() {
  export STRIPE_MODE=sandbox
  if wwn_is_live_key "${STRIPE_SECRET_KEY:-}"; then
    unset STRIPE_SECRET_KEY
  fi
  if wwn_is_live_key "${STRIPE_PUBLISHABLE_KEY:-}"; then
    unset STRIPE_PUBLISHABLE_KEY
  fi
  export STRIPE_CHECKOUT_API="http://127.0.0.1:4242"
  if command -v pass >/dev/null 2>&1; then
    if [[ -z "${STRIPE_SECRET_KEY:-}" ]]; then
      STRIPE_SECRET_KEY="$(wwn_pass_first \
        secretspec/wawona/site/sandbox/STRIPE_SECRET_KEY \
        secretspec/shared/default/STRIPE_SECRET_KEY || true)"
      export STRIPE_SECRET_KEY
    fi
    if [[ -z "${STRIPE_PUBLISHABLE_KEY:-}" ]]; then
      STRIPE_PUBLISHABLE_KEY="$(wwn_pass_first \
        secretspec/wawona/site/sandbox/STRIPE_PUBLISHABLE_KEY \
        secretspec/shared/default/STRIPE_PUBLISHABLE_KEY || true)"
      export STRIPE_PUBLISHABLE_KEY
    fi
    if [[ -z "${SURVEY_DASHBOARD_TOKEN:-}" ]]; then
      SURVEY_DASHBOARD_TOKEN="$(wwn_pass_first \
        secretspec/wawona/site/SURVEY_DASHBOARD_TOKEN \
        secretspec/shared/default/SURVEY_DASHBOARD_TOKEN || true)"
      export SURVEY_DASHBOARD_TOKEN
    fi
  fi
  wwn_assert_sandbox
}

wwn_load_stripe_live() {
  export STRIPE_MODE=live
  if wwn_is_test_key "${STRIPE_SECRET_KEY:-}"; then
    unset STRIPE_SECRET_KEY
  fi
  if wwn_is_test_key "${STRIPE_PUBLISHABLE_KEY:-}"; then
    unset STRIPE_PUBLISHABLE_KEY
  fi
  if wwn_is_local_checkout_api "${STRIPE_CHECKOUT_API:-}"; then
    unset STRIPE_CHECKOUT_API
  fi
  if command -v pass >/dev/null 2>&1; then
    if [[ -z "${STRIPE_PUBLISHABLE_KEY:-}" ]]; then
      STRIPE_PUBLISHABLE_KEY="$(wwn_pass_first \
        secretspec/wawona/site/live/STRIPE_PUBLISHABLE_KEY || true)"
      export STRIPE_PUBLISHABLE_KEY
    fi
    if [[ -z "${STRIPE_CHECKOUT_API:-}" ]]; then
      STRIPE_CHECKOUT_API="$(wwn_pass_first \
        secretspec/wawona/site/live/STRIPE_CHECKOUT_API || true)"
      export STRIPE_CHECKOUT_API
    fi
    # Live secret is for the Checkout API host only. Load it when starting that process.
    if [[ -z "${STRIPE_SECRET_KEY:-}" ]]; then
      STRIPE_SECRET_KEY="$(wwn_pass_first \
        secretspec/wawona/site/live/STRIPE_SECRET_KEY || true)"
      export STRIPE_SECRET_KEY
    fi
  fi
  wwn_assert_live
}
