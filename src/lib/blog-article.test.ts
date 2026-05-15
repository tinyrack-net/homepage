import { describe, expect, it } from "vitest";
import { resolveGiscusTheme } from "./blog-article";

describe("blog article helpers", () => {
  it("maps page theme values to giscus themes", () => {
    expect(resolveGiscusTheme("black")).toBe("dark");
    expect(resolveGiscusTheme("light")).toBe("light");
    expect(resolveGiscusTheme(null)).toBe("light");
  });
});
