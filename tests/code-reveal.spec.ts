import { test, expect } from "@playwright/test";
const radius = () =>
  Number.parseFloat(
    document
      .querySelector<HTMLElement>(".portrait-stage")!
      .style.getPropertyValue("--reveal-radius"),
  );
test("portrait starts closed; pointer lens follows and contracts", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "mobile",
    "Mouse interaction is covered on desktop; touch has its own test.",
  );
  await page.goto("/");
  const stage = page.locator(".portrait-stage");
  await expect(stage).toHaveAttribute("data-revealing", "false");
  await expect(stage).toHaveAttribute("data-ready", "true");
  const box = await stage.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.35, box!.y + box!.height * 0.4);
  await expect(stage).toHaveAttribute("data-revealing", "true");
  await expect.poll(() => page.evaluate(radius)).toBeGreaterThan(100);
  const before = Number(
    await stage.evaluate((el) =>
      parseFloat((el as HTMLElement).style.getPropertyValue("--reveal-x")),
    ),
  );
  await page.mouse.move(box!.x + box!.width * 0.65, box!.y + box!.height * 0.4);
  await expect
    .poll(() =>
      stage.evaluate((el) =>
        parseFloat((el as HTMLElement).style.getPropertyValue("--reveal-x")),
      ),
    )
    .toBeGreaterThan(before + 30);
  await page.mouse.move(0, 0);
  await expect.poll(() => page.evaluate(radius)).toBeLessThan(0.2);
  await expect(page.locator(".code-reveal-layer")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});
test("keyboard reveal, quality controls, and reduced-motion static mode work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Reveal the code" });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Hide the code" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => page.evaluate(radius)).toBeGreaterThan(300);
  await expect(page.getByLabel("Portrait rendering quality")).toBeDisabled();
  await expect(page.locator(".portrait-stage")).toHaveAttribute(
    "data-quality",
    "low",
  );
  await page.keyboard.press("Enter");
  await expect.poll(() => page.evaluate(radius)).toBe(0);
});
test("touch drag reveals code without blocking normal vertical scrolling", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "mobile",
    "Touch behavior is exercised in mobile Chromium.",
  );
  await page.goto("/");
  const stage = page.locator(".portrait-stage");
  await expect(stage).toHaveAttribute("data-quality", "low");
  await stage.dispatchEvent("pointerdown", {
    pointerType: "touch",
    clientX: 260,
    clientY: 350,
    buttons: 1,
  });
  await expect(stage).toHaveAttribute("data-revealing", "true");
  await stage.dispatchEvent("pointermove", {
    pointerType: "touch",
    clientX: 290,
    clientY: 390,
    buttons: 1,
  });
  await stage.dispatchEvent("pointercancel", { pointerType: "touch" });
  await expect.poll(() => page.evaluate(radius)).toBeLessThan(0.2);
  expect(await stage.evaluate((el) => getComputedStyle(el).touchAction)).toBe(
    "pan-y",
  );
  await page.getByRole("button", { name: "Reveal the code" }).tap();
  await expect(stage).toHaveAttribute("data-full", "true");
});
test("an unavailable image falls back to a labeled neutral asset", async ({
  page,
}) => {
  await page.route("**/images/portrait-placeholder.svg", (route) =>
    route.fulfill({ status: 404, body: "not found" }),
  );
  await page.goto("/");
  await expect(page.locator(".portrait-stage")).toHaveAttribute(
    "data-image-fallback",
    "true",
  );
  await expect(page.getByText("IMAGE UNAVAILABLE · PLACEHOLDER")).toBeVisible();
  await page.getByRole("button", { name: "Reveal the code" }).click();
  await expect(
    page.getByRole("button", { name: "Hide the code" }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("intentional desktop scroll expands the code layer and returning to the top closes it", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "mobile",
    "The low-quality mobile profile intentionally omits the scroll reveal.",
  );
  await page.goto("/");
  const stage = page.locator(".portrait-stage");
  await expect(stage).toHaveAttribute("data-ready", "true");
  await page.mouse.move(0, 0);
  await page.evaluate(() => window.scrollTo(0, 350));
  await expect.poll(() => page.evaluate(radius)).toBeGreaterThan(100);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(radius)).toBeLessThan(0.2);
});
test("quality selection works and atmospheric code pauses when the document is hidden", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Portrait rendering quality").selectOption("high");
  await expect(page.locator(".portrait-stage")).toHaveAttribute(
    "data-quality",
    "high",
  );
  await page.getByRole("button", { name: "Reveal the code" }).click();
  await expect(page.locator(".portrait-stage")).toHaveAttribute(
    "data-revealing",
    "true",
  );
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".portrait-stage")).toHaveAttribute(
    "data-page-visible",
    "false",
  );
  expect(
    await page
      .locator(".code-texture")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("paused");
});
test("portrait controls remain clear of the overlapping name and resize cleanly", async ({
  page,
}) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "Reveal the code" });
  await expect(button).toBeVisible();
  const control = await button.boundingBox();
  const name = await page.locator(".hero-name").boundingBox();
  expect(control).not.toBeNull();
  expect(name).not.toBeNull();
  expect(control!.y + control!.height).toBeLessThan(name!.y);
  await page.setViewportSize({ width: 820, height: 1180 });
  await expect(page.locator(".portrait-stage")).toBeVisible();
  await button.click();
  await expect(page.locator(".portrait-stage")).toHaveAttribute(
    "data-full",
    "true",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
