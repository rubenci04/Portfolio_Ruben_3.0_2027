import { test, expect } from "@playwright/test";

test("planetas, zoom limitado y selección por teclado", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const planet = page.getByRole("button", { name: "Explorar planeta Godot", exact: true });
  await planet.focus();
  await page.keyboard.press("Enter");
  await expect(planet).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("heading", { name: "Mundos para jugar" })).toBeVisible();
  for (let i = 0; i < 6; i++) {
    const zoom = page.getByRole("button", { name: "Acercar escena" });
    if (await zoom.isEnabled()) await zoom.click();
  }
  await expect(page.getByLabel("Zoom de la escena")).toHaveText("160%");
  await expect(page.getByRole("button", { name: "Acercar escena" })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Restablecer escena" }).click();
  await expect(page.getByLabel("Zoom de la escena")).toHaveText("100%");
  await page.getByRole("button", { name: "Cerrar planeta" }).click();
  await expect(planet).toBeFocused();
  await planet.click();
  await page.getByRole("button", { name: "Ver Godot", exact: true }).click();
  await expect(page.locator("#catalog .project-card")).toHaveCount(3);
  await expect(page.locator("#catalog-heading")).toBeFocused();
});

test("cohete: recorrido manual, ficha y detención", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Iniciar recorrido de proyectos" }).click();
  const panel = page.locator(".universe-information");
  await expect(panel).toContainText("Bee Alien 3D");
  await panel.getByRole("button", { name: "Siguiente" }).click();
  await expect(panel).toContainText("Tucumán Rush");
  await panel.getByRole("button", { name: "Ver ficha", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("Tucumán Rush");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Detener recorrido" }).click();
  await expect(panel).toContainText("Tres destinos");
  await expect(page.getByRole("button", { name: "Iniciar recorrido de proyectos" })).toBeFocused();
});

test("pausa global y rueda de scroll sin secuestro", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pausar universo" }).click();
  const canvas = page.locator(".space-particles");
  const pixels = await canvas.evaluate(e => e.toDataURL());
  await page.waitForTimeout(180);
  expect(await canvas.evaluate(e => e.toDataURL())).toBe(pixels);
  await expect(page.locator(".stars").first()).toHaveCSS("animation-play-state", "paused");
  await page.locator(".universe-scene").hover();
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 450);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
});

test("Android, fallbacks sin videos y fichas con foco restaurado", async ({ page }) => {
  const mediaRequests = [];
  page.on("request", request => { if (/\.(mp4|webm)(\?|$)/.test(request.url())) mediaRequests.push(request.url()); });
  await page.goto("/");
  await page.getByRole("button", { name: /^Android/ }).click();
  await expect(page.locator("#catalog .project-card")).toHaveCount(2);
  await expect(page.locator("#catalog .phone-frame")).toHaveCount(2);
  const ratio = await page.locator("#catalog .project-cover").first().evaluate(element => element.clientWidth / element.clientHeight);
  expect(ratio).toBeCloseTo(16 / 9, 1);
  await expect(page.locator("video")).toHaveCount(0);
  for (const [id, title, repo] of [["ostoappar", "OstoAppAR", "OstoAppAR"], ["gym-scientific", "Gym Scientific App", "gym_scientific_app"]]) {
    const card = page.locator(`#catalog [data-project="${id}"]`);
    await expect(card).toContainText("Funcional · APK");
    await expect(card.locator("a")).toHaveAttribute("href", `https://github.com/rubenci04/${repo}`);
    const button = card.getByRole("button", { name: `Ver ficha de ${title}` });
    await button.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("distribuida mediante APK");
    await expect(dialog.locator(".project-gallery")).toHaveCount(0);
    await expect(dialog.locator('a[download]')).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(button).toBeFocused();
  }
  expect(mediaRequests).toEqual([]);
});
