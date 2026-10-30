import { test, expect } from "@playwright/test";

test("minijuego: abrir, ver el canvas y cerrar con Esc", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Jugar al minijuego espacial" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Minijuego espacial de Bee" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("canvas")).toBeVisible();
  const items = dialog.locator('.sg-power-legend span');
  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toHaveCSS('background-color', 'rgb(53, 231, 255)');
  await expect(items.nth(1)).toHaveCSS('background-color', 'rgb(141, 245, 138)');
  await expect(items.nth(2)).toHaveCSS('background-color', 'rgb(193, 138, 255)');
  await dialog.getByRole("button", { name: "Jugar", exact: true }).click();
  await page.waitForTimeout(400);
  await page.keyboard.press('p');
  await expect(dialog.getByRole('heading', { name: 'Pausa', exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
