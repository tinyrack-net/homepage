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
- Listing pages are split statically at `ARTICLES_PER_PAGE` (`app/lib/pagination.ts`). Page one keeps the unpaginated URL (`/blog/`, `/tag/<slug>/`); later pages are `/blog/page/2/`. Only page one goes in the sitemap. Every locale gets `/blog/` even with zero articles, because the header links to it unconditionally.

## App Wiring
- `app/root.tsx` owns `<html>/<head>/<body>` (SEO meta from `app/lib/seo.ts`, GTM, no-flash theme script, font preloads) and mounts the `MDXProvider`, `SiteHeader`, `<main>`, and `Footer`.
- Article/page routes ARE the MDX files (`app/routes.ts` maps them via `relative("content")`). The MDX `wrapper` is overridden to `app/components/BlogArticleFrame.tsx`, which reads the manifest by pathname to render the article chrome. Prose is styled by `@tinyrack/ui/mdx`; code blocks by `TRCodeBlock`.
- Home, blog and tag pages are `app/routes/{home,blog,tag}.tsx`, reading the manifest by pathname. There are no loaders anywhere; `app/lib/site-page.ts` (`resolveSitePage`) turns a pathname into the page kind, locale, and listing page number.
- `/` is a two-section landing: a typographic hero stating the brand idea (ownership — "your data belongs on a machine you can unplug") and the three latest posts. Copy lives in `app/content/landing-copy.ts`; `app/i18n/translations/*.json` stays for short UI labels only.
- The landing deliberately names **no product and no licence**. It has to keep holding up as the lineup changes and as commercial products appear alongside open-source ones, so products live in the header and footer, and licensing belongs on each product's own site. `LandingCopy` has no section-description slot — a section needing a paragraph belongs on `/about/`. An e2e test enforces the no-product/no-licence rule.
- `app/components/ArticleList.tsx` is the shared paginated card grid behind both `/blog/` and tag pages.
- Theme is 3-state (auto/light/dark) mapped to `data-theme="tinyrack-light|dark"` (`app/lib/theme.ts` + `app/components/ThemeSwitcher.tsx`).
- `rss.xml`, `robots.txt`, `sitemap.xml`, `404.html`, and `media/` are emitted at build time in `app/build/finalize.ts` (`buildEnd`), NOT as runtime routes (`ssr: false`).

## Commands
- `pnpm dev` — React Router dev server on `:8432`.
- `pnpm build` — `react-router typegen && react-router build` (prerenders all routes, then runs `finalizeBuild`).
- `pnpm biome` / `pnpm biome:fix` — lint/format (Biome, not ESLint/Prettier).

## Tests
- Types: `pnpm typecheck` — `react-router typegen && tsc --noEmit`.
- Unit (Vitest, node): `pnpm test:unit` — `app/**/*.test.ts` + `scripts/**/*.test.mjs`.
- E2E (Playwright): `pnpm test:e2e` — `tests/e2e/*.spec.ts`; the `webServer` runs `pnpm build` then `vite preview` on `:4511`.
- CI order: `pnpm test:ci` (= `typecheck && test:unit && test:e2e`) then `pnpm build`.
- Screenshot matrix: `node scripts/shoot.mjs <label>` against a running dev server writes `.screenshots/<label>/` across viewport × theme.
- First-time Playwright: `pnpm exec playwright install --with-deps chromium`.

## Deployment
- CI deploys from `main` via `.github/workflows/deployment.yaml`.
- `pnpm deploy` runs `wrangler deploy`; Wrangler serves static assets from `build/client` (`html_handling: auto-trailing-slash`, `not_found_handling: 404-page`).
- Content re-import: `pnpm import:ghost` (emits `.mdx` into `content/**/attachments/`).
