import * as m from "../i18n/paraglide/messages.js";
import type { ContentEntry } from "./content-types.ts";
import type { SupportedLanguageCodes } from "./language.ts";
import { getContentPath } from "./routes.ts";

export type AlternativeLanguageLink = {
  href: string;
  label: string;
  lang: SupportedLanguageCodes;
};

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
      label: m.locale_name({}, { locale: candidate.data.lang }),
      lang: candidate.data.lang,
    }));
}
