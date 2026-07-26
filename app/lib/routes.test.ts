import { describe, expect, it } from "vitest";
import {
  getBlogPagePath,
  getBlogPath,
  getContentPath,
  getEquivalentLanguagePath,
  getHomePath,
  getTagPagePath,
  getTagPath,
} from "./routes.ts";

describe("route builders", () => {
  it("keeps the default locale unprefixed and prefixes others", () => {
    expect(getHomePath("en")).toBe("/");
    expect(getHomePath("ko")).toBe("/ko/");
    expect(getContentPath("en", "about")).toBe("/about/");
    expect(getContentPath("ja", "about")).toBe("/ja/about/");
    expect(getTagPath("en", "news")).toBe("/tag/news/");
    expect(getTagPath("ko", "news")).toBe("/ko/tag/news/");
  });

  it("keeps page one on the unpaginated listing path", () => {
    expect(getBlogPath("en")).toBe("/blog/");
    expect(getBlogPagePath("en", 1)).toBe("/blog/");
    expect(getBlogPagePath("ko", 1)).toBe("/ko/blog/");
    expect(getTagPagePath("en", "news", 1)).toBe("/tag/news/");
  });

  it("numbers listing pages from two", () => {
    expect(getBlogPagePath("en", 2)).toBe("/blog/page/2/");
    expect(getBlogPagePath("ja", 3)).toBe("/ja/blog/page/3/");
    expect(getTagPagePath("en", "news", 2)).toBe("/tag/news/page/2/");
    expect(getTagPagePath("ko", "news", 4)).toBe("/ko/tag/news/page/4/");
  });

  it("maps a path to its equivalent in another language", () => {
    expect(getEquivalentLanguagePath("/about/", "ko")).toBe("/ko/about/");
    expect(getEquivalentLanguagePath("/ko/about/", "en")).toBe("/about/");
    expect(getEquivalentLanguagePath("/ja/about/", "ko")).toBe("/ko/about/");
    expect(getEquivalentLanguagePath("/", "ko")).toBe("/ko/");
    expect(getEquivalentLanguagePath("/ko/", "en")).toBe("/");
  });
});
