import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getAllArticles } from "../lib/content";
import { defaultLangCode } from "../lib/language";
import { getContentPath } from "../lib/routes";
import { SITE_DESCRIPTIONS, SITE_TITLES } from "../libs/constants";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("Astro site is required for RSS generation.");
  }

  const posts = (await getAllArticles()).filter(
    (post) => post.data.lang === defaultLangCode,
  );

  return rss({
    title: SITE_TITLES[defaultLangCode],
    description: SITE_DESCRIPTIONS[defaultLangCode],
    site,
    items: posts.map((post) => {
      return {
        title: post.data.title,
        description: post.data.excerpt,
        pubDate: new Date(post.data.publishedAt),
        link: getContentPath(defaultLangCode, post.data.routeSlug),
      };
    }),
  });
};
