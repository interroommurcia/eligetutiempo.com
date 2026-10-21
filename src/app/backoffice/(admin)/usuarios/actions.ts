"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isSuperAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { headers } from "next/headers";

export type UsuarioAction = { ok: true; msg?: string } | { ok: false; error: string };

async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado.");
  if (!isSuperAdmin(user.email)) throw new Error("Solo super-admins pueden gestionar usuarios.");
  return user;
}

/** Invita a un email: Supabase envía un correo con enlace para fijar contraseña. */
export async function invitarUsuario(formData: FormData): Promise<UsuarioAction> {
  try {
    await requireSuperAdmin();
    const email = ((formData.get("email") as string) || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: "Email no válido." };
    }

    const h = await headers();
    const host = h.get("host") || "eligetutiempo.com";
    const proto = h.get("x-forwarded-proto") || "https";
    const redirectTo = `${proto}://${host}/backoffice`;

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
    if (error) return { ok: false, error: error.message };

    await logAudit({ action: "user.invite", resource_type: "auth", metadata: { email } });
    revalidatePath("/backoffice/usuarios");
    return { ok: true, msg: `Invitación enviada a ${email}.` };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Error inesperado." };
  }
}

/** Elimina un usuario del backoffice (no se puede recuperar). */
export async function eliminarUsuario(id: string): Promise<UsuarioAction> {
  try {
    const yo = await requireSuperAdmin();
    if (yo.id === id) return { ok: false, error: "No puedes eliminarte a ti mismo." };

    const admin = createAdminClient();
    const { data: target } = await admin.auth.admin.getUserById(id);
    const email = target?.user?.email;

    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) return { ok: false, error: error.message };

    await logAudit({ action: "user.delete", resource_type: "auth", resource_id: id, metadata: { email } });
    revalidatePath("/backoffice/usuarios");
    return { ok: true, msg: "Usuario eliminado." };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Error inesperado." };
  }
}

/** Envía un email con enlace para resetear contraseña del usuario. */
export async function enviarResetPassword(email: string): Promise<UsuarioAction> {
  try {
    await requireSuperAdmin();
    const h = await headers();
    const host = h.get("host") || "eligetutiempo.com";
    const proto = h.get("x-forwarded-proto") || "https";
    const redirectTo = `${proto}://${host}/backoffice/login`;

    const admin = createAdminClient();
    const { error } = await admin.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return { ok: false, error: error.message };

    await logAudit({ action: "user.reset_password", resource_type: "auth", metadata: { email } });
    return { ok: true, msg: `Email de reset enviado a ${email}.` };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Error inesperado." };
  }
}
