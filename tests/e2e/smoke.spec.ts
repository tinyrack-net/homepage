import { expect, test } from "@playwright/test";

test("English home renders at the unprefixed root", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Tinyrack");
  await expect(
    page.getByRole("heading", { level: 2, name: "Latest" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /I Made a Forum/ }),
  ).toBeVisible();
});

test("localized home renders under its prefix", async ({ page }) => {
  await page.goto("/ko/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
});

test("article renders with content and alternate-language links", async ({
  page,
}) => {
  await page.goto("/openterface-mini-kvm/");
  await expect(page.locator("article h1.text-tinyrack-4xl")).toContainText(
    "Openterface",
  );
  await expect(
    page.locator('a[href="/ja/openterface-mini-kvm/"]'),
  ).toBeVisible();
  await expect(
    page.locator('a[href="/ko/openterface-mini-kvm/"]'),
  ).toBeVisible();
  await expect(page.locator(".tr-mdx img").first()).toBeVisible();
});

test("tag listing renders", async ({ page }) => {
  await page.goto("/tag/hardware/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("theme preference persists across reloads", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    window.localStorage.setItem("theme-preference", "dark"),
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "tinyrack-dark",
  );
});

test("feeds and crawler files are served", async ({ request }) => {
  const rss = await request.get("/rss.xml");
  expect(rss.ok()).toBeTruthy();
  expect(await rss.text()).toContain("<rss");

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain(
    "Sitemap: https://tinyrack.net/sitemap.xml",
  );

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("<urlset");
});
