{
  description = "Wawona static site development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
      nixpkgsFor = forAllSystems (system: import nixpkgs { inherit system; });
    in
    {
      devShells = forAllSystems (system:
        let pkgs = nixpkgsFor.${system};
        in {
          default = pkgs.mkShell {
            packages = with pkgs; [
              zola
              stripe-cli
              secretspec
              (python3.withPackages (ps: [ ps.stripe ]))
            ];
            shellHook = ''
              echo "Wawona.io dev shell (zola, secretspec, stripe-cli)."
              echo "  Local Checkout is Wawona sandbox only (:4242, pk_test_)."
              echo "  ./scripts/site-env.sh zola serve"
              echo "  ./scripts/site-env.sh python3 stripe/server.py"
              echo "  nix run    # site + sandbox Checkout API"
            '';
          };
        });

      packages = forAllSystems (system:
        let
          pkgs = nixpkgsFor.${system};
          py = pkgs.python3.withPackages (ps: [ ps.stripe ]);
          stripeServer = ./stripe/server.py;
          loadSiteEnv = ''
            # Local flake apps are always Wawona sandbox Checkout.
            # shellcheck disable=SC1091
            source ${./scripts/lib/stripe-env.sh}
            wwn_load_stripe_sandbox
          '';
          stripeCheckout = pkgs.writeShellScriptBin "wawona-stripe-checkout" ''
            set -euo pipefail
            ${loadSiteEnv}
            if [ -z "''${STRIPE_SECRET_KEY:-}" ]; then
              echo "wawona-stripe-checkout: sandbox STRIPE_SECRET_KEY missing. Store sk_test_/rk_test_ with pass-stripe-bootstrap." >&2
              exit 1
            fi
            if [ -f stripe/server.py ]; then
              exec ${py}/bin/python3 stripe/server.py
            fi
            exec ${py}/bin/python3 ${stripeServer}
          '';
          zolaServe = pkgs.writeShellScriptBin "wawona-serve" ''
            set -euo pipefail
            ${loadSiteEnv}
            LOCAL_IP=""
            if command -v ipconfig >/dev/null 2>&1; then
              LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || ipconfig getifaddr en2 2>/dev/null || true)
            elif command -v ip >/dev/null 2>&1; then
              LOCAL_IP=$(ip addr show | awk '/inet / && $2 != "127.0.0.1/8" {print $2}' | cut -d/ -f1 | head -n1)
            fi
            echo "==========================================================="
            echo "Starting Zola development server..."
            echo "Local Testing:   http://127.0.0.1:1111"
            if [ -n "$LOCAL_IP" ]; then
              echo "Network Testing: http://$LOCAL_IP:1111"
              echo "==========================================================="
              exec ${pkgs.zola}/bin/zola serve --interface 0.0.0.0 --base-url "$LOCAL_IP"
            fi
            echo "==========================================================="
            exec ${pkgs.zola}/bin/zola serve --interface 0.0.0.0
          '';
          combined = pkgs.writeShellScriptBin "wawona-dev" ''
            set -euo pipefail
            ${loadSiteEnv}
            checkout_pid=""
            cleanup() {
              if [ -n "$checkout_pid" ]; then
                kill "$checkout_pid" 2>/dev/null || true
              fi
            }
            trap cleanup EXIT INT TERM
            if [ -n "''${STRIPE_SECRET_KEY:-}" ]; then
              if [ -f stripe/server.py ]; then
                ${py}/bin/python3 stripe/server.py &
              else
                ${py}/bin/python3 ${stripeServer} &
              fi
              checkout_pid=$!
              echo "Stripe Checkout API: ''${STRIPE_CHECKOUT_API:-http://127.0.0.1:4242}/create-checkout-session"
            else
              echo "Sandbox Checkout API skipped (no STRIPE_SECRET_KEY). Run pass-stripe-bootstrap with a test key."
            fi
            exec ${zolaServe}/bin/wawona-serve
          '';
        in
        {
          default = combined;
          wawona-serve = zolaServe;
          stripe-checkout = stripeCheckout;
        });

      apps = forAllSystems (system: {
        default = {
          type = "app";
          program = "${self.packages.${system}.default}/bin/wawona-dev";
        };
        stripe-checkout = {
          type = "app";
          program = "${self.packages.${system}.stripe-checkout}/bin/wawona-stripe-checkout";
        };
      });
    };
}
