# Device catalog

Built for the download survey typeahead. Canonical marketing names so
counts group cleanly (MacBook Air M2 vs mba m2). Unrecognized entries
become the graph bucket `Other` while the typed label is kept in
`devices_other` (and as `Other: …` on the readable `device` string).
Other-device free text is sanitized with DOMPurify in the browser and
with `sanitize-html` + `validator` on the survey API.

## Sources

- Apple identifier → marketing name JSON from
  [kyle-seongwoo-jun/apple-device-identifiers](https://github.com/kyle-seongwoo-jun/apple-device-identifiers)
  (ios, mac, tvos, watchos, visionos). Unique display names only.
- Filtered marketing names from
  [pbakondy/android-device-list](https://github.com/pbakondy/android-device-list)
  (Pixel, Galaxy S/Z/A/Tab, OnePlus, Nothing, and similar).
- Curated Linux / handheld / laptop extras (Framework, Steam Deck,
  System76, Raspberry Pi, XPS, ThinkPad, Surface).

Rebuild locally:

```bash
# see agent notes / scripts if added; output:
# wawona.io/static/data/device-catalog.json
```

Not MobileAPI.dev: that needs a paid key and a secret-holding proxy.
Static catalog keeps Pages free of device-API secrets.
