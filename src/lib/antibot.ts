/**
 * Trampas antibots sencillas para formularios públicos.
 *
 * 1) Honeypot: un campo oculto que un humano nunca rellena pero que la mayoría
 *    de bots rellenan automáticamente al ver inputs.
 * 2) Time-trap: tiempo mínimo entre que carga el formulario y se envía
 *    (los bots mandan en < 1s).
 *
 * Si quieres algo más fuerte, añade NEXT_PUBLIC_TURNSTILE_SITE_KEY /
 * TURNSTILE_SECRET_KEY de Cloudflare Turnstile y usa <TurnstileWidget /> +
 * verifyTurnstile().
 */

export const HONEYPOT_FIELD = "website_url_hp";
export const TIMESTAMP_FIELD = "ts_hp";
export const MIN_FORM_FILL_MS = 1500;

/** True si la petición parece un bot. Llamar desde el server action. */
export function isLikelyBot(formData: FormData) {
  const honeypot = (formData.get(HONEYPOT_FIELD) || "").toString().trim();
  if (honeypot) return { bot: true, reason: "honeypot_filled" };

  const ts = Number(formData.get(TIMESTAMP_FIELD) || 0);
  if (!ts || Date.now() - ts < MIN_FORM_FILL_MS) {
    return { bot: true, reason: "too_fast" };
  }
  return { bot: false, reason: null as string | null };
}

/** Verifica un token de Cloudflare Turnstile. Si no está configurado, pasa. */
export async function verifyTurnstile(token: string | null, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, bypass: true as const };
  if (!token) return { ok: false, bypass: false as const };
  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    if (ip) body.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data: { success?: boolean } = await r.json();
    return { ok: !!data.success, bypass: false as const };
  } catch {
    return { ok: false, bypass: false as const };
  }
}
