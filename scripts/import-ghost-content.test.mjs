import { describe, expect, it } from "vitest";
import {
  convertGhostHtmlToMarkdown,
  isSystemGhostPage,
  mapGhostEntryToContent,
  normalizeGhostTagSlug,
} from "./lib/ghost-import.mjs";

describe("Ghost content importer helpers", () => {
  it("classifies posts as articles and real pages as pages", () => {
    const post = mapGhostEntryToContent(
      {
        id: "post-id",
        uuid: "post-uuid",
        slug: "openterface-mini-kvm",
        title: "Openterface Mini-KVM",
        excerpt: "A compact KVM review",
        html: "<p>Hello</p>",
        published_at: "2026-01-02T03:04:05.000Z",
        updated_at: "2026-01-03T03:04:05.000Z",
        comment_id: "ghost-comment-id",
        tags: [{ name: "Review", slug: "review" }],
      },
      "post",
    );

    const page = mapGhostEntryToContent(
      {
        id: "page-id",
        uuid: "page-uuid",
        slug: "about",
        title: "About",
        excerpt: "About Tinyrack",
        html: "<p>About</p>",
        updated_at: "2026-01-03T03:04:05.000Z",
      },
      "page",
    );

    expect(post).toMatchObject({
      collection: "articles",
      slug: "openterface-mini-kvm",
      frontmatter: {
        lang: "ko",
        routeSlug: "openterface-mini-kvm",
        translationKey: "openterface-mini-kvm",
        publishedAt: "2026-01-02T03:04:05.000Z",
        updatedAt: "2026-01-03T03:04:05.000Z",
        commentsTerm: "ghost-comment-id",
        tags: ["review"],
      },
    });
    expect(page).toMatchObject({
      collection: "pages",
      slug: "about",
      frontmatter: {
        lang: "ko",
        routeSlug: "about",
        translationKey: "about",
        updatedAt: "2026-01-03T03:04:05.000Z",
      },
    });
  });

  it("excludes Ghost system/home pages", () => {
    expect(isSystemGhostPage({ slug: "" })).toBe(true);
    expect(isSystemGhostPage({ slug: "index" })).toBe(true);
    expect(isSystemGhostPage({ slug: "/" })).toBe(true);
    expect(isSystemGhostPage({ slug: "^" })).toBe(true);
    expect(isSystemGhostPage({ slug: "about" })).toBe(false);
  });

  it("normalizes Ghost tags", () => {
    expect(normalizeGhostTagSlug({ name: "News" })).toBe("news");
    expect(normalizeGhostTagSlug({ name: "Review" })).toBe("review");
    expect(normalizeGhostTagSlug({ slug: "Tiny Rack" })).toBe("tiny-rack");
  });

  it("converts common Ghost HTML to Markdown and rewrites images", () => {
    const result = convertGhostHtmlToMarkdown(
      `<h2>Intro</h2>
      <p>Hello <a href="https://tinyrack.net">Tinyrack</a>.</p>
      <ul><li>One</li><li>Two</li></ul>
      <figure class="kg-card kg-image-card">
        <img src="https://tinyrack.net/content/images/2026/01/device.png" alt="Device" />
        <figcaption>Device caption</figcaption>
      </figure>`,
      "https://tinyrack.net",
    );

    expect(result.markdown).toContain("## Intro");
    expect(result.markdown).toContain(
      "Hello [Tinyrack](https://tinyrack.net).",
    );
    expect(result.markdown).toContain("- One");
    expect(result.markdown).toContain("![Device](./images/device.png)");
    expect(result.markdown).toContain("Device caption");
    expect(result.images).toEqual([
      {
        sourceUrl: "https://tinyrack.net/content/images/2026/01/device.png",
        filename: "device.png",
      },
    ]);
  });
});
