# Medios de proyectos

Estos directorios están preparados para material real. No hay archivos multimedia de ejemplo ni rutas ficticias en los datos del portfolio.

Configurar `media` en `src/data/projects.js`:

- cover: ruta local a una captura/portada real, preferentemente 16:9.
- poster: imagen liviana de fallback para el video.
- screenshots: lista de objetos con src, alt y caption opcional. Capturas móviles verticales se muestran sin deformación dentro de un teléfono CSS.
- previewVideo: MP4 corto, sin audio necesario.
- previewWebm: alternativa WebM.
- aspectRatio: relación editorial; actualmente 16 / 9 para portadas. Las capturas de Android conservan su orientación en MobileShowcase.
- mediaStatus: pending o available según exista material real.

Usar null y [] cuando falten medios. No se crean videos, imágenes, galerías ni botones de reproducción vacíos. El build valida que cada ruta configurada exista antes de generar el HTML final.

Los previews usan preload=none y no se montan hasta una interacción. Hover solo con puntero mouse, soporte hover y movimiento permitido; en móvil/reduced motion se usa un botón explícito. Se pausa al salir del área, fuera de viewport y al ocultar pestaña. Solo un video reproduce a la vez.

No incluir datos médicos/personales ni pantallas operativas con información real. OstoAppAR debe capturarse con datos ficticios y sin perfiles/historiales privados. Para Don Enrique usar una base de demostración separada. Las marcas CONCEPTO VISUAL se conservan mientras no haya capturas reales.
