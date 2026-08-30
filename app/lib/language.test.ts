import { describe, expect, it } from "vitest";
import { getLocaleLabel } from "../i18n/copy.ts";
import { defaultLangCode, SUPPORTED_LANGUAGE_CODES } from "./language.ts";

describe("language constants", () => {
  it("exposes the supported language codes", () => {
    expect(SUPPORTED_LANGUAGE_CODES).toEqual(["en", "ja", "ko"]);
    expect(defaultLangCode).toBe("en");
  });

  it("maps each code to a display label", () => {
    expect(getLocaleLabel("en")).toBe("English");
    expect(getLocaleLabel("ja")).toBe("日本語");
    expect(getLocaleLabel("ko")).toBe("한국어");
  });
});
