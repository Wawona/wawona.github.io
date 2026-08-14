#!/usr/bin/env python3
"""Stripe Checkout Sessions + beta survey store for wawona.io.

Secret key from STRIPE_SECRET_KEY only. Never log it.
Survey rows live in stripe/data/surveys.sqlite (not git).
"""

from __future__ import annotations

import html
import json
import os
import re
import secrets
import sqlite3
import string
import sys
import threading
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from stripe import StripeClient

MIN_USD = 1
MAX_USD = 10_000
DEFAULT_ORIGIN = "http://127.0.0.1:1111"
SURVEY_MAX_BYTES = 32_768
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DB_PATH = os.path.join(DATA_DIR, "surveys.sqlite")
DB_LOCK = threading.Lock()


def _load_dotenv() -> None:
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if not os.path.isfile(env_path):
        return
    with open(env_path, encoding="utf-8") as handle:
        for raw in handle:
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            name, value = line.split("=", 1)
            name = name.strip()
            value = value.strip().strip('"').strip("'")
            if name and name not in os.environ:
                os.environ[name] = value


def _is_test_key(key: str) -> bool:
    return key.startswith(("pk_test_", "sk_test_", "rk_test_"))


def _is_live_key(key: str) -> bool:
    return key.startswith(("pk_live_", "sk_live_", "rk_live_"))


def _secret() -> str:
    _load_dotenv()
    key = (os.environ.get("STRIPE_SECRET_KEY") or "").strip()
    if not key:
        print("stripe-checkout: STRIPE_SECRET_KEY is unset", file=sys.stderr)
        sys.exit(1)
    if not (key.startswith("sk_") or key.startswith("rk_")):
        print("stripe-checkout: STRIPE_SECRET_KEY must be sk_ or rk_", file=sys.stderr)
        sys.exit(1)
    mode = (os.environ.get("STRIPE_MODE") or "").strip().lower()
    host = os.environ.get("STRIPE_CHECKOUT_HOST", "127.0.0.1")
    if mode in ("sandbox", "test", "local") or host in ("127.0.0.1", "localhost"):
        if _is_live_key(key):
            print(
                "stripe-checkout: refusing live key on local/sandbox Checkout. "
                "Local wawona.io uses the Wawona sandbox account.",
                file=sys.stderr,
            )
            sys.exit(1)
    if mode in ("live", "publish", "ci"):
        if _is_test_key(key):
            print(
                "stripe-checkout: refusing sandbox key on live Checkout. "
                "Published wawona.io uses the live Wawona account.",
                file=sys.stderr,
            )
            sys.exit(1)
    return key


CLIENT = StripeClient(_secret(), stripe_version="2026-07-29.dahlia")
LISTEN_HOST = os.environ.get("STRIPE_CHECKOUT_HOST", "127.0.0.1")
LISTEN_PORT = int(os.environ.get("STRIPE_CHECKOUT_PORT", "4242"))
ALLOWED_ORIGINS = {
    origin.strip()
    for origin in os.environ.get(
        "STRIPE_CHECKOUT_ORIGINS",
        "http://127.0.0.1:1111,http://localhost:1111,https://wawona.io",
    ).split(",")
    if origin.strip()
}
DASHBOARD_TOKEN = (os.environ.get("SURVEY_DASHBOARD_TOKEN") or "").strip()


def _ident() -> str:
    suffix = "".join(secrets.choice(string.ascii_lowercase) for _ in range(8))
    return f"wawona-download-{suffix}"


def _cors_origin(handler: BaseHTTPRequestHandler) -> str:
    origin = handler.headers.get("Origin", "")
    if origin in ALLOWED_ORIGINS:
        return origin
    return ""


def _write(handler: BaseHTTPRequestHandler, code: int, payload: dict, origin: str) -> None:
    body = json.dumps(payload).encode("utf-8")
    handler.send_response(code)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Cache-Control", "no-store")
    if origin:
        handler.send_header("Access-Control-Allow-Origin", origin)
        handler.send_header("Access-Control-Allow-Headers", "content-type")
        handler.send_header("Access-Control-Allow-Methods", "POST, OPTIONS, GET")
        handler.send_header("Vary", "Origin")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def _write_html(handler: BaseHTTPRequestHandler, code: int, body: str) -> None:
    raw = body.encode("utf-8")
    handler.send_response(code)
    handler.send_header("Content-Type", "text/html; charset=utf-8")
    handler.send_header("Cache-Control", "no-store")
    handler.send_header("Content-Length", str(len(raw)))
    handler.end_headers()
    handler.wfile.write(raw)


def _db() -> sqlite3.Connection:
    os.makedirs(DATA_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS surveys (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            skipped INTEGER NOT NULL DEFAULT 0,
            platform TEXT,
            device TEXT,
            use_cases TEXT,
            price TEXT,
            source TEXT,
            notes TEXT,
            donation_usd INTEGER NOT NULL DEFAULT 0,
            interval TEXT,
            stripe_session_id TEXT
        )
        """
    )
    conn.commit()
    return conn


def _clip(value: object, limit: int) -> str:
    text = "" if value is None else str(value)
    return text[:limit]


def _obj_get(obj: object, key: str):
    if obj is None:
        return None
    if isinstance(obj, dict):
        return obj.get(key)
    return getattr(obj, key, None)


def _customer_id(value: object) -> str:
    text = _clip(value, 64).strip()
    if re.fullmatch(r"cus_[A-Za-z0-9]+", text):
        return text
    return ""


def _checkout_session_id(value: object) -> str:
    text = _clip(value, 128).strip()
    if re.fullmatch(r"cs_(test_|live_)?[A-Za-z0-9]+", text):
        return text
    return ""


def _email(value: object) -> str:
    text = _clip(value, 254).strip()
    if " " in text or text.count("@") != 1:
        return ""
    local, domain = text.split("@", 1)
    if not local or "." not in domain or domain.startswith(".") or domain.endswith("."):
        return ""
    return text


def _customer_from_session_obj(session: object) -> str:
    customer = _obj_get(session, "customer")
    if isinstance(customer, str):
        return _customer_id(customer)
    return _customer_id(_obj_get(customer, "id"))


def _upsert_survey(data: dict) -> str:
    survey_id = _clip(data.get("id"), 64).strip() or secrets.token_urlsafe(12)
    use_cases = data.get("use_cases") or []
    if isinstance(use_cases, str):
        use_cases = [part.strip() for part in use_cases.split(",") if part.strip()]
    if not isinstance(use_cases, list):
        use_cases = []
    use_cases = [_clip(item, 64) for item in use_cases[:12]]
    donation_in = data.get("donation_usd")
    try:
        donation = int(donation_in) if donation_in is not None and donation_in != "" else None
    except (TypeError, ValueError):
        donation = None
    if donation is not None:
        donation = max(0, min(donation, MAX_USD))
    interval = _clip(data.get("interval") or "", 16)
    if interval and interval not in ("month", "one_time"):
        interval = "month"
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    session_id = _clip(data.get("stripe_session_id"), 128)
    skipped_in = data.get("skipped") if "skipped" in data else None

    with DB_LOCK:
        conn = _db()
        try:
            existing = conn.execute("SELECT * FROM surveys WHERE id = ?", (survey_id,)).fetchone()
            if existing:
                conn.execute(
                    """
                    UPDATE surveys SET
                        skipped = ?,
                        platform = COALESCE(NULLIF(?, ''), platform),
                        device = COALESCE(NULLIF(?, ''), device),
                        use_cases = COALESCE(NULLIF(?, ''), use_cases),
                        price = COALESCE(NULLIF(?, ''), price),
                        source = COALESCE(NULLIF(?, ''), source),
                        notes = COALESCE(NULLIF(?, ''), notes),
                        donation_usd = ?,
                        interval = COALESCE(NULLIF(?, ''), interval),
                        stripe_session_id = COALESCE(NULLIF(?, ''), stripe_session_id)
                    WHERE id = ?
                    """,
                    (
                        existing["skipped"] if skipped_in is None else (1 if skipped_in else 0),
                        _clip(data.get("platform"), 80),
                        _clip(data.get("device"), 160),
                        json.dumps(use_cases) if use_cases else "",
                        _clip(data.get("price"), 32),
                        _clip(data.get("source"), 80),
                        _clip(data.get("notes"), 4000),
                        existing["donation_usd"] if donation is None else donation,
                        interval,
                        session_id,
                        survey_id,
                    ),
                )
            else:
                conn.execute(
                    """
                    INSERT INTO surveys (
                        id, created_at, skipped, platform, device, use_cases,
                        price, source, notes, donation_usd, interval, stripe_session_id
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        survey_id,
                        now,
                        1 if skipped_in else 0,
                        _clip(data.get("platform"), 80),
                        _clip(data.get("device"), 160),
                        json.dumps(use_cases),
                        _clip(data.get("price"), 32),
                        _clip(data.get("source"), 80),
                        _clip(data.get("notes"), 4000),
                        0 if donation is None else donation,
                        interval or "month",
                        session_id,
                    ),
                )
            conn.commit()
        finally:
            conn.close()
    return survey_id


def _count_map(rows: list[sqlite3.Row], key: str) -> dict[str, int]:
    out: dict[str, int] = {}
    for row in rows:
        label = (row[key] or "").strip() or "(blank)"
        out[label] = out.get(label, 0) + 1
    return dict(sorted(out.items(), key=lambda item: (-item[1], item[0])))


def _survey_stats() -> dict:
    with DB_LOCK:
        conn = _db()
        try:
            rows = conn.execute("SELECT * FROM surveys ORDER BY created_at ASC").fetchall()
        finally:
            conn.close()
    use_cases: dict[str, int] = {}
    histogram = {"0": 0, "1-5": 0, "6-20": 0, "21-50": 0, "51+": 0}
    submitted = 0
    skipped = 0
    monthly = 0
    one_time = 0
    paid_session = 0
    for row in rows:
        if row["skipped"]:
            skipped += 1
        else:
            submitted += 1
        if row["interval"] == "one_time":
            one_time += 1
        else:
            monthly += 1
        if row["stripe_session_id"]:
            paid_session += 1
        amount = int(row["donation_usd"] or 0)
        if amount <= 0:
            histogram["0"] += 1
        elif amount <= 5:
            histogram["1-5"] += 1
        elif amount <= 20:
            histogram["6-20"] += 1
        elif amount <= 50:
            histogram["21-50"] += 1
        else:
            histogram["51+"] += 1
        try:
            cases = json.loads(row["use_cases"] or "[]")
        except json.JSONDecodeError:
            cases = []
        if isinstance(cases, list):
            for item in cases:
                label = str(item).strip() or "(blank)"
                use_cases[label] = use_cases.get(label, 0) + 1
    return {
        "total": len(rows),
        "submitted": submitted,
        "skipped": skipped,
        "interval": {"month": monthly, "one_time": one_time},
        "with_stripe_session": paid_session,
        "platform": _count_map(rows, "platform"),
        "source": _count_map(rows, "source"),
        "price": _count_map(rows, "price"),
        "use_cases": dict(sorted(use_cases.items(), key=lambda item: (-item[1], item[0]))),
        "donation_histogram": histogram,
    }


def _token_ok(handler: BaseHTTPRequestHandler) -> bool:
    if not DASHBOARD_TOKEN:
        return False
    parsed = urlparse(handler.path)
    query = parse_qs(parsed.query)
    provided = (query.get("token") or [""])[0]
    auth = handler.headers.get("Authorization") or ""
    if auth.lower().startswith("bearer "):
        provided = auth[7:].strip() or provided
    return secrets.compare_digest(provided, DASHBOARD_TOKEN)


def _dashboard_html(token: str) -> str:
    safe_token = html.escape(token, quote=True)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Wawona beta survey</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    body {{ font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; background: #111; color: #eee; }}
    main {{ max-width: 1100px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }}
    h1 {{ font-size: 1.4rem; margin: 0 0 0.35rem; }}
    .sub {{ color: #aaa; margin: 0 0 1.5rem; font-size: 0.9rem; }}
    .kpis {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }}
    .kpi {{ background: #1c1c1c; border: 1px solid #333; border-radius: 28px; padding: 1rem; }}
    .kpi b {{ display: block; font-size: 1.6rem; }}
    .kpi span {{ color: #aaa; font-size: 0.8rem; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem; }}
    figure {{ background: #1c1c1c; border: 1px solid #333; border-radius: 28px; padding: 1rem; margin: 0; }}
    figcaption {{ font-size: 0.85rem; margin-bottom: 0.6rem; color: #ccc; }}
    canvas {{ max-height: 280px; }}
  </style>
</head>
<body>
<main>
  <h1>Wawona beta survey</h1>
  <p class="sub">Source: Checkout API SQLite · local/maintainer only</p>
  <div class="kpis" id="kpis"></div>
  <div class="grid">
    <figure><figcaption>Primary platform</figcaption><canvas id="c-platform"></canvas></figure>
    <figure><figcaption>Intended use case</figcaption><canvas id="c-use"></canvas></figure>
    <figure><figcaption>How they heard about Wawona</figcaption><canvas id="c-source"></canvas></figure>
    <figure><figcaption>Expected monthly value</figcaption><canvas id="c-price"></canvas></figure>
    <figure><figcaption>Donation amount (USD buckets)</figcaption><canvas id="c-donate"></canvas></figure>
    <figure><figcaption>Skip vs submit · monthly vs one-time</figcaption><canvas id="c-mix"></canvas></figure>
  </div>
</main>
<script>
fetch("/survey/stats?token={safe_token}").then(function (r) {{ return r.json(); }}).then(function (s) {{
  function kpi(label, value) {{
    return "<div class=kpi><b>" + value + "</b><span>" + label + "</span></div>";
  }}
  document.getElementById("kpis").innerHTML =
    kpi("Total", s.total) +
    kpi("Submitted", s.submitted) +
    kpi("Skipped", s.skipped) +
    kpi("Monthly", s.interval.month) +
    kpi("One-time", s.interval.one_time) +
    kpi("Stripe session", s.with_stripe_session);
  function bar(id, data, title) {{
    var labels = Object.keys(data);
    var values = labels.map(function (k) {{ return data[k]; }});
    new Chart(document.getElementById(id), {{
      type: "bar",
      data: {{ labels: labels, datasets: [{{ label: title, data: values, backgroundColor: "#ef5350" }}] }},
      options: {{
        plugins: {{ legend: {{ display: false }} }},
        scales: {{
          x: {{ ticks: {{ color: "#ccc" }}, grid: {{ color: "#2a2a2a" }} }},
          y: {{ beginAtZero: true, ticks: {{ color: "#ccc", precision: 0 }}, grid: {{ color: "#2a2a2a" }} }}
        }}
      }}
    }});
  }}
  bar("c-platform", s.platform, "Responses");
  bar("c-use", s.use_cases, "Mentions");
  bar("c-source", s.source, "Responses");
  bar("c-price", s.price, "Responses");
  bar("c-donate", s.donation_histogram, "Responses");
  new Chart(document.getElementById("c-mix"), {{
    type: "bar",
    data: {{
      labels: ["Submitted", "Skipped", "Monthly", "One-time"],
      datasets: [{{
        label: "Count",
        data: [s.submitted, s.skipped, s.interval.month, s.interval.one_time],
        backgroundColor: ["#22c55e", "#64748b", "#ef5350", "#fbbf24"]
      }}]
    }},
    options: {{
      plugins: {{ legend: {{ display: false }} }},
      scales: {{
        x: {{ ticks: {{ color: "#ccc" }}, grid: {{ color: "#2a2a2a" }} }},
        y: {{ beginAtZero: true, ticks: {{ color: "#ccc", precision: 0 }}, grid: {{ color: "#2a2a2a" }} }}
      }}
    }}
  }});
}}).catch(function () {{
  document.querySelector("main").insertAdjacentHTML("beforeend", "<p>Failed to load /survey/stats.</p>");
}});
</script>
</body>
</html>
"""


def _create_portal_session(handler: BaseHTTPRequestHandler, data: dict, origin: str) -> None:
    customer = _customer_id(data.get("customer"))
    session_id = _checkout_session_id(data.get("session_id"))
    email = _email(data.get("email"))
    site = (data.get("site_url") or DEFAULT_ORIGIN).rstrip("/")
    return_url = f"{site}/donate/"

    try:
        if not customer and session_id:
            session = CLIENT.v1.checkout.sessions.retrieve(session_id)
            customer = _customer_from_session_obj(session)
        if not customer and email:
            listed = CLIENT.v1.customers.list(params={"email": email, "limit": 5})
            rows = _obj_get(listed, "data") or []
            if rows:
                customer = _customer_id(_obj_get(rows[0], "id"))
        if not customer:
            _write(
                handler,
                404,
                {
                    "error": "no_customer",
                    "detail": "No Stripe customer found. Use the email from your receipt, or donate first.",
                },
                origin,
            )
            return
        portal = CLIENT.v1.billing_portal.sessions.create(
            params={"customer": customer, "return_url": return_url}
        )
    except Exception as exc:  # noqa: BLE001: return Stripe errors to the client
        _write(handler, 502, {"error": "stripe_error", "detail": str(exc)}, origin)
        return

    url = _obj_get(portal, "url")
    if not url:
        _write(handler, 502, {"error": "missing portal url"}, origin)
        return
    _write(handler, 200, {"url": url, "customer": customer}, origin)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("stripe-checkout: " + (fmt % args) + "\n")

    def do_OPTIONS(self) -> None:  # noqa: N802
        origin = _cors_origin(self)
        self.send_response(204)
        if origin:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Headers", "content-type")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS, GET")
            self.send_header("Vary", "Origin")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        origin = _cors_origin(self)
        parsed = urlparse(self.path)
        path = parsed.path
        if path in ("/healthz", "/"):
            _write(
                self,
                200,
                {
                    "ok": True,
                    "service": "wawona-stripe-checkout",
                    "survey_dashboard": bool(DASHBOARD_TOKEN),
                },
                origin,
            )
            return
        if path == "/survey/stats":
            if not _token_ok(self):
                _write(self, 401, {"error": "unauthorized"}, origin)
                return
            _write(self, 200, _survey_stats(), origin)
            return
        if path == "/survey/dashboard":
            if not _token_ok(self):
                _write_html(self, 401, "<!DOCTYPE html><title>Unauthorized</title><p>Missing or invalid token.</p>")
                return
            token = (parse_qs(parsed.query).get("token") or [DASHBOARD_TOKEN])[0]
            _write_html(self, 200, _dashboard_html(token))
            return
        if path == "/checkout-session":
            session_id = _checkout_session_id((parse_qs(parsed.query).get("session_id") or [""])[0])
            if not session_id:
                _write(self, 400, {"error": "session_id is required"}, origin)
                return
            try:
                session = CLIENT.v1.checkout.sessions.retrieve(session_id)
            except Exception as exc:  # noqa: BLE001: return Stripe errors to the client
                _write(self, 502, {"error": "stripe_error", "detail": str(exc)}, origin)
                return
            _write(
                self,
                200,
                {
                    "id": _obj_get(session, "id"),
                    "customer": _customer_from_session_obj(session),
                    "status": _obj_get(session, "status"),
                    "payment_status": _obj_get(session, "payment_status"),
                },
                origin,
            )
            return
        _write(self, 404, {"error": "not found"}, origin)

    def do_POST(self) -> None:  # noqa: N802
        origin = _cors_origin(self)
        path = urlparse(self.path).path
        length = int(self.headers.get("Content-Length") or "0")
        max_bytes = SURVEY_MAX_BYTES if path == "/survey" else 4096
        if length > max_bytes:
            _write(self, 413, {"error": "payload too large"}, origin)
            return
        try:
            data = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            _write(self, 400, {"error": "invalid json"}, origin)
            return

        if path == "/survey":
            survey_id = _upsert_survey(data if isinstance(data, dict) else {})
            _write(self, 200, {"id": survey_id, "ok": True}, origin)
            return

        if path == "/create-portal-session":
            _create_portal_session(self, data if isinstance(data, dict) else {}, origin)
            return

        if path != "/create-checkout-session":
            _write(self, 404, {"error": "not found"}, origin)
            return

        try:
            amount = int(data.get("amount_usd"))
        except (TypeError, ValueError):
            _write(self, 400, {"error": "amount_usd must be an integer"}, origin)
            return
        if amount < MIN_USD or amount > MAX_USD:
            _write(
                self,
                400,
                {"error": f"amount_usd must be between {MIN_USD} and {MAX_USD}"},
                origin,
            )
            return

        interval = (data.get("interval") or "month").strip()
        if interval not in ("one_time", "month"):
            _write(self, 400, {"error": "interval must be one_time or month"}, origin)
            return

        site = (data.get("site_url") or DEFAULT_ORIGIN).rstrip("/")
        source = _clip(data.get("source"), 32).strip() or "download"
        if source not in ("download", "donate"):
            source = "download"
        default_path = "/donate/" if source == "donate" else "/download/"
        success = data.get("success_url") or (
            f"{site}/donate/thanks/?from={source}&session_id={{CHECKOUT_SESSION_ID}}"
        )
        cancel = data.get("cancel_url") or f"{site}{default_path}?donated=0"
        survey_id = _clip(data.get("survey_id"), 64)

        cents = amount * 100
        product_name = "Wawona monthly support" if interval == "month" else "Wawona one-time support"
        price_data: dict = {
            "currency": "usd",
            "product_data": {
                "name": product_name,
                "description": "Support development of the Wawona Wayland compositor.",
            },
            "unit_amount": cents,
        }
        metadata = {
            "project": "wawona.io",
            "interval": interval,
            "amount_usd": str(amount),
            "source": source,
        }
        if survey_id:
            metadata["survey_id"] = survey_id
        params: dict = {
            "mode": "subscription" if interval == "month" else "payment",
            "line_items": [{"price_data": price_data, "quantity": 1}],
            "success_url": success,
            "cancel_url": cancel,
            "client_reference_id": f"wawona-{interval}-{amount}",
            "billing_address_collection": "auto",
            "managed_payments": {"enabled": False},
            "metadata": metadata,
            "integration_identifier": _ident(),
        }
        if interval == "month":
            price_data["recurring"] = {"interval": "month"}
        else:
            params["invoice_creation"] = {"enabled": True}
            params["customer_creation"] = "always"

        try:
            session = CLIENT.v1.checkout.sessions.create(params=params)
        except Exception as exc:  # noqa: BLE001: return Stripe errors to the client
            _write(self, 502, {"error": "stripe_error", "detail": str(exc)}, origin)
            return

        url = getattr(session, "url", None) or (session.get("url") if isinstance(session, dict) else None)
        session_id = getattr(session, "id", None) or (session.get("id") if isinstance(session, dict) else None)
        if survey_id and session_id:
            _upsert_survey({"id": survey_id, "stripe_session_id": session_id, "donation_usd": amount, "interval": interval})
        if not url:
            _write(self, 502, {"error": "missing checkout url"}, origin)
            return
        _write(self, 200, {"url": url, "id": session_id}, origin)


def main() -> None:
    os.makedirs(DATA_DIR, exist_ok=True)
    _db().close()
    httpd = ThreadingHTTPServer((LISTEN_HOST, LISTEN_PORT), Handler)
    extra = " survey dashboard on /survey/dashboard" if DASHBOARD_TOKEN else " (set SURVEY_DASHBOARD_TOKEN for /survey/dashboard)"
    print(
        f"stripe-checkout: listening on http://{LISTEN_HOST}:{LISTEN_PORT}/create-checkout-session "
        f"(portal /create-portal-session){extra}",
        file=sys.stderr,
    )
    httpd.serve_forever()


if __name__ == "__main__":
    main()
