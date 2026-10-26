# QA del rediseño S02 — 26/10/2026

## Resultado

- ESLint: aprobado.
- Build Vite + prerender: aprobado. Se necesitó ejecución fuera del sandbox para resolver archivos y lanzar Chrome; no fue un error del código.
- Playwright: 28/28, Chrome real, en 375×812, 768×1024, 1440×900 y 1920×1080.
- Cobertura: titular, 12 proyectos, filtros 2/2/3/5/12, navegación/anclas, teclado/Escape del menú, demos ausentes, URL de Traidores, metadatos, foto contain, reduced motion, movimiento activo y parallax, validación/contacto con éxito y error simulados.
- Build servido en 4173: sin errores de consola/hidratación, sin overflow, 12 tarjetas y todas las imágenes cargadas en los cuatro tamaños. Evidencia: `evidence/visual-qa.json`.
- JavaScript desactivado: Hero y 12 proyectos presentes. Hidratación activada: filtros anteriores/todos operativos. Configuración de producción sin URL rechazada. `scripts/verify-build.mjs` reproduce estas verificaciones.
- Enlaces públicos de proyectos/perfil GitHub: 13 respuestas HTTP 200 (incluyendo el acceso del bar y su repositorio; Python ya no pertenece al catálogo). Kiosco timeout y portfolio viejo 404 quedan sin acción de demo. Respuesta 200 no equivale a QA funcional de terceros.

## Visual

Capturas en `screenshots/`: hero, featured, previous, skills, about, contact y página completa para cada uno de los cuatro tamaños. Se inspeccionaron las imágenes reales del Hero en los cuatro tamaños y secciones de retrato, proyectos, habilidades y contacto. La fotografía original conserva toda la cabeza; en pantalla tiene marco circular 330×330 con imagen contenida, sin distorsión ni recorte de la cabeza; la marca de la esquina inferior queda fuera de la máscara.

Las capturas se estabilizan con reduced motion. En recortes de sección se ocultan solo header sticky y skip-link mediante el estilo temporal de Playwright, para que no tapen contenido durante capturas más altas que la ventana; las capturas Hero y completas conservan la interfaz. No se alteran los estilos de producción. Para reproducir: iniciar `npm run preview`, luego `$env:QA_URL='http://127.0.0.1:4173/'; node scripts/capture.mjs`.

Fallos corregidos: expectativas antiguas del desplegable y override de object-fit en About.css. No hay fallos conocidos de las pruebas finales.

## Rendimiento y límites

El build incorpora únicamente los WebP utilizados por las tarjetas actuales; Tejido y App Python ya no se descargan. Los PNG originales se conservan como fuentes. Imágenes fuera de pantalla con lazy loading; dimensiones de retrato explícitas; portadas con altura reservada. 121 estrellas CSS y una capa Canvas 2D de 28 partículas en móvil o 58 en escritorio. El Canvas usa requestAnimationFrame, dibujo a 30 fps como máximo, DPR máximo 1,5, pausa con pestaña oculta y dibujo estático con movimiento reducido. No usa motor 3D. Fuente externa Space Mono con display=swap y fallback local.

No se midieron Core Web Vitals de campo, batería/GPU, lectores de pantalla ni recepción real de EmailJS. No se ejecutó Lighthouse; no se atribuye un puntaje. Las animaciones están implementadas y reduced motion probado; las capturas no acreditan fluidez en hardware móvil físico. No se envió correo ni se modificaron credenciales. No hay CV definitivo ni dominio final.

- git diff --check: aprobado; solo advertencias informativas de conversión LF/CRLF.


Último build de esta revisión: JS 335,49 KB (108,62 KB gzip), CSS 21,62 KB (5,78 KB gzip). Captura WebP de acceso al bar: 8,10 KB. Las 28 pruebas se repitieron después de incorporar la tarjeta del bar y retirar Tejido/App Python: aprobadas. El Canvas se comprobó con píxeles cambiantes en movimiento y estables al activar reduced motion.

