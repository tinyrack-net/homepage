import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { SITE_DESCRIPTION, SITE_TITLE } from "../libs/constants";
import { getAllArticles } from "../lib/content";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("Astro site is required for RSS generation.");
  }

  const enPosts = (await getAllArticles()).filter(
    (post) => post.data.lang === "en",
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,
    items: enPosts.map((post) => {
      return {
        title: post.data.title,
        description: post.data.excerpt,
        pubDate: new Date(post.data.publishedAt),
        link: `/en/article/${post.data.routeSlug}/`,
      };
    }),
  });
};
