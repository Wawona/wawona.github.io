# Wawona.io

![Wawona Preview](static/images/wawona-screenshots/SplitPreviewWawonaio.png)

Uses [Zola](https://www.getzola.org/) to generate the static site.

### Prerequisites

- [Zola](https://www.getzola.org/) (Follow the [official installation guide](https://www.getzola.org/documentation/getting-started/installation/) for your platform)

### Using Nix (Recommended)

If you have [Nix](https://nixos.org/) installed with flakes enabled, you don't need to manually install Zola. Nix will handle all dependencies and environment setup.

**Start the development server:**
```bash
nix run
```
This command will:
1. Automatically fetch and set up Zola (and the Python Stripe SDK).
2. Start the development server at `http://127.0.0.1:1111`.
3. Load **sandbox** Stripe env from pass and start the Checkout Session API at `http://127.0.0.1:4242` when a test secret is available. Published wawona.io uses live Checkout. Never mix the two.
4. Provide a network-accessible URL for testing on other devices on your local network.

Keys never live in `config.toml`. Local and CI use env vars:

```bash
nix develop
./scripts/site-env.sh zola serve
./scripts/site-env.sh python3 stripe/server.py
```

Store the **sandbox** Stripe secret with `printf '%s\n' "$KEY" | pass-stripe-bootstrap` (never commit `sk_` / `rk_` keys). Local Checkout API: `nix run .#stripe-checkout`. Survey graphs: `http://127.0.0.1:4242/survey/dashboard?token=…` (`SURVEY_DASHBOARD_TOKEN` in pass). Live Pages keys: [`docs/secrets.md`](docs/secrets.md).

**Enter the development environment:**
```bash
nix develop
```
This drops you into a shell with Zola, SecretSpec, and the Stripe CLI.

### Build Instructions without Nix

**Build the site:**
```bash
zola build
```

**Serve the site locally:**
```bash
zola serve
```

#### If you're using zola via flatpak:

**Build the site:**
```bash
flatpak run org.getzola.zola build
```

**Serve the site locally:**
```bash
flatpak run org.getzola.zola serve
```

### Cleaning the build directory

```bash
rm -rf public/
```