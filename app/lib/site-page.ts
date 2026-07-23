import { getAllArticles, getAllPages } from "./content.ts";
import type { ContentEntry } from "./content-types.ts";
import {
  defaultLangCode,
  SUPPORTED_LANGUAGE_CODES,
  type SupportedLanguageCodes,
} from "./language.ts";
import { getHomePath } from "./routes.ts";

export type SitePage =
  | { kind: "home"; lang: SupportedLanguageCodes }
  | { kind: "content"; lang: SupportedLanguageCodes; entry: ContentEntry }
  | { kind: "tag"; lang: SupportedLanguageCodes; tagSlug: string }
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

export function resolveSitePage(pathname: string): SitePage {
  const path = normalize(pathname);
  const lang = langFromPath(path);

  for (const code of SUPPORTED_LANGUAGE_CODES) {
    if (path === getHomePath(code)) {
      return { kind: "home", lang: code };
    }
  }

  const entries: ContentEntry[] = [...getAllArticles(), ...getAllPages()];
  const entry = entries.find((candidate) => candidate.path === path);
  if (entry) {
    return { kind: "content", lang: entry.data.lang, entry };
  }

  const tagMatch = /\/tag\/([^/]+)\/$/.exec(path);
  if (tagMatch) {
    return { kind: "tag", lang, tagSlug: tagMatch[1] as string };
  }

  return { kind: "unknown", lang };
}
