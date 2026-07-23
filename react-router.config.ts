import { join } from "node:path";
import type { Config } from "@react-router/dev/config";
import { finalizeBuild } from "./app/build/finalize.ts";
import { planRoutes } from "./app/content/routes-plan.ts";
import { scanContent } from "./app/content/scan.ts";

export default {
  ssr: false,
  prerender() {
    const manifest = scanContent(process.cwd());
    return planRoutes(manifest).map((entry) => entry.path);
  },
  async buildEnd({ reactRouterConfig, viteConfig }) {
    const clientDir = join(reactRouterConfig.buildDirectory, "client");
    await finalizeBuild({ root: viteConfig.root, clientDir });
  },
} satisfies Config;
