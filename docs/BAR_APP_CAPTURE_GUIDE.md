# Cómo mostrar Don Enrique Gestión sin publicar una sesión privada

Proyecto: https://github.com/rubenci04/bar_app_web
Acceso desplegado: https://bar-app-web.onrender.com/

El portfolio ya incluye una tarjeta con stack y funciones verificados, repositorio público y captura del inicio de sesión. Su botón dice **Abrir acceso** y aclara que requiere usuario y contraseña. No se presentará como una demo abierta.

Para mostrar el interior, la mejor opción es una copia local o entorno de demostración del mismo código con una base separada, usuarios de prueba y operaciones ficticias. Nunca conectar esa copia a la base operativa de Render. No hace falta que los visitantes del portfolio reciban una cuenta: las capturas o un video alcanzan para explicar el producto.

## Capturas recomendadas

1. Mesas: mostrar una libre, otra ocupada y otra con cuenta pagada pendiente de liberar, usando importes ficticios.
2. Pedido: varios productos de prueba, cantidades y subtotal; sin nombres de clientes reales.
3. Productos/stock: catálogo de demostración para explicar la gestión.
4. Caja: sesión y movimientos ficticios. Esta pantalla debe prepararse exclusivamente en la base de demostración.
5. Vista móvil: una pantalla operativa de mesas o pedidos.

En Windows, abrir cada pantalla tras iniciar sesión vos y usar Win+Shift+S para recortar la interfaz. Guardar imágenes PNG sin incluir pestañas, gestores de contraseñas ni datos reales. También se puede grabar un recorrido corto con datos de prueba, marcado como demostración. No necesito tu contraseña, cookies, tokens ni exportaciones de la base.

Si solo se dispone de la sesión operativa, comenzar con una pantalla que no revele información privada y revisar cuidadosamente el archivo antes de compartirlo. Evitar capturar caja, reportes e historial reales. No modificar operaciones del bar para fabricar una captura.

## Integración futura

Guardar los archivos revisados en `src/assets/cards_images/` o una carpeta específica de medios del proyecto y usar el campo image de `bar-gestion` para la portada. La estructura media admite screenshots y gallery, aunque todavía no hay un visor implementado. Reemplazar la imagen de acceso solo al disponer de una captura real representativa y actualizar imageAlt y availability.

Para reproducir la captura pública actual: `node scripts/capture-bar-login.mjs` (requiere Chrome y red), luego `scripts/optimize_images.py` con Python/Pillow. Ese script no autentica ni captura el interior.

Estado de esta entrega: Render respondió 200 y redirigió a /auth/login. Se verificó la pantalla de acceso en Chrome. Las funciones internas se describen desde el código/documentación del repositorio; no se acredita QA de producción ni acceso a datos privados.
