<div align="center">

# Tinyrack Homepage

**Multilingual Astro site for Tinyrack content and updates.**

[![Web Deployment](https://github.com/tinyrack-net/homepage/actions/workflows/deployment.yaml/badge.svg)](https://github.com/tinyrack-net/homepage/actions/workflows/deployment.yaml)

[tinyrack.net](https://tinyrack.net) · [Forum](https://forum.tinyrack.net) · [winetree94](https://winetree94.com)

</div>

---

This repository contains the Tinyrack homepage, built with React Router and populated from the content files under `content/`.

## Features

- Korean canonical routes with English and Japanese translations
- Article, page, tag, RSS, and sitemap output
- Localized navigation, theme switching, and sidebar links
- Cloudflare deployment via GitHub Actions

## Development

```bash
pnpm install
pnpm dev
```

## Checks

```bash
pnpm biome
pnpm test:ci
pnpm build
```
