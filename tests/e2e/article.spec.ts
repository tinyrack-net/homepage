import { expect, test } from "@playwright/test";

test("article page renders metadata and supports language switching", async ({
  page,
}) => {
  await page.goto("/en/article/vector-optimizer/");

  await expect(page).toHaveTitle(/Vector Optimizer/i);
  await expect(
    page.getByRole("heading", {
      name: "Vector Optimizer: Enhancing Natural Pen Input",
    }),
  ).toBeVisible();
  await expect(page.getByText("Jan 16, 2023")).toBeVisible();
  await expect(
    page.getByText("Vector Optimizer is a vector optimization utility"),
  ).toBeVisible();
  await expect(
    page.locator('script.discus[data-term="vector-optimizer"]'),
  ).toHaveCount(1);

  await page.getByRole("link", { name: "한국어" }).click();

  await expect(page).toHaveURL("/ko/article/vector-optimizer/");
  await expect(
    page.getByRole("heading", {
      name: "사용자의 펜 입력을 자연스럽게, Vector Optimizer",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Vector Optimizer 는 벡터 최적화 유틸리티입니다."),
  ).toBeVisible();
});

test("single-language article does not render alternative-language UI", async ({
  page,
}) => {
  await page.goto("/ko/article/es5-class/");

  await expect(
    page.getByRole("heading", {
      name: "자바스크립트 ES5로 ES6 Class 완벽하게 구현하기",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "English" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "한국어" })).toHaveCount(0);
});
