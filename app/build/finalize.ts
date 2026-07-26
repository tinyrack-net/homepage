import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { planRoutes } from "../content/routes-plan.ts";
import { scanContent } from "../content/scan.ts";
import { SITE, SITE_DESCRIPTIONS, SITE_TITLES } from "../lib/constants.ts";
import { defaultLangCode } from "../lib/language.ts";
import { getContentPath } from "../lib/routes.ts";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function copyMedia(root: string, clientDir: string): void {
  const contentDir = join(root, "content");
  for (const collection of ["articles", "pages"] as const) {
    const collectionDir = join(contentDir, collection);
    if (!existsSync(collectionDir)) {
      continue;
    }
    for (const group of readdirSync(collectionDir, { withFileTypes: true })) {
      if (!group.isDirectory()) {
        continue;
      }
      const attachments = join(collectionDir, group.name, "attachments");
      if (!existsSync(attachments)) {
        continue;
      }
      const dest = join(clientDir, "media", collection, group.name);
      mkdirSync(dest, { recursive: true });
      for (const file of readdirSync(attachments, { withFileTypes: true })) {
        if (file.isFile()) {
          copyFileSync(join(attachments, file.name), join(dest, file.name));
        }
      }
    }
  }
}

function writeRss(root: string, clientDir: string): void {
  const { articles } = scanContent(root);
  const items = articles
    .filter((entry) => !entry.data.draft && entry.data.lang === defaultLangCode)
    .sort(
      (a, b) =>
        new Date(b.data.publishedAt).getTime() -
        new Date(a.data.publishedAt).getTime(),
    )
    .map((entry) => {
      const link = `${SITE}${getContentPath(defaultLangCode, entry.data.routeSlug)}`;
      const pubDate = entry.data.publishedAt
        ? new Date(entry.data.publishedAt).toUTCString()
        : "";
      return [
        "    <item>",
        `      <title>${escapeXml(entry.data.title)}</title>`,
        `      <description>${escapeXml(entry.data.excerpt)}</description>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid>${escapeXml(link)}</guid>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  // Feed readers show the channel image beside the feed name.
  const channelImage = `${SITE}/brand/tinyrack-app-icon.svg`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_TITLES[defaultLangCode])}</title>
    <description>${escapeXml(SITE_DESCRIPTIONS[defaultLangCode])}</description>
    <link>${SITE}/</link>
    <image>
      <url>${escapeXml(channelImage)}</url>
      <title>${escapeXml(SITE_TITLES[defaultLangCode])}</title>
      <link>${SITE}/</link>
    </image>
${items}
  </channel>
</rss>
`;
  writeFileSync(join(clientDir, "rss.xml"), xml, "utf8");
}

function writeSitemap(root: string, clientDir: string): void {
  const manifest = scanContent(root);
  const urls = planRoutes(manifest)
    // Listing pages past the first hold no unique content of their own, so
    // only the canonical first page is submitted.
    .filter((entry) => (entry.page ?? 1) === 1)
    .map(
      (entry) => `  <url><loc>${escapeXml(`${SITE}${entry.path}`)}</loc></url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  writeFileSync(join(clientDir, "sitemap.xml"), xml, "utf8");
}

function writeRobots(clientDir: string): void {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;
  writeFileSync(join(clientDir, "robots.txt"), robots, "utf8");
}

/** Provide a 404.html for Cloudflare's `not_found_handling: "404-page"`. */
function writeNotFound(clientDir: string): void {
  const fallback = join(clientDir, "__spa-fallback.html");
  const target = join(clientDir, "404.html");
  if (existsSync(fallback)) {
    writeFileSync(target, readFileSync(fallback, "utf8"), "utf8");
  }
}

export async function finalizeBuild({
  root,
  clientDir,
}: {
  root: string;
  clientDir: string;
}): Promise<void> {
  copyMedia(root, clientDir);
  writeRss(root, clientDir);
  writeSitemap(root, clientDir);
  writeRobots(clientDir);
  writeNotFound(clientDir);
}
