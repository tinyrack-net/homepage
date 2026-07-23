import { describe, expect, it } from "vitest";
import {
  getContentPath,
  getEquivalentLanguagePath,
  getHomePath,
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

  it("maps a path to its equivalent in another language", () => {
    expect(getEquivalentLanguagePath("/about/", "ko")).toBe("/ko/about/");
    expect(getEquivalentLanguagePath("/ko/about/", "en")).toBe("/about/");
    expect(getEquivalentLanguagePath("/ja/about/", "ko")).toBe("/ko/about/");
    expect(getEquivalentLanguagePath("/", "ko")).toBe("/ko/");
    expect(getEquivalentLanguagePath("/ko/", "en")).toBe("/");
  });
});
