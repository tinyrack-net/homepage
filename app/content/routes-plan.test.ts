import { describe, expect, it } from "vitest";
import { planRoutes } from "./routes-plan.ts";
import { scanContent } from "./scan.ts";

const paths = planRoutes(scanContent(process.cwd())).map((entry) => entry.path);

describe("route plan (URL contract)", () => {
  it("serves the default locale at the unprefixed root", () => {
    expect(paths).toContain("/");
    expect(paths).toContain("/ko/");
    expect(paths).toContain("/ja/");
  });

  it("never generates an /en/ prefix", () => {
    expect(paths.some((path) => path.startsWith("/en/"))).toBe(false);
  });

  it("emits article, page and tag routes with trailing slashes", () => {
    expect(paths).toContain("/about/");
    expect(paths).toContain("/ja/about/");
    expect(paths).toContain("/tag/hardware/");
    for (const path of paths) {
      expect(path.endsWith("/")).toBe(true);
    }
  });
});
