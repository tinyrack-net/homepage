import { expect, test } from "@playwright/test";
import { gotoHydrated } from "./helpers.ts";

test("landing page renders at the unprefixed root", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Tinyrack");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "From the engineering blog" }),
  ).toBeVisible();
});

test("landing page keeps its corporate sections", async ({ page }) => {
  await page.goto("/");
  // Scoped to main: the footer's column headings are also h2. The landing has
  // one h2 per section: principles, the open-source band, blog.
  const main = page.locator("main");
  await expect(main.getByRole("heading", { level: 2 })).toHaveCount(3);
  await expect(
    main.getByRole("heading", { level: 2, name: "What we stand for" }),
  ).toBeVisible();
  await expect(
    main.getByRole("heading", { level: 2, name: "What we make" }),
  ).toBeVisible();
});

test("landing isometric objects use opaque illustration roles", async ({
  page,
}) => {
  await gotoHydrated(page, "/");
  const faces = page.locator("[data-iso-face]");
  const fronts = page.locator('[data-iso-face="front"]');
  const sides = page.locator('[data-iso-face="side"]');
  const tops = page.locator('[data-iso-face="top"]');
  expect(await faces.count()).toBeGreaterThan(0);
  expect(await fronts.count()).toBeGreaterThan(0);
  const backdrops = page.locator(
    "[data-iso-box] > polygon:not([data-iso-face])",
  );
  await expect(backdrops).toHaveCount(0);

  for (const theme of ["tinyrack-light", "tinyrack-dark"] as const) {
    await page.locator("html").evaluate((html, value) => {
      html.dataset.theme = value;
    }, theme);
    const expected = await page.evaluate(() => {
      const probe = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      document.body.append(probe);
      const fill = (role: string) => {
        probe.style.fill = `var(--tinyrack-${role})`;
        return getComputedStyle(probe).fill;
      };
      const colors = {
        front: fill("illustration-fill-primary"),
        side: fill("illustration-fill-tertiary"),
        top: fill("illustration-fill-secondary"),
      };
      probe.remove();
      return colors;
    });
    await expect
      .poll(() =>
        fronts.evaluateAll((polygons) => [
          ...new Set(polygons.map((polygon) => getComputedStyle(polygon).fill)),
        ]),
      )
      .toEqual([expected.front]);
    await expect
      .poll(() =>
        tops.evaluateAll((polygons) => [
          ...new Set(polygons.map((polygon) => getComputedStyle(polygon).fill)),
        ]),
      )
      .toEqual([expected.top]);
    expect(
      await fronts.evaluateAll((polygons) => [
        ...new Set(
          polygons.map((polygon) => getComputedStyle(polygon).opacity),
        ),
      ]),
    ).toEqual(["1"]);
    expect(
      await tops.evaluateAll((polygons) => [
        ...new Set(
          polygons.map((polygon) => getComputedStyle(polygon).opacity),
        ),
      ]),
    ).toEqual(["1"]);
    expect(
      await sides.evaluateAll((polygons) => ({
        fills: [
          ...new Set(polygons.map((polygon) => getComputedStyle(polygon).fill)),
        ],
        opacities: [
          ...new Set(
            polygons.map((polygon) => getComputedStyle(polygon).opacity),
          ),
        ],
      })),
    ).toEqual({ fills: [expected.side], opacities: ["1"] });
  }
});

test("simplicity plinth conceals its supporting complexity", async ({
  page,
}) => {
  await gotoHydrated(page, "/");
  const visual = page.locator("[data-home-principle]").nth(2).locator("svg");
  const complexity = visual.locator("[data-simplicity-complexity]");
  const cover = visual.locator("[data-simplicity-cover]");

  await expect(complexity.locator("[data-iso-box]")).toHaveCount(4);
  await expect(complexity.locator("[data-simplicity-network]")).toHaveCount(0);
  await expect(cover.locator("[data-iso-box]")).toHaveCount(1);
  expect(
    await visual.evaluate((svg) => {
      const layer = svg.querySelector("[data-simplicity-complexity]");
      const coverLayer = svg.querySelector("[data-simplicity-cover]");
      const visibleServer = [...svg.querySelectorAll("[data-iso-box]")].find(
        (box) =>
          !box.closest("[data-simplicity-complexity]") &&
          !box.closest("[data-simplicity-cover]"),
      );

      return {
        coverMotion: (
          coverLayer?.querySelector("[data-iso-box]") as SVGElement
        )?.style.getPropertyValue("--hv-anim"),
        paintsOver: Boolean(
          layer &&
            coverLayer &&
            layer.compareDocumentPosition(coverLayer) &
              Node.DOCUMENT_POSITION_FOLLOWING,
        ),
        serverMotion: (visibleServer as SVGElement)?.style.getPropertyValue(
          "--hv-anim",
        ),
      };
    }),
  ).toEqual({
    coverMotion: "hv-iso-drop",
    paintsOver: true,
    serverMotion: "hv-iso-drop",
  });
});

test("landing illustration entrances play only once per page visit", async ({
  page,
}) => {
  await gotoHydrated(page, "/");
  const simplicity = page.locator("[data-home-principle]").nth(2);
  const stage = simplicity.locator(".hv-stage");

  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute("data-inview", "true");

  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await expect(stage).not.toBeInViewport();
  await expect(stage).toHaveAttribute("data-inview", "true");
});

test("hero illustration starts empty before hydration", async ({ page }) => {
  let releaseScripts!: () => void;
  const scriptsRelease = new Promise<void>((resolve) => {
    releaseScripts = resolve;
  });

  await page.route("**/*.js", async (route) => {
    await scriptsRelease;
    await route.continue();
  });

  await page.goto("/", { waitUntil: "commit" });
  const stage = page.locator(".home-hero-visual .hv-stage");
  const firstCabinet = stage
    .locator("[data-dc-cabinet-layer] > [data-hv-enter]")
    .first();

  try {
    await expect(stage).toHaveAttribute("data-inview", "false");
    await expect(firstCabinet).toHaveCSS("opacity", "0");
    await expect(firstCabinet).toHaveCSS("animation-play-state", "paused");
  } finally {
    releaseScripts();
  }

  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await expect(stage).toHaveAttribute("data-inview", "true");
  await expect(firstCabinet).toHaveCSS("opacity", "1");
});

test("hero illustration stays complete without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  const stage = page.locator(".home-hero-visual .hv-stage");
  const firstCabinet = stage
    .locator("[data-dc-cabinet-layer] > [data-hv-enter]")
    .first();
  await expect(stage).toHaveAttribute("data-inview", "false");
  await expect(firstCabinet).toHaveCSS("opacity", "1");
  await expect(firstCabinet).toHaveCSS("animation-name", "none");

  await context.close();
});

test("hero rack footprints stay below and enter with their cabinets", async ({
  page,
}) => {
  await gotoHydrated(page, "/");
  const shadowLayer = page.locator("[data-dc-shadow-layer]");
  const cabinetLayer = page.locator("[data-dc-cabinet-layer]");
  await expect(shadowLayer).toHaveCount(1);
  await expect(cabinetLayer).toHaveCount(1);
  await expect(
    page.locator("[data-dc-shadow-layer] + [data-dc-cabinet-layer]"),
  ).toHaveCount(1);

  const timing = (selector: string) =>
    page.locator(selector).evaluateAll((elements) =>
      elements.map((element) => ({
        delay: (element as SVGElement).style.getPropertyValue("--hv-delay"),
        duration: (element as SVGElement).style.getPropertyValue(
          "--hv-duration",
        ),
      })),
    );
  const shadowTiming = await timing("[data-dc-shadow-layer] > [data-hv-enter]");
  const cabinetTiming = await timing(
    "[data-dc-cabinet-layer] > [data-iso-box]",
  );
  expect(shadowTiming).toHaveLength(8);
  expect(shadowTiming).toEqual(cabinetTiming);
});

test("home editorials keep 16:9 cover images", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 });
  await gotoHydrated(page, "/");

  // The blog section is deliberately compact: three equal teasers, no
  // featured card.
  await expect(page.locator("[data-home-article-teaser]")).toHaveCount(3);
  await expect(page.locator("[data-home-article-featured]")).toHaveCount(0);
  const links = page.locator("[data-home-article-link]");
  await expect(links).toHaveCount(3);
  const images = page.locator("[data-home-article-image]");
  await expect(images).toHaveCount(3);

  const frames = await images.evaluateAll((elements) =>
    elements.map((element) => {
      const image = element as HTMLImageElement;
      const bounds = image.getBoundingClientRect();
      const link = image.closest("[data-home-article-link]");
      const linkBounds = link?.getBoundingClientRect();
      return {
        width: bounds.width,
        height: bounds.height,
        objectFit: getComputedStyle(image).objectFit,
        imageInsideLink:
          linkBounds !== undefined &&
          linkBounds.left <= bounds.left &&
          linkBounds.top <= bounds.top &&
          linkBounds.right >= bounds.right &&
          linkBounds.bottom >= bounds.bottom,
      };
    }),
  );
  const firstFrame = frames[0];
  expect(firstFrame).toBeDefined();
  if (!firstFrame) {
    throw new Error("Expected at least one home editorial image.");
  }

  for (const frame of frames) {
    expect(frame.objectFit).toBe("cover");
    expect(frame.imageInsideLink).toBe(true);
    expect(Math.abs(frame.width / frame.height - 16 / 9)).toBeLessThan(0.02);
  }

  const firstHref = await links.first().getAttribute("href");
  if (!firstHref) {
    throw new Error("Expected the first home editorial link to have an href.");
  }
  await images.first().click();
  await expect(page).toHaveURL(new RegExp(`${firstHref}$`));
});

test("authored hero lines do not overflow in any locale", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const path of ["/", "/ko/", "/ja/"]) {
      await page.goto(path);
      const headline = page.getByRole("heading", { level: 1 });
      await expect(headline).toBeVisible();
      expect(
        await headline.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
        `${path} at ${viewport.width}px`,
      ).toBe(true);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
        `${path} should not create document-level horizontal overflow at ${viewport.width}px`,
      ).toBe(true);
      const heroBounds = await page
        .locator(".home-hero-visual")
        .evaluate((hero) => {
          const bounds = hero.getBoundingClientRect();
          return {
            left: bounds.left,
            right: bounds.right,
            width: bounds.width,
          };
        });
      expect(heroBounds.left).toBeCloseTo(0, 0);
      expect(heroBounds.right).toBeCloseTo(viewport.width, 0);
      expect(heroBounds.width).toBeCloseTo(viewport.width, 0);
    }
  }
});

test("latest Tinyrack layout scale drives site frames", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 });

  await page.goto("/");
  await expect(page.locator(".wide-shell").first()).toHaveCSS(
    "max-width",
    "1216px",
  );
  await expect(page.locator("header img").first()).toHaveCSS("height", "28px");

  await page.goto("/blog/");
  await expect(page.locator(".page-shell")).toHaveCSS("max-width", "1024px");

  await page.goto("/openterface-mini-kvm/");
  await expect(page.locator(".reading-shell")).toHaveCSS("max-width", "1024px");
});

test("landing leads with philosophy, not a product list", async ({ page }) => {
  await page.goto("/");
  // The landing introduces principles with illustrations; the lineup lives on
  // /open-source/, reached through the CTA band. No product or licence names.
  const main = page.locator("main");
  await expect(main.locator("[data-home-principle]")).toHaveCount(3);
  await expect(
    main.getByRole("link", { name: "Explore the projects" }),
  ).toHaveAttribute("href", "/open-source/");
  await expect(main).not.toContainText("MIT");
  await expect(main).not.toContainText("Dotweave");
  await expect(main).not.toContainText("Proxer");
});

test("hero primary CTA leads to the open-source showcase", async ({ page }) => {
  await gotoHydrated(page, "/");
  await page
    .locator("main")
    .getByRole("link", { name: "Explore our open source" })
    .click();
  await expect(page).toHaveURL("/open-source/");
});

test("open-source showcase lists each curated project exactly once", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1024 });
  await gotoHydrated(page, "/open-source/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Everything we build is open.",
    }),
  ).toBeVisible();
  await expect(page.locator("[data-open-source-project]")).toHaveCount(5);

  for (const name of [
    "Dotweave",
    "Proxer",
    "Tinyauth",
    "Tinyrack Design",
    "Dart Packages",
  ]) {
    await expect(
      page.getByRole("heading", { level: 3, name }),
      `${name} should appear in one project card`,
    ).toHaveCount(1);
  }

  await expect(
    page.locator(
      '[data-open-source-project="dotweave"] a[href="https://github.com/tinyrack-net/dotweave"]',
    ),
  ).toHaveCount(1);
  await expect(
    page.locator(
      '[data-open-source-project="proxer"] a[href="https://github.com/tinyrack-net/proxer"]',
    ),
  ).toHaveCount(1);

  const firstProjectLink = page.locator(
    '[data-open-source-project="dotweave"] a',
  );
  await expect(firstProjectLink).toHaveAttribute("target", "_blank");
  await expect(firstProjectLink).toHaveAttribute("rel", /noopener/);
  await firstProjectLink.focus();
  await expect(firstProjectLink).toBeFocused();

  const firstProjectCardLayout = await firstProjectLink
    .locator(".tr-card")
    .evaluate((card) => {
      const body = card.firstElementChild;
      const footer = card.querySelector(".tr-card-footer");
      if (!(body instanceof HTMLElement) || !(footer instanceof HTMLElement)) {
        throw new Error("Project card body and footer must be present");
      }

      const cardRect = card.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const cardStyles = getComputedStyle(card);
      const bodyStyles = getComputedStyle(body);
      const footerStyles = getComputedStyle(footer);

      return {
        bodyPaddingTop: bodyStyles.paddingTop,
        footerBottomPadding: footerStyles.paddingBottom,
        footerLeftInset:
          footerRect.left -
          cardRect.left -
          Number.parseFloat(cardStyles.borderLeftWidth),
        footerRightInset:
          cardRect.right -
          footerRect.right -
          Number.parseFloat(cardStyles.borderRightWidth),
      };
    });
  expect(firstProjectCardLayout.footerLeftInset).toBeCloseTo(0, 1);
  expect(firstProjectCardLayout.footerRightInset).toBeCloseTo(0, 1);
  expect(firstProjectCardLayout.footerBottomPadding).toBe(
    firstProjectCardLayout.bodyPaddingTop,
  );

  const desktopColumns = await page
    .locator("[data-open-source-project-grid]")
    .evaluate(
      (grid) =>
        getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean)
          .length,
    );
  expect(desktopColumns).toBe(3);
});

test("open-source showcase is localized and responsive", async ({ page }) => {
  for (const locale of [
    {
      path: "/ko/open-source/",
      lang: "ko",
      title: "만드는 것은 전부 공개해요.",
    },
    {
      path: "/ja/open-source/",
      lang: "ja",
      title: "つくるものは、すべてオープンに。",
    },
  ]) {
    const response = await page.goto(locale.path);
    expect(response?.status(), locale.path).toBeLessThan(400);
    await expect(page.locator("html")).toHaveAttribute("lang", locale.lang);
    await expect(
      page.getByRole("heading", { level: 1, name: locale.title }),
    ).toBeVisible();
    await expect(page.locator("[data-open-source-project]")).toHaveCount(5);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await gotoHydrated(page, "/open-source/");
  const heading = page.getByRole("heading", { level: 1 });
  expect(
    await heading.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  const mobileColumns = await page
    .locator("[data-open-source-project-grid]")
    .evaluate(
      (grid) =>
        getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean)
          .length,
    );
  expect(mobileColumns).toBe(1);
});

test("open-source navigation and metadata follow the locale contract", async ({
  page,
}) => {
  await gotoHydrated(page, "/");
  await page
    .getByRole("navigation", { name: "Tinyrack" })
    .getByRole("link", { name: "Open Source" })
    .click();
  await expect(page).toHaveURL("/open-source/");
  await expect(
    page
      .getByRole("navigation", { name: "Tinyrack" })
      .getByRole("link", { name: "Open Source" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page).toHaveTitle("Open Source - Tinyrack");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://tinyrack.net/open-source/",
  );
  await expect(
    page.locator('link[rel="alternate"][hreflang="ko"]'),
  ).toHaveAttribute("href", "https://tinyrack.net/ko/open-source/");
});

test("header shows the official lockup for the page language", async ({
  page,
}) => {
  await page.goto("/");
  const latin = page.locator('header img[src="/brand/tinyrack-lockup.svg"]');
  await expect(latin).toBeVisible();
  await expect(latin).toHaveAccessibleName("Tinyrack");

  await page.goto("/ko/");
  const korean = page.locator(
    'header img[src="/brand/tinyrack-lockup-ko.svg"]',
  );
  await expect(korean).toBeVisible();
  await expect(korean).toHaveAccessibleName("타이니랙");

  // Japanese uses the Latin lockup; only Korean has approved localized artwork.
  await page.goto("/ja/");
  await expect(
    page.locator('header img[src="/brand/tinyrack-lockup.svg"]'),
  ).toBeVisible();
});

test("brand artwork and icons are served", async ({ request }) => {
  for (const path of [
    "/favicon.svg",
    "/apple-touch-icon.png",
    "/brand/tinyrack-lockup.svg",
    "/brand/tinyrack-lockup-ko.svg",
    "/brand/tinyrack-lockup-inverse.svg",
    "/brand/tinyrack-lockup-ko-inverse.svg",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});

test("every locale gets a social image that exists", async ({
  page,
  request,
}) => {
  for (const path of ["/", "/ko/", "/ja/"]) {
    await page.goto(path);
    const image = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(image, path).toBeTruthy();
    const response = await request.get(new URL(image as string).pathname);
    expect(response.status(), `${path} -> ${image}`).toBe(200);
  }
});

test("publishes Organization structured data pointing at the logo", async ({
  page,
}) => {
  await page.goto("/");
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const data = JSON.parse(raw ?? "{}");
  expect(data["@type"]).toBe("Organization");
  expect(data.logo).toBe("https://tinyrack.net/brand/tinyrack-lockup.svg");
});

test("publishes canonical, locale, article and Twitter metadata", async ({
  page,
}) => {
  await page.goto("/openterface-mini-kvm/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://tinyrack.net/openterface-mini-kvm/",
  );
  await expect(
    page.locator('link[rel="alternate"][hreflang="ko"]'),
  ).toHaveAttribute("href", "https://tinyrack.net/ko/openterface-mini-kvm/");
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
  await expect(
    page.locator('meta[property="article:published_time"]'),
  ).toHaveCount(1);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
});

test("localized home renders under its prefix", async ({ page }) => {
  await page.goto("/ko/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
});

test("header links the blog and marks it active", async ({ page }) => {
  await gotoHydrated(page, "/");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Blog" })
    .first()
    .click();
  await expect(page).toHaveURL("/blog/");
  await expect(
    page.getByRole("link", { name: /I Made a Forum/ }),
  ).toBeVisible();
});

test("blog index lists articles for its locale", async ({ page }) => {
  await page.goto("/blog/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Blog" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Openterface/ })).toBeVisible();
});

test("every locale has a reachable blog index", async ({ page }) => {
  for (const path of ["/blog/", "/ko/blog/", "/ja/blog/"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("article renders with content and alternate-language links", async ({
  page,
}) => {
  await page.goto("/openterface-mini-kvm/");
  await expect(page.locator("article h1.text-tinyrack-4xl")).toContainText(
    "Openterface",
  );
  await expect(
    page.locator('a[href="/ja/openterface-mini-kvm/"]'),
  ).toBeVisible();
  await expect(
    page.locator('a[href="/ko/openterface-mini-kvm/"]'),
  ).toBeVisible();
  await expect(page.locator(".tr-mdx img").first()).toBeVisible();
});

test("tag listing renders", async ({ page }) => {
  await page.goto("/tag/hardware/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("switching language from the blog stays on a real page", async ({
  page,
}) => {
  await page.goto("/blog/");
  const response = await page.goto("/ko/blog/");
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
});

test("mobile header and navigation match the docs layout", async ({ page }) => {
  for (const width of [390, 900]) {
    await page.setViewportSize({ width, height: 844 });
    await gotoHydrated(page, "/blog/");

    const mobileUtilities = page.locator("[data-mobile-header-utilities]");
    const themeSwitcher = mobileUtilities.getByRole("button", {
      name: "Switch theme. Current: Auto; next: Light",
    });
    await expect(themeSwitcher).toBeVisible();
    await expect(themeSwitcher).toHaveAttribute("data-appearance", "ghost");
    await expect(page.locator("[data-desktop-header-utilities]")).toBeHidden();

    await mobileUtilities.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const navigation = dialog.locator("[data-site-nav]");
    for (const link of ["About", "Products", "Open Source", "Blog"]) {
      await expect(
        navigation.getByRole("link", { name: link, exact: true }),
      ).toBeVisible();
    }
    for (const removedLink of ["Dotweave", "Forum", "GitHub", "YouTube"]) {
      await expect(
        dialog.getByRole("link", { name: removedLink, exact: true }),
      ).toHaveCount(0);
    }
    await expect(
      dialog.getByRole("button", { name: /^Switch theme\./ }),
    ).toHaveCount(0);
    await expect(
      dialog.getByRole("combobox", { name: "Language" }),
    ).toBeVisible();

    const blogLink = navigation.getByRole("link", { name: "Blog" });
    await expect(blogLink).toHaveAttribute("aria-current", "page");
    await expect(blogLink).toHaveAttribute("data-active", "true");
    await expect(blogLink).toHaveCSS("text-decoration-line", "none");
    expect(
      await blogLink.evaluate((link) => getComputedStyle(link).backgroundColor),
    ).not.toBe("rgba(0, 0, 0, 0)");

    const geometry = await dialog.evaluate((popup) => {
      const popupRect = popup.getBoundingClientRect();
      const style = getComputedStyle(popup);
      const widthProbe = document.createElement("div");
      widthProbe.style.position = "fixed";
      widthProbe.style.width = "calc(var(--tinyrack-space-2xl) * 9)";
      document.body.append(widthProbe);
      const expectedWidth = widthProbe.getBoundingClientRect().width;
      widthProbe.remove();
      return {
        borderRadii: [
          style.borderTopLeftRadius,
          style.borderTopRightRadius,
          style.borderBottomRightRadius,
          style.borderBottomLeftRadius,
        ],
        expectedWidth,
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        popupBottom: popupRect.bottom,
        popupHeight: popupRect.height,
        popupRight: popupRect.right,
        popupTop: popupRect.top,
        popupWidth: popupRect.width,
      };
    });
    expect(geometry.borderRadii).toEqual(["0px", "0px", "0px", "0px"]);
    expect(geometry.popupWidth).toBeCloseTo(
      Math.min(geometry.expectedWidth, geometry.innerWidth),
      0,
    );
    expect(geometry.popupTop).toBeCloseTo(0, 0);
    expect(geometry.popupBottom).toBeCloseTo(geometry.innerHeight, 0);
    expect(geometry.popupHeight).toBeCloseTo(geometry.innerHeight, 0);
    await expect
      .poll(() =>
        dialog.evaluate((popup) => popup.getBoundingClientRect().right),
      )
      .toBeCloseTo(geometry.innerWidth, 0);

    if (width === 390) {
      await dialog.getByRole("button", { name: "Close menu" }).click();
      await expect(dialog).toBeHidden();
      await mobileUtilities.getByRole("button", { name: "Open menu" }).click();
      await dialog
        .locator("[data-site-nav]")
        .getByRole("link", { name: "About" })
        .click();
      await expect(page).toHaveURL("/about/");
      await expect(dialog).toBeHidden();
    } else {
      await page.setViewportSize({ width: 1440, height: 844 });
      await expect(dialog).toBeHidden();
      await expect(
        page.getByRole("button", { name: "Open menu" }),
      ).toBeHidden();
    }
  }
});

test("desktop header exposes navigation and settings without a menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1024 });
  await gotoHydrated(page, "/blog/");

  const utilities = page.locator("[data-desktop-header-utilities]");
  await expect(utilities).toBeVisible();
  const themeSwitcher = utilities.getByRole("button", {
    name: "Switch theme. Current: Auto; next: Light",
  });
  await expect(themeSwitcher).toBeVisible();
  await expect(themeSwitcher).toHaveAttribute("data-appearance", "ghost");
  await expect(
    utilities.getByRole("button", { name: /^Switch theme\./ }),
  ).toHaveCount(1);
  const language = utilities.getByRole("combobox", { name: "Language" });
  await expect(language).toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  const headerBlogLink = page
    .locator("header nav")
    .getByRole("link", { name: "Blog" });
  await expect(headerBlogLink).toHaveAttribute("aria-current", "page");
  await expect(headerBlogLink).toHaveCSS("text-decoration-line", "none");

  await language.focus();
  await language.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/ja/blog/");
});

test("theme button cycles through auto, light, and dark", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.setViewportSize({ width: 1440, height: 1024 });
  await gotoHydrated(page, "/");

  const utilities = page.locator("[data-desktop-header-utilities]");
  let themeSwitcher = utilities.getByRole("button", {
    name: "Switch theme. Current: Auto; next: Light",
  });
  await expect(themeSwitcher.locator("svg.lucide-monitor")).toBeVisible();

  await themeSwitcher.click();
  themeSwitcher = utilities.getByRole("button", {
    name: "Switch theme. Current: Light; next: Dark",
  });
  await expect(themeSwitcher.locator("svg.lucide-sun")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "tinyrack-light",
  );
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("theme-preference")))
    .toBe("light");

  await themeSwitcher.click();
  themeSwitcher = utilities.getByRole("button", {
    name: "Switch theme. Current: Dark; next: Auto",
  });
  await expect(themeSwitcher.locator("svg.lucide-moon")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "tinyrack-dark",
  );
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("theme-preference")))
    .toBe("dark");

  await themeSwitcher.click();
  themeSwitcher = utilities.getByRole("button", {
    name: "Switch theme. Current: Auto; next: Light",
  });
  await expect(themeSwitcher.locator("svg.lucide-monitor")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "tinyrack-light",
  );
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("theme-preference")))
    .toBe("auto");
});

test("theme preference persists across reloads", async ({ page }) => {
  await gotoHydrated(page, "/");
  await page.evaluate(() =>
    window.localStorage.setItem("theme-preference", "dark"),
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "tinyrack-dark",
  );
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(10, 10, 10)",
  );
});

test("auto dark theme remains stable while hydrating across time zones", async ({
  browser,
}) => {
  const context = await browser.newContext({
    colorScheme: "dark",
    timezoneId: "Asia/Seoul",
  });
  const page = await context.newPage();
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.addInitScript(() => {
    const tracedWindow = window as typeof window & {
      __themeTransitions: (string | undefined)[];
    };
    tracedWindow.__themeTransitions = [];

    const attachObserver = () => {
      const html = document.documentElement;
      tracedWindow.__themeTransitions.push(html.dataset.theme);
      new MutationObserver(() => {
        tracedWindow.__themeTransitions.push(html.dataset.theme);
      }).observe(html, {
        attributeFilter: ["data-theme"],
        attributes: true,
      });
    };

    if (document.documentElement) {
      attachObserver();
    } else {
      new MutationObserver((_, observer) => {
        if (document.documentElement) {
          observer.disconnect();
          attachObserver();
        }
      }).observe(document, { childList: true });
    }
  });

  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "tinyrack-dark",
  );
  await expect(page.getByText("Jun 30, 2025", { exact: true })).toBeVisible();

  const transitions = await page.evaluate(
    () =>
      (
        window as typeof window & {
          __themeTransitions: (string | undefined)[];
        }
      ).__themeTransitions,
  );
  const firstDark = transitions.indexOf("tinyrack-dark");
  expect(firstDark).toBeGreaterThanOrEqual(0);
  expect(transitions.slice(firstDark + 1)).not.toContain("tinyrack-light");
  expect(pageErrors).toEqual([]);

  await context.close();
});

test("auto dark theme is applied before the stylesheet loads", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });

  let markStylesheetRequested!: () => void;
  const stylesheetRequested = new Promise<void>((resolve) => {
    markStylesheetRequested = resolve;
  });
  let releaseStylesheet!: () => void;
  const stylesheetRelease = new Promise<void>((resolve) => {
    releaseStylesheet = resolve;
  });

  await page.route("**/*.css", async (route) => {
    markStylesheetRequested();
    await stylesheetRelease;
    await route.continue();
  });

  await page.goto("/", { waitUntil: "commit" });
  await stylesheetRequested;

  try {
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      "tinyrack-dark",
    );
    await expect
      .poll(() =>
        page.locator("html").evaluate((html) => html.style.colorScheme),
      )
      .toBe("dark");
  } finally {
    releaseStylesheet();
  }

  await page.waitForLoadState("domcontentloaded");
});

test("about page renders unordered-list markers in dark theme", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.addInitScript(() =>
    window.localStorage.setItem("theme-preference", "dark"),
  );
  await page.goto("/about/");

  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "tinyrack-dark",
  );
  const lists = page.locator(".tr-mdx ul.tr-mdx-list");
  await expect(lists).not.toHaveCount(0);
  await expect(lists.first()).toHaveCSS("list-style-type", "disc");
});

test("feeds and crawler files are served", async ({ request }) => {
  const rss = await request.get("/rss.xml");
  expect(rss.ok()).toBeTruthy();
  expect(await rss.text()).toContain("<rss");

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain(
    "Sitemap: https://tinyrack.net/sitemap.xml",
  );

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const body = await sitemap.text();
  expect(body).toContain("<urlset");
  expect(body).toContain("<loc>https://tinyrack.net/blog/</loc>");
  expect(body).not.toContain("https://tinyrack.net/en/");
  // Paginated listings are deliberately left out of the sitemap.
  expect(body).not.toContain("/blog/page/");
});

test("pages advertise the default RSS feed", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(
      'link[rel="alternate"][type="application/rss+xml"][href="/rss.xml"]',
    ),
  ).toHaveCount(1);
});
