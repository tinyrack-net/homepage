# AGENTS.md

## Repo Shape
- Single-package **React Router 8** app (framework mode, `ssr: false`, fully prerendered/SSG) built on the **@tinyrack/ui** design system and Tailwind v4, deployed to Cloudflare as static assets.
- App code lives under `app/`. Import alias `@/*` maps to `app/*` (Vite `resolve.alias` + `tsconfig.json`). Node-side config/plugin files use relative `.ts` imports.
- The default locale (`en`) is served at the **unprefixed root**; `ja`/`ko` are prefixed (`/ja/…`, `/ko/…`). Do NOT introduce `/en/…` routes. All list/detail URLs carry a trailing slash. Three locales: `en` (default), `ja`, `ko`.

## Source Of Truth
- Content is MDX under `content/{articles,pages}/<slug>/{en,ja,ko}.mdx` plus `content/tags/*.json`. Images live in each group's `attachments/` folder and are served at `/media/<collection>/<slug>/<file>`.
- `app/content/scan.ts` scans the filesystem (frontmatter via gray-matter) into a manifest exposed to runtime as the virtual module `virtual:blog/manifest` (see `app/vite/blog-content.ts`). `app/lib/content.ts` is the query layer over it — update it for sorting, draft filtering, or tag navigation.
- Routing depends on frontmatter `lang`, `routeSlug`, `translationKey` (articles also need `publishedAt`, `commentsTerm`). Tags with slug `en`/`ja`/`ko` are reserved language tags and are filtered out of navigation.
- `app/content/routes-plan.ts` (`planRoutes`) is the single source for which URLs exist; it drives `app/routes.ts`, the prerender list (`react-router.config.ts`), and the sitemap. A unit test locks the "no `/en/`, root = English" contract.

## App Wiring
- `app/root.tsx` owns `<html>/<head>/<body>` (SEO meta from `app/lib/seo.ts`, GTM, no-flash theme script, font preloads) and mounts the `MDXProvider` + `SiteShell`.
- Article/page routes ARE the MDX files (`app/routes.ts` maps them via `relative("content")`). The MDX `wrapper` is overridden to `app/components/BlogArticleFrame.tsx`, which reads the manifest by pathname to render the article chrome. Prose is styled by `@tinyrack/ui/mdx`; code blocks by `TRCodeBlock`.
- Home and tag pages are `app/routes/{home,tag}.tsx`, reading the manifest by pathname.
- Theme is 3-state (auto/light/dark) mapped to `data-theme="tinyrack-light|dark"` (`app/lib/theme.ts` + `app/components/ThemeSwitcher.tsx`).
- `rss.xml`, `robots.txt`, `sitemap.xml`, `404.html`, and `media/` are emitted at build time in `app/build/finalize.ts` (`buildEnd`), NOT as runtime routes (`ssr: false`).

## Commands
- `pnpm dev` — React Router dev server on `:8432`.
- `pnpm build` — `react-router typegen && react-router build` (prerenders all routes, then runs `finalizeBuild`).
- `pnpm biome` / `pnpm biome:fix` — lint/format (Biome, not ESLint/Prettier).

## Tests
- Unit (Vitest, node): `pnpm test:unit` — `app/**/*.test.ts` + `scripts/**/*.test.mjs`.
- E2E (Playwright): `pnpm test:e2e` — `tests/e2e/*.spec.ts`; the `webServer` runs `pnpm build` then `vite preview` on `:4511`.
- CI order: `pnpm test:ci` (= `test:unit && test:e2e`) then `pnpm build`.
- First-time Playwright: `pnpm exec playwright install --with-deps chromium`.

## Deployment
- CI deploys from `main` via `.github/workflows/deployment.yaml`.
- `pnpm deploy` runs `wrangler deploy`; Wrangler serves static assets from `build/client` (`html_handling: auto-trailing-slash`, `not_found_handling: 404-page`).
- Content re-import: `pnpm import:ghost` (emits `.mdx` into `content/**/attachments/`).
