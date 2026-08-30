import type { SupportedLanguageCodes } from "../lib/language.ts";
import * as m from "./paraglide/messages.js";

const LOCALE_LABEL_MESSAGES = {
  en: m.locale_name_en,
  ja: m.locale_name_ja,
  ko: m.locale_name_ko,
} as const satisfies Record<SupportedLanguageCodes, typeof m.locale_name_en>;

export function getLocaleLabel(lang: SupportedLanguageCodes): string {
  return LOCALE_LABEL_MESSAGES[lang]({}, { locale: lang });
}

export function getSiteTitle(lang: SupportedLanguageCodes): string {
  return m.nav_site({}, { locale: lang });
}

export function getSiteDescription(lang: SupportedLanguageCodes): string {
  return m.site_description({}, { locale: lang });
}
