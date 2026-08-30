export const SUPPORTED_LANGUAGES = {
  EN: "en",
  JA: "ja",
  KO: "ko",
} as const;

export const SUPPORTED_LANGUAGE_CODES = Object.values(SUPPORTED_LANGUAGES);

export type SupportedLanguageCodes =
  (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES];

export const defaultLangCode = SUPPORTED_LANGUAGES.EN as SupportedLanguageCodes;

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
