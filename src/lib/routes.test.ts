import { describe, expect, it } from "vitest";
import type { SupportedLanguageCodes } from "./language";
import { getEquivalentLanguagePath } from "./routes";

const cases = [
  ["/", "ko", "/"],
  ["/", "en", "/en/"],
  ["/", "ja", "/ja/"],
  ["/about/", "en", "/en/about/"],
  ["/en/about/", "ko", "/about/"],
  ["/en/about/", "ja", "/ja/about/"],
  ["/openterface-mini-kvm/", "en", "/en/openterface-mini-kvm/"],
  ["/en/openterface-mini-kvm/", "ko", "/openterface-mini-kvm/"],
  ["/ja/openterface-mini-kvm/", "en", "/en/openterface-mini-kvm/"],
  ["/tag/news/", "en", "/en/tag/news/"],
  ["/en/tag/news/", "ko", "/tag/news/"],
  ["/ja/tag/news/", "en", "/en/tag/news/"],
] satisfies Array<[string, SupportedLanguageCodes, string]>;

describe("getEquivalentLanguagePath", () => {
  it.each(cases)("maps %s to %s as %s", (pathname, targetLang, expected) => {
    expect(getEquivalentLanguagePath(pathname, targetLang)).toBe(expected);
  });
});
