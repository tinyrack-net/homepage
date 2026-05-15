import { expect, type Page, test } from "@playwright/test";

async function getBodyFontFamily(page: Page) {
  return page.evaluate(() => getComputedStyle(document.body).fontFamily);
}

test("root route renders the Tinyrack home page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL("/");
  await expect(page).toHaveTitle(/타이니랙/i);
  await expect(
    page.getByRole("heading", { name: "타이니랙", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /또 다른 작은 오픈소스 KVM, Openterface/i }),
  ).toBeVisible();

  await page.reload();

  await expect(page).toHaveURL("/");
});

test("pages apply the language-specific font stack", async ({ page }) => {
  await page.goto("/");

  await expect
    .poll(() => getBodyFontFamily(page))
    .toContain("IBM Plex Sans KR");
});

test("pages render the expected language-specific font links", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.locator(
      'head link[rel="preconnect"][href="https://fonts.googleapis.com"]',
    ),
  ).toHaveCount(1);
  await expect(
    page.locator(
      'head link[rel="preconnect"][href="https://fonts.gstatic.com"][crossorigin="anonymous"]',
    ),
  ).toHaveCount(1);
  await expect(
    page.locator(
      'head link[rel="preload"][as="style"][href*="IBM+Plex+Sans+KR"]',
    ),
  ).toHaveCount(1);
  await expect(
    page.locator('head link[rel="stylesheet"][href*="IBM+Plex+Sans+KR"]'),
  ).toHaveCount(1);
});
