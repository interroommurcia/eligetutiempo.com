import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la service_role key. Permite listar/crear/borrar
 * usuarios de auth.users. SOLO se puede usar desde el servidor (server
 * actions, route handlers). La clave bypassa RLS, así que nunca la expongas
 * al cliente.
 *
 * Requiere SUPABASE_SERVICE_ROLE_KEY en el entorno (NO con prefijo NEXT_PUBLIC).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY en el entorno. Añádela en .env.local " +
      "y en Vercel → Settings → Environment Variables (producción + preview). " +
      "La encuentras en Supabase → Project Settings → API → service_role key."
    );
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Lista de super-admins (emails) que pueden gestionar usuarios.
 * Configúralo en el entorno: SUPER_ADMINS="tu@email.com,otro@email.com".
 * Si está vacío, cualquier usuario autenticado del backoffice puede gestionar
 * usuarios (menos recomendable).
 */
export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const raw = process.env.SUPER_ADMINS;
  if (!raw) return true;
  const list = raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return list.includes(email.toLowerCase());
}
