import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

type AuditEntry = {
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
};

/** Registra una acción en audit_log. Silencioso si falla (no bloquea la operación real). */
export async function logAudit(entry: AuditEntry) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || null;
    const user_agent = h.get("user-agent") || null;

    await supabase.from("audit_log").insert({
      user_id: user?.id ?? null,
      user_email: user?.email ?? null,
      action: entry.action,
      resource_type: entry.resource_type ?? null,
      resource_id: entry.resource_id ?? null,
      metadata: entry.metadata ?? {},
      ip,
      user_agent,
    });
  } catch (e) {
    console.warn("[audit] fallo al registrar:", e);
  }
}
