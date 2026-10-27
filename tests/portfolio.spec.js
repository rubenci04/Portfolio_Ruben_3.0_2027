import { test, expect } from "@playwright/test";

test("renderizado, navegación, accesibilidad estructural y responsive", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/Rubén Albarracín/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "realidad.",
  );
  await expect(page.locator("#catalog .project-card")).toHaveCount(14);
  await expect(page.getByRole("link", { name: "Descargar CV" })).toHaveCount(0);
  const integrity = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map(
      (element) => element.id,
    );
    return {
      duplicates: ids.filter((id, index) => ids.indexOf(id) !== index),
      broken: [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute("href"))
        .filter((href) => !document.getElementById(href.slice(1))),
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  expect(integrity).toEqual({ duplicates: [], broken: [], overflow: false });
  await page
    .getByRole("link", { name: "Explorar proyectos", exact: true })
    .click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator(".featured-projects .project-card")).toHaveCount(6);

  expect(errors).toEqual([]);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#about img").scrollIntoViewIfNeeded();
  await page.locator("#about img").evaluate(image => image.decode());
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: testInfo.outputPath("portfolio.png"),
    fullPage: true,
    animations: "disabled",
  });
  await page.screenshot({path: testInfo.outputPath("hero.png"), animations: "disabled"});
  await page.locator("#projects").screenshot({path: testInfo.outputPath("projects.png"), animations: "disabled"});
});

test("filtros y acciones disponibles", async ({ page }) => {
  await page.goto("/");
  for (const [label, count] of [
    ["Aplicaciones web", 3],
    ["Juegos web", 2],
    ["Godot", 3],
    ["Android", 2],
    ["Sitios web", 4],
    ["Todos", 14],
  ]) {
    await page.getByRole("group", { name: "Filtrar catálogo" }).getByRole("button", { name: label }).click();
    await expect(page.locator("#catalog .project-card")).toHaveCount(count);
    await expect(page.getByRole("group", { name: "Filtrar catálogo" }).getByRole("button", { name: label })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator(".project-count")).toHaveText(
      count + " proyectos",
    );
  }
  await expect(page.locator('#catalog [data-project="edu-app"] a')).toHaveAttribute('href','https://edu-app-contable.rea-04.workers.dev/');
  await expect(page.locator('#catalog [data-project="crochet-match"] a')).toHaveCount(0);
  await expect(page.locator('#catalog [data-project="bee-alien"] a')).toHaveCount(1);
  await expect(page.locator('#catalog [data-project="reclutador"] a')).toHaveCount(2);
});

test("menú mediante teclado y cierre al navegar", async ({ page }) => {
  await page.goto("/");
  const menu = page.locator(".menu-toggle");
  if (await menu.isVisible()) {
    await menu.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Inicio", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
    await page.keyboard.press("Enter");
    await page.getByRole("link", { name: "Contacto", exact: true }).click();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/#contact$/);
  } else {
    await page.getByRole("link", { name: "Habilidades", exact: true }).click();
    await expect(page).toHaveURL(/#skills$/);
  }
});

test("contacto: validación, envío simulado y recuperación del error", async ({
  page,
}) => {
  let fail = false;
  await page.route("**/api.emailjs.com/**", async (route) => {
    if (fail)
      await route.fulfill({
        status: 500,
        contentType: "text/plain",
        body: "Unavailable",
      });
    else
      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: "OK",
      });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  expect(await page.locator("#name").evaluate(input => input.validity.valueMissing)).toBe(true);
  await expect(page.locator(".status-message")).toBeEmpty();
  const fill = async () => {
    await page.getByLabel("Tu Nombre").fill("Prueba local");
    await page.getByLabel("Tu Email").fill("prueba@example.com");
    await page
      .getByLabel("Tu Mensaje")
      .fill("Mensaje de prueba interceptado localmente.");
  };
  await fill();
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.locator(".status-message")).toContainText("éxito");
  await expect(page.getByLabel("Tu Nombre")).toHaveValue("");
  fail = true;
  await fill();
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.locator(".status-message")).toContainText("Error");
  await expect(
    page.getByRole("button", { name: "Enviar mensaje" }),
  ).toBeEnabled();
  await expect(page.getByLabel("Tu Mensaje")).not.toHaveValue("");
});

test("movimiento reducido desactiva la animación decorativa", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".planet-sphere").first()).toHaveCSS(
    "animation-name",
    "none",
  );
});

test('catálogo original, foto completa y metadatos', async ({ page }) => {
 await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Las ideasse vuelvenrealidad.');
 for(const title of ['Don Enrique · Gestión del bar','Edu App Contable','Reclutador','Bee Alien 3D','Tucumán Rush','Crochet Match','Ricota Quiz','Estéticars Monteros','Bar Don Enrique','App Ventas y Gestión de Kiosco','Traidores No','Portfolio anterior']) await expect(page.locator('#catalog').getByRole('heading',{name:title,exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'App Python',exact:true})).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Emprendimiento de Tejido',exact:true})).toHaveCount(0);
 await expect(page.locator('.portrait-frame')).toHaveCSS('border-radius','50%');
 await expect(page.locator('html')).toHaveAttribute('lang','es-AR');
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, follow');
 await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/Tucumán/);
 await expect(page.locator('#about img')).toHaveCSS('object-fit','contain');
 await expect(page.locator('#catalog [data-project="bar-gestion"] a')).toHaveAttribute('href','https://github.com/rubenci04/bar_app_web');
 await expect(page.locator('#catalog [data-project="bar-gestion"]')).toContainText('Aplicación de uso privado, sin demo pública');
 await expect(page.locator('#catalog [data-project="kiosco"] a')).toHaveCount(0);
 await expect(page.locator('#catalog [data-project="traidores-no"] a')).toHaveAttribute('href','https://traidoresno.vercel.app/');
 await expect(page.locator('.stars')).toHaveCount(3);
 await expect(page.locator('.planet-control')).toHaveCount(3);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.stars').first()).toHaveCSS('animation-name','none');
});

test('estrellas activas y parallax limitado al puntero', async ({ page }) => {
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/');
 const stars=page.locator('.stars').first();
 const canvas=page.locator('.space-particles');
 await expect(canvas).toHaveCount(1);
 const pixels=await canvas.evaluate(e=>e.toDataURL());
 await expect.poll(()=>canvas.evaluate(e=>e.toDataURL())).not.toBe(pixels);
 await expect(stars).toHaveCSS('animation-name','star-drift');
 const before=await stars.evaluate(e=>getComputedStyle(e).transform);
 await expect.poll(()=>stars.evaluate(e=>getComputedStyle(e).transform)).not.toBe(before);
 await page.mouse.move(100,100);
 await expect.poll(()=>page.locator('.background').evaluate(e=>e.style.getPropertyValue('--px'))).not.toBe('');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.background')).toHaveCSS('--px','0px');
 await expect(stars).toHaveCSS('animation-name','none');
 const still=await canvas.evaluate(e=>e.toDataURL());
 // Allow several potential frames: reduced motion must stop canvas redraws.
 await page.waitForTimeout(180);
 expect(await canvas.evaluate(e=>e.toDataURL())).toBe(still);
});
