# Rubén Albarracín — portfolio espacial

Portfolio React/Vite: aplicaciones web, videojuegos y trabajos anteriores. Rediseño S02 sobre el Sprint 01, recuperando estrellas, Space Mono, fotografía completa y proyectos originales.

## Ejecutar

```powershell
npm ci
npm run dev
```

Node 22+ compatible con Vite 7. Para QA: `npm run lint`, `npm test -- --workers=2` (Chrome instalado), `npm run build` y `npm run preview`. La salida `dist` es HTML estático con hidratación React y se puede publicar manualmente. No requiere SSR en hosting.

## Catálogo y edición

`src/data/projects.js` contiene siete destacados y cinco trabajos anteriores/colaboraciones. Filtros excluyentes y estados explícitos; links sin demo no se inventan. PNG originales preservados y WebP optimizados para la web. Los campos media permiten incorporar capturas, gameplay, galerías, páginas de detalle y builds más adelante. Las portadas abstractas son conceptos visuales, no screenshots.

`src/data/profile.js` centraliza redes y CV (null hasta disponer del archivo definitivo). Contacto conserva EmailJS y sus identificadores públicos originales. No agregar claves privadas al cliente. Los tests interceptan EmailJS y no prueban recepción real.

## SEO y publicación

`scripts/prerender.mjs` genera contenido accesible sin JavaScript, resuelve assets con el manifest de Vite y añade Person. Preview por defecto: noindex en HTML y headers, sin canonical ficticio. `scripts/site-config.mjs` centraliza SITE_ENV/SITE_URL; la publicación definitiva exige un origen real. Vercel queda preparado con `vercel.json`; Cloudflare Pages y Netlify admiten el mismo `dist`. El destino autorizado es `rubenci04/Portfolio_Ruben_3.0_2027`.

- [Decisiones y recuperación de identidad](docs/REDESIGN_DECISIONS.md)
- [Auditoría SEO con evidencia](docs/SEO_AUDIT.md)
- [QA y límites de verificación](docs/QA_REPORT.md)
- [Guía de Vercel, Cloudflare Pages y Netlify Drop](docs/DEPLOY_GUIDE.md)
- [Capturas](docs/screenshots/)

Rama local: `feat/portfolio-spatial-redesign-s02`. Base HEAD: `83c27dc`. Se preservó el trabajo del Sprint 01. El remoto `portfolio2027` apunta al repositorio nuevo; `origin` conserva el anterior. Consultar `git log -1` para el commit de entrega.

Pendientes: dominio, CV, medios reales de los juegos, confirmar Kiosco y correo real. El portfolio anterior publicado responde 404. Tejido y App Python se retiraron por indicación del propietario; los assets fuente se conservan. Don Enrique Gestión tiene acceso privado y captura pública de login; [guía para capturar el interior](docs/BAR_APP_CAPTURE_GUIDE.md).
