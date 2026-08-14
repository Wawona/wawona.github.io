# Site secrets (wawona.io)

Donate uses GitHub Sponsors plus Ko-fi. No payment secrets on the
public site. Amount and monthly vs one-time are Sponsors query params.

## Beta survey

Download survey answers POST to a Vercel function. The function holds
a GitHub token and opens an issue on the **private** inbox
[`Wawona/beta-survey`](https://github.com/Wawona/beta-survey).

| Name | Where |
|---|---|
| `survey_endpoint` | `config.toml` (public URL) |
| `SURVEY_GITHUB_TOKEN` | pass `secretspec/shared/default/SURVEY_GITHUB_TOKEN` and Vercel project env |

Do not put `SURVEY_GITHUB_TOKEN` in `config.toml`, Pages JS, or git.
Rotate the token in pass and `vercel env` together.

Forking the public repo does not grant the survey token.

### What stays private vs public

Raw issues (device strings, notes, free text) stay in the private repo.
The README there graphs aggregates for the team.

Twice a year, aggregate graphs only are published as a wawona.io post:
use cases, most frequent devices, and expected monthly value / support
amounts. No individual responses. Automation should pull graph data from
`Wawona/beta-survey` and draft or publish that post on a semi-annual
schedule (Jan / Jul is fine).

### Device typeahead

The download survey device field uses `static/data/device-catalog.json`
plus `static/js/device-suggest.js`. Catalog is vendored (Apple marketing
names from apple-device-identifiers, filtered Android list, curated
Linux/PC). Comma-separated multi-device. Suggestions insert canonical
names so README device counts stay consistent. Unrecognized names are
stored as `Other: <text>` in the human-readable `device` line and in
`devices_other`; the `devices` array uses the bucket `Other` so graphs
group them. Other-device free text is sanitized with DOMPurify (site) and
`sanitize-html` + `validator` (Vercel API). See `static/data/DEVICE_CATALOG.md`.

If a later feature needs a token, put the **name** in git and the
**value** in pass (`git@github.com:aspauldingcode/.password-store.git`).
Do not put `sk_` / `rk_` / API tokens in `config.toml` or Pages.
