# Sprint 003 — universo interactivo y catálogo

Fecha: 27/10/2026. Rama: `codex/portfolio-003-interactive-universe`, creada desde `e2b5262` con árbol limpio. No se crearon commits nuevos, ni push, merge o deploy. Los remotos anteriores se preservan.

## Estado real y comparación

Se revisaron README, decisiones S02, catálogo, Hero, Canvas, navegación, estilos y tests. La referencia pública manual https://effortless-piroshki-a3c8f9.netlify.app/ respondió 200. Sus assets JS/CSS coincidían exactamente con dist al inicio (`index-B5lUxmvL.js`, `index-1JPGgQLX.css`), con 12 proyectos, tres capas de estrellas y Canvas. No se asumió que origin/dev fuera la base correcta. Evidencia: `evidence/s03-public-baseline.json` y `screenshots/s03-public-baseline.png`. La publicación permanece en S02; la nueva interfaz solo está localmente.

## Universo

Se mantiene el azul oscuro, dorado y Space Mono. Canvas conserva límite de 28 partículas móvil/58 escritorio, DPR 1,5 y dibujo máximo 30 fps. Se agregan deriva lateral, oscilación de brillo, colores discretos y una estrella fugaz breve a los 8 segundos y luego cada 14 segundos de animación activa. Cursor suave y tres capas CSS mantienen profundidad.

UniverseExplorer presenta tres planetas con volumen, textura, anillos y luz coherente. Son botones de teclado/touch, abren información de Godot, web o Android y permiten filtrar el catálogo. Zoom 100–160%, reset y cierre con devolución de foco. Solo transforma la escena, sin capturar wheel ni gestos del documento. El cohete SVG original inicia un recorrido manual por seis destacados con Anterior, Siguiente, Ver ficha y Detener. No hay cambio automático de diapositivas.

Pausar universo detiene fondo y escena; reduced motion desactiva animaciones y conserva controles. Se pausa al ocultar pestaña y se limpian listeners/rAF. No se instaló motor 3D ni dependencia nueva.

## Catálogo y fichas

Seis destacados en orden editorial: Bee Alien 3D, Tucumán Rush, Reclutador, Crochet Match, Ricota Quiz, Edu App Contable. Después, catálogo completo de 16 proyectos, sin duplicados dentro del listado. Los destacados repiten únicamente seis accesos compactos de entrada; las descripciones completas viven en catálogo y fichas.

Filtros: Todos 16, Godot 3, Juegos web 2, Aplicaciones web 4, Android 2, Sitios web 4. App Python conserva categoría de escritorio y aparece en Todos para no clasificarla incorrectamente como aplicación web. App Python y Tejido vuelven por pedido explícito del encargo 003, posterior a su retiro en S02. Se mantienen Don Enrique Gestión y todos los otros trabajos. Los filtros móviles se desplazan horizontalmente con foco visible.

Cada tarjeta abre una ficha en dialog nativo, con Escape, foco contenido/restaurado, funciones, stack y acciones reales. Las fichas no son URLs individuales: no se agregaron páginas SEO ficticias ni rutas que requieran un servidor.

## Android verificado

OstoAppAR: package.json, TrackerScreen.js y pdfGenerator.js verifican React Native/Expo, AsyncStorage, inventario de bolsas/discos, registros/historial, recordatorios y PDF. Gym Scientific App: pubspec.yaml, workout_screen.dart, progress_screen.dart, routine_repository.dart y notification_service.dart verifican Flutter/Dart/Hive, rutinas, biblioteca, sesiones, progreso e hidratación/notificaciones.

El propietario confirmó en esta conversación que **ambas funcionan y están empaquetadas en APK, fuera de Google Play**. Esto está registrado en editorial con confirmedBy=owner; no se dedujo del número de versión ni se ejecutaron las apps. No hay APK público verificado ni botón de descarga. Los repositorios públicos son las acciones disponibles. No se accedió a datos médicos ni a sesiones privadas.

## Multimedia

ProjectCover, ProjectGallery, GameplayPreview y MobileShowcase son reutilizables. media centraliza cover, poster, screenshots, previewVideo, previewWebm, aspectRatio y mediaStatus. `scripts/validate-media.mjs` impide builds con rutas inexistentes o archivos fuera del proyecto. Las carpetas de `public/media/projects/` están vacías salvo README/.gitkeep hasta recibir medios reales.

Portadas 16:9, teléfono CSS para capturas verticales, galería solo si existen imágenes. Fallos de imagen/video conservan fallback. Videos no se montan antes de una interacción, preload none, muted/playsInline, hover solo mouse, botón explícito móvil/reduced motion, pausa al salir/fuera del viewport/pestaña oculta. Un solo video reproduce a la vez. El fixture gris de tests no se copia a dist y no representa gameplay.

Pendientes de capturar: covers/gameplay de juegos, pantallas verticales de Android con datos ficticios, pantallas operativas del bar en una base de demostración. Se conserva el login público del bar. Los conceptos gráficos están identificados y no simulan screenshots.

## Archivos centrales

`src/components/Universe/*`, `src/components/Media/*`, `src/components/Projects/ProjectDialog.*`, App, Hero, Background/SpaceParticles, Projects/ProjectCard y data/projects. Scripts de captura/comparación/validación y tests media/universe. Documentación y screenshots bajo docs. README enlaza el estado actual.

## Ejecución y actualización manual

npm run dev; npm run lint; npm test -- --workers=2; npm run build; npm run preview. Salida: `D:\proyectos\portfolio\dist`.

Para actualizar el Netlify existente: ingresar al proyecto cuyo dominio es effortless-piroshki-a3c8f9.netlify.app, abrir Deploys y arrastrar dist al área de deploy manual **de ese mismo proyecto**. No usar Drop para crear otro sitio, ni vincular GitHub. Mantener SITE_ENV=preview durante revisión. La URL es provisional: sigue noindex y no se agrega canonical/sitemap ficticio. Al confirmar el nombre, configurar SITE_URL con el origen HTTPS real y SITE_ENV=production y reconstruir. No cambiar por accidente el contexto de previews. Revisar HTML/headers después de una publicación autorizada.
