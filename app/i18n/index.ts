import type { SupportedLanguageCodes } from "../lib/language.ts";
import en from "./translations/en.json";
import ja from "./translations/ja.json";
import ko from "./translations/ko.json";

export const translations: Record<
  SupportedLanguageCodes,
  Record<string, string>
> = {
  en,
  ja,
  ko,
};

/**
 * Get translation for a key in the specified language.
 * Falls back to the key itself if translation is not found.
 *
 * `params` fills `{name}` placeholders, which locales may position differently
 * (English "Page 2" against Korean "2페이지"). An unmatched placeholder is left
 * as authored so the gap is visible rather than silently blank.
 */
export function t(
  lang: SupportedLanguageCodes,
  key: string,
  params?: Record<string, string | number>,
): string {
  const value = translations[lang]?.[key] ?? key;
  if (!params) {
    return value;
  }
  return value.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
    const replacement = params[name];
    return replacement === undefined ? placeholder : String(replacement);
  });
}
