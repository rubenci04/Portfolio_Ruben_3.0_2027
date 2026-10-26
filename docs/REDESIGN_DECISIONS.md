# Decisiones del rediseño S02

Rama: `feat/portfolio-spatial-redesign-s02`, creada desde `feat/sprint-01-interactive-studio` con cambios sin confirmar. HEAD heredado: `83c27dc`. En la primera entrega no se crearon commits, merge, push ni despliegues; la autorización posterior de commit/push al repositorio nuevo se registra al final. `dev` no fue modificada. El diff contra HEAD incluye trabajo previo del Sprint 01; no debe interpretarse como un diff exclusivo de S02.

Se compararon con `git show dev:...` Hero, Projects, Background e index.css. Se revisó el diff existente antes de editar. Las eliminaciones de App.css, temp_hero.css y vite.svg ya estaban presentes al comenzar.

## Identidad recuperada

- Space Mono original para títulos, nombre y etiquetas; Segoe UI para párrafos largos. Conserva personalidad técnica y mejora lectura.
- Fondo continuo de tres capas de estrellas reconstruido desde la intención del original, con posiciones deterministas, 121 puntos y velocidades de 100/65/40 segundos. El original usaba box-shadow y desplazamiento vertical; ahora las capas cubren cualquier ancho.
- Un planeta con anillo en Hero y dos cuerpos distantes en el fondo. CSS sin WebGL, Canvas ni dependencias nuevas. Parallax limitado a puntero fino, rAF solo al moverlo, cleanup de eventos y pausa del fondo al ocultar pestaña. Movimiento reducido desactiva animaciones.
- Hero con el titular solicitado, nombre, especialidad y dos CTA. Sin tipeo infinito ni CV ficticio.
- Retrato original 864×1184 intacto: el contenedor cuadrado con cover causaba el corte. Se conserva la proporción con contain y dimensiones intrínsecas. WebP de 38,7 KB frente a PNG de 995 KB; PNG preservado.

## Catálogo y contenido

Se mantienen Edu App Contable, Reclutador, Bee Alien 3D, Tucumán Rush, Crochet Match y Ricota Quiz. Los seis originales vuelven a una sección siempre visible: Kiosco, Estéticars Monteros, Bar Don Enrique, App Python, Emprendimiento de Tejido y Portfolio anterior. Se agrega Traidores No con autoría universitaria compartida. React en Traidores se verificó en el DOM; Vue en Don Enrique y React en Estéticars también. Los otros stacks originales proceden de `dev`, no de una nueva auditoría de sus repositorios.

Filtros: todos (13), aplicaciones (1), juegos web (2), Godot (3), anteriores (7). Las categorías de anteriores son excluyentes para hacer explícito el recorrido. Se conservan URLs históricas fallidas en datos sin botones engañosos. Las portadas abstractas dicen CONCEPTO VISUAL; las capturas originales no fueron sustituidas. Datos listos para galerías, gameplay, detalle y builds, sin reproductor complejo.

Sobre mí recupera UTN, React/Vue/Python, aprendizaje práctico e IA; incorpora videojuegos y un flujo de planificación, implementación y validación. Habilidades conservan la organización del Sprint 01, suman el backend documentado y no usan porcentajes. Contacto, menú accesible y enlaces sociales del Sprint 01 se preservan.

## Ingeniería y archivos

Cambios centrales en `src/components/{Background,Hero,Projects,About,Skills}`, `src/data/projects.js`, `src/index.css`, `src/main.jsx`, `index.html`. Nuevos WebP, scripts de prerender/QA, configuración Netlify y documentación. No se agregaron paquetes. Producción usa HTML estático más hidratación, con assets resueltos desde el manifest de Vite.

Quedan pendientes de aportes reales: CV final, capturas/gameplay de los proyectos nuevos, dominio definitivo, confirmación del servidor Kiosco y recepción real de EmailJS. El ejemplo Python mantiene la descripción histórica Tkinter, aunque la URL es un embed pygame: conviene confirmar que corresponda a la misma versión.

## Iteración acordada con el propietario — 26/10/2026

Se retiran App Python y Emprendimiento de Tejido del catálogo a pedido explícito, conservando sus assets fuente en el repositorio. Se incorpora **Don Enrique · Gestión del bar** como aplicación web destacada, independiente del sitio gastronómico Bar Don Enrique. El catálogo actual tiene 12 proyectos: siete destacados y cinco anteriores; filtros 12/2/2/3/5.

Fuentes verificadas para el nuevo proyecto: repositorio `rubenci04/bar_app_web`, requirements.txt, modelos y docs/UI_PHASE1_CHANGES.md. Stack mostrado: Python, Flask, SQLAlchemy, Jinja2 y Tailwind CSS. La URL de Render devuelve 200 y redirige a /auth/login. La imagen es una captura real del login público, no una interfaz de administración simulada. Las pantallas internas siguen pendientes de captura con datos de demostración. No se inició sesión ni se consultaron datos privados.

Retrato circular: máscara CSS de 50% con overflow hidden y object-fit contain; respeta el archivo original completo y mantiene la cabeza dentro del círculo. El detalle de Gemini de la esquina queda fuera del área visible. No se retocó ni regeneró la fotografía.

Interacción espacial: tres capas CSS aceleradas a 45/30/18 segundos, parallax ampliado de forma moderada y capa Canvas 2D. Entre 28 y 58 partículas derivan continuamente y se apartan suavemente del cursor; hasta seis enlaces luminosos cercanos refuerzan la respuesta. Pausa al ocultar pestaña, límite de dibujo de 30 fps y DPR 1,5. Con reduced motion se dibuja una sola imagen estática y se cancelan los frames. Los listeners y rAF se liberan al desmontar.

Publicación: nuevo destino autorizado `rubenci04/Portfolio_Ruben_3.0_2027`. Remoto local `portfolio2027`, sin reemplazar origin. El propietario autorizó commit y push a este destino; no autorizó crear un despliegue externo ni enlazar una cuenta de hosting. Se conserva la rama de trabajo S02; se enviará su commit a main del repositorio nuevo sin force push.

