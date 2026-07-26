import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { Plugin } from "vite";

const require = createRequire(import.meta.url);

const ICONS = [
  ["tinyrack-app-icon.svg", "favicon.svg"],
  ["tinyrack-app-icon-180.png", "apple-touch-icon.png"],
] as const;

async function copyAsset(
  sourceDir: string,
  publicDir: string,
  sourceName: string,
  targetName: string,
): Promise<void> {
  const source = await readFile(join(sourceDir, sourceName));
  const target = join(publicDir, targetName);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, source);
}

async function syncBrandAssets(root: string): Promise<void> {
  const packageRoot = dirname(require.resolve("@tinyrack/ui/package.json"));
  const sourceDir = join(packageRoot, "dist/brand");
  const publicDir = join(root, "public");
  const brandDir = join(publicDir, "brand");
  const artwork = (await readdir(sourceDir)).filter((name) =>
    name.endsWith(".svg"),
  );

  if (artwork.length === 0) {
    throw new Error(`No brand artwork found in ${sourceDir}`);
  }

  await Promise.all(
    artwork.map((name) => copyAsset(sourceDir, brandDir, name, name)),
  );
  await Promise.all(
    ICONS.map(([sourceName, targetName]) =>
      copyAsset(sourceDir, publicDir, sourceName, targetName),
    ),
  );
}

/** Keep stable, unhashed brand URLs synchronized before Vite serves or builds. */
export function brandAssets(): Plugin {
  let root = process.cwd();

  return {
    name: "tinyrack-brand-assets",

    configResolved(config) {
      root = config.root;
    },

    buildStart() {
      return syncBrandAssets(root);
    },
  };
}
