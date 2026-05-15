import { expect, test } from "@playwright/test";

test("about page renders in English and links to Korean", async ({ page }) => {
  await page.goto("/en/about/");

  await expect(page).toHaveTitle(/@winetree94/i);
  await expect(
    page.getByText("My day job is mainly front-end web development.").first(),
  ).toBeVisible();

  await page.getByRole("link", { name: "한국어" }).click();

  await expect(page).toHaveURL("/ko/about/");
  await expect(
    page
      .getByText("저의 회사에서의 직무는 주로 웹의 프론트엔트 개발이에요.")
      .first(),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "English" })).toBeVisible();
});
