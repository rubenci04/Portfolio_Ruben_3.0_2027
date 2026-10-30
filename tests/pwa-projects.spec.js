import { test, expect } from '@playwright/test';

test('nuevas PWA: enlaces, miniaturas reales y ficha', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('group', { name: 'Filtrar catálogo' }).getByRole('button', { name: 'Aplicaciones web' }).click();
  await expect(page.locator('#catalog .project-card')).toHaveCount(5);
  for (const [id, title, demo, repo] of [
    ['brandkit-studio', 'BrandKit Studio', 'https://brandkit-studio.rea-04.workers.dev/', 'https://github.com/rubenci04/BrandKit-Studio'],
    ['rio-seco-conecta', 'Río Seco Conecta', 'https://rio-seco-conecta.rea-04.workers.dev/', 'https://github.com/rubenci04/R-o-Seco-Conecta'],
  ]) {
    const card = page.locator(`#catalog [data-project="${id}"]`);
    await expect(card).toContainText('Publicada · PWA');
    await expect(card.locator(`a[href="${demo}"]`)).toBeVisible();
    await expect(card.locator(`a[href="${repo}"]`)).toBeVisible();
    await card.locator('img').scrollIntoViewIfNeeded();
    await card.locator('img').evaluate(img => img.decode());
    expect(await card.locator('img').evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
    const trigger = card.getByRole('button', { name: `Ver ficha de ${title}`, exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(dialog.locator('.project-gallery img')).toHaveCount(1);
    if (id === 'rio-seco-conecta') await expect(dialog).toContainText('No es una aplicación oficial');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  }
  expect(errors).toEqual([]);
});
