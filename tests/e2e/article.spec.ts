import { expect, test } from "@playwright/test";

test("Ghost-compatible article page renders metadata", async ({ page }) => {
  await page.goto("/openterface-mini-kvm/");

  await expect(page).toHaveTitle(/Openterface/i);
  await expect(
    page.getByRole("heading", {
      name: "또 다른 작은 오픈소스 KVM, Openterface",
    }),
  ).toBeVisible();
  await expect(page.getByText("2025년 5월 19일")).toBeVisible();
  await expect(
    page.getByText("이 제품은 제조사로부터 무상으로 대여받았습니다."),
  ).toBeVisible();
});

test("legacy locale article routes are not generated", async ({ page }) => {
  const response = await page.goto("/ko/article/openterface-mini-kvm/");

  expect(response?.status()).toBe(404);
});

test("translated article routes render English and Japanese content", async ({
  page,
}) => {
  await page.goto("/en/openterface-mini-kvm/");
  await expect(
    page.getByRole("heading", {
      name: "Another Tiny Open-Source KVM: Openterface",
    }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.goto("/ja/openterface-mini-kvm/");
  await expect(
    page.getByRole("heading", {
      name: "もうひとつの小さなオープンソースKVM、Openterface",
    }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});
