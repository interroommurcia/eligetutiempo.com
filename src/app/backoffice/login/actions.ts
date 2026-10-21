"use server";

import { logAudit } from "@/lib/audit";

/** Registra el resultado de un intento de login para la página de Seguridad. */
export async function registrarLogin(email: string, ok: boolean) {
  await logAudit({
    action: ok ? "login" : "login.failed",
    resource_type: "auth",
    metadata: { email: email.toLowerCase().slice(0, 120) },
  });
}
