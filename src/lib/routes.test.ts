import { describe, expect, it } from "vitest";
import type { SupportedLanguageCodes } from "./language";
import { getEquivalentLanguagePath } from "./routes";

const cases = [
  ["/", "en", "/"],
  ["/", "ko", "/ko/"],
  ["/", "ja", "/ja/"],
  ["/about/", "en", "/about/"],
  ["/about/", "ko", "/ko/about/"],
  ["/en/about/", "en", "/about/"],
  ["/en/about/", "ko", "/ko/about/"],
  ["/en/about/", "ja", "/ja/about/"],
  ["/openterface-mini-kvm/", "en", "/openterface-mini-kvm/"],
  ["/openterface-mini-kvm/", "ko", "/ko/openterface-mini-kvm/"],
  ["/en/openterface-mini-kvm/", "ko", "/ko/openterface-mini-kvm/"],
  ["/ja/openterface-mini-kvm/", "en", "/openterface-mini-kvm/"],
  ["/tag/news/", "en", "/tag/news/"],
  ["/tag/news/", "ko", "/ko/tag/news/"],
  ["/en/tag/news/", "ko", "/ko/tag/news/"],
  ["/ja/tag/news/", "en", "/tag/news/"],
] satisfies Array<[string, SupportedLanguageCodes, string]>;

describe("getEquivalentLanguagePath", () => {
  it.each(cases)("maps %s to %s as %s", (pathname, targetLang, expected) => {
    expect(getEquivalentLanguagePath(pathname, targetLang)).toBe(expected);
  });
});
