import { expect, type Page, test } from "@playwright/test";

async function getBodyFontFamily(page: Page) {
  return page.evaluate(() => getComputedStyle(document.body).fontFamily);
}

test("root route renders the Tinyrack home page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/Tinyrack/i);
  await expect(
    page.getByRole("heading", { name: "Tinyrack", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Homelab hardware and software reviews, news"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /Another Tiny Open-Source KVM: Openterface/i,
    }),
  ).toBeVisible();

  await page.reload();

  await expect(page).toHaveURL("/");
});

test("prefixed Korean home page renders Korean content", async ({ page }) => {
  await page.goto("/ko/");

  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(
    page.getByRole("heading", { name: "타이니랙", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /또 다른 작은 오픈소스 KVM, Openterface/i }),
  ).toBeVisible();
});

test("home page does not render a Products section", async ({ page }) => {
  await page.goto("/");

  const main = page.locator("main");

  await expect(main.getByRole("heading", { name: "Products" })).toHaveCount(0);
});

test("pages apply the language-specific font stack", async ({ page }) => {
  await page.goto("/");

  await expect.poll(() => getBodyFontFamily(page)).toContain("Agave");
});

test("pages render the expected language-specific font links", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.locator(
      'head link[rel="preload"][as="font"][href="/fonts/Agave-Regular.ttf"]',
    ),
  ).toHaveCount(1);
  await expect(
    page.locator(
      'head link[rel="preload"][as="font"][href="/fonts/Agave-Bold.ttf"]',
    ),
  ).toHaveCount(1);
  await expect(page.locator('head link[href*="IBM+Plex+Sans+KR"]')).toHaveCount(
    0,
  );
});
