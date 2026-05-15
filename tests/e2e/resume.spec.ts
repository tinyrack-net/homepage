import { expect, type Page, test } from "@playwright/test";

async function expectSectionNearViewportTop(page: Page, id: string) {
  await expect
    .poll(async () => {
      return page.evaluate((targetId) => {
        const element = document.getElementById(targetId);
        if (!(element instanceof HTMLElement)) {
          return false;
        }

        const top = element.getBoundingClientRect().top;
        return top >= 0 && top < window.innerHeight / 2;
      }, id);
    })
    .toBe(true);
}

async function getViewerScale(page: Page) {
  return page.locator("#viewer-root").evaluate((element) => {
    const rawValue = getComputedStyle(element)
      .getPropertyValue("--scaling-factor")
      .trim();

    return rawValue ? Number.parseFloat(rawValue) : 1;
  });
}

test("resume page renders sections and jump links scroll to targets", async ({
  page,
}) => {
  await page.goto("/en/resume/");

  await expect(page.getByRole("heading", { name: "Profiles" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Skills" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Work Experience" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Open Source" }),
  ).toBeVisible();

  await page.locator("#jump_to_experience").click();
  await expectSectionNearViewportTop(page, "experience");

  await page.locator("#jump_to_open_source").click();
  await expectSectionNearViewportTop(page, "open_source");

  await page.locator("#jump_to_profile").click();
  await expectSectionNearViewportTop(page, "profile");
});

test("korean resume links to the pdf viewer and the viewer controls update scale", async ({
  page,
}) => {
  await page.goto("/ko/resume/");

  await page.getByRole("link", { name: /PDF/i }).click();

  await expect(page).toHaveURL("/ko/resume/pdf/");
  await expect(page.getByRole("button", { name: "Go back" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Go home" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Print" })).toBeVisible();

  const viewerRoot = page.locator("#viewer-root");
  await expect(viewerRoot).toBeVisible();

  const initialScale = await viewerRoot.evaluate((element) => {
    return getComputedStyle(element)
      .getPropertyValue("--scaling-factor")
      .trim();
  });

  await page.getByRole("button", { name: "Zoom out" }).click();

  await expect
    .poll(async () => {
      return viewerRoot.evaluate((element) => {
        return getComputedStyle(element)
          .getPropertyValue("--scaling-factor")
          .trim();
      });
    })
    .not.toBe(initialScale);

  const zoomedOutScale = await viewerRoot.evaluate((element) => {
    return getComputedStyle(element)
      .getPropertyValue("--scaling-factor")
      .trim();
  });

  await expect(
    page.getByRole("button", { name: "Fit to screen" }),
  ).toBeEnabled();

  await page.getByRole("button", { name: "Fit to screen" }).click();

  await expect
    .poll(async () => {
      return viewerRoot.evaluate((element) => {
        return getComputedStyle(element)
          .getPropertyValue("--scaling-factor")
          .trim();
      });
    })
    .not.toBe(zoomedOutScale);
});

test("resume pdf header actions and zoom bounds behave correctly", async ({
  page,
}) => {
  await page.goto("/ko/resume/");
  await page.getByRole("link", { name: /PDF/i }).click();

  await expect(page).toHaveURL("/ko/resume/pdf/");
  await page.getByRole("button", { name: "Go back" }).click();
  await expect(page).toHaveURL("/ko/resume/");

  await page.getByRole("link", { name: /PDF/i }).click();
  await expect(page).toHaveURL("/ko/resume/pdf/");
  await page.getByRole("link", { name: "Go home" }).click();
  await expect(page).toHaveURL("/ko/");

  await page.goto("/ko/resume/pdf/");

  const zoomOutButton = page.getByRole("button", { name: "Zoom out" });
  const zoomInButton = page.getByRole("button", { name: "Zoom in" });

  while (await zoomOutButton.isEnabled()) {
    await zoomOutButton.click();
  }

  await expect.poll(() => getViewerScale(page)).toBe(0.25);
  await expect(zoomOutButton).toBeDisabled();

  const minScale = await getViewerScale(page);
  await zoomOutButton.click({ force: true });
  await expect.poll(() => getViewerScale(page)).toBe(minScale);

  while (await zoomInButton.isEnabled()) {
    await zoomInButton.click();
  }

  await expect.poll(() => getViewerScale(page)).toBe(1);
  await expect(zoomInButton).toBeDisabled();

  const maxScale = await getViewerScale(page);
  await zoomInButton.click({ force: true });
  await expect.poll(() => getViewerScale(page)).toBe(maxScale);

  await page.keyboard.down("Control");
  await page.mouse.wheel(0, 100);
  await page.keyboard.up("Control");

  await expect.poll(() => getViewerScale(page)).toBe(0.9);
});
