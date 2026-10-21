import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isSuperAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import UsuariosPanel from "./UsuariosPanel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Usuarios — Backoffice" };

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  // Comprobación de super-admin + aviso si falta service_role.
  const puedeGestionar = isSuperAdmin(user.email);
  const haySRK = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!haySRK) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">Usuarios</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-900 leading-relaxed">
          <p className="font-semibold mb-2">Falta configurar la service_role key de Supabase.</p>
          <p className="mb-3">
            Para gestionar usuarios desde el backoffice añade en el entorno:
          </p>
          <pre className="bg-amber-100 rounded-lg p-3 text-xs overflow-auto">SUPABASE_SERVICE_ROLE_KEY=&lt;tu service_role key&gt;
SUPER_ADMINS={user.email}</pre>
          <p className="mt-3">
            La encuentras en Supabase → Project Settings → API → <strong>service_role</strong> secret.
            Añádela también en Vercel → Settings → Environment Variables (producción + preview) y redeploya.
          </p>
        </div>
      </div>
    );
  }

  if (!puedeGestionar) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">Usuarios</h1>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-800">
          <p className="font-semibold mb-1">No tienes permiso para gestionar usuarios.</p>
          <p>Pide al super-admin que añada tu email a la variable <code>SUPER_ADMINS</code>.</p>
        </div>
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: list, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">Usuarios</h1>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-800">
          <p className="font-semibold mb-1">No se pudieron cargar los usuarios.</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const usuarios = (list?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "(sin email)",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    confirmed: !!u.email_confirmed_at,
    super_admin: isSuperAdmin(u.email),
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Usuarios del backoffice</h1>
        <p className="text-stone-500 text-sm mt-1">
          Da o quita acceso al panel. Las acciones quedan registradas en Seguridad.
        </p>
      </div>
      <UsuariosPanel usuarios={usuarios} currentUserId={user.id} currentEmail={user.email ?? ""} />
    </div>
  );
}
