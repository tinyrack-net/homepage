import { expect, test } from "@playwright/test";

test("theme choice persists after reload", async ({ page }) => {
  await page.goto("/en/");
  await page.locator("#global-drawer").evaluate((element) => {
    const input = element as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  const themeButton = page.getByRole("button", { name: /theme/i });

  await expect(themeButton).toBeVisible();
  await themeButton.click();
  await page.getByRole("button", { name: "Dark" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "black");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("theme-preference")))
    .toBe("dark");

  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "black");
});

test.describe("auto theme", () => {
  test.use({ colorScheme: "dark" });

  test("follows the system color scheme when auto is stored", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("theme-preference", "auto");
    });

    await page.goto("/en/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "black");
  });
});
