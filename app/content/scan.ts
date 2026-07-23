import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import matter from "gray-matter";
import type {
  ArticleEntry,
  BlogManifest,
  PageEntry,
  TagEntry,
} from "../lib/content-types.ts";
import {
  SUPPORTED_LANGUAGE_CODES,
  type SupportedLanguageCodes,
} from "../lib/language.ts";
import { getContentPath } from "../lib/routes.ts";

const LANG_SET = new Set<string>(SUPPORTED_LANGUAGE_CODES);

function isLang(value: string): value is SupportedLanguageCodes {
  return LANG_SET.has(value);
}

/** Rewrite a content-relative image reference to its public `/media/...` URL. */
export function toMediaUrl(
  collection: "articles" | "pages",
  slug: string,
  ref: string | undefined,
): string | undefined {
  if (!ref) {
    return undefined;
  }
  return `/media/${collection}/${slug}/${basename(ref)}`;
}

function readGroup(
  contentDir: string,
  collection: "articles" | "pages",
): { slug: string; lang: SupportedLanguageCodes; file: string }[] {
  const collectionDir = join(contentDir, collection);
  if (!existsSync(collectionDir)) {
    return [];
  }

  const groups = readdirSync(collectionDir, { withFileTypes: true }).filter(
    (entry) => entry.isDirectory(),
  );

  const files: { slug: string; lang: SupportedLanguageCodes; file: string }[] =
    [];

  for (const group of groups) {
    const groupDir = join(collectionDir, group.name);
    for (const file of readdirSync(groupDir)) {
      if (!file.endsWith(".mdx")) {
        continue;
      }
      const lang = file.replace(/\.mdx$/, "");
      if (!isLang(lang)) {
        continue;
      }
      files.push({ slug: group.name, lang, file: join(groupDir, file) });
    }
  }

  return files;
}

export function scanContent(root: string): BlogManifest {
  const contentDir = join(root, "content");

  const articles: ArticleEntry[] = readGroup(contentDir, "articles").map(
    ({ slug, lang, file }) => {
      const { data } = matter(readFileSync(file, "utf8"));
      const routeSlug = String(data["routeSlug"] ?? slug);
      return {
        collection: "articles",
        id: `articles/${slug}/${lang}`,
        slug,
        routeFile: `articles/${slug}/${lang}.mdx`,
        path: getContentPath(lang, routeSlug),
        data: {
          title: String(data["title"] ?? ""),
          excerpt: String(data["excerpt"] ?? ""),
          lang,
          routeSlug,
          translationKey: String(data["translationKey"] ?? slug),
          publishedAt: String(data["publishedAt"] ?? ""),
          updatedAt: data["updatedAt"] ? String(data["updatedAt"]) : undefined,
          tags: Array.isArray(data["tags"]) ? data["tags"].map(String) : [],
          featureImage: toMediaUrl(
            "articles",
            slug,
            data["featureImage"] as string | undefined,
          ),
          commentsTerm: String(data["commentsTerm"] ?? ""),
          draft: data["draft"] === true,
        },
      } satisfies ArticleEntry;
    },
  );

  const pages: PageEntry[] = readGroup(contentDir, "pages").map(
    ({ slug, lang, file }) => {
      const { data } = matter(readFileSync(file, "utf8"));
      const routeSlug = String(data["routeSlug"] ?? slug);
      return {
        collection: "pages",
        id: `pages/${slug}/${lang}`,
        slug,
        routeFile: `pages/${slug}/${lang}.mdx`,
        path: getContentPath(lang, routeSlug),
        data: {
          title: String(data["title"] ?? ""),
          excerpt: String(data["excerpt"] ?? ""),
          lang,
          routeSlug,
          translationKey: String(data["translationKey"] ?? slug),
          featureImage: toMediaUrl(
            "pages",
            slug,
            data["featureImage"] as string | undefined,
          ),
          updatedAt: data["updatedAt"] ? String(data["updatedAt"]) : undefined,
        },
      } satisfies PageEntry;
    },
  );

  const tagsDir = join(contentDir, "tags");
  const tags: TagEntry[] = existsSync(tagsDir)
    ? readdirSync(tagsDir)
        .filter((file) => file.endsWith(".json"))
        .map(
          (file) =>
            JSON.parse(readFileSync(join(tagsDir, file), "utf8")) as TagEntry,
        )
    : [];

  return { articles, pages, tags };
}
