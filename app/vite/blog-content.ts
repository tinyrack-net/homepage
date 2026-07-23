import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import type { Plugin } from "vite";
import { scanContent } from "../content/scan.ts";

const MANIFEST_ID = "virtual:blog/manifest";
const RESOLVED_MANIFEST_ID = `\0${MANIFEST_ID}`;

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

/** `/media/<collection>/<slug>/<file>` → `content/<collection>/<slug>/attachments/<file>` */
function mediaUrlToFile(root: string, url: string): string | null {
  const match = /^\/media\/(articles|pages)\/([^/]+)\/([^/?#]+)/.exec(url);
  if (!match) {
    return null;
  }
  const [, collection, slug, file] = match;
  if (!collection || !slug || !file) {
    return null;
  }
  return join(root, "content", collection, slug, "attachments", file);
}

export function blogContent(): Plugin {
  let root = process.cwd();

  return {
    name: "blog-content",

    configResolved(config) {
      root = config.root;
    },

    resolveId(id) {
      if (id === MANIFEST_ID) {
        return RESOLVED_MANIFEST_ID;
      }
      return null;
    },

    load(id) {
      if (id === RESOLVED_MANIFEST_ID) {
        const manifest = scanContent(root);
        return `export const manifest = ${JSON.stringify(manifest)};`;
      }
      return null;
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/media/")) {
          next();
          return;
        }
        const file = mediaUrlToFile(root, req.url);
        if (!file || !existsSync(file) || !statSync(file).isFile()) {
          next();
          return;
        }
        res.setHeader(
          "Content-Type",
          MIME[extname(file).toLowerCase()] ?? "application/octet-stream",
        );
        res.setHeader("Cache-Control", "public, max-age=3600");
        createReadStream(file).pipe(res);
      });
    },
  };
}
