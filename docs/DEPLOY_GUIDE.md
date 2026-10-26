# Ejecutar y publicar una preview independiente

## Local

Requiere Node 22 o compatible con Vite 7; se validó en Node 24.21.0 y Chrome instalado.

```powershell
cd D:\proyectos\portfolio
npm ci
npm run dev
npm run lint
npm test -- --workers=2
npm run build
npm run preview
```

`npm run build` genera assets y HTML prerenderizado en `dist`. El resultado incluye index.html, assets, robots.txt y _headers. No necesita Node en el hosting. Las rutas son anclas de una sola página: no requiere redirección SPA; una ruta inexistente debe devolver 404.

## Netlify Drop — sitio nuevo

1. En PowerShell, ejecutar `$env:SITE_ENV='preview'` y `npm run build`.
2. Abrir [Netlify Drop](https://app.netlify.com/drop), iniciar sesión y elegir la creación de un proyecto nuevo independiente. No usar el área Deploys del sitio antiguo.
3. Arrastrar la carpeta **D:\proyectos\portfolio\dist** completa, no `src`, ni el repositorio, ni la carpeta padre. El index.html debe quedar en la raíz del despliegue.
4. Netlify asignará una URL del nuevo proyecto. Abrirla y comprobar imágenes, filtros, navegación móvil y formulario. La entrega real de EmailJS requiere un envío autorizado y confirmar recepción; el mock local no lo acredita.
5. Comprobar en el HTML `robots=noindex, follow` y en la respuesta `X-Robots-Tag: noindex, follow`. Noindex no es control de acceso: quien tenga la URL puede ver la preview.
6. Para actualizar esta preview, reconstruir y arrastrar dist al área de despliegues de **ese proyecto nuevo**.

No se ejecutó ninguna publicación. Netlify CLI no fue encontrada en PATH; no se comprobó autenticación ni se instaló. No se modificó el sitio existente.

## Conectar GitHub posteriormente

El propietario autorizó subir esta versión al repositorio nuevo. La rama publicada será `main`. En el proyecto nuevo de Netlify, vincular el repositorio `rubenci04/Portfolio_Ruben_3.0_2027`, seleccionar `main`, raíz del repositorio, comando `npm run build` y directorio `dist`. `netlify.toml` fija Node 22 y preview por defecto. Mantener SITE_ENV=preview durante la revisión. La vinculación habilita despliegues futuros automáticos, por lo que debe hacerse deliberadamente.

## Dominio definitivo

Elegir primero el origen HTTPS real. Configurar SITE_ENV=production y SITE_URL con ese origen, sin ruta, query ni fragmento, exclusivamente para el contexto production. Recompilar: se generan canonical, og:url y sitemap reales; se reemplaza noindex por index y se quita el header de exclusión. Deploy previews y branch deploys siguen noindex aunque hereden SITE_URL. No hay un dominio de ejemplo incorporado al build entregado.

En Netlify, cambiar SITE_ENV del contexto production en netlify.toml cuando corresponda; no establecerlo globalmente para todos los contextos. Validar headers y HTML después de publicar y registrar sitemap en Search Console. Al cambiar dominio, decidir redirecciones del antiguo con el propietario.

Referencia oficial consultada: [Crear despliegues](https://docs.netlify.com/deploy/create-deploys/). Los despliegues manuales suben el resultado ya construido.

## Vercel — conexión al repositorio nuevo

1. Crear un proyecto en Vercel e importar `rubenci04/Portfolio_Ruben_3.0_2027`, rama `main`.
2. Framework Vite, comando `npm run build`, salida `dist`; estos valores están en `vercel.json`. Usar Node 22.
3. Durante revisión, establecer SITE_ENV=preview. El HTML tendrá noindex. Vercel no consume el archivo _headers: verificar la meta robots en el HTML servido; vercel.json configura los headers de seguridad compatibles.
4. Cuando se defina el dominio final, establecer SITE_ENV=production y SITE_URL con el origen real **solo en Production** y recompilar. VERCEL_ENV distinto de production fuerza noindex aunque se herede SITE_ENV=production.
5. Las rutas internas son anclas; no hace falta una reescritura global que convierta cualquier error 404 en una página válida.

## Cloudflare Pages — conexión al repositorio nuevo

1. En Workers & Pages, crear un proyecto Pages desde GitHub y elegir `rubenci04/Portfolio_Ruben_3.0_2027`.
2. Rama de producción main, raíz del repositorio, comando `npm run build`, salida `dist`, Node 22 mediante NODE_VERSION.
3. Comenzar con SITE_ENV=preview. Cloudflare Pages consume dist/_headers y la meta robots permanece noindex.
4. Al elegir el dominio definitivo, cambiar solo producción a SITE_ENV=production y SITE_URL real. Las ramas distintas de main fuerzan preview cuando CF_PAGES=1. Si cambia la rama principal, configurar SITE_PRODUCTION_BRANCH con su nombre real.
5. Publicar implica crear un despliegue externo: esta sesión prepara la integración, pero no conecta cuentas ni publica automáticamente.

El portfolio se sirve estáticamente en ambos proveedores. La aplicación Python del bar continúa en Render como proyecto independiente: el portfolio solo presenta su trabajo y enlaza al acceso existente.

Fuentes oficiales: [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite) y [configuración de builds en Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/build-configuration/).
