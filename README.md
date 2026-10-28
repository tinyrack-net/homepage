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

Articles live in the Outline collection `Blog: tinyrack` (notes.winetree94.com), not in this repository. Pages (`content/pages`) and tags (`content/tags`) stay here.

- Each top-level document is an original article; translations are its child documents. Document titles are used as-is.
- Drafts are unpublished Outline documents and are never deployed.
- Every document starts with the same header: a feature image (Outline attachment), a `yaml` block, and a `---` divider before the body.

  ````markdown
  ![](/api/attachments.redirect?id=<attachment-id>)

  ```yaml
  lang: "ko"
  routeSlug: "my-article"
  publishedAt: "2026-01-01T00:00:00.000+09:00"
  commentsTerm: "my-article"
  ```

  ---

  Body...
  ````

- The image is required in the original and optional in translations, which otherwise reuse it.
- Every document declares its language with `lang`. The original also holds `routeSlug`, `publishedAt`, `updatedAt`, `tags`, `commentsTerm`, and `excerpt`; translations may only override `publishedAt`, `updatedAt`, or `excerpt` and inherit the rest.
- `pnpm content:pull` converts published documents into `content/articles/<slug>/<lang>.md` (gitignored). Tests use `pnpm content:fixtures` instead.
- `pnpm content:check` validates every document, drafts included, without writing files. Run it before publishing.

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
