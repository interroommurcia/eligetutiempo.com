-- 003: buckets de Storage y políticas (relojes + blog)
INSERT INTO storage.buckets (id, name, public)
  VALUES ('relojes', 'relojes', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('blog', 'blog', true)
  ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_relojes" ON storage.objects;
CREATE POLICY "public_read_relojes" ON storage.objects
  FOR SELECT USING (bucket_id = 'relojes');

DROP POLICY IF EXISTS "auth_write_relojes" ON storage.objects;
CREATE POLICY "auth_write_relojes" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'relojes');

DROP POLICY IF EXISTS "auth_update_relojes" ON storage.objects;
CREATE POLICY "auth_update_relojes" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'relojes');

DROP POLICY IF EXISTS "auth_delete_relojes" ON storage.objects;
CREATE POLICY "auth_delete_relojes" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'relojes');

DROP POLICY IF EXISTS "public_read_blog" ON storage.objects;
CREATE POLICY "public_read_blog" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog');

DROP POLICY IF EXISTS "auth_write_blog" ON storage.objects;
CREATE POLICY "auth_write_blog" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog');

DROP POLICY IF EXISTS "auth_update_blog" ON storage.objects;
CREATE POLICY "auth_update_blog" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'blog');

DROP POLICY IF EXISTS "auth_delete_blog" ON storage.objects;
CREATE POLICY "auth_delete_blog" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'blog');
