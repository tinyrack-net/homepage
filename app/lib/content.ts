import { manifest } from "virtual:blog/manifest";
import type { ArticleEntry, PageEntry, TagEntry } from "./content-types.ts";

export type { ArticleEntry, PageEntry, TagEntry } from "./content-types.ts";

const LANGUAGE_TAGS = new Set(["en", "ja", "ko"]);

function sortByPublishedAtDesc<T extends { data: { publishedAt: string } }>(
  entries: T[],
) {
  return [...entries].sort((left, right) => {
    return (
      new Date(right.data.publishedAt).getTime() -
      new Date(left.data.publishedAt).getTime()
    );
  });
}

function sortTags(entries: TagEntry[]) {
  return [...entries].sort((left, right) => {
    const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.slug.localeCompare(right.slug);
  });
}

export function getAllArticles(): ArticleEntry[] {
  const entries = manifest.articles.filter((entry) => !entry.data.draft);
  return sortByPublishedAtDesc(entries);
}

export function getAllPages(): PageEntry[] {
  return manifest.pages;
}

export function getAllTags(): TagEntry[] {
  return sortTags(manifest.tags);
}

export function getNavigationTags(): TagEntry[] {
  return getAllTags().filter((entry) => {
    return !LANGUAGE_TAGS.has(entry.slug) && entry.visibility !== "internal";
  });
}
