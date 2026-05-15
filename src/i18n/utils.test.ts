import { describe, expect, it } from "vitest";
import { t } from "./index";

describe("i18n t function", () => {
  it("should return correct English translations", () => {
    expect(t("en", "theme")).toBe("Theme");
    expect(t("en", "theme.light")).toBe("Light");
  });

  it("should return correct Korean translations", () => {
    expect(t("ko", "theme")).toBe("테마");
    expect(t("ko", "theme.light")).toBe("밝은 색상");
  });

  it("should return key as fallback for missing translations", () => {
    expect(t("en", "nonexistent.key")).toBe("nonexistent.key");
  });
});
