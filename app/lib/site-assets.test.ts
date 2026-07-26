import { createRss, createSitemap } from "@tinyrack/docs/site";
import { describe, expect, it } from "vitest";
import type { ArticleEntry, BlogManifest } from "./content-types.ts";
import {
  createHomepageFeed,
  createHomepagePageDescriptors,
} from "./site-assets.ts";

function article({
  draft = false,
  lang = "en",
  publishedAt,
  slug,
}: {
  draft?: boolean;
  lang?: "en" | "ja" | "ko";
  publishedAt: string;
  slug: string;
}): ArticleEntry {
  return {
    collection: "articles",
    data: {
      commentsTerm: slug,
      draft,
      excerpt: `Excerpt ${slug}`,
      lang,
      publishedAt,
      routeSlug: slug,
      tags: [],
      title: `Title ${slug}`,
      translationKey: slug,
    },
    id: `articles/${slug}/${lang}`,
    path: lang === "en" ? `/${slug}/` : `/${lang}/${slug}/`,
    routeFile: `articles/${slug}/${lang}.mdx`,
    slug,
  };
}

function manifest(articles: ArticleEntry[]): BlogManifest {
  return { articles, pages: [], tags: [] };
}

describe("homepage site descriptors", () => {
  it("keeps English unprefixed and emits locale alternates", () => {
    const pages = createHomepagePageDescriptors(manifest([]));
    const root = pages.find((page) => page.url === "https://tinyrack.net/");

    expect(pages.some((page) => page.url.includes("/en/"))).toBe(false);
    expect(root?.alternates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          language: "ja",
          url: "https://tinyrack.net/ja/",
        }),
        expect.objectContaining({
          language: "ko",
          url: "https://tinyrack.net/ko/",
        }),
      ]),
    );
  });

  it("leaves paginated listings out of the sitemap", () => {
    const articles = Array.from({ length: 11 }, (_, index) =>
      article({
        publishedAt: `2026-01-${String(index + 1).padStart(2, "0")}`,
        slug: `post-${index}`,
      }),
    );
    const sitemap = createSitemap(
      createHomepagePageDescriptors(manifest(articles)),
    );

    expect(sitemap).toContain("https://tinyrack.net/blog/");
    expect(sitemap).not.toContain("/blog/page/2/");
  });

  it("builds a newest-first English feed without drafts", () => {
    const feed = createHomepageFeed(
      manifest([
        article({ publishedAt: "2026-01-01", slug: "older" }),
        article({ publishedAt: "2026-02-01", slug: "newer" }),
        article({
          draft: true,
          publishedAt: "2026-03-01",
          slug: "draft",
        }),
        article({
          lang: "ko",
          publishedAt: "2026-04-01",
          slug: "korean",
        }),
      ]),
    );
    const rss = createRss(feed);

    expect(feed.items.map((item) => item.title)).toEqual([
      "Title newer",
      "Title older",
    ]);
    expect(rss).toContain("<guid>https://tinyrack.net/newer/</guid>");
    expect(rss).not.toContain("Title draft");
    expect(rss).not.toContain("Title korean");
  });
});
