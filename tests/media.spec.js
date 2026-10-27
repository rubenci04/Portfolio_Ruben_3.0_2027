import { test, expect } from "@playwright/test";

test("microvideos diferidos, reproducción exclusiva y pausa", async ({ page }) => {
  await page.goto("/tests/fixtures/media-harness.html");
  // Synthetic gray 64px fixture, never shipped as project gameplay.
  await page.evaluate(() => window.installTestMedia('/tests/fixtures/test-preview.webm'));
  await expect(page.getByRole("button", { name: "Reproducir preview de A" })).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".gameplay-preview")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Reproducir preview de A" }).click();
  await expect.poll(() => page.locator("video").first().evaluate(video => video.paused)).toBe(false);
  await page.getByRole("button", { name: "Reproducir preview de B" }).evaluate(button => button.click());
  await expect.poll(() => page.locator("video").nth(1).evaluate(video => video.paused)).toBe(false);
  await expect.poll(() => page.locator("video").first().evaluate(video => video.paused)).toBe(true);
  await expect(page.locator("video").nth(1)).toHaveJSProperty("muted", true);
  await page.evaluate(() => scrollTo(0, 1500));
  await expect.poll(() => page.locator("video").nth(1).evaluate(video => video.paused)).toBe(true);
  await page.evaluate(() => scrollTo(0, 0));
  await page.mouse.move(350, 10);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator(".gameplay-preview").first().hover();
  await expect.poll(() => page.locator("video").first().evaluate(video => video.paused)).toBe(false);
  await page.mouse.move(600, 10);
  await expect.poll(() => page.locator("video").first().evaluate(video => video.paused)).toBe(true);
});

test("galería vertical opcional y fallback de portada", async ({ page }) => {
  await page.goto("/tests/fixtures/media-harness.html");
  await page.evaluate(() => window.installTestGallery());
  await expect(page.getByAltText("Fixture one")).toBeVisible();
  await expect(page.locator(".gallery-main")).toHaveCSS("object-fit", "contain");
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByAltText("Fixture two")).toBeVisible();
  await page.getByRole("button", { name: "Anterior" }).click();
  await expect(page.getByAltText("Fixture one")).toBeVisible();
  await page.evaluate(() => window.installBrokenCover());
  await expect(page.locator(".cover-title")).toContainText("Fixture");
  await expect(page.locator(".project-cover img")).toHaveCount(0);
});

test("video no compatible conserva la portada", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/fixture-unsupported.webm", route => route.fulfill({ contentType: "video/webm", headers: {"content-length":"18"}, body: "invalid test media" }));
  await page.goto("/tests/fixtures/media-harness.html");
  await page.evaluate(() => window.installTestMedia("/fixture-unsupported.webm"));
  await page.getByRole("button", { name: "Reproducir preview de A" }).click();
  await expect(page.getByRole("button", { name: "Reproducir preview de A" })).toHaveCount(0);
  await expect(page.getByText("Test fixture A", { exact: true })).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
});
