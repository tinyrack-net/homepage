import { describe, expect, it } from "vitest";
import { getOpenSourceProjectDescription } from "../content/open-source.ts";
import { defaultLangCode, SUPPORTED_LANGUAGE_CODES } from "../lib/language.ts";
import * as m from "./paraglide/messages.js";
import { baseLocale, locales } from "./paraglide/runtime.js";
import en from "./translations/en.json";
import ja from "./translations/ja.json";
import ko from "./translations/ko.json";

describe("Paraglide messages", () => {
  it("returns localized messages for every supported locale", () => {
    expect(m.nav_home({}, { locale: "en" })).toBe("Home");
    expect(m.nav_home({}, { locale: "ja" })).toBe("ホーム");
    expect(m.nav_home({}, { locale: "ko" })).toBe("홈");
  });

  it("fills placeholders wherever the locale positions them", () => {
    expect(m.pagination_page({ page: 2 }, { locale: "en" })).toBe("Page 2");
    expect(m.pagination_page({ page: 2 }, { locale: "ko" })).toBe("2페이지");
    expect(m.pagination_page({ page: 2 }, { locale: "ja" })).toBe("2ページ");
  });

  it("fills every theme switch placeholder", () => {
    expect(
      m.theme_switch({ current: "Auto", next: "Light" }, { locale: "en" }),
    ).toBe("Switch theme. Current: Auto; next: Light");
  });

  it("defines the same keys in every locale", () => {
    const keys = (catalog: Record<string, string>) =>
      Object.keys(catalog).sort();

    expect(keys(ko)).toEqual(keys(en));
    expect(keys(ja)).toEqual(keys(en));
  });

  it("keeps Paraglide locale configuration aligned with app routing", () => {
    expect(locales).toEqual(SUPPORTED_LANGUAGE_CODES);
    expect(baseLocale).toBe(defaultLangCode);
  });

  it("exposes app-owned localized copy directly as messages", () => {
    expect(m.home_hero_headline_first({}, { locale: "ko" })).toBe(
      "열린 인프라를",
    );
    expect(m.products_title({}, { locale: "ja" })).toBe("準備中です。");
    expect(
      m.open_source_meta_title({ site: "Tinyrack" }, { locale: "en" }),
    ).toBe("Open Source - Tinyrack");
    expect(getOpenSourceProjectDescription("dotweave", "ko")).toContain(
      "dotfiles",
    );
    expect(m.locale_name({}, { locale: "ja" })).toBe("日本語");
    expect(m.nav_site({}, { locale: "ko" })).toBe("타이니랙");
    expect(m.site_description({}, { locale: "en" })).toContain("self-hosted");
  });
});
