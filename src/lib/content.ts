import { type CollectionEntry, getCollection } from "astro:content";

const LANGUAGE_TAGS = new Set(["en", "ko"]);

export type ArticleEntry = CollectionEntry<"articles">;
export type PageEntry = CollectionEntry<"pages">;
export type TagEntry = CollectionEntry<"tags">;

function sortByPublishedAtDesc<T extends { data: { publishedAt: string } }>(
  entries: T[],
) {
  return entries.sort((left, right) => {
    return (
      new Date(right.data.publishedAt).getTime() -
      new Date(left.data.publishedAt).getTime()
    );
  });
}

function sortTags(entries: TagEntry[]) {
  return entries.sort((left, right) => {
    const leftOrder = left.data.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.data.order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.data.slug.localeCompare(right.data.slug);
  });
}

export async function getAllArticles(): Promise<ArticleEntry[]> {
  const entries = await getCollection("articles", ({ data }) => !data.draft);
  return sortByPublishedAtDesc(entries);
}

export async function getAllPages(): Promise<PageEntry[]> {
  return getCollection("pages");
}

export async function getAllTags(): Promise<TagEntry[]> {
  const entries = await getCollection("tags");
  return sortTags(entries);
}

export async function getNavigationTags(): Promise<TagEntry[]> {
  const entries = await getAllTags();
  return entries.filter((entry) => {
    return (
      !LANGUAGE_TAGS.has(entry.data.slug) &&
      entry.data.visibility !== "internal"
    );
  });
}
