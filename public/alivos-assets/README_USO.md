# ALIVOS assets renombrados para `public`

Carpeta lista para copiar dentro de `alivoweb/public`.

Uso recomendado:
1. Copia la carpeta `alivos-assets` completa a `alivoweb/public/alivos-assets`.
2. En el frontend usa rutas públicas como:
   `/alivos-assets/home/hero-madre-bebe-bloques-alivos.png`
   `/alivos-assets/courses/descubriendo-su-cuerpo-0-3-meses/modulo-01/portada-modulo-01-bebe-boca-abajo.png`
3. Consulta `asset-manifest.json` para ver el mapeo entre nombre original y nombre nuevo.
4. La carpeta `_preview` solo es apoyo visual; no es obligatoria para producción.

Contenido organizado:
- `brand/`: logos y material de marca.
- `home/`: imágenes para home, portada, bienvenida y uso de plataforma.
- `courses/descubriendo-su-cuerpo-0-3-meses/`: material del curso y módulos.
- Cada módulo contiene portada, banner, objetivos, materiales, contenido extra, actividades, FAQ y evaluación.

Nota de seguridad:
No se incluyó el chat de WhatsApp ni credenciales dentro de esta carpeta pública. Solo se renombró el material del Drive para uso en el frontend.
