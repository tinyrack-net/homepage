export const SITE = "https://tinyrack.net";

export const SITE_TITLES = {
  en: "Tinyrack",
  // The brand is written in Latin on Japanese surfaces; only Korean has its own
  // approved wordmark. Keep this in step with `nav.site` and the lockup choice
  // in `app/components/BrandLockup.tsx`.
  ja: "Tinyrack",
  ko: "타이니랙",
};

export const SITE_DESCRIPTIONS = {
  en: "Homelab hardware and software reviews, news",
  ja: "ホームラボのハードウェア/ソフトウェアレビュー、ニュース",
  ko: "홈랩 하드웨어/소프트웨어 리뷰, 뉴스",
};

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

export const SITE_TITLE = SITE_TITLES.ko;
export const SITE_DESCRIPTION = SITE_DESCRIPTIONS.ko;
