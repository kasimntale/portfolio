import { test, expect } from "@playwright/test";
const slugs = ["mirrorload", "academy-os", "pocketledger", "wetguard"];
test("home is semantic, responsive, and links to all real project routes", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "NTALE KASIM.",
  );
  await expect(page.getByRole("main")).toHaveCount(1);
  for (const slug of slugs)
    await expect(page.locator(`a[href="/projects/${slug}"]`)).toHaveCount(1);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(
    page.getByRole("link", { name: "kasimntale2@gmail.com", exact: true }),
  ).toHaveAttribute("href", "mailto:kasimntale2@gmail.com");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator('a[href="#"],a[href=""],button:empty')).toHaveCount(
    0,
  );
  expect(errors).toEqual([]);
});
test("every project has unique detail content and working next navigation", async ({
  page,
}) => {
  for (const slug of slugs) {
    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: "The problem worth solving." }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "An engineering approach." }),
    ).toBeVisible();
    await expect(page.locator(".next-project")).toHaveAttribute(
      "href",
      /\/projects\//,
    );
    await expect(page.locator(".status-badge")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.locator(".back-link").click();
  await expect(page).toHaveURL(/\/#work$/);
});
test("keyboard navigation and mobile menu close, trap, and restore focus", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  if (info.project.name === "mobile") {
    const menu = page.getByRole("button", { name: "Menu" });
    await menu.click();
    await expect(page.getByRole("button", { name: "Close" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(
      page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "01 About" }),
    ).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator("#mobile-navigation>a")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(page.locator("#mobile-navigation")).toBeHidden();
    await menu.click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "02 Selected work" })
      .click();
    await expect(page.locator("#mobile-navigation")).toBeHidden();
    await expect(page).toHaveURL(/#work$/);
  } else {
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "About", exact: true })
      .click();
    await expect(
      page.getByRole("link", { name: "About", exact: true }),
    ).toHaveAttribute("aria-current", "location");
  }
});
test("reduced motion uses a lightweight portrait with an accessible digital toggle", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".portrait-stage")).toHaveAttribute(
    "data-renderer",
    "css",
  );
  await expect(page.locator("canvas")).toHaveCount(0);
  const button = page.getByRole("button", { name: "Reveal the code" });
  await button.click();
  await expect(
    page.getByRole("button", { name: "Hide the code" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".portrait-stage")).toHaveAttribute(
    "data-full",
    "true",
  );
  await page.getByRole("button", { name: "Hide the code" }).click();
  await expect(button).toHaveAttribute("aria-pressed", "false");
  expect(
    await page
      .locator(".route-entry")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
test("portrait adapts to device and cleans up across route transitions", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await expect(page.locator(".portrait-stage")).toHaveAttribute(
    "data-renderer",
    "css",
  );
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Reveal the code" }).click();
  await expect(
    page.getByRole("button", { name: "Hide the code" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("link", { name: "Explore MirrorLoad", exact: true })
    .click();
  await expect(page).toHaveURL("/projects/mirrorload");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.locator(".back-link").click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/");
  await expect(page.locator(".site-header")).toHaveCount(1);
  expect(errors).toEqual([]);
});
test("metadata, sitemap, OG image and custom 404 are served", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Ntale Kasim/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    /Ntale Kasim/,
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  for (const slug of slugs)
    expect(await sitemap.text()).toContain(`/projects/${slug}`);
  const og = await request.get("/opengraph-image");
  expect(og.ok()).toBe(true);
  expect(og.headers()["content-type"]).toContain("image/png");
  const response = await page.goto("/projects/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404." })).toBeVisible();
  await page.getByRole("link", { name: "Back to the portfolio" }).click();
  await expect(page).toHaveURL("/");
});
test("home and project detail have no serious accessibility violations", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/", "/projects/mirrorload"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});
test("tablet layout and data-saver mode remain usable without WebGL", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      value: { saveData: true },
      configurable: true,
    }),
  );
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto("/");
  await expect(page.locator(".portrait-stage")).toHaveAttribute(
    "data-renderer",
    "css",
  );
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("link", { name: "Explore WetGuard", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "WetGuard", exact: true }),
  ).toBeVisible();
});
test("skill filters show the requested disciplines and retain keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".skills-grid .skill")).toHaveCount(6);
  const product = page.getByRole("button", {
    name: "Product engineering",
    exact: true,
  });
  await product.click();
  await expect(page.locator(".skills-grid .skill")).toHaveCount(3);
  await expect(product).toHaveAttribute("aria-pressed", "true");
  await expect(product).toBeFocused();
  await expect(page.getByRole("status")).toContainText("Product engineering");
  await page
    .getByRole("button", { name: "Data & systems", exact: true })
    .click();
  await expect(page.locator(".skills-grid .skill")).toHaveCount(3);
  await expect(page.locator(".skills-grid")).toContainText(
    "Data & machine learning",
  );
  await page.getByRole("button", { name: "All disciplines" }).click();
  await expect(page.locator(".skills-grid .skill")).toHaveCount(6);
});
