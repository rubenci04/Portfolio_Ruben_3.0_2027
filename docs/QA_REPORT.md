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


## Sprint 003 — estado actual

Ver [informe del Sprint 003](SPRINT_003.md). Cambios implementados en `codex/portfolio-003-interactive-universe`, sin nuevos commits ni publicación. Base pública S02 comparada con assets iguales al inicio. Seis destacados y catálogo de 16, incluyendo OstoAppAR y Gym Scientific App funcionales en APK según confirmación del propietario. Sin descargas verificadas.

ESLint y build con prerender/validación de medios aprobados. JavaScript final 239,64 KB / 76,58 KB gzip; CSS 32,66 KB / 8,11 KB gzip. Sin dependencias nuevas. La reducción de JS respecto a S02 se debe al retiro de motion en tarjetas, no es una medición de Core Web Vitals.

Suite final ejecutada: 52/52 aprobadas en 375×812, 768×1024, 1440×900 y 1920×1080. Incluye proporciones de portada, planetas/zoom/teclado, cohete/stop, filtros, fichas Android y foco, pausa global, wheel libre, Canvas/reduced motion, contacto simulado, galería vertical y reproducción exclusiva/diferida. Después se agregó un test de archivo de video incompatible: 4/4 aprobado, uno por tamaño. Total: 56 comprobaciones aprobadas en dos ejecuciones con la misma implementación de producción.

Chrome real utilizado para las capturas de `screenshots/s03/`: Hero, universo, destacados, catálogo, habilidades, retrato, contacto, página completa, planeta ampliado, tour, Android y ficha. Recortes largos ocultan temporalmente header sticky/skip-link para no tapar contenido; no se alteran estilos de producción. Ver `evidence/s03-visual-qa.json`. No se midió fluidez en hardware móvil físico, batería/GPU ni Core Web Vitals de campo.

Se corrigieron: selectores de tests que confundían planeta y filtro; restauración de foco del modal; carga inicial y cambio en vivo de reduced motion de videos; proporción heredada de portadas. La generación inicial del clip de test con MediaRecorder produjo un contenedor sin frames en este Chrome; se reemplazó por fixture gris WebM de 2 segundos generado con FFmpeg de Playwright, aislado en tests y ausente de dist.

Una revisión automática de permisos alcanzó temporalmente el límite de uso e impidió iniciar dos verificaciones finales. Tras continuar la sesión, los comandos se pudieron retomar; no se trató de un rechazo por inseguridad ni de una prueba ejecutada.

Verificación final de dist: 16 tarjetas de catálogo presentes sin JavaScript; 6 destacados y filtros Android/Todos correctos tras hidratación. Capturas regeneradas contra dist, sin errores de consola, imágenes rotas ni overflow en los cuatro tamaños. Los enlaces públicos verificaron 14 respuestas 200; Render del bar agotó 20 segundos en esta consulta (había respondido 200 en S02). Se conserva su URL real y la indicación de acceso privado; el timeout no acredita una caída permanente. Evidencia en evidence/s03-links.json.

## Sprint 004: producción automática

56/56 pruebas aprobadas en una sola ejecución, lint/build/diff-check aprobados. Build local y URL real comprobados en Chrome en los cuatro tamaños. Conexión verificada a portfolio_web/dev y deploy automático 6ae02977eee2574ccfde686e con commit 2d4b230, state ready, manual_deploy=false. La meta build-revision pública prueba que no se sirvió una versión antigua. Detalles en SPRINT_004_CICD.md y evidencia s04.
