import { getAllArticles, getAllPages } from "./content.ts";
import type { ContentEntry } from "./content-types.ts";
import {
  defaultLangCode,
  SUPPORTED_LANGUAGE_CODES,
  type SupportedLanguageCodes,
} from "./language.ts";
import {
  getBlogPath,
  getEquivalentLanguagePath,
  getHomePath,
  getOpenSourcePath,
  getTagPath,
} from "./routes.ts";

export type SitePage =
  | { kind: "home"; lang: SupportedLanguageCodes }
  | { kind: "openSource"; lang: SupportedLanguageCodes }
  | { kind: "content"; lang: SupportedLanguageCodes; entry: ContentEntry }
  | { kind: "blog"; lang: SupportedLanguageCodes; page: number }
  | {
      kind: "tag";
      lang: SupportedLanguageCodes;
      tagSlug: string;
      page: number;
    }
  | { kind: "unknown"; lang: SupportedLanguageCodes };

function normalize(pathname: string): string {
  if (!pathname) {
    return "/";
  }
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function langFromPath(pathname: string): SupportedLanguageCodes {
  const first = pathname.split("/").filter(Boolean)[0];
  if (
    first &&
    SUPPORTED_LANGUAGE_CODES.includes(first as SupportedLanguageCodes)
  ) {
    return first as SupportedLanguageCodes;
  }
  return defaultLangCode;
}

function pageFrom(raw: string | undefined): number {
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

// Only a real locale counts as a prefix, so a two-letter content slug cannot
// be mistaken for one.
const LANG_PREFIX = `(?:${SUPPORTED_LANGUAGE_CODES.join("|")})`;
const BLOG_PATTERN = new RegExp(
  `^/(?:${LANG_PREFIX}/)?blog/(?:page/(\\d+)/)?$`,
);
const TAG_PATTERN = new RegExp(
  `^/(?:${LANG_PREFIX}/)?tag/([^/]+)/(?:page/(\\d+)/)?$`,
);

export function resolveSitePage(pathname: string): SitePage {
  const path = normalize(pathname);
  const lang = langFromPath(path);

  for (const code of SUPPORTED_LANGUAGE_CODES) {
    if (path === getHomePath(code)) {
      return { kind: "home", lang: code };
    }
    if (path === getOpenSourcePath(code)) {
      return { kind: "openSource", lang: code };
    }
  }

  const blogMatch = BLOG_PATTERN.exec(path);
  if (blogMatch) {
    return { kind: "blog", lang, page: pageFrom(blogMatch[1]) };
  }

  const tagMatch = TAG_PATTERN.exec(path);
  if (tagMatch) {
    return {
      kind: "tag",
      lang,
      tagSlug: tagMatch[1] as string,
      page: pageFrom(tagMatch[2]),
    };
  }

  const entries: ContentEntry[] = [...getAllArticles(), ...getAllPages()];
  const entry = entries.find((candidate) => candidate.path === path);
  if (entry) {
    return { kind: "content", lang: entry.data.lang, entry };
  }

  return { kind: "unknown", lang };
}

/**
 * Where a language switch should land from `pathname`.
 *
 * Listing pages reset to page one because the target locale may have fewer
 * pages, and a tag with no articles in the target locale has no route at all,
 * so it falls back to that locale's blog index.
 */
export function getLanguageSwitchPath(
  pathname: string,
  targetLang: SupportedLanguageCodes,
): string {
  const page = resolveSitePage(pathname);

  if (page.kind === "blog") {
    return getBlogPath(targetLang);
  }

  if (page.kind === "tag") {
    const hasTag = getAllArticles().some(
      (article) =>
        article.data.lang === targetLang &&
        article.data.tags.includes(page.tagSlug),
    );
    return hasTag
      ? getTagPath(targetLang, page.tagSlug)
      : getBlogPath(targetLang);
  }

  return getEquivalentLanguagePath(pathname, targetLang);
}
