import { LOCALE_INFO, type SupportedLanguageCodes } from "@/lib/language";
import { getContentPath } from "@/lib/routes";
import type { ArticleEntry, PageEntry } from "./content";

export type AlternativeLanguageLink = {
  href: string;
  label: string;
  lang: SupportedLanguageCodes;
};

type ContentEntry = ArticleEntry | PageEntry;

export function getAlternativeLanguageLinks(
  entry: ContentEntry,
  entries: ContentEntry[],
): AlternativeLanguageLink[] {
  return entries
    .filter((candidate) => {
      return (
        candidate.data.translationKey === entry.data.translationKey &&
        candidate.data.lang !== entry.data.lang
      );
    })
    .map((candidate) => ({
      href: getContentPath(candidate.data.lang, candidate.data.routeSlug),
      label: LOCALE_INFO[candidate.data.lang],
      lang: candidate.data.lang,
    }));
}
