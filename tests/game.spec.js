import { test, expect } from "@playwright/test";

test("minijuego: abrir, ver el canvas y cerrar con Esc", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Jugar al minijuego espacial" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Minijuego espacial de Bee" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("canvas")).toBeVisible();
  await dialog.getByRole("button", { name: "Jugar", exact: true }).click();
  await page.waitForTimeout(400);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
