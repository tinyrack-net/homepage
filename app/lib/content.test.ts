import { describe, expect, it, vi } from "vitest";
import type { ArticleEntry, BlogManifest, TagEntry } from "./content-types.ts";

function article(
  slug: string,
  publishedAt: string,
  extra: Partial<ArticleEntry["data"]> = {},
): ArticleEntry {
  return {
    collection: "articles",
    id: `articles/${slug}/en`,
    slug,
    routeFile: `articles/${slug}/en.mdx`,
    path: `/${slug}/`,
    data: {
      title: slug,
      excerpt: "",
      lang: "en",
      routeSlug: slug,
      translationKey: slug,
      publishedAt,
      tags: [],
      commentsTerm: "",
      draft: false,
      ...extra,
    },
  };
}

function tag(
  slug: string,
  order: number | undefined,
  extra: Partial<TagEntry> = {},
): TagEntry {
  return {
    slug,
    name: slug,
    visibility: "public",
    order,
    translations: {
      en: { title: slug, description: "" },
      ja: { title: slug, description: "" },
      ko: { title: slug, description: "" },
    },
    ...extra,
  };
}

const manifest: BlogManifest = {
  articles: [
    article("older", "2024-01-02"),
    article("draft", "2025-01-01", { draft: true }),
    article("newer", "2025-01-03"),
  ],
  pages: [],
  tags: [
    tag("web", undefined),
    tag("blog", 5),
    tag("ai", 5),
    tag("project", 1),
    tag("ko", 0),
    tag("internal", 1, { visibility: "internal" }),
  ],
};

vi.mock("virtual:blog/manifest", () => ({ manifest }));

const { getAllArticles, getAllTags, getNavigationTags } = await import(
  "./content.ts"
);

describe("content helpers", () => {
  it("filters drafts and sorts articles by published date descending", () => {
    expect(getAllArticles().map((entry) => entry.slug)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("sorts all tags by order then slug", () => {
    expect(getAllTags().map((entry) => entry.slug)).toEqual([
      "ko",
      "internal",
      "project",
      "ai",
      "blog",
      "web",
    ]);
  });

  it("excludes language and internal tags from navigation", () => {
    expect(getNavigationTags().map((entry) => entry.slug)).toEqual([
      "project",
      "ai",
      "blog",
      "web",
    ]);
  });
});
