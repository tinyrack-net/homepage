import { expect, type Page, test } from "@playwright/test";

async function openDrawer(page: Page) {
  await page.locator("#global-drawer").evaluate((element) => {
    const input = element as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

test("drawer navigation links open the expected Tinyrack pages", async ({
  page,
}) => {
  await page.goto("/");

  await openDrawer(page);
  await page.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL("/about/");
});

test("drawer omits redundant Tinyrack and Contents navigation", async ({
  page,
}) => {
  await page.goto("/");

  await openDrawer(page);

  const drawer = page.locator(".drawer-side");
  await expect(drawer.getByText("Contents", { exact: true })).toHaveCount(0);
  await expect(
    drawer.getByRole("link", { name: "tinyrack", exact: true }),
  ).toHaveCount(0);
  await expect(drawer.locator('a[href="https://tinyrack.net"]')).toHaveCount(0);
});

test("drawer includes winetree94 profile link", async ({ page }) => {
  await page.goto("/");

  await openDrawer(page);

  const profileLink = page
    .locator(".drawer-side")
    .getByRole("link", { name: "winetree94", exact: true });
  await expect(profileLink).toBeVisible();
  await expect(profileLink).toHaveAttribute("href", "https://winetree94.com");
});

test("drawer includes product links", async ({ page }) => {
  await page.goto("/");

  await openDrawer(page);

  const drawer = page.locator(".drawer-side");
  await expect(drawer.getByText("Products", { exact: true })).toBeVisible();

  const dotweaveLink = drawer.getByRole("link", {
    name: "Dotweave",
    exact: true,
  });
  await expect(dotweaveLink).toBeVisible();
  await expect(dotweaveLink).toHaveAttribute(
    "href",
    "https://dotweave.tinyrack.net",
  );

  const proxerLink = drawer.getByRole("link", {
    name: "Proxer",
    exact: true,
  });
  await expect(proxerLink).toBeVisible();
  await expect(proxerLink).toHaveAttribute(
    "href",
    "https://proxer.tinyrack.net",
  );
});

test("drawer language selector navigates equivalent routes", async ({
  page,
}) => {
  await page.goto("/openterface-mini-kvm/");
  await openDrawer(page);

  const drawer = page.locator(".drawer-side");
  await expect(drawer.getByRole("button", { name: /한국어/ })).toBeVisible();
  await drawer.getByRole("button", { name: /한국어/ }).click();
  await drawer.getByRole("link", { name: "English" }).click();

  await expect(page).toHaveURL("/en/openterface-mini-kvm/");

  await openDrawer(page);
  await expect(drawer.getByRole("button", { name: /English/ })).toBeVisible();
  await drawer.getByRole("button", { name: /English/ }).click();
  await drawer.getByRole("link", { name: "日本語" }).click();

  await expect(page).toHaveURL("/ja/openterface-mini-kvm/");

  await openDrawer(page);
  await drawer.getByRole("button", { name: /日本語/ }).click();
  await drawer.getByRole("link", { name: "한국어" }).click();

  await expect(page).toHaveURL("/openterface-mini-kvm/");
});

test("drawer closes and public tag badges navigate to tag pages", async ({
  page,
}) => {
  await page.goto("/");

  await openDrawer(page);
  await expect(page.locator("#global-drawer")).toBeChecked();
  await page.getByLabel("close sidebar").click();
  await expect(page.locator("#global-drawer")).not.toBeChecked();

  await openDrawer(page);
  await page.locator('a.badge.badge-soft[href="/tag/news/"]').click();

  await expect(page).toHaveURL("/tag/news/");
  await expect(page.getByRole("heading", { name: "News" })).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /타이니랙 인프라를 클라우드로 이전했어요/i,
    }),
  ).toBeVisible();
});
