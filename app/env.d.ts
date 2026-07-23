/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { JSX } from "react";

  export default function MdxContent(
    props: Record<string, unknown>,
  ): JSX.Element;
}

declare module "virtual:blog/manifest" {
  import type { BlogManifest } from "./lib/content-types.ts";

  export const manifest: BlogManifest;
}
