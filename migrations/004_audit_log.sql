-- 004: log de auditoría para la sección de Seguridad del backoffice.
-- Registramos: logins, cambios en relojes, publicaciones de blog, etc.
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,          -- 'login', 'reloj.create', 'reloj.update', 'reloj.delete', 'reloj.estado_venta', 'blog.create', 'blog.update', 'blog.delete', 'blog.publish', 'antibot.blocked'
  resource_type TEXT,            -- 'reloj' | 'blog_post' | 'auth' | 'tasacion' | ...
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_log_user_id_idx ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS audit_log_action_idx ON audit_log(action);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_log_admin_read" ON audit_log;
CREATE POLICY "audit_log_admin_read" ON audit_log
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "audit_log_admin_insert" ON audit_log;
CREATE POLICY "audit_log_admin_insert" ON audit_log
  FOR INSERT TO authenticated WITH CHECK (true);
