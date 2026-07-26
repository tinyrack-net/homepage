import { expect, test } from "@playwright/test";

test("landing page renders at the unprefixed root", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Tinyrack");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // The brand sections, not an article list.
  await expect(
    page.getByRole("heading", { level: 2, name: "Open-source tools" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Latest" }),
  ).toBeVisible();
});

test("localized home renders under its prefix", async ({ page }) => {
  await page.goto("/ko/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
});

test("header links the blog and marks it active", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Blog" })
    .first()
    .click();
  await expect(page).toHaveURL("/blog/");
  await expect(
    page.getByRole("link", { name: /I Made a Forum/ }),
  ).toBeVisible();
});

test("blog index lists articles for its locale", async ({ page }) => {
  await page.goto("/blog/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Blog" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Openterface/ })).toBeVisible();
});

test("every locale has a reachable blog index", async ({ page }) => {
  for (const path of ["/blog/", "/ko/blog/", "/ja/blog/"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
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

test("switching language from the blog stays on a real page", async ({
  page,
}) => {
  await page.goto("/blog/");
  const response = await page.goto("/ko/blog/");
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
});

test("mobile menu opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "About" })).toBeVisible();
  await page.getByRole("button", { name: "Close menu" }).click();
  await expect(dialog).toBeHidden();
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
  const body = await sitemap.text();
  expect(body).toContain("<urlset");
  expect(body).toContain("<loc>https://tinyrack.net/blog/</loc>");
  // Paginated listings are deliberately left out of the sitemap.
  expect(body).not.toContain("/blog/page/");
});
