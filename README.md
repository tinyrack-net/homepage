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

## Content

Articles live in Outline under `Articles / tinyrack` (notes.winetree94.com), not in this repository. Pages (`content/pages`) and tags (`content/tags`) stay here.

- The Korean original is the article document; translations are child documents titled `<title> (en)` or `<title> (ja)`.
- Drafts are unpublished Outline documents and are never deployed.
- Each body starts with a `yaml` block. The original holds `routeSlug`, `publishedAt`, `updatedAt`, `tags`, `featureImage`, `commentsTerm`, and `excerpt`; translations only override `publishedAt`, `updatedAt`, or `excerpt`.
- `pnpm content:pull` converts them into `content/articles/<slug>/<lang>.md` (gitignored). Tests use `pnpm content:fixtures` instead.

To publish content-only changes, run the **Web Deployment** workflow manually:

```bash
gh workflow run deployment.yaml --repo tinyrack-net/homepage --ref main
```

## Development

```bash
pnpm install
export OUTLINE_API_KEY=...   # read-only Outline API key
pnpm content:pull            # or: pnpm content:fixtures
pnpm dev
```

## Checks

```bash
pnpm biome
pnpm test:ci
pnpm build
```
