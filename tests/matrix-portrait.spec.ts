import { test, expect } from "@playwright/test";
test("automatically completes two full photographic-binary cycles without pointer input", async ({
  page,
}, info) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.setViewportSize(
    info.project.name === "mobile"
      ? { width: 390, height: 1000 }
      : { width: 1440, height: 1000 },
  );
  await page.goto("/");
  const portrait = page.locator(".matrix-portrait");
  await expect(portrait).toHaveAttribute("data-ready", "true");
  await expect(portrait).toHaveAttribute("data-running", "true");
  const elapsed = () =>
    portrait.evaluate((el) => Number((el as HTMLElement).dataset.elapsed));
  const stages = [
    ["real", 0.2, "portrait"],
    ["early", 3, "transformation"],
    ["half", 3.8, "transformation"],
    ["matrix", 6.8, "matrix"],
    ["reconstruction", 11.2, "reconstruction"],
    ["return", 13, "portrait"],
  ] as const;
  const pictures: Buffer[] = [];
  for (const [name, time, phase] of stages) {
    await expect.poll(elapsed, { timeout: 15000 }).toBeGreaterThanOrEqual(time);
    await expect(portrait).toHaveAttribute("data-phase", phase);
    const box = await portrait.boundingBox();
    expect(box).not.toBeNull();
    pictures.push(
      await page.screenshot({
        path: info.outputPath(`${name}.png`),
        clip: box!,
      }),
    );
    await expect(portrait).toHaveAttribute("data-phase", phase);
    await info.attach(`${name}-timing`, {
      body: (await portrait.getAttribute("data-elapsed")) ?? "",
      contentType: "text/plain",
    });
  }
  expect(pictures[0].equals(pictures[3])).toBe(false);
  expect(pictures[3].equals(pictures[4])).toBe(false);
  await expect
    .poll(
      () =>
        portrait.evaluate((el) => Number((el as HTMLElement).dataset.cycle)),
      { timeout: 25000 },
    )
    .toBeGreaterThanOrEqual(2);
  await expect(portrait).toHaveAttribute("data-phase", "portrait");
  expect(
    await portrait.evaluate((el) => Number((el as HTMLElement).dataset.frames)),
  ).toBeGreaterThan(100);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await info.attach("two-cycle-observation", {
    body: JSON.stringify(
      await portrait.evaluate((el) => ({ ...(el as HTMLElement).dataset })),
      null,
      2,
    ),
    contentType: "application/json",
  });
});
test("pause, resume, hidden tab, and viewport visibility suspend expensive rendering", async ({
  page,
}) => {
  await page.goto("/");
  const portrait = page.locator(".matrix-portrait");
  await expect(portrait).toHaveAttribute("data-running", "true");
  await page.getByRole("button", { name: "Pause animation" }).click();
  await expect(portrait).toHaveAttribute("data-running", "false");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Resume animation" }).click();
  await expect(portrait).toHaveAttribute("data-running", "true");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(portrait).toHaveAttribute("data-running", "false");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(portrait).toHaveAttribute("data-running", "true");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(portrait).toHaveAttribute("data-running", "false");
});
test("WebGL context loss switches to an automatically animated Canvas fallback", async ({
  page,
}) => {
  await page.goto("/");
  const portrait = page.locator(".matrix-portrait");
  await expect(portrait).toHaveAttribute("data-ready", "true");
  await page.locator(".matrix-canvas").dispatchEvent("webglcontextlost");
  await expect(portrait).toHaveAttribute("data-renderer", "canvas");
  await expect(portrait).toHaveAttribute("data-running", "true");
  await expect
    .poll(
      () =>
        portrait.evaluate((el) => Number((el as HTMLElement).dataset.elapsed)),
      { timeout: 10000 },
    )
    .toBeGreaterThan(2.5);
  await expect(portrait).toHaveAttribute("data-phase", "transformation");
});
test("a missing photograph displays a clearly labeled fallback", async ({
  page,
}) => {
  await page.route("**/images/portrait.webp", (route) =>
    route.fulfill({ status: 404, body: "not found" }),
  );
  await page.goto("/");
  await expect(page.locator(".matrix-portrait")).toHaveAttribute(
    "data-image-fallback",
    "true",
  );
  await expect(page.getByText("IMAGE UNAVAILABLE · PLACEHOLDER")).toBeVisible();
});
test("contact links to the supplied LinkedIn profile", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator("#contact").getByRole("link", { name: /LinkedIn/ }),
  ).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/kasim-ntale-43aa91382/",
  );
});
