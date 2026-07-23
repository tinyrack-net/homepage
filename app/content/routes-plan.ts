import type { BlogManifest } from "../lib/content-types.ts";
import {
  defaultLangCode,
  SUPPORTED_LANGUAGE_CODES,
  type SupportedLanguageCodes,
} from "../lib/language.ts";
import { getHomePath, getTagPath } from "../lib/routes.ts";

export interface RoutePlanEntry {
  id: string;
  path: string;
  kind: "home" | "content" | "tag";
  lang: SupportedLanguageCodes;
  /** For `content` entries: MDX file relative to the `content/` directory. */
  routeFile?: string;
  tagSlug?: string;
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

  // Tag listing pages.
  const navTags = navigationTags(manifest);
  const articlesByLang = new Map<SupportedLanguageCodes, Set<string>>();
  for (const article of manifest.articles) {
    if (article.data.draft) {
      continue;
    }
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
      plan.push({
        id: `tag/${lang}/${tag.slug}`,
        path: getTagPath(lang, tag.slug),
        kind: "tag",
        lang,
        tagSlug: tag.slug,
      });
    }
  }

  return plan;
}
