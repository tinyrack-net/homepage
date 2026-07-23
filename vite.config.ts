import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";
import { remarkMedia } from "./app/content/remark-media.ts";
import { blogContent } from "./app/vite/blog-content.ts";

const appDir = fileURLToPath(new URL("./app", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": appDir,
    },
  },
  server: {
    host: true,
    port: 8432,
  },
  plugins: [
    blogContent(),
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMedia],
    }),
    reactRouter(),
    tailwindcss(),
  ],
});
