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

test("mobile menu opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoHydrated(page, "/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "About" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Auto" })).toBeVisible();
  await expect(
    dialog.getByRole("combobox", { name: "Language" }),
  ).toBeVisible();
  const geometry = await dialog.evaluate((popup) => {
    const viewport = popup.closest(".tr-drawer-viewport");
    const popupRect = popup.getBoundingClientRect();
    const viewportRect = viewport?.getBoundingClientRect();
    const style = getComputedStyle(popup);
    const widthProbe = document.createElement("div");
    widthProbe.style.position = "fixed";
    widthProbe.style.width = "var(--tinyrack-overlay-width-sm)";
    document.body.append(widthProbe);
    const expectedWidth = widthProbe.getBoundingClientRect().width;
    widthProbe.remove();
    return {
      borderWidths: [
        style.borderTopWidth,
        style.borderRightWidth,
        style.borderBottomWidth,
        style.borderLeftWidth,
      ],
      expectedWidth,
      innerWidth: window.innerWidth,
      popupWidth: popupRect.width,
      popupRight: popupRect.right,
      viewportRight: viewportRect?.right,
    };
  });
  expect(geometry.borderWidths).toEqual(["0px", "0px", "0px", "0px"]);
  expect(geometry.popupWidth).toBeCloseTo(geometry.expectedWidth, 0);
  expect(geometry.popupWidth).toBeLessThan(geometry.innerWidth);
  expect(geometry.viewportRight).toBeCloseTo(geometry.innerWidth, 0);
  await expect
    .poll(() => dialog.evaluate((popup) => popup.getBoundingClientRect().right))
    .toBeCloseTo(geometry.innerWidth, 0);
  await page.getByRole("button", { name: "Close menu" }).click();
  await expect(dialog).toBeHidden();
});

test("desktop header exposes settings and a labeled menu", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.goto("/");

  const utilities = page.locator("[data-desktop-header-utilities]");
  await expect(utilities).toBeVisible();
  await expect(utilities.getByRole("button", { name: "Auto" })).toBeVisible();
  const language = utilities.getByRole("combobox", { name: "Language" });
  await expect(language).toBeVisible();
  await expect(
    utilities.getByRole("button", { name: "Open menu" }),
  ).toContainText("Menu");

  await language.focus();
  await language.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/ja/");
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
