import type { BlogManifest } from "../lib/content-types.ts";
import {
  defaultLangCode,
  SUPPORTED_LANGUAGE_CODES,
  type SupportedLanguageCodes,
} from "../lib/language.ts";
import { getPageCount } from "../lib/pagination.ts";
import {
  getBlogPagePath,
  getHomePath,
  getOpenSourcePath,
  getProductsPath,
  getTagPagePath,
} from "../lib/routes.ts";

export interface RoutePlanEntry {
  id: string;
  path: string;
  kind: "home" | "openSource" | "products" | "content" | "blog" | "tag";
  lang: SupportedLanguageCodes;
  /** For `content` entries: MDX file relative to the `content/` directory. */
  routeFile?: string;
  tagSlug?: string;
  /** For `blog` and `tag` entries: 1-based listing page number. */
  page?: number;
}

const NAV_LANGUAGE_TAGS = new Set<string>(["en", "ja", "ko"]);

function navigationTags(manifest: BlogManifest) {
  return manifest.tags.filter(
    (tag) => !NAV_LANGUAGE_TAGS.has(tag.slug) && tag.visibility !== "internal",
  );
}

export function planRoutes(manifest: BlogManifest): RoutePlanEntry[] {
  const plan: RoutePlanEntry[] = [];

  // Home pages: default locale at root, others prefixed.
  for (const lang of SUPPORTED_LANGUAGE_CODES) {
    plan.push({
      id: `home/${lang}`,
      path: getHomePath(lang),
      kind: "home",
      lang,
    });
    plan.push({
      id: `open-source/${lang}`,
      path: getOpenSourcePath(lang),
      kind: "openSource",
      lang,
    });
    plan.push({
      id: `products/${lang}`,
      path: getProductsPath(lang),
      kind: "products",
      lang,
    });
  }

  // Article + page detail pages (drafts excluded).
  const contentEntries = [
    ...manifest.articles.filter((entry) => !entry.data.draft),
    ...manifest.pages,
  ];
  for (const entry of contentEntries) {
    plan.push({
      id: entry.id,
      path: entry.path,
      kind: "content",
      lang: entry.data.lang,
      routeFile: entry.routeFile,
    });
  }

  const publishedArticles = manifest.articles.filter(
    (article) => !article.data.draft,
  );

  // Blog listing pages. Every locale gets at least page one so the header can
  // link to it unconditionally; an empty locale renders the empty state.
  for (const lang of SUPPORTED_LANGUAGE_CODES) {
    const total = publishedArticles.filter(
      (article) => article.data.lang === lang,
    ).length;
    for (let page = 1; page <= getPageCount(total); page += 1) {
      plan.push({
        id: page === 1 ? `blog/${lang}` : `blog/${lang}/page/${page}`,
        path: getBlogPagePath(lang, page),
        kind: "blog",
        lang,
        page,
      });
    }
  }

  // Tag listing pages.
  const navTags = navigationTags(manifest);
  const articlesByLang = new Map<SupportedLanguageCodes, Set<string>>();
  for (const article of publishedArticles) {
    const set = articlesByLang.get(article.data.lang) ?? new Set<string>();
    for (const tag of article.data.tags) {
      set.add(tag);
    }
    articlesByLang.set(article.data.lang, set);
  }

  for (const lang of SUPPORTED_LANGUAGE_CODES) {
    for (const tag of navTags) {
      const langHasTag = articlesByLang.get(lang)?.has(tag.slug) ?? false;
      // The default locale always exposes every navigation tag; other locales
      // only expose tags that actually have articles in that language.
      if (lang !== defaultLangCode && !langHasTag) {
        continue;
      }

      const total = publishedArticles.filter(
        (article) =>
          article.data.lang === lang && article.data.tags.includes(tag.slug),
      ).length;

      for (let page = 1; page <= getPageCount(total); page += 1) {
        plan.push({
          id:
            page === 1
              ? `tag/${lang}/${tag.slug}`
              : `tag/${lang}/${tag.slug}/page/${page}`,
          path: getTagPagePath(lang, tag.slug, page),
          kind: "tag",
          lang,
          tagSlug: tag.slug,
          page,
        });
      }
    }
  }

  return plan;
}
