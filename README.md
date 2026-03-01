Uses [Zola](https://www.getzola.org/) to generate the static site.

### Prerequisites

- [Zola](https://www.getzola.org/) (Follow the [official installation guide](https://www.getzola.org/documentation/getting-started/installation/) for your platform)

### Build Instructions

You can use the following commands to build and preview the site locally. For more details on Zola's capabilities, check the [official CLI documentation](https://www.getzola.org/documentation/getting-started/cli-usage/).

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