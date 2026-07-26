import { describe, expect, it } from "vitest";
import type {
  ArticleEntry,
  BlogManifest,
  TagEntry,
} from "../lib/content-types.ts";
import type { SupportedLanguageCodes } from "../lib/language.ts";
import { ARTICLES_PER_PAGE } from "../lib/pagination.ts";
import { planRoutes } from "./routes-plan.ts";
import { scanContent } from "./scan.ts";

const paths = planRoutes(scanContent(process.cwd())).map((entry) => entry.path);

describe("route plan (URL contract)", () => {
  it("serves the default locale at the unprefixed root", () => {
    expect(paths).toContain("/");
    expect(paths).toContain("/ko/");
    expect(paths).toContain("/ja/");
  });

  it("never generates an /en/ prefix", () => {
    expect(paths.some((path) => path.startsWith("/en/"))).toBe(false);
  });

  it("emits article, page and tag routes with trailing slashes", () => {
    expect(paths).toContain("/about/");
    expect(paths).toContain("/ja/about/");
    expect(paths).toContain("/tag/hardware/");
    for (const path of paths) {
      expect(path.endsWith("/")).toBe(true);
    }
  });

  it("gives every locale a blog listing so the header can link to it", () => {
    expect(paths).toContain("/blog/");
    expect(paths).toContain("/ko/blog/");
    expect(paths).toContain("/ja/blog/");
  });
});

describe("listing pagination", () => {
  function article(
    lang: SupportedLanguageCodes,
    index: number,
    tags: string[],
  ) {
    return {
      collection: "articles",
      id: `articles/post-${index}/${lang}`,
      slug: `post-${index}`,
      routeFile: `articles/post-${index}/${lang}.mdx`,
      path: `/post-${index}/`,
      data: {
        title: `Post ${index}`,
        excerpt: "",
        lang,
        routeSlug: `post-${index}`,
        translationKey: `post-${index}`,
        publishedAt: `2026-01-${String(index + 1).padStart(2, "0")}`,
        tags,
        commentsTerm: `post-${index}`,
        draft: false,
      },
    } satisfies ArticleEntry;
  }

  function manifestWith(count: number, tags: string[] = []): BlogManifest {
    return {
      articles: Array.from({ length: count }, (_, index) =>
        article("en", index, tags),
      ),
      pages: [],
      tags: tags.map((slug) => ({
        slug,
        name: slug,
        translations: {} as TagEntry["translations"],
      })),
    };
  }

  function blogPaths(count: number) {
    return planRoutes(manifestWith(count))
      .filter((entry) => entry.kind === "blog" && entry.lang === "en")
      .map((entry) => entry.path);
  }

  it("keeps a single unpaginated page for an empty locale", () => {
    expect(blogPaths(0)).toEqual(["/blog/"]);
  });

  it("does not split a listing that fits on one page", () => {
    expect(blogPaths(ARTICLES_PER_PAGE)).toEqual(["/blog/"]);
  });

  it("adds a second page as soon as one article overflows", () => {
    expect(blogPaths(ARTICLES_PER_PAGE + 1)).toEqual([
      "/blog/",
      "/blog/page/2/",
    ]);
  });

  it("splits evenly without emitting a trailing empty page", () => {
    expect(blogPaths(ARTICLES_PER_PAGE * 3)).toEqual([
      "/blog/",
      "/blog/page/2/",
      "/blog/page/3/",
    ]);
  });

  it("paginates tag listings on the same contract", () => {
    const plan = planRoutes(manifestWith(ARTICLES_PER_PAGE + 1, ["hardware"]));
    const tagPaths = plan
      .filter((entry) => entry.kind === "tag" && entry.lang === "en")
      .map((entry) => entry.path);
    expect(tagPaths).toEqual(["/tag/hardware/", "/tag/hardware/page/2/"]);
  });

  it("numbers pages from one and never emits /page/1/", () => {
    const plan = planRoutes(manifestWith(ARTICLES_PER_PAGE * 2));
    const first = plan.find((entry) => entry.kind === "blog");
    expect(first?.page).toBe(1);
    expect(plan.every((entry) => !entry.path.includes("/page/1/"))).toBe(true);
  });

  it("keeps every generated path unique", () => {
    const all = planRoutes(
      manifestWith(ARTICLES_PER_PAGE * 2, ["hardware"]),
    ).map((entry) => entry.path);
    expect(new Set(all).size).toBe(all.length);
  });
});
