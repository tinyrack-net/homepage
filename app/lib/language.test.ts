import { describe, expect, it } from "vitest";
import {
  defaultLangCode,
  LOCALE_INFO,
  SUPPORTED_LANGUAGE_CODES,
} from "./language.ts";

describe("language constants", () => {
  it("exposes the supported language codes", () => {
    expect(SUPPORTED_LANGUAGE_CODES).toEqual(["en", "ja", "ko"]);
    expect(defaultLangCode).toBe("en");
  });

  it("maps each code to a display label", () => {
    expect(LOCALE_INFO.en).toBe("English");
    expect(LOCALE_INFO.ja).toBe("日本語");
    expect(LOCALE_INFO.ko).toBe("한국어");
  });
});
