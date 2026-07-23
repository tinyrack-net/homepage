import { describe, expect, it } from "vitest";
import { resolveGiscusTheme } from "./blog-article.ts";

describe("resolveGiscusTheme", () => {
  it("maps the dark tinyrack theme to giscus dark", () => {
    expect(resolveGiscusTheme("tinyrack-dark")).toBe("dark");
  });

  it("defaults to light otherwise", () => {
    expect(resolveGiscusTheme("tinyrack-light")).toBe("light");
    expect(resolveGiscusTheme(null)).toBe("light");
    expect(resolveGiscusTheme(undefined)).toBe("light");
  });
});
