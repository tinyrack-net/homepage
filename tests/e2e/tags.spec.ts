import { expect, test } from "@playwright/test";

test("Ghost-compatible tag page lists articles and navigates to detail", async ({
  page,
}) => {
  await page.goto("/tag/hardware/");

  await expect(page.getByRole("heading", { name: "Hardware" })).toBeVisible();

  const articleLink = page.getByRole("link", {
    name: /또 다른 작은 오픈소스 KVM, Openterface/i,
  });

  await expect(articleLink).toBeVisible();
  await articleLink.click();

  await expect(page).toHaveURL("/openterface-mini-kvm/");
  await expect(
    page.getByRole("heading", {
      name: "또 다른 작은 오픈소스 KVM, Openterface",
    }),
  ).toBeVisible();
});

test("translated tag pages list language-matched articles", async ({
  page,
}) => {
  await page.goto("/en/tag/hardware/");

  await expect(page.getByRole("heading", { name: "Hardware" })).toBeVisible();
  const englishArticleLink = page.getByRole("link", {
    name: /Another Tiny Open-Source KVM: Openterface/i,
  });
  await expect(englishArticleLink).toBeVisible();
  await englishArticleLink.click();
  await expect(page).toHaveURL("/en/openterface-mini-kvm/");

  await page.goto("/ja/tag/hardware/");
  await expect(
    page.getByRole("heading", { name: "ハードウェア" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /もうひとつの小さなオープンソースKVM、Openterface/i,
    }),
  ).toBeVisible();
});
