import { expect, test } from "@playwright/test";

test("about page renders from imported Ghost page", async ({ page }) => {
  await page.goto("/about/");

  await expect(page).toHaveTitle(/환영해요/i);
  await expect(
    page
      .getByText(
        "tinyrack.net 은 홈랩에 대한 뉴스와 리뷰 컨텐츠를 제공하는 사이트입니다.",
      )
      .first(),
  ).toBeVisible();
  await expect(page.getByText("contact@tinyrack.net")).toBeVisible();
});

test("translated about pages render on language-prefixed routes", async ({
  page,
}) => {
  await page.goto("/en/about/");
  await expect(page).toHaveTitle(/Welcome/i);
  await expect(
    page.getByText("tinyrack.net provides homelab news and reviews.").first(),
  ).toBeVisible();

  await page.goto("/ja/about/");
  await expect(page).toHaveTitle(/ようこそ/i);
  await expect(
    page
      .getByText(
        "tinyrack.net はホームラボのニュースとレビューを提供するサイトです。",
      )
      .first(),
  ).toBeVisible();
});
