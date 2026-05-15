import { expect, test } from "@playwright/test";

test("project tag page lists articles and navigates to detail", async ({
  page,
}) => {
  await page.goto("/en/tags/project/");

  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();

  const articleLink = page.getByRole("link", {
    name: /Vector Optimizer: Enhancing Natural Pen Input/i,
  });

  await expect(articleLink).toBeVisible();
  await articleLink.click();

  await expect(page).toHaveURL("/en/article/vector-optimizer/");
  await expect(
    page.getByRole("heading", {
      name: "Vector Optimizer: Enhancing Natural Pen Input",
    }),
  ).toBeVisible();
});
