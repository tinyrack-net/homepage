import path from "node:path";
import TurndownService from "turndown";

export const DEFAULT_GHOST_URL = "https://tinyrack.net";
export const DEFAULT_LANG = "ko";

const SYSTEM_PAGE_SLUGS = new Set(["", "/", "^", "index"]);

function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(text = "") {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function slugify(value = "") {
  return (
    value
      .toString()
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-+|-+$/g, "") || "untagged"
  );
}

function uniqueImageFilename(sourceUrl, usedFilenames) {
  const url = new URL(sourceUrl);
  const parsed = path.posix.parse(decodeURIComponent(url.pathname));
  const base = slugify(parsed.name) || "image";
  const ext = parsed.ext || ".jpg";
  let filename = `${base}${ext}`;
  let index = 2;

  while (usedFilenames.has(filename)) {
    filename = `${base}-${index}${ext}`;
    index += 1;
  }

  usedFilenames.add(filename);
  return filename;
}

function normalizeImageUrl(rawUrl, siteUrl) {
  if (!rawUrl) {
    return undefined;
  }

  try {
    return new URL(rawUrl, siteUrl).href;
  } catch {
    return undefined;
  }
}

function extractImageUrls(html, siteUrl) {
  const urls = [];
  const seen = new Set();
  const imagePattern = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  let match = imagePattern.exec(html);

  while (match) {
    const normalized = normalizeImageUrl(match[1], siteUrl);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      urls.push(normalized);
    }
    match = imagePattern.exec(html);
  }

  return urls;
}

export function isSystemGhostPage(page) {
  return SYSTEM_PAGE_SLUGS.has((page.slug ?? "").trim());
}

export function normalizeGhostTagSlug(tag) {
  return slugify(tag.slug || tag.name || "untagged");
}

export function convertGhostHtmlToMarkdown(
  html = "",
  siteUrl = DEFAULT_GHOST_URL,
) {
  const usedFilenames = new Set();
  const images = extractImageUrls(html, siteUrl).map((sourceUrl) => ({
    sourceUrl,
    filename: uniqueImageFilename(sourceUrl, usedFilenames),
  }));
  let rewrittenHtml = html;

  for (const image of images) {
    const escaped = image.sourceUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    rewrittenHtml = rewrittenHtml.replace(
      new RegExp(escaped, "g"),
      `./images/${image.filename}`,
    );
  }

  const turndown = new TurndownService({
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    headingStyle: "atx",
  });
  turndown.keep(["iframe", "table"]);
  turndown.addRule("ghostBookmarkCard", {
    filter: (node) => {
      return (
        node.nodeName === "FIGURE" &&
        node.className?.includes("kg-bookmark-card")
      );
    },
    replacement: (_content, node) => {
      const anchor = node.querySelector?.("a[href]");
      const title = stripHtml(
        node.querySelector?.(".kg-bookmark-title")?.innerHTML ?? "",
      );
      const href = anchor?.getAttribute("href") ?? "";
      return href ? `\n\n[${title || href}](${href})\n\n` : "";
    },
  });

  return {
    markdown: turndown
      .turndown(rewrittenHtml)
      .replace(/^- {3}/gm, "- ")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
    images,
  };
}

export function mapGhostEntryToContent(entry, type) {
  const slug = entry.slug;
  const frontmatter = {
    title: decodeHtml(entry.title || slug),
    excerpt: decodeHtml(entry.excerpt || stripHtml(entry.html).slice(0, 160)),
    lang: DEFAULT_LANG,
    routeSlug: slug,
    translationKey: slug,
  };

  if (entry.feature_image) {
    frontmatter.featureImage = `./images/${uniqueImageFilename(
      entry.feature_image,
      new Set(),
    )}`;
  }

  if (entry.updated_at) {
    frontmatter.updatedAt = entry.updated_at;
  }

  if (type === "post") {
    frontmatter.publishedAt = entry.published_at;
    frontmatter.commentsTerm =
      entry.comment_id || entry.uuid || entry.id || slug;
    frontmatter.tags = (entry.tags ?? [])
      .filter((tag) => tag.visibility !== "internal")
      .map(normalizeGhostTagSlug);
  }

  return {
    collection: type === "post" ? "articles" : "pages",
    slug,
    frontmatter,
    html: entry.html || "",
  };
}

export function discoverGhostContentApiKey(html) {
  return html.match(/data-key=["']([^"']+)["']/)?.[1];
}

export function formatFrontmatter(frontmatter) {
  const lines = ["---"];

  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${JSON.stringify(item)}`);
      }
    } else if (typeof value === "boolean" || typeof value === "number") {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }

  lines.push("---", "");
  return lines.join("\n");
}
