import { expect, type Page, test } from "@playwright/test";

async function openDrawer(page: Page) {
  await page.locator("#global-drawer").evaluate((element) => {
    const input = element as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

test("drawer navigation links open the expected localized pages", async ({
  page,
}) => {
  await page.goto("/en/");

  await openDrawer(page);
  await page.getByRole("link", { name: "Resume" }).click();
  await expect(page).toHaveURL("/en/resume/");

  await openDrawer(page);
  await page.getByRole("link", { name: "About Me" }).click();
  await expect(page).toHaveURL("/en/about/");

  await openDrawer(page);
  await page.getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL("/en/tags/project/");

  await openDrawer(page);
  await page.getByRole("link", { name: "Blog" }).click();
  await expect(page).toHaveURL("/en/tags/blog/");
});

test("drawer closes and public tag badges navigate to tag pages", async ({
  page,
}) => {
  await page.goto("/en/");

  await openDrawer(page);
  await expect(page.locator("#global-drawer")).toBeChecked();
  await page.getByLabel("close sidebar").click();
  await expect(page.locator("#global-drawer")).not.toBeChecked();

  await openDrawer(page);
  await page.locator('a.badge.badge-soft[href="/en/tags/python/"]').click();

  await expect(page).toHaveURL("/en/tags/python/");
  await expect(page.getByRole("heading", { name: "python" })).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /I Wish Google Assistant Were Smarter, Introducing GPT Voice Assistant/i,
    }),
  ).toBeVisible();
});
