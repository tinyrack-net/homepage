import type { SupportedLanguageCodes } from "../lib/language.ts";
import en from "./translations/en.json";
import ja from "./translations/ja.json";
import ko from "./translations/ko.json";

const translations: Record<SupportedLanguageCodes, Record<string, string>> = {
  en,
  ja,
  ko,
};

/**
 * Get translation for a key in the specified language.
 * Falls back to the key itself if translation is not found.
 */
export function t(lang: SupportedLanguageCodes, key: string): string {
  return translations[lang]?.[key] ?? key;
}
