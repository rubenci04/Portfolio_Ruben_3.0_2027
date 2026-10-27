# Sprint 004 — CI/CD

Fecha: 27/10/2026. Rama de trabajo: codex/portfolio-003-interactive-universe; base e2b5262. Auditoría inicial: origin/HEAD=dev y origin/dev=83c27dc. No había commits remotos nuevos respecto al ancestro y dev es antecesor del trabajo actual. Se preserva S02 y todos los cambios sin confirmar de S03. No se empleó reset, force push ni eliminación de ramas.

Contrario al contexto inicial, Netlify ya estaba conectado a Portfolio_Ruben_3.0_2027/main y su último deploy automático correspondía a e2b5262. Se cambió la integración del mismo sitio a rubenci04/portfolio_web/dev con API oficial updateSite, reutilizando la instalación GitHub existente. Se verificaron cmd=npm run build, dir=dist y stop_builds=false. Project ID: 31f2593b-b266-49c9-8dff-25d5682fd46d. No se creó otro sitio.

Netlify CLI 27.14.2 ejecutada con npx desde el registro oficial. Autenticación mediante login de navegador; no se incluyeron tokens en el repositorio. El control del navegador estaba deshabilitado en ajustes Work; no fue necesario para el acceso CLI exitoso. El estado local .netlify está ignorado.

Validaciones previas a integración: lint aprobado, 56/56 tests aprobados en cuatro tamaños, build producción aprobado, revisión de diff y búsqueda básica de secretos sin hallazgos nuevos. Ningún dist/node_modules/.env/.netlify/state.json está versionado. Los identificadores públicos preexistentes de EmailJS se conservan. El build local de producción se abrió realmente en Chrome a 375/768/1440/1920: 16 proyectos, filtros Android y fichas, sin errores de página ni overflow, canonical real e index, follow. Evidencia: evidence/s04-production-check.json.

netlify.toml activa producción en contexto production y mantiene previews noindex. La URL real se centraliza en SITE_URL. prerender añade build-revision si Netlify proporciona un COMMIT_REF válido. La configuración evita SSR en hosting y redirecciones SPA innecesarias. README y guía explican el flujo Git y consultas de deploy.

Resultado remoto y deploy: pendiente de registrar después de integrar y verificar el disparo automático. No se usará upload manual como sustituto.
