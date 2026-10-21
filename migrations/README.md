# Migraciones Supabase

Ejecuta estos SQL **en orden** en el SQL editor de Supabase (dashboard → SQL → New query).

1. `001_estado_venta.sql` — añade `estado_venta` a `relojes` (Disponible / Reservado / Vendido).
2. `002_blog.sql` — crea la tabla `blog_posts` con RLS.
3. `003_storage_buckets.sql` — crea buckets `relojes` y `blog` para fotos + políticas.
4. `004_audit_log.sql` — tabla `audit_log` para la sección Seguridad del backoffice.
5. `005_fix_estado_check.sql` — alinea el CHECK de `relojes.estado` con los 4 valores que usa la UI (arregla el "violates check constraint relojes_estado_check" al crear reloj).
6. `006_fix_estado_check_v2.sql` — reemplazo correcto de la 005 (que fallaba silenciosamente si el CHECK viejo bloqueaba los UPDATE). Ejecuta esta aunque la 005 no te diera error.

Cada script es **idempotente**: puedes relanzarlo sin romper nada.
