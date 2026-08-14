# Device + OS catalogs

Built for the download survey typeahead. Canonical marketing names so
counts group cleanly. Unrecognized entries become the graph bucket
`Other` while the typed label is kept in `devices_other` /
`os_versions_other`. Intended use case **Other** uses `use_cases_other`
the same way (optional free text; pie stays one Other slice).

## Device catalog (`device-catalog.json`)

- Apple identifier → marketing name JSON from
  [kyle-seongwoo-jun/apple-device-identifiers](https://github.com/kyle-seongwoo-jun/apple-device-identifiers)
- Filtered marketing names from
  [pbakondy/android-device-list](https://github.com/pbakondy/android-device-list)
- Curated Linux / handheld / laptop extras
- Optional `aliases` on a row map colloquial typed names to the
  canonical `name` (typeahead and storage). Do not add a second `name`
  for the same machine.
- Apple Silicon rows that omit the chip in Apple's marketing name get
  the chip family in `name` plus a `chip` field (for example
  `MacBook Pro (14-inch, M1 Pro/Max, 2021)`). The official string stays
  an alias. There is no base-M1 14-inch Pro.

## OS catalog (`os-catalog.json`)

Curated release names for Apple (macOS / iOS family), Android, and
common Linux distros. Same pill/typeahead UX as devices.

Rebuild notes live next to the JSON under `static/data/`.
