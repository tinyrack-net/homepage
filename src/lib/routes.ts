import {
  defaultLangCode,
  SUPPORTED_LANGUAGE_CODES,
  type SupportedLanguageCodes,
} from "./language";

function getLanguagePrefix(lang: SupportedLanguageCodes) {
  return lang === defaultLangCode ? "" : `/${lang}`;
}

export function getHomePath(lang: SupportedLanguageCodes) {
  return `${getLanguagePrefix(lang)}/`;
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
