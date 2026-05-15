# AGENTS.md

## Repo Shape
- Single-package Astro site at the repo root. `pnpm-workspace.yaml` only whitelists native builds; there are no workspace packages.
- Import alias `@/*` maps to `src/*` via `tsconfig.json`.
- Astro i18n always prefixes the default locale. `/` redirects to `/en/`; do not add unprefixed English routes.

## Source Of Truth
- Site content comes from Astro content collections, not ad hoc page data: `content/articles`, `content/pages`, and `content/tags`, wired in `src/content.config.ts`.
- Article/page routing depends on frontmatter fields, especially `lang`, `routeSlug`, and `translationKey`. Articles also require `publishedAt` and `commentsTerm`.
- Tag files with slug `en` and `ko` are reserved language tags. `src/lib/content.ts` filters them out of navigation and tag pages.

## App Wiring
- Main route entrypoints are under `src/pages/[lang]/...`; dynamic article and about pages are generated from content collections with `getStaticPaths`.
- `src/lib/content.ts` is the shared content/query layer. Update it when changing article sorting, translation matching, tag navigation, or draft filtering.
- RSS is generated from English articles only in `src/pages/rss.xml.js`.

## Commands
- Use `pnpm dev` for local work. Astro runs on `0.0.0.0:7432`.
- Use `pnpm build` for production validation; it already runs `astro check` before `astro build`.
- Use `pnpm biome` to lint/format-check and `pnpm biome:fix` to apply Biome fixes. This repo uses Biome, not ESLint/Prettier.

## Tests
- Unit tests: `pnpm test:unit`
- Browser Vitest tests: `pnpm test:component`
- E2E tests: `pnpm test:e2e`
- Full CI order is `pnpm test:unit && pnpm test:component && pnpm test:e2e && pnpm build` before deploy. Mirror that order for broad verification.
- Run a single Vitest file with `pnpm test:unit -- <path>` or `pnpm test:component -- <path>`.
- Run a single Playwright spec with `pnpm test:e2e -- tests/e2e/<file>.spec.ts`.
- Playwright uses a `webServer` that runs `pnpm build` and then `pnpm astro preview --host 127.0.0.1 --port 4511`. Expect e2e runs to rebuild the site first.
- First-time Playwright setup may require `pnpm exec playwright install --with-deps chromium`.

## Deployment
- CI deploys only from `main` via `.github/workflows/deployment.yaml`.
- `pnpm deploy` runs `wrangler deploy`; Wrangler serves static assets from `dist` per `wrangler.jsonc`, so deploy after a fresh build.
