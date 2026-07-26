/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { JSX } from "react";

  export default function MdxContent(
    props: Record<string, unknown>,
  ): JSX.Element;
}

declare module "virtual:blog/manifest" {
  // Inline import: a top-level `import type` inside an ambient module block
  // does not resolve here, and `skipLibCheck` hides that failure, which
  // silently degraded the manifest to `any`.
  export const manifest: import("./lib/content-types.ts").BlogManifest;
}
