import { describe, expect, it } from "vitest";
import * as m from "../i18n/paraglide/messages.js";
import { defaultLangCode, SUPPORTED_LANGUAGE_CODES } from "./language.ts";

describe("language constants", () => {
  it("exposes the supported language codes", () => {
    expect(SUPPORTED_LANGUAGE_CODES).toEqual(["en", "ja", "ko"]);
    expect(defaultLangCode).toBe("en");
  });

  it("maps each code to a display label", () => {
    expect(m.locale_name({}, { locale: "en" })).toBe("English");
    expect(m.locale_name({}, { locale: "ja" })).toBe("日本語");
    expect(m.locale_name({}, { locale: "ko" })).toBe("한국어");
  });
});
