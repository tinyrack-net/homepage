import { describe, expect, it, vi } from "vitest";
import type { ArticleEntry, BlogManifest } from "./content-types.ts";
import type { SupportedLanguageCodes } from "./language.ts";

function article(
  slug: string,
  lang: SupportedLanguageCodes,
  tags: string[] = [],
): ArticleEntry {
  return {
    collection: "articles",
    id: `articles/${slug}/${lang}`,
    slug,
    routeFile: `articles/${slug}/${lang}.mdx`,
    path: lang === "en" ? `/${slug}/` : `/${lang}/${slug}/`,
    data: {
      title: slug,
      excerpt: "",
      lang,
      routeSlug: slug,
      translationKey: slug,
      publishedAt: "2026-01-01",
      tags,
      commentsTerm: "",
      draft: false,
    },
  };
}

const manifest: BlogManifest = {
  articles: [
    article("kvm-review", "en", ["hardware"]),
    article("kvm-review", "ko", ["hardware"]),
    article("news-only", "en", ["news"]),
  ],
  pages: [],
  tags: [],
};

vi.mock("virtual:blog/manifest", () => ({ manifest }));

const { getLanguageSwitchPath, resolveSitePage } = await import(
  "./site-page.ts"
);

describe("resolveSitePage", () => {
  it("resolves home for every locale", () => {
    expect(resolveSitePage("/")).toEqual({ kind: "home", lang: "en" });
    expect(resolveSitePage("/ko/")).toEqual({ kind: "home", lang: "ko" });
  });

  it("resolves the blog index and its numbered pages", () => {
    expect(resolveSitePage("/blog/")).toEqual({
      kind: "blog",
      lang: "en",
      page: 1,
    });
    expect(resolveSitePage("/blog/page/3/")).toEqual({
      kind: "blog",
      lang: "en",
      page: 3,
    });
    expect(resolveSitePage("/ja/blog/page/2/")).toEqual({
      kind: "blog",
      lang: "ja",
      page: 2,
    });
  });

  it("resolves the open-source showcase for every locale", () => {
    expect(resolveSitePage("/open-source/")).toEqual({
      kind: "openSource",
      lang: "en",
    });
    expect(resolveSitePage("/ko/open-source/")).toEqual({
      kind: "openSource",
      lang: "ko",
    });
    expect(resolveSitePage("/ja/open-source")).toEqual({
      kind: "openSource",
      lang: "ja",
    });
  });

  it("resolves tag listings with their page number", () => {
    expect(resolveSitePage("/tag/hardware/")).toEqual({
      kind: "tag",
      lang: "en",
      tagSlug: "hardware",
      page: 1,
    });
    expect(resolveSitePage("/ko/tag/hardware/page/2/")).toEqual({
      kind: "tag",
      lang: "ko",
      tagSlug: "hardware",
      page: 2,
    });
  });

  it("resolves a content entry by its path", () => {
    const page = resolveSitePage("/kvm-review/");
    expect(page.kind).toBe("content");
    expect(page.lang).toBe("en");
  });

  it("does not mistake a two-letter slug for a locale prefix", () => {
    expect(resolveSitePage("/xx/blog/").kind).toBe("unknown");
  });

  it("normalizes a missing trailing slash", () => {
    expect(resolveSitePage("/blog")).toEqual({
      kind: "blog",
      lang: "en",
      page: 1,
    });
  });
});

describe("getLanguageSwitchPath", () => {
  it("resets a paginated listing to page one in the target locale", () => {
    expect(getLanguageSwitchPath("/blog/page/4/", "ko")).toBe("/ko/blog/");
    expect(getLanguageSwitchPath("/ko/blog/page/2/", "en")).toBe("/blog/");
  });

  it("keeps a tag that exists in the target locale", () => {
    expect(getLanguageSwitchPath("/tag/hardware/", "ko")).toBe(
      "/ko/tag/hardware/",
    );
  });

  it("falls back to the blog index for a tag the target locale lacks", () => {
    // Only the English article carries `news`, so /ko/tag/news/ is never built.
    expect(getLanguageSwitchPath("/tag/news/", "ko")).toBe("/ko/blog/");
  });

  it("maps other pages straight across", () => {
    expect(getLanguageSwitchPath("/kvm-review/", "ko")).toBe("/ko/kvm-review/");
    expect(getLanguageSwitchPath("/", "ja")).toBe("/ja/");
    expect(getLanguageSwitchPath("/open-source/", "ko")).toBe(
      "/ko/open-source/",
    );
  });
});
