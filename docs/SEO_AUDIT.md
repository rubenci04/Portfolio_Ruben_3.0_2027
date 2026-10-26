# Auditoría SEO comparativa — 26 de octubre de 2026

Se consultaron HTML, headers, robots.txt y sitemap.xml por HTTP, y DOM renderizado en Chrome. Evidencia reproducible: `evidence/http-audit.json`, `site-0.html` a `site-3.html`, `rendered-audit.json` y `links.json`. Los fallos iniciales de red del sandbox se resolvieron con ejecución autorizada. Las observaciones corresponden a esta fecha, no garantizan disponibilidad futura.

| Sitio | HTTP / HTML inicial | Metadatos | DOM renderizado |
|---|---|---|---|
| [Estéticars](https://esteticars-monteros.vercel.app/) | 200; root vacío, React | Title con marca y localidad; sin description, canonical, OG ni JSON-LD | Un H1, secciones H2 y servicios H3; 9 imágenes, 3 enlaces. Primero aparece una pantalla de carga; se esperó su finalización. |
| [Don Enrique](https://donenriqueweb.netlify.app/) | 200; app vacío, Vue | Title descriptivo con gastronomía; description; sin canonical, OG ni JSON-LD | Un H1, H2 de actividad y H3 para carta/historia; 7 imágenes y 14 enlaces. |
| [Traidores No](https://traidoresno.vercel.app/) | 200; root vacío, React | Title, description, OG; imagen OG relativa; sin canonical ni JSON-LD | H2/H3, sin H1 observado; 32 imágenes y 14 enlaces. Autoría compartida declarada en HTML. |
| [Portfolio anterior](https://portfoliorubenweb.netlify.app/) | 404 | No se puede evaluar la versión publicada original | El contenido histórico se recuperó de `dev`, no de un sitio operativo. |

En los tres sitios activos, `/robots.txt` y `/sitemap.xml` devuelven 404. No se observaron directivas noindex en el HTML ni en los headers recibidos. La ausencia de robots no bloquea por sí misma la indexación; tampoco demuestra que Google haya indexado estas páginas. Las rutas de las portadas son sencillas, HTTPS y sin parámetros.

Los tres necesitan JavaScript para exponer el texto principal. Estéticars presenta servicios concretos y una marca que incluye Monteros; Don Enrique desarrolla contenido gastronómico; Traidores No incluye música, integrantes y actuaciones. Esto aporta contexto temático, pero no permite explicar posiciones en Google. Los enlaces se registran en el JSON: no se realizó un rastreo completo de todas las rutas internas.

La sesión de Chrome registró aproximadamente 0,41 MB de transferencias para Estéticars, 3,79 MB para Don Enrique y 16,4 MB para Traidores No. Son observaciones de una carga, afectadas por caché, recursos externos y carga diferida; no son benchmarks comparables ni Core Web Vitals. Don Enrique usa lazy loading en varias imágenes, aunque una fuente tiene 4000 px. Traidores carga muchas imágenes con loading automático. Se registraron alt, tamaños y recursos; no se hizo una auditoría exhaustiva de contraste o accesibilidad de terceros. Su ausencia de H1 es una mejora concreta de estructura.

## Qué investigar y corregir

1. Search Console: inspección de URL, HTML rastreado, cobertura, canonical elegido, consultas, impresiones y clics. Solo allí se puede contrastar la percepción de visibilidad con datos del propietario.
2. Prerenderizar contenido público; añadir description a Estéticars y H1 a Traidores; configurar canonical y sitemap reales.
3. Completar OG con URLs absolutas y optimizar imágenes grandes/carga diferida.
4. Medir LCP, CLS e INP con datos de campo o pruebas de laboratorio controladas antes de atribuir diferencias al rendimiento.

No se observaron evidencias suficientes para afirmar que Estéticars tenga mejor SEO técnico global. Don Enrique y Traidores poseen metadatos que Estéticars no tiene. La relevancia local, competencia, antigüedad y enlaces externos son hipótesis, no conclusiones de esta auditoría.

## Aplicado al portfolio

HTML estático generado con React en build e hidratado en cliente, sin servidor SSR en hosting. Se comprobó que los 13 proyectos y el Hero aparecen con JavaScript desactivado. Idioma es-AR, descripción específica, autor, OG, Twitter summary y Person con identidad real. Un H1 y navegación con anclas rastreables. Imágenes WebP y texto alternativo; fuente original con display=swap.

`scripts/site-config.mjs` centraliza SITE_ENV/SITE_URL. Preview por defecto: meta y header noindex, follow; robots permite rastreo para que el buscador lea noindex. Sin canonical ni sitemap ficticio. Producción exige origen HTTPS explícito, genera canonical, og:url y sitemap y quita noindex. Los contextos Netlify de preview/branch fuerzan preview. Falta elegir dominio definitivo y una imagen social editorial; no se inventó una URL ni una captura.

Kiosco agotó 20 segundos sin respuesta: no prueba una caída permanente. Se conserva su URL histórica en datos y se desactiva la acción de demo. El portfolio antiguo devuelve 404. Los otros 12 destinos de proyectos/perfil GitHub respondieron 200; eso acredita respuesta HTTP, no el funcionamiento interno de cada aplicación. LinkedIn/WhatsApp se conservaron del perfil y no se verificó su sesión ni se enviaron mensajes.

Actualización del catálogo: la revisión posterior autorizada por el propietario elimina Tejido y App Python e incorpora Don Enrique Gestión. El HTML estático actual contiene 12 proyectos; las cifras de 13 de la primera auditoría corresponden al catálogo recuperado antes de esta selección editorial. El acceso de Render devuelve 200 tras redirigir a /auth/login, sin autenticar. Enlaces y capturas finales regenerados. La protección noindex también contempla previews de Vercel y ramas de Cloudflare Pages.
