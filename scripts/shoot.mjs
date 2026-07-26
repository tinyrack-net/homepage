// Screenshot matrix helper for the homepage rebuild.
// Usage: node scripts/shoot.mjs <label> [baseUrl]
// Captures every route in ROUTES across viewport x theme, into .screenshots/<label>/.

import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const label = process.argv[2];
const baseUrl = process.argv[3] ?? "http://localhost:8432";

if (!label) {
  console.error("usage: node scripts/shoot.mjs <label> [baseUrl]");
  process.exit(1);
}

const ROUTES = [
  ["home", "/"],
  ["home-ko", "/ko/"],
  ["home-ja", "/ja/"],
  ["blog", "/blog/"],
  ["blog-ko", "/ko/blog/"],
  ["about", "/about/"],
  ["about-ko", "/ko/about/"],
  ["article", "/openterface-mini-kvm/"],
  ["article-ko", "/ko/openterface-mini-kvm/"],
  ["tag", "/tag/hardware/"],
  ["tag-news", "/tag/news/"],
  ["notfound", "/does-not-exist/"],
];

const VIEWPORTS = [
  ["desktop", 1440, 900],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
];

const THEMES = ["light", "dark"];

const outDir = join(".screenshots", label);
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const [vpName, width, height] of VIEWPORTS) {
  for (const theme of THEMES) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    // Seed the theme the way app/lib/theme.ts persists it, before any script runs.
    await context.addInitScript(
      `localStorage.setItem("theme-preference", ${JSON.stringify(theme)})`,
    );
    // GTM is irrelevant to layout and slows every navigation down.
    await context.route("**://www.googletagmanager.com/**", (route) =>
      route.abort(),
    );
    const page = await context.newPage();

    for (const [routeName, path] of ROUTES) {
      const url = `${baseUrl}${path}`;
      const file = join(outDir, `${routeName}--${vpName}--${theme}.png`);
      try {
        const response = await page.goto(url, {
          waitUntil: "networkidle",
          timeout: 30000,
        });
        const status = response?.status() ?? 0;
        await page.waitForTimeout(300);
        await page.screenshot({ path: file, fullPage: true });
        results.push({ routeName, vpName, theme, status, file });
      } catch (error) {
        results.push({
          routeName,
          vpName,
          theme,
          error: String(error.message ?? error),
        });
      }
    }

    await context.close();
  }
}

await browser.close();

// The 404 route is expected to answer 404; everything else must be under 400.
const failed = results.filter(
  (r) => r.error || (r.status && r.status >= 400 && r.routeName !== "notfound"),
);
for (const r of failed) {
  console.error(
    `FAIL ${r.routeName} ${r.vpName} ${r.theme}: ${r.error ?? `HTTP ${r.status}`}`,
  );
}
console.log(
  `captured ${results.length - failed.length}/${results.length} into ${outDir}`,
);
if (failed.length > 0) {
  process.exitCode = 1;
}
