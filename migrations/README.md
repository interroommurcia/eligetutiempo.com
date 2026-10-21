# Migraciones Supabase

Ejecuta estos SQL **en orden** en el SQL editor de Supabase (dashboard → SQL → New query).

1. `001_estado_venta.sql` — añade `estado_venta` a `relojes` (Disponible / Reservado / Vendido).
2. `002_blog.sql` — crea la tabla `blog_posts` con RLS.
3. `003_storage_buckets.sql` — crea buckets `relojes` y `blog` para fotos + políticas.

Cada script es **idempotente**: puedes relanzarlo sin romper nada.
