# Sprint 004 — CI/CD

Fecha: 27/10/2026. Rama de trabajo: codex/portfolio-003-interactive-universe; base e2b5262. Auditoría inicial: origin/HEAD=dev y origin/dev=83c27dc. No había commits remotos nuevos respecto al ancestro y dev es antecesor del trabajo actual. Se preserva S02 y todos los cambios sin confirmar de S03. No se empleó reset, force push ni eliminación de ramas.

Contrario al contexto inicial, Netlify ya estaba conectado a Portfolio_Ruben_3.0_2027/main y su último deploy automático correspondía a e2b5262. Se cambió la integración del mismo sitio a rubenci04/portfolio_web/dev con API oficial updateSite, reutilizando la instalación GitHub existente. Se verificaron cmd=npm run build, dir=dist y stop_builds=false. Project ID: 31f2593b-b266-49c9-8dff-25d5682fd46d. No se creó otro sitio.

Netlify CLI 27.14.2 ejecutada con npx desde el registro oficial. Autenticación mediante login de navegador; no se incluyeron tokens en el repositorio. El control del navegador estaba deshabilitado en ajustes Work; no fue necesario para el acceso CLI exitoso. El estado local .netlify está ignorado.

Validaciones previas a integración: lint aprobado, 56/56 tests aprobados en cuatro tamaños, build producción aprobado, revisión de diff y búsqueda básica de secretos sin hallazgos nuevos. Ningún dist/node_modules/.env/.netlify/state.json está versionado. Los identificadores públicos preexistentes de EmailJS se conservan. El build local de producción se abrió realmente en Chrome a 375/768/1440/1920: 16 proyectos, filtros Android y fichas, sin errores de página ni overflow, canonical real e index, follow. Evidencia: evidence/s04-production-check.json.

netlify.toml activa producción en contexto production y mantiene previews noindex. La URL real se centraliza en SITE_URL. prerender añade build-revision si Netlify proporciona un COMMIT_REF válido. La configuración evita SSR en hosting y redirecciones SPA innecesarias. README y guía explican el flujo Git y consultas de deploy.

Resultado remoto y deploy: pendiente de registrar después de integrar y verificar el disparo automático. No se usará upload manual como sustituto.

## Primer despliegue automático verificado

Commit de implementación: **2d4b230ed87cc0d269d252cb16a5d90a895ddd54**. Se subió la rama de trabajo a origin y se integró por fast-forward en dev; el push a origin/dev fue aceptado sin force push. Netlify inició automáticamente el deploy **6ae02977eee2574ccfde686e**, build 6ae02977eee2574ccfde686c. Resultado: **ready**, context production, branch dev, commit_ref igual al SHA, manual_deploy=false, publicado el 27/10/2026 04:33:11 UTC (01:33:11 de Buenos Aires).

Se abrió la URL pública real en Chrome a 375/768/1440/1920 y se comprobó meta build-revision igual al SHA anterior, index/follow sin header noindex, canonical real, 16 proyectos (también sin JavaScript), filtro Android de 2 apps y apertura/cierre de ficha. Sin errores de página ni overflow. Se guardaron capturas reales móvil/escritorio de Hero y Android en screenshots/s04. Los assets de aplicación coinciden con el build local (index-C1UYvJdy.js, index-CqVt4j_o.css).

Evidencias: evidence/s04-live-check.json, evidence/s04-netlify.json y screenshots/s04. La vinculación inicial ya disparó un build del antiguo dev antes de la integración; ese deploy no se usó como prueba de la versión actual. La prueba válida es el deploy con SHA 2d4b230.

La integración GitHub existente pudo reutilizarse para portfolio_web/dev sin instalar otro webhook ni solicitar tokens. Se mantuvieron los otros sitios y el remoto portfolio2027. No se ejecutó netlify deploy ni carga manual de dist.

Este informe y las capturas se entregan en un segundo commit de documentación por la misma rama; su integración en dev comprueba nuevamente el flujo automático. No modifica la aplicación. Consultar git log -2 y el historial de Deploys para identificar ambos commits. No se requiere una acción manual para autorizar servicios: login y API funcionaron dentro de esta sesión.

## Cambio de nombre observado durante la sesión

El sitio fue renombrado externamente a **portfoliorubenalbarracin** mientras se verificaba el primer deploy; no fue una acción ejecutada por Codex. El Project ID permaneció igual. El dominio anterior empezó a responder 404 y el nuevo respondió 200 con el mismo build-revision 2d4b230. Para que canonical y sitemap correspondan al sitio realmente publicado se actualiza SITE_URL a https://portfoliorubenalbarracin.netlify.app, manteniendo el mismo sitio y la conexión portfolio_web/dev. Se preguntó por preferencia del nombre; al no recibirse aclaración durante el trabajo independiente se toma la URL primaria verificada del sitio existente. No se crea ni renombra otro sitio.

El segundo commit guarda esta corrección legítima de metadatos y la evidencia del primer despliegue. Su push debe producir un segundo despliegue automático, que se verifica en la sesión antes del informe final.
