export const SITE = "https://tinyrack.net";

/**
 * Social preview images. Only the locales with artwork on disk appear here —
 * pointing at a file that does not exist makes `og:image` a 404 for every page
 * in that language. `getSiteImage` falls back instead.
 */
export const SITE_IMAGES: Partial<Record<string, string>> = {
  en: "/og/index/en.png",
  ko: "/og/index/ko.png",
};

export const DEFAULT_SITE_IMAGE = "/og/index/en.png";

export function getSiteImage(lang: string): string {
  return SITE_IMAGES[lang] ?? DEFAULT_SITE_IMAGE;
}

export const OWNER_NAME = "tinyrack";

export const GTM_ID = "GTM-5NJV8H34";
export const THEME_STORAGE_KEY = "theme-preference";

export const LINKS = {
  GITHUB: "https://github.com/tinyrack-net",
  YOUTUBE: "https://www.youtube.com/@tinyrack",
  FORUM: "https://forum.tinyrack.net/",
  EMAIL: "contact@tinyrack.net",
};
