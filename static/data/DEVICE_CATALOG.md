# Device + OS catalogs

Built for the download survey typeahead. Canonical marketing names so
counts group cleanly. Unrecognized entries become the graph bucket
`Other` while the typed label is kept in `devices_other` /
`os_versions_other`.

## Device catalog (`device-catalog.json`)

- Apple identifier → marketing name JSON from
  [kyle-seongwoo-jun/apple-device-identifiers](https://github.com/kyle-seongwoo-jun/apple-device-identifiers)
- Filtered marketing names from
  [pbakondy/android-device-list](https://github.com/pbakondy/android-device-list)
- Curated Linux / handheld / laptop extras

## OS catalog (`os-catalog.json`)

Curated release names for Apple (macOS / iOS family), Android, and
common Linux distros. Same pill/typeahead UX as devices.

Rebuild notes live next to the JSON under `static/data/`.
