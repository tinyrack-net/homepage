import { expect, test } from "@playwright/test";

test("default article page renders English metadata", async ({ page }) => {
  await page.goto("/openterface-mini-kvm/");

  await expect(page).toHaveTitle(/Openterface/i);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", {
      name: "Another Tiny Open-Source KVM: Openterface",
    }),
  ).toBeVisible();
  await expect(page.getByText("May 19, 2025")).toBeVisible();
  await expect(
    page.getByText(
      "This product was loaned to me free of charge by the manufacturer.",
    ),
  ).toBeVisible();
});

test("legacy locale article routes are not generated", async ({ page }) => {
  const response = await page.goto("/ko/article/openterface-mini-kvm/");

  expect(response?.status()).toBe(404);
});

test("old English-prefixed article route is not generated", async ({
  page,
}) => {
  const response = await page.goto("/en/openterface-mini-kvm/");

  expect(response?.status()).toBe(404);
});

test("translated article routes render Korean and Japanese content", async ({
  page,
}) => {
  await page.goto("/ko/openterface-mini-kvm/");
  await expect(
    page.getByRole("heading", {
      name: "또 다른 작은 오픈소스 KVM, Openterface",
    }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");

  await page.goto("/ja/openterface-mini-kvm/");
  await expect(
    page.getByRole("heading", {
      name: "もうひとつの小さなオープンソースKVM、Openterface",
    }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});

test("article body language links navigate to translations", async ({
  page,
}) => {
  await page.goto("/openterface-mini-kvm/");

  await expect(page.getByText("Also available in")).toBeVisible();

  const koreanLink = page.getByRole("link", { name: "한국어" }).first();
  const japaneseLink = page.getByRole("link", { name: "日本語" }).first();

  await expect(koreanLink).toHaveAttribute("href", "/ko/openterface-mini-kvm/");
  await expect(japaneseLink).toHaveAttribute(
    "href",
    "/ja/openterface-mini-kvm/",
  );

  await koreanLink.click();

  await expect(page).toHaveURL("/ko/openterface-mini-kvm/");
});
