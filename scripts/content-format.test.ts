import { describe, expect, it } from "vitest";
import {
  ContentError,
  checkUnsupportedSyntax,
  normalizeBody,
  parseHeader,
} from "./content-format.ts";

const IMAGE =
  "/api/attachments.redirect?id=21862505-0dd3-422f-b59d-9cc8df6e75f4";
const YAML = '```yaml\nlang: "ko"\nrouteSlug: "my-article"\n```';

describe("parseHeader", () => {
  it("reads image, yaml and body", () => {
    const header = parseHeader(
      `![](${IMAGE})\n\n${YAML}\n\n---\n\nBody text.\n`,
      "doc",
    );
    expect(header.image).toBe(IMAGE);
    expect(header.data).toEqual({ lang: "ko", routeSlug: "my-article" });
    expect(header.body.trim()).toBe("Body text.");
  });

  it("accepts Outline's export variants", () => {
    const header = parseHeader(
      ` ![cover](https://notes.winetree94.com${IMAGE} " =640x360")\n${YAML}\n***\nBody`,
      "doc",
    );
    expect(header.image).toBe(`https://notes.winetree94.com${IMAGE}`);
    expect(header.body).toBe("Body");
    expect(parseHeader(`${YAML}\n\n* * *\n\nBody`, "doc").body.trim()).toBe(
      "Body",
    );
  });

  it("allows documents without an image", () => {
    expect(parseHeader(`${YAML}\n\n---\n\nBody`, "doc").image).toBeUndefined();
  });

  it("keeps later dividers in the body", () => {
    const header = parseHeader(`${YAML}\n---\nA\n\n---\n\nB`, "doc");
    expect(header.body).toBe("A\n\n---\n\nB");
  });

  it.each([
    ["missing yaml", `![](${IMAGE})\n\nBody`, /missing yaml block/],
    ["missing divider", `![](${IMAGE})\n\n${YAML}\n\nBody`, /missing ---/],
    ["yaml before image", `${YAML}\n\n![](${IMAGE})\n\n---\n`, /missing ---/],
    ["text before yaml", `Intro\n\n${YAML}\n\n---\n`, /missing yaml block/],
    ["unclosed yaml", '```yaml\nlang: "ko"\n', /not closed/],
    [
      "external image",
      `![](https://example.com/a.png)\n\n${YAML}\n\n---\n`,
      /Outline attachment/,
    ],
    [
      "featureImage field",
      `![](${IMAGE})\n\n\`\`\`yaml\nfeatureImage: "${IMAGE}"\n\`\`\`\n\n---\n`,
      /featureImage is not a yaml field/,
    ],
    ["yaml list", "```yaml\n- a\n```\n\n---\n", /must be a mapping/],
  ])("rejects %s", (_, text, message) => {
    expect(() => parseHeader(text, "doc")).toThrow(ContentError);
    expect(() => parseHeader(text, "doc")).toThrow(message);
  });
});

describe("normalizeBody", () => {
  it("unindents images and collapses blank lines", () => {
    expect(normalizeBody(`\n ![](${IMAGE})\n\n\n\nText`)).toBe(
      `![](${IMAGE})\n\nText\n`,
    );
  });
});

describe("checkUnsupportedSyntax", () => {
  it("rejects Outline-only syntax outside code blocks", () => {
    expect(() => checkUnsupportedSyntax("doc", ":::info\nx\n:::")).toThrow(
      /notice blocks/,
    );
    expect(() =>
      checkUnsupportedSyntax("doc", "```md\n:::info\n```\n"),
    ).not.toThrow();
  });
});
