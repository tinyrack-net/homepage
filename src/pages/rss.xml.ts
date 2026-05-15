import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getAllArticles } from "../lib/content";
import { SITE_DESCRIPTION, SITE_TITLE } from "../libs/constants";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("Astro site is required for RSS generation.");
  }

  const koPosts = (await getAllArticles()).filter(
    (post) => post.data.lang === "ko",
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,
    items: koPosts.map((post) => {
      return {
        title: post.data.title,
        description: post.data.excerpt,
        pubDate: new Date(post.data.publishedAt),
        link: `/${post.data.routeSlug}/`,
      };
    }),
  });
};
