#!/usr/bin/env node
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  convertGhostHtmlToMarkdown,
  DEFAULT_GHOST_URL,
  discoverGhostContentApiKey,
  formatFrontmatter,
  isSystemGhostPage,
  mapGhostEntryToContent,
  normalizeGhostTagSlug,
} from "./lib/ghost-import.mjs";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const clean = args.has("--clean");
const siteUrl = process.env.GHOST_CONTENT_API_URL || DEFAULT_GHOST_URL;

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}

async function discoverApiKey() {
  if (process.env.GHOST_CONTENT_API_KEY) {
    return process.env.GHOST_CONTENT_API_KEY;
  }

  const response = await fetch(siteUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${siteUrl}: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();
  const key = discoverGhostContentApiKey(html);
  if (!key) {
    throw new Error(
      "Could not discover Ghost Content API key from public HTML.",
    );
  }
  return key;
}

async function fetchGhostCollection(resource, key) {
  const url = new URL(`/ghost/api/content/${resource}/`, siteUrl);
  url.searchParams.set("key", key);
  url.searchParams.set("include", "tags,authors");
  url.searchParams.set("formats", "html,plaintext");
  url.searchParams.set("limit", "all");
  const json = await fetchJson(url);
  return json[resource] ?? [];
}

async function downloadImage(image, directory) {
  const response = await fetch(image.sourceUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to download ${image.sourceUrl}: ${response.status} ${response.statusText}`,
    );
  }
  await mkdir(directory, { recursive: true });
  const filePath = path.join(directory, image.filename);
  await writeFile(filePath, Buffer.from(await response.arrayBuffer()));
}

async function writeEntry(entry, type) {
  const mapped = mapGhostEntryToContent(entry, type);
  const converted = convertGhostHtmlToMarkdown(entry.html ?? "", siteUrl);
  const outputDir = path.join("content", mapped.collection, mapped.slug);
  const imageDir = path.join(outputDir, "images");
  const featureImage = entry.feature_image
    ? (converted.images.find(
        (image) => image.sourceUrl === entry.feature_image,
      ) ?? {
        sourceUrl: entry.feature_image,
        filename: mapped.frontmatter.featureImage.replace("./images/", ""),
      })
    : undefined;
  const images = [...converted.images];

  if (
    featureImage &&
    !images.some((image) => image.sourceUrl === featureImage.sourceUrl)
  ) {
    images.push(featureImage);
  }

  if (featureImage) {
    mapped.frontmatter.featureImage = `./images/${featureImage.filename}`;
  }

  if (dryRun) {
    return { mapped, images };
  }

  await mkdir(outputDir, { recursive: true });
  await Promise.all(images.map((image) => downloadImage(image, imageDir)));
  await writeFile(
    path.join(outputDir, "ko.md"),
    `${formatFrontmatter(mapped.frontmatter)}${converted.markdown}\n`,
    "utf8",
  );

  return { mapped, images };
}

async function writeTags(tags) {
  const publicTags = tags
    .filter((tag) => tag.visibility !== "internal")
    .map((tag, index) => ({
      slug: normalizeGhostTagSlug(tag),
      name: tag.name || tag.slug,
      visibility: tag.visibility || "public",
      order: index + 1,
      translations: {
        en: {
          title: tag.name || tag.slug,
          description: tag.description || "",
        },
        ko: {
          title: tag.name || tag.slug,
          description: tag.description || "",
        },
      },
    }));

  if (dryRun) {
    return publicTags;
  }

  await mkdir("content/tags", { recursive: true });
  await Promise.all(
    publicTags.map((tag) =>
      writeFile(
        path.join("content", "tags", `${tag.slug}.json`),
        `${JSON.stringify(tag, null, 2)}\n`,
        "utf8",
      ),
    ),
  );
  return publicTags;
}

async function main() {
  const key = await discoverApiKey();
  const [posts, pages, tags] = await Promise.all([
    fetchGhostCollection("posts", key),
    fetchGhostCollection("pages", key),
    fetchGhostCollection("tags", key),
  ]);
  const realPages = pages.filter((page) => !isSystemGhostPage(page));
  const excludedPages = pages.filter(isSystemGhostPage);

  if (!dryRun && clean) {
    await Promise.all([
      rm("content/articles", { recursive: true, force: true }),
      rm("content/pages", { recursive: true, force: true }),
      rm("content/tags", { recursive: true, force: true }),
    ]);
  }

  const writtenPosts = await Promise.all(
    posts.map((post) => writeEntry(post, "post")),
  );
  const writtenPages = await Promise.all(
    realPages.map((page) => writeEntry(page, "page")),
  );
  const writtenTags = await writeTags(tags);
  const imageCount = [...writtenPosts, ...writtenPages].reduce(
    (count, entry) => count + entry.images.length,
    0,
  );

  console.log(
    JSON.stringify(
      {
        dryRun,
        posts: posts.length,
        pages: realPages.length,
        excludedPages: excludedPages.map((page) => page.slug),
        tags: writtenTags.map((tag) => tag.slug),
        images: imageCount,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
