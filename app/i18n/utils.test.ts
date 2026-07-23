import { describe, expect, it } from "vitest";
import { t } from "./index.ts";

describe("t()", () => {
  it("returns the localized string for a known key", () => {
    expect(t("en", "nav.home")).not.toBe("nav.home");
    expect(typeof t("ko", "nav.home")).toBe("string");
  });

  it("falls back to the key when missing", () => {
    expect(t("en", "does.not.exist")).toBe("does.not.exist");
  });
});
