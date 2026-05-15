import { expect, type Page, test } from "@playwright/test";

async function openDrawer(page: Page) {
  await page.locator("#global-drawer").evaluate((element) => {
    const input = element as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

test.describe("Language switching state retention", () => {
  test("maintains the current page when switching languages on a general page", async ({ page }) => {
    await page.goto("/en/resume/");
    
    // Open drawer
    await openDrawer(page);
    
    // Click language switcher
    await page.getByRole("button", { name: /English|한국어/ }).click();
    
    // Switch to Korean (specifically in the drawer)
    await page.locator(".drawer-side").getByRole("link", { name: "한국어" }).click();
    
    await expect(page).toHaveURL("/ko/resume/");
  });

  test("maintains the current page when switching languages on an article with translations", async ({ page }) => {
    // Vector Optimizer has both en and ko versions
    await page.goto("/en/article/vector-optimizer/");
    
    await openDrawer(page);
    await page.getByRole("button", { name: /English|한국어/ }).click();
    await page.locator(".drawer-side").getByRole("link", { name: "한국어" }).click();
    
    await expect(page).toHaveURL("/ko/article/vector-optimizer/");
  });

  test("redirects to index when switching to a language that doesn't have a translation for the current article", async ({ page }) => {
    // 'es5-class' only has 'ko' version
    await page.goto("/ko/article/es5-class/");
    
    await openDrawer(page);
    await page.getByRole("button", { name: /English|한국어/ }).click();
    
    // Switch to English
    await page.locator(".drawer-side").getByRole("link", { name: "English" }).click();
    
    // Should fallback to /en/ because es5-class doesn't have an en version
    await expect(page).toHaveURL("/en/");
  });

  test("maintains tag page when switching languages", async ({ page }) => {
    await page.goto("/en/tags/project/");
    
    await openDrawer(page);
    await page.getByRole("button", { name: /English|한국어/ }).click();
    await page.locator(".drawer-side").getByRole("link", { name: "한국어" }).click();
    
    await expect(page).toHaveURL("/ko/tags/project/");
  });
});
