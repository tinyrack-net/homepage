import { expect, type Page } from "@playwright/test";

export async function gotoHydrated(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
}
