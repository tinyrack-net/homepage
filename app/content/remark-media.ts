import { basename } from "node:path";
import { visit } from "unist-util-visit";

/** Matches a `content/<collection>/<slug>/...` file path (posix or win32). */
const CONTENT_PATH = /content[\\/](articles|pages)[\\/]([^\\/]+)[\\/]/;

/**
 * Remark plugin: rewrite content-relative image references
 * (`./attachments/foo.png`) to their public `/media/<collection>/<slug>/foo.png`
 * URL, so the static media server / build copy can serve them.
 */
export function remarkMedia() {
  return (tree: unknown, file: { path?: string }) => {
    const match = file.path ? CONTENT_PATH.exec(file.path) : null;
    if (!match) {
      return;
    }
    const [, collection, slug] = match;

    visit(
      tree as Parameters<typeof visit>[0],
      "image",
      (node: { url?: string }) => {
        if (!node.url) {
          return;
        }
        if (/^(https?:)?\/\//.test(node.url) || node.url.startsWith("/")) {
          return;
        }
        node.url = `/media/${collection}/${slug}/${basename(node.url)}`;
      },
    );
  };
}
