import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — Backoffice EligeTuTiempo" };

export default async function BackofficeDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  const [
    { count: totalRelojes },
    { count: relojesPublicados },
    { data: stockData },
    { count: tasacionesPendientes },
    { count: tasacionesTotal },
    { data: ventasData },
  ] = await Promise.all([
    supabase.from("relojes").select("*", { count: "exact", head: true }),
    supabase.from("relojes").select("*", { count: "exact", head: true }).eq("publicado", true),
    supabase.from("relojes").select("precio_venta"),
    supabase.from("tasaciones").select("*", { count: "exact", head: true }).eq("estado", "Pendiente"),
    supabase.from("tasaciones").select("*", { count: "exact", head: true }),
    supabase.from("ventas").select("precio_venta").gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ]);

  const valorStock = (stockData ?? []).reduce((acc, r) => acc + (r.precio_venta ?? 0), 0);
  const ventasMes = (ventasData ?? []).reduce((acc, v) => acc + (v.precio_venta ?? 0), 0);

  const stats = [
    { label: "Relojes en catálogo", value: totalRelojes ?? 0, sub: `${relojesPublicados ?? 0} publicados`, icon: "⌚" },
    { label: "Valor en stock", value: `${valorStock.toLocaleString("es-ES")} €`, sub: "precio venta total", icon: "💎" },
    { label: "Tasaciones", value: tasacionesTotal ?? 0, sub: `${tasacionesPendientes ?? 0} pendientes`, icon: "📋", alert: (tasacionesPendientes ?? 0) > 0 },
    { label: "Ventas este mes", value: `${ventasMes.toLocaleString("es-ES")} €`, sub: "ingresos del mes", icon: "💶" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Bienvenido, {user.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, sub, icon, alert }) => (
          <div key={label} className={`bg-white rounded-2xl border p-6 ${alert ? "border-amber-300 bg-amber-50" : "border-stone-200"}`}>
            <div className="text-3xl mb-3">{icon}</div>
            <div className="text-2xl font-bold text-stone-900">{value}</div>
            <div className="text-stone-500 text-sm mt-0.5">{label}</div>
            <div className={`text-xs mt-1 ${alert ? "text-amber-600 font-medium" : "text-stone-400"}`}>{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: "/backoffice/relojes/nuevo", icon: "➕", title: "Añadir reloj", desc: "Publicar nuevo reloj en el catálogo" },
          { href: "/backoffice/tasaciones", icon: "📋", title: "Ver tasaciones", desc: `${tasacionesPendientes ?? 0} pendientes de respuesta` },
          { href: "/backoffice/ventas/nueva", icon: "💶", title: "Registrar venta", desc: "Anotar una venta completada" },
          { href: "/backoffice/mercado", icon: "📈", title: "Herramienta mercado", desc: "Consultar precios en plataformas" },
        ].map(({ href, icon, title, desc }) => (
          <a key={href} href={href}
            className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl hover:border-[#C9A84C] transition-colors">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="font-medium text-sm text-stone-900">{title}</p>
              <p className="text-stone-400 text-xs">{desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
