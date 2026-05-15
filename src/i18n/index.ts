import type { SupportedLanguageCodes } from "@/lib/language";
import en from "./translations/en.json";
import ko from "./translations/ko.json";

const translations: Record<SupportedLanguageCodes, Record<string, string>> = {
  en,
  ko,
};

/**
 * Get translation for a key in the specified language.
 * Falls back to the key itself if translation is not found.
 */
export function t(lang: SupportedLanguageCodes, key: string): string {
  return translations[lang]?.[key] ?? key;
}

/**
 * Language-specific head links for font preloading.
 */
export const LANGUAGE_HEAD_LINKS: Record<
  SupportedLanguageCodes,
  Array<{
    rel: string;
    href: string;
    as?: string;
    type?: string;
    crossorigin?: boolean;
  }>
> = {
  en: [
    {
      rel: "preload",
      href: "/fonts/Agave-Regular.ttf",
      as: "font",
      type: "font/woff",
      crossorigin: true,
    },
    {
      rel: "preload",
      href: "/fonts/Agave-Bold.ttf",
      as: "font",
      type: "font/woff",
      crossorigin: true,
    },
  ],
  ko: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: true,
    },
    {
      rel: "preload",
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@100;200;300;400;500;600;700&display=block",
      as: "style",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@100;200;300;400;500;600;700&display=block",
    },
  ],
};
