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

test("home page renders product links with descriptions", async ({ page }) => {
  await page.goto("/");

  const products = page.locator("section", {
    has: page.getByRole("heading", { name: "Products" }),
  });

  await expect(
    products.getByText(
      "Git 기반으로 개발 환경 설정과 dotfiles를 여러 기기에서 동기화하는 CLI 도구입니다.",
    ),
  ).toBeVisible();
  await expect(
    products.getByText(
      "로컬 개발 서버를 안전하게 외부에 공유하는 리버스 터널링 도구입니다.",
    ),
  ).toBeVisible();

  const dotweaveLink = products.getByRole("link", {
    name: /Dotweave/,
  });
  await expect(dotweaveLink).toBeVisible();
  await expect(dotweaveLink).toHaveAttribute(
    "href",
    "https://dotweave.tinyrack.net",
  );

  const proxerLink = products.getByRole("link", {
    name: /Proxer/,
  });
  await expect(proxerLink).toBeVisible();
  await expect(proxerLink).toHaveAttribute(
    "href",
    "https://proxer.tinyrack.net",
  );
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
