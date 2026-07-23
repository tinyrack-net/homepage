import type { SupportedLanguageCodes } from "./language.ts";

export interface ArticleData {
  title: string;
  excerpt: string;
  lang: SupportedLanguageCodes;
  routeSlug: string;
  translationKey: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  /** Resolved public URL (e.g. `/media/articles/<slug>/<file>`), or undefined. */
  featureImage?: string;
  commentsTerm: string;
  draft: boolean;
}

export interface PageData {
  title: string;
  excerpt: string;
  lang: SupportedLanguageCodes;
  routeSlug: string;
  translationKey: string;
  featureImage?: string;
  updatedAt?: string;
}

export interface ArticleEntry {
  collection: "articles";
  /** Unique id, e.g. `articles/<slug>/<lang>`. */
  id: string;
  /** Folder name of the translation group. */
  slug: string;
  /** Route module file, relative to the `content/` directory. */
  routeFile: string;
  /** URL path with leading + trailing slash, e.g. `/i-made-a-forum/`. */
  path: string;
  data: ArticleData;
}

export interface PageEntry {
  collection: "pages";
  id: string;
  slug: string;
  routeFile: string;
  path: string;
  data: PageData;
}

export interface TagTranslation {
  title: string;
  description: string;
}

export interface TagEntry {
  slug: string;
  name: string;
  visibility?: "public" | "internal";
  order?: number;
  translations: Record<SupportedLanguageCodes, TagTranslation>;
}

export type ContentEntry = ArticleEntry | PageEntry;

export interface BlogManifest {
  articles: ArticleEntry[];
  pages: PageEntry[];
  tags: TagEntry[];
}
