// Captures the mobile navigation drawer open, in both color schemes.
// Usage: node scripts/shoot-drawer.mjs [baseUrl]

import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://localhost:4601";
const outDir = join(".screenshots", "drawer");
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

for (const theme of ["light", "dark"]) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  await context.addInitScript(
    `localStorage.setItem("theme-preference", ${JSON.stringify(theme)})`,
  );
  await context.route("**://www.googletagmanager.com/**", (route) =>
    route.abort(),
  );
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("dialog").waitFor();
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(outDir, `open--${theme}.png`) });
  await context.close();
}

await browser.close();
console.log("drawer captured");
