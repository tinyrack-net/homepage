/**
 * Copies the brand artwork out of @tinyrack/ui into `public/`.
 *
 * The logo has to live at a stable, unhashed URL: structured data points at it
 * absolutely, and the favicon and apple-touch-icon are referenced from the
 * document head. Bundling it through Vite would fingerprint the filename, so
 * it is copied as a static asset instead.
 *
 * The design system stays the source of truth — nothing here is hand-drawn,
 * and `--check` fails the build if `public/` has drifted from the package.
 *
 *   node scripts/sync-brand.mjs
 *   node scripts/sync-brand.mjs --check
 */

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const checkOnly = process.argv.includes("--check");

const packageRoot = dirname(require.resolve("@tinyrack/ui/package.json"));
const sourceDir = join(packageRoot, "dist/brand");
const publicDir = join(process.cwd(), "public");
const brandDir = join(publicDir, "brand");

/** Icons the document head references directly, copied to fixed names. */
const ICONS = [
  ["tinyrack-app-icon.svg", join(publicDir, "favicon.svg")],
  ["tinyrack-app-icon-180.png", join(publicDir, "apple-touch-icon.png")],
];

async function copy(sourceName, target) {
  const source = await readFile(join(sourceDir, sourceName));

  if (checkOnly) {
    const existing = await readFile(target).catch(() => null);
    if (existing === null || !existing.equals(source)) {
      console.error(`Brand asset is out of sync with @tinyrack/ui: ${target}`);
      return false;
    }
    return true;
  }

  await writeFile(target, source);
  return true;
}

await mkdir(brandDir, { recursive: true });

const artwork = (await readdir(sourceDir)).filter((name) =>
  name.endsWith(".svg"),
);
if (artwork.length === 0) {
  throw new Error(`No brand artwork found in ${sourceDir}`);
}

let ok = true;
for (const name of artwork.sort()) {
  ok = (await copy(name, join(brandDir, name))) && ok;
}
for (const [name, target] of ICONS) {
  ok = (await copy(name, target)) && ok;
}

if (!ok) {
  console.error("Run `pnpm sync:brand` to refresh.");
  process.exitCode = 1;
} else {
  console.log(
    checkOnly
      ? `Brand artwork matches @tinyrack/ui (${artwork.length + ICONS.length} files).`
      : `Synced ${artwork.length + ICONS.length} brand files.`,
  );
}
