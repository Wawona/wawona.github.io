# Nerd Font symbols (slider)

`SymbolsNerdFont-Slider.woff2` is a subset of Symbols Nerd Font Only
(v3.3.0) with the donation-slider glyphs:

- `U+F0238` nf-md-fire
- `U+F04CE` nf-md-star
- `U+F06D` / `U+F005` fa-fire / fa-star (spare)

Rebuild:

```bash
# full SymbolsNerdFont-Regular.ttf from nerd-fonts v3.3.0, then:
pyftsubset SymbolsNerdFont-Regular.ttf \
  --unicodes=U+F0238,U+F04CE,U+F06D,U+F005 \
  --output-file=SymbolsNerdFont-Slider.woff2 \
  --flavor=woff2
```

Loaded via `static/css/custom.css`, preloaded in the site header, and
warmed on download/donate pages.
