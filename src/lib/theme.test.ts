import { describe, expect, it } from "vitest";
import {
  getThemePreference,
  isSupportedTheme,
  resolveAppliedTheme,
  THEME,
  THEME_KEY,
} from "./theme";

describe("theme helpers", () => {
  it("accepts only supported theme values", () => {
    expect(isSupportedTheme("auto")).toBe(true);
    expect(isSupportedTheme("light")).toBe(true);
    expect(isSupportedTheme("dark")).toBe(true);
    expect(isSupportedTheme("sepia")).toBe(false);
    expect(isSupportedTheme(null)).toBe(false);
  });

  it("reads the stored preference and falls back to auto", () => {
    expect(
      getThemePreference({
        getItem(key) {
          return key === THEME_KEY ? "dark" : null;
        },
      }),
    ).toBe(THEME.DARK);

    expect(
      getThemePreference({
        getItem() {
          return "unexpected";
        },
      }),
    ).toBe(THEME.AUTO);
  });

  it("maps supported themes to applied document themes", () => {
    expect(resolveAppliedTheme(THEME.AUTO, true)).toBe("black");
    expect(resolveAppliedTheme(THEME.AUTO, false)).toBe("light");
    expect(resolveAppliedTheme(THEME.LIGHT, true)).toBe("light");
    expect(resolveAppliedTheme(THEME.DARK, false)).toBe("black");
  });
});
