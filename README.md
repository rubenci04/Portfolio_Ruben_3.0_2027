# Rubén Albarracín — portfolio

React + Vite, universo interactivo CSS/Canvas, seis destacados y catálogo completo de 16 proyectos. Incluye aplicaciones Android, videojuegos Godot/web, aplicaciones de gestión y sitios colaborativos. Fichas accesibles y medios opcionales sin screenshots inventados.

## Desarrollo local

Node 22.12+ (Vite 7); el hosting utiliza Node 22. Instalación reproducible con package-lock.json:

```powershell
npm ci
npm run dev
npm run lint
npm test -- --workers=2
npm run build
npm run preview
```

Los tests usan Chrome instalado. No enviar correo real desde pruebas: EmailJS se intercepta. Los medios de test viven en tests/fixtures y no forman parte de dist.

## Flujo de publicación

Repositorio de producción: https://github.com/rubenci04/portfolio_web
Rama de producción: **dev**.
Sitio existente: https://effortless-piroshki-a3c8f9.netlify.app/
Project ID: 31f2593b-b266-49c9-8dff-25d5682fd46d.

1. Implementar en una rama de funcionalidad creada desde dev actualizado.
2. Ejecutar lint, tests, build y git diff --check.
3. Crear commit y subir la rama a origin.
4. Integrar a dev por fast-forward o PR según las reglas del repositorio.
5. La integración nativa de Netlify detecta el push a dev, construye con npm run build y publica dist automáticamente.
6. Revisar Deploys en Netlify y comprobar el SHA del deploy contra origin/dev. El HTML incluye build-revision cuando Netlify proporciona COMMIT_REF.

Un push a una rama de funcionalidad no necesariamente actualiza producción. Los Deploy Previews dependen de las preferencias y permisos de Netlify; si se habilitan para PRs, su enlace aparece en los checks y en Deploys, con noindex. No se añadió un workflow de GitHub Actions para desplegar.

No se sube dist, node_modules, .env, cachés ni .netlify/state.json. La CLI puede vincularse localmente con netlify link --id, pero ese vínculo por sí solo no configura CI/CD.

## SEO y configuración

netlify.toml conserva preview por defecto y activa SITE_ENV=production / SITE_URL real únicamente en contexto production. Producción genera canonical, sitemap e index, follow; deploy-preview y branch-deploy conservan noindex. Al cambiar el nombre del sitio, actualizar SITE_URL en el contexto de producción y generar otro build antes de comprobar canonical/headers. No hay redirección SPA global: las rutas son anclas de una sola página.

## Contenido y documentación

src/data/projects.js centraliza categorías, estado editorial y medios. El propietario confirmó ambas apps Android funcionales y empaquetadas en APK; no hay descargas públicas verificadas ni Google Play. Las capturas internas del bar requieren datos de demostración. El retrato circular conserva el archivo fuente.

- [Guía de CI/CD](docs/DEPLOY_GUIDE.md)
- [Informe Sprint 004](docs/SPRINT_004_CICD.md)
- [Sprint 003](docs/SPRINT_003.md)
- [QA](docs/QA_REPORT.md)
- [Medios](public/media/projects/README.md)
- [Capturas](docs/screenshots/s03/)
- [SEO comparativo](docs/SEO_AUDIT.md)
