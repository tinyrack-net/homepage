import { describe, expect, it } from "vitest";
import { getAlternativeLanguageLinks } from "./alternative-language-links.ts";
import type { ArticleEntry } from "./content-types.ts";

function article(
  lang: ArticleEntry["data"]["lang"],
  slug: string,
): ArticleEntry {
  return {
    collection: "articles",
    id: `articles/${slug}/${lang}`,
    slug: "group",
    routeFile: `articles/group/${lang}.mdx`,
    path: `/${slug}/`,
    data: {
      title: slug,
      excerpt: "",
      lang,
      routeSlug: slug,
      translationKey: "group",
      publishedAt: "2025-01-01",
      tags: [],
      commentsTerm: "",
      draft: false,
    },
  };
}

describe("getAlternativeLanguageLinks", () => {
  it("returns other-language entries sharing a translation key", () => {
    const en = article("en", "hello");
    const ko = article("ko", "hello-ko");
    const ja = article("ja", "hello-ja");
    const unrelated: ArticleEntry = {
      ...article("ko", "other"),
      data: { ...article("ko", "other").data, translationKey: "other" },
    };

    const links = getAlternativeLanguageLinks(en, [en, ko, ja, unrelated]);

    expect(links).toEqual([
      { href: "/ko/hello-ko/", label: "한국어", lang: "ko" },
      { href: "/ja/hello-ja/", label: "日本語", lang: "ja" },
    ]);
  });
});
