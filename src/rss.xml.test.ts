import rss from "@astrojs/rss";
import { describe, expect, it, vi } from "vitest";
import { getAllArticles } from "./lib/content";
import { GET } from "./pages/rss.xml";

vi.mock("./lib/content", () => ({
  getAllArticles: vi.fn(),
}));

vi.mock("@astrojs/rss", () => ({
  default: vi.fn((input) => input),
}));

const getAllArticlesMock = vi.mocked(getAllArticles);
const rssMock = vi.mocked(rss);

describe("GET /rss.xml", () => {
  it("builds an RSS feed from English articles only", async () => {
    getAllArticlesMock.mockResolvedValue([
      {
        data: {
          lang: "en",
          title: "Browser Testing in Astro",
          excerpt: "Using Vitest browser mode",
          publishedAt: "2025-01-05",
          routeSlug: "browser-testing-in-astro",
        },
      },
      {
        data: {
          lang: "ko",
          title: "브라우저 테스트",
          excerpt: "한국어 포스트",
          publishedAt: "2025-01-06",
          routeSlug: "browser-testing-ko",
        },
      },
    ] as never);

    const result = await GET({
      site: new URL("https://winetree94.com"),
    } as never);

    expect(rssMock).toHaveBeenCalledOnce();
    expect(result).toMatchObject({
      site: new URL("https://winetree94.com"),
      items: [
        {
          title: "Browser Testing in Astro",
          description: "Using Vitest browser mode",
          link: "/en/article/browser-testing-in-astro/",
          pubDate: new Date("2025-01-05"),
        },
      ],
    });
  });
});
