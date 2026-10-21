import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Seguridad — Backoffice" };

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

const ACTION_LABEL: Record<string, { label: string; emoji: string; tone: string }> = {
  "login": { label: "Inicio de sesión", emoji: "🔑", tone: "text-emerald-700" },
  "login.failed": { label: "Intento fallido", emoji: "❌", tone: "text-red-700" },
  "logout": { label: "Cierre de sesión", emoji: "🚪", tone: "text-stone-600" },
  "reloj.create": { label: "Reloj creado", emoji: "➕", tone: "text-emerald-700" },
  "reloj.update": { label: "Reloj editado", emoji: "✏️", tone: "text-stone-700" },
  "reloj.delete": { label: "Reloj eliminado", emoji: "🗑️", tone: "text-red-700" },
  "reloj.estado_venta": { label: "Estado de venta", emoji: "🏷️", tone: "text-amber-700" },
  "blog.create": { label: "Artículo creado", emoji: "📝", tone: "text-emerald-700" },
  "blog.update": { label: "Artículo editado", emoji: "✏️", tone: "text-stone-700" },
  "blog.delete": { label: "Artículo eliminado", emoji: "🗑️", tone: "text-red-700" },
  "blog.publish": { label: "Publicación blog", emoji: "📣", tone: "text-emerald-700" },
  "antibot.blocked": { label: "Bot bloqueado", emoji: "🤖", tone: "text-amber-700" },
};

export default async function SeguridadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  const { data: eventos } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const eventosArr = eventos ?? [];
  const now = Date.now();
  const last24h = eventosArr.filter((e) => now - new Date(e.created_at).getTime() < 24 * 3600 * 1000);
  const bots24h = last24h.filter((e) => e.action === "antibot.blocked").length;
  const fails24h = last24h.filter((e) => e.action === "login.failed").length;
  const logins24h = last24h.filter((e) => e.action === "login").length;

  // Agrupar por IP (visión rápida de actividad)
  const porIp = new Map<string, number>();
  for (const e of last24h) {
    if (!e.ip) continue;
    porIp.set(e.ip, (porIp.get(e.ip) ?? 0) + 1);
  }
  const topIps = [...porIp.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  const miLastSignIn = (user as unknown as { last_sign_in_at?: string | null })?.last_sign_in_at ?? null;
  const turnstileEnabled = !!process.env.TURNSTILE_SECRET_KEY;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Seguridad</h1>
        <p className="text-stone-500 text-sm mt-1">
          Actividad reciente, intentos de acceso y protecciones del sitio.
        </p>
      </div>

      {/* Mi sesión */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="font-semibold text-stone-800 mb-4">Tu sesión</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs text-stone-500 uppercase tracking-wider">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-stone-500 uppercase tracking-wider">Último inicio</dt>
            <dd className="font-medium">{fmtDate(miLastSignIn)}</dd>
          </div>
          <div>
            <dt className="text-xs text-stone-500 uppercase tracking-wider">ID de usuario</dt>
            <dd className="font-mono text-xs text-stone-500 break-all">{user.id}</dd>
          </div>
          <div>
            <dt className="text-xs text-stone-500 uppercase tracking-wider">Creado</dt>
            <dd className="font-medium">{fmtDate(user.created_at ?? null)}</dd>
          </div>
        </dl>
      </div>

      {/* KPIs últimas 24h */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Logins 24h", value: logins24h, icon: "🔑", tone: "text-emerald-700" },
          { label: "Fallos 24h", value: fails24h, icon: "❌", tone: fails24h > 0 ? "text-red-700" : "text-stone-500", alert: fails24h > 5 },
          { label: "Bots bloqueados 24h", value: bots24h, icon: "🤖", tone: bots24h > 0 ? "text-amber-700" : "text-stone-500" },
          { label: "Eventos totales", value: eventosArr.length, icon: "📜", tone: "text-stone-700" },
        ].map((k) => (
          <div key={k.label} className={`bg-white rounded-2xl border p-5 ${k.alert ? "border-red-300 bg-red-50" : "border-stone-200"}`}>
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-bold ${k.tone}`}>{k.value}</div>
            <div className="text-xs text-stone-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Protecciones */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="font-semibold text-stone-800 mb-4">Protecciones activas</h2>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 mt-0.5">✅</span>
            <div>
              <p className="font-medium">Honeypot antibot en formularios públicos</p>
              <p className="text-xs text-stone-500">Campo oculto + tiempo mínimo de rellenado. Bloquea bots automáticos.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 mt-0.5">✅</span>
            <div>
              <p className="font-medium">Autenticación obligatoria en backoffice</p>
              <p className="text-xs text-stone-500">Middleware redirige al login si no hay sesión. Row Level Security activo en Supabase.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 mt-0.5">✅</span>
            <div>
              <p className="font-medium">HTTPS forzado</p>
              <p className="text-xs text-stone-500">Vercel servido siempre por HTTPS; cookies con atributo Secure.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className={turnstileEnabled ? "text-emerald-500 mt-0.5" : "text-stone-300 mt-0.5"}>
              {turnstileEnabled ? "✅" : "⚪"}
            </span>
            <div>
              <p className="font-medium">
                Cloudflare Turnstile {turnstileEnabled ? "" : "(no configurado)"}
              </p>
              <p className="text-xs text-stone-500">
                {turnstileEnabled
                  ? "Verificación extra tipo captcha, sin fricción visible."
                  : "Añade TURNSTILE_SECRET_KEY y NEXT_PUBLIC_TURNSTILE_SITE_KEY para activar protección reforzada."}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad reciente */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 lg:col-span-2">
          <h2 className="font-semibold text-stone-800 mb-4">Actividad reciente (últimos 100 eventos)</h2>
          {eventosArr.length === 0 ? (
            <div className="text-center py-8 text-sm text-stone-500">
              <p className="text-3xl mb-2">📭</p>
              Sin eventos todavía. Se irán registrando conforme uses el backoffice.
            </div>
          ) : (
            <ul className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
              {eventosArr.map((e) => {
                const meta = ACTION_LABEL[e.action] ?? { label: e.action, emoji: "•", tone: "text-stone-600" };
                return (
                  <li key={e.id} className="py-2.5 flex items-start gap-3 text-sm">
                    <span className="text-lg mt-0.5">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${meta.tone}`}>{meta.label}</p>
                      <p className="text-xs text-stone-500 truncate">
                        {e.user_email ?? "anónimo"}
                        {e.ip ? ` · ${e.ip}` : ""}
                        {e.resource_id ? ` · ${e.resource_id.slice(0, 8)}…` : ""}
                      </p>
                    </div>
                    <span className="text-[11px] text-stone-400 whitespace-nowrap">{fmtDate(e.created_at)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Top IPs */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">IPs más activas (24h)</h2>
          {topIps.length === 0 ? (
            <p className="text-sm text-stone-500">Sin registros aún.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {topIps.map(([ip, n]) => (
                <li key={ip} className="py-2 flex justify-between text-sm">
                  <span className="font-mono text-xs text-stone-600 truncate pr-2" title={ip}>{ip}</span>
                  <span className="font-semibold text-stone-800">{n}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-[11px] text-stone-400 mt-4">
            Si ves una IP desconocida con muchos accesos, revisa qué acciones hizo en la actividad.
          </p>
        </div>
      </div>
    </div>
  );
}
