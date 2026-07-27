import {
  defaultLangCode,
  SUPPORTED_LANGUAGE_CODES,
  type SupportedLanguageCodes,
} from "./language.ts";

function getLanguagePrefix(lang: SupportedLanguageCodes) {
  return lang === defaultLangCode ? "" : `/${lang}`;
}

export function getHomePath(lang: SupportedLanguageCodes) {
  return `${getLanguagePrefix(lang)}/`;
}

export function getOpenSourcePath(lang: SupportedLanguageCodes) {
  return `${getLanguagePrefix(lang)}/open-source/`;
}

export function getContentPath(
  lang: SupportedLanguageCodes,
  routeSlug: string,
) {
  return `${getLanguagePrefix(lang)}/${routeSlug}/`;
}

export function getTagPath(lang: SupportedLanguageCodes, tagSlug: string) {
  return `${getLanguagePrefix(lang)}/tag/${tagSlug}/`;
}

export function getBlogPath(lang: SupportedLanguageCodes) {
  return `${getLanguagePrefix(lang)}/blog/`;
}

/** Page one lives at the unpaginated path so it has a single canonical URL. */
export function getBlogPagePath(lang: SupportedLanguageCodes, page: number) {
  if (page <= 1) {
    return getBlogPath(lang);
  }
  return `${getLanguagePrefix(lang)}/blog/page/${page}/`;
}

export function getTagPagePath(
  lang: SupportedLanguageCodes,
  tagSlug: string,
  page: number,
) {
  if (page <= 1) {
    return getTagPath(lang, tagSlug);
  }
  return `${getLanguagePrefix(lang)}/tag/${tagSlug}/page/${page}/`;
}

export function getEquivalentLanguagePath(
  pathname: string,
  targetLang: SupportedLanguageCodes,
) {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (
    firstSegment &&
    SUPPORTED_LANGUAGE_CODES.includes(firstSegment as SupportedLanguageCodes)
  ) {
    segments.shift();
  }

  const routePath = segments.join("/");

  if (targetLang === defaultLangCode) {
    return routePath ? `/${routePath}/` : "/";
  }

  return routePath ? `/${targetLang}/${routePath}/` : `/${targetLang}/`;
}
