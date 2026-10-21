# Migraciones Supabase

Ejecuta estos SQL **en orden** en el SQL editor de Supabase (dashboard → SQL → New query).

1. `001_estado_venta.sql` — añade `estado_venta` a `relojes` (Disponible / Reservado / Vendido).
2. `002_blog.sql` — crea la tabla `blog_posts` con RLS.
3. `003_storage_buckets.sql` — crea buckets `relojes` y `blog` para fotos + políticas.
4. `004_audit_log.sql` — tabla `audit_log` para la sección Seguridad del backoffice.
5. `005_fix_estado_check.sql` — alinea el CHECK de `relojes.estado` con los 4 valores que usa la UI (arregla el "violates check constraint relojes_estado_check" al crear reloj).

Cada script es **idempotente**: puedes relanzarlo sin romper nada.
