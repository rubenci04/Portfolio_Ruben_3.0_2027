# Despliegue continuo del portfolio

Destino autorizado: **rubenci04/portfolio_web**, rama **dev**. URL: https://effortless-piroshki-a3c8f9.netlify.app/. Project ID existente: 31f2593b-b266-49c9-8dff-25d5682fd46d.

## Configuración

La integración nativa GitHub de Netlify debe tener repo_path=rubenci04/portfolio_web, repo_branch=dev, base vacía (raíz), cmd=npm run build, dir=dist y stop_builds=false. Se reutiliza la instalación GitHub existente, sin webhooks duplicados ni un sitio nuevo.

netlify.toml versiona Node 22, instalación de dependencias de desarrollo necesarias para Vite, comando y carpeta. package-lock.json fija las resoluciones; npm ci es el comando local de instalación reproducible. Netlify realiza su instalación antes del build. No se versiona dist.

## Flujo normal

```powershell
git switch dev
git pull --ff-only origin dev
git switch -c codex/nombre-del-cambio
npm ci
npm run lint
npm test -- --workers=2
npm run build
git diff --check
git add <archivos-revisados>
git commit -m "Descripción concreta"
git push -u origin codex/nombre-del-cambio
```

Integrar la rama en dev por PR o fast-forward según las protecciones vigentes. Netlify escucha los cambios en dev y publica automáticamente. Un push de funcionalidad no garantiza un deploy de producción. Consultar Deploy Previews en los checks del PR/Deploys de Netlify si están habilitados; no asumir que lo están solo por tener Git conectado.

En cada producción revisar state=ready, branch=dev, commit_ref igual al SHA esperado, repo/commit_url correctos y manual_deploy=false. Abrir la URL pública, comprobar los 16 proyectos y Android. Comparar meta build-revision con el deploy para descartar una versión antigua servida con HTTP 200.

## Acceso local de CLI

La CLI oficial puede ejecutarse con npx netlify-cli@27.14.2. netlify login autoriza en navegador; no pegar tokens en el chat. netlify link --id 31f2593b-b266-49c9-8dff-25d5682fd46d vincula el directorio local y crea .netlify/state.json, excluido de Git. Esto no sustituye la conexión Git real en el sitio.

## Producción y previews

Producción: SITE_ENV=production y SITE_URL=https://effortless-piroshki-a3c8f9.netlify.app, definidos solo en context.production.environment. HTML index, follow, canonical/og:url absolutos y sitemap con la URL real. Previews: SITE_ENV=preview y noindex en HTML/headers. Se permite rastrear robots.txt para leer noindex.

Al cambiar el subdominio o elegir dominio propio, actualizar SITE_URL en netlify.toml con el origen HTTPS real y publicar ese cambio mediante dev. Verificar canonical, sitemap y headers de respuesta después del deploy. No se generan URLs ficticias.

El sitio usa anclas; no requiere una reescritura /* /index.html 200. El HTML principal está prerenderizado en build y se hidrata en cliente, sin Node/SSR en hosting.

## Diagnóstico

Si falla un deploy, revisar sus logs antes de tocar código. Validar el mismo build localmente; subir la corrección por Git para que Netlify ejecute un nuevo build. No sustituir la prueba de CI/CD por una carga manual de dist. Si una regla de GitHub bloquea dev, usar el PR requerido y respetar aprobaciones.

Documentación oficial consultada: https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/ y https://open-api.netlify.com/.
