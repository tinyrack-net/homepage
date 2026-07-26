import { describe, expect, it } from "vitest";
import { t, translations } from "./index.ts";

describe("t()", () => {
  it("returns the localized string for a known key", () => {
    expect(t("en", "nav.home")).not.toBe("nav.home");
    expect(typeof t("ko", "nav.home")).toBe("string");
  });

  it("falls back to the key when missing", () => {
    expect(t("en", "does.not.exist")).toBe("does.not.exist");
  });

  it("fills placeholders wherever the locale positions them", () => {
    expect(t("en", "pagination.page", { page: 2 })).toBe("Page 2");
    expect(t("ko", "pagination.page", { page: 2 })).toBe("2페이지");
    expect(t("ja", "pagination.page", { page: 2 })).toBe("2ページ");
  });

  it("leaves an unmatched placeholder visible", () => {
    expect(t("en", "pagination.page", { wrong: 2 })).toBe("Page {page}");
  });

  it("defines the same keys in every locale", () => {
    const keys = (lang: "en" | "ja" | "ko") =>
      Object.keys(translations[lang]).sort();
    expect(keys("ko")).toEqual(keys("en"));
    expect(keys("ja")).toEqual(keys("en"));
  });
});
