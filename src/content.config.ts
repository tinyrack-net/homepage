import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const languageSchema = z.enum(["en", "ko"]);

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/articles" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string().default(""),
      lang: languageSchema,
      routeSlug: z.string(),
      translationKey: z.string(),
      publishedAt: z.string(),
      updatedAt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      featureImage: image().optional(),
      commentsTerm: z.string(),
      draft: z.boolean().optional().default(false),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/pages" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string().default(""),
      lang: languageSchema,
      routeSlug: z.string(),
      translationKey: z.string(),
      featureImage: image().optional(),
      updatedAt: z.string().optional(),
    }),
});

const tags = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./content/tags" }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    visibility: z.enum(["public", "internal"]).optional(),
    order: z.number().optional(),
    translations: z.object({
      en: z.object({
        title: z.string(),
        description: z.string().default(""),
      }),
      ko: z.object({
        title: z.string(),
        description: z.string().default(""),
      }),
    }),
  }),
});

export const collections = {
  articles,
  pages,
  tags,
};
