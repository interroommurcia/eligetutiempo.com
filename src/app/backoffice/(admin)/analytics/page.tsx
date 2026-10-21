import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics — Backoffice" };

function fmtEur(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function startOfMonth(offset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() - offset);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  // Pullamos datos crudos y agregamos en JS (los volúmenes son chicos en este negocio).
  const [relojesRes, ventasRes, tasacionesRes, postsRes] = await Promise.all([
    supabase.from("relojes").select("id, marca, precio_coste, precio_venta, estado_venta, publicado, created_at"),
    supabase.from("ventas").select("id, precio_venta, created_at"),
    supabase.from("tasaciones").select("id, estado, created_at"),
    supabase.from("blog_posts").select("id, publicado, created_at"),
  ]);

  const relojes = relojesRes.data ?? [];
  const ventas = ventasRes.data ?? [];
  const tasaciones = tasacionesRes.data ?? [];
  const posts = postsRes.data ?? [];

  const inicioMes = startOfMonth(0);
  const inicioMesAnterior = startOfMonth(1);
  const inicioAño = new Date(new Date().getFullYear(), 0, 1);

  const ventasMes = ventas.filter((v) => new Date(v.created_at) >= inicioMes);
  const ventasMesAnterior = ventas.filter((v) => {
    const d = new Date(v.created_at);
    return d >= inicioMesAnterior && d < inicioMes;
  });
  const ventasAño = ventas.filter((v) => new Date(v.created_at) >= inicioAño);

  const ingresosMes = ventasMes.reduce((a, v) => a + (v.precio_venta ?? 0), 0);
  const ingresosMesAnt = ventasMesAnterior.reduce((a, v) => a + (v.precio_venta ?? 0), 0);
  const ingresosAño = ventasAño.reduce((a, v) => a + (v.precio_venta ?? 0), 0);
  const deltaMes = ingresosMesAnt > 0 ? ((ingresosMes - ingresosMesAnt) / ingresosMesAnt) * 100 : null;

  const valorStock = relojes
    .filter((r) => (r.estado_venta ?? "Disponible") !== "Vendido")
    .reduce((a, r) => a + (r.precio_venta ?? 0), 0);

  const costeStock = relojes
    .filter((r) => (r.estado_venta ?? "Disponible") !== "Vendido")
    .reduce((a, r) => a + (r.precio_coste ?? 0), 0);

  const porEstadoVenta = { Disponible: 0, Reservado: 0, Vendido: 0 } as Record<string, number>;
  for (const r of relojes) porEstadoVenta[r.estado_venta ?? "Disponible"] = (porEstadoVenta[r.estado_venta ?? "Disponible"] ?? 0) + 1;

  const topMarcas = Object.entries(
    relojes.reduce<Record<string, number>>((acc, r) => {
      acc[r.marca] = (acc[r.marca] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Serie mensual últimos 6 meses: ingresos
  const meses: { mes: string; ingresos: number; unidades: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const ini = startOfMonth(i);
    const fin = startOfMonth(i - 1);
    const vs = ventas.filter((v) => {
      const d = new Date(v.created_at);
      return d >= ini && d < fin;
    });
    meses.push({
      mes: ini.toLocaleDateString("es-ES", { month: "short", year: "2-digit" }),
      ingresos: vs.reduce((a, v) => a + (v.precio_venta ?? 0), 0),
      unidades: vs.length,
    });
  }
  const maxIngresos = Math.max(1, ...meses.map((m) => m.ingresos));

  const tasacionesPendientes = tasaciones.filter((t) => t.estado === "Pendiente").length;
  const postsPublicados = posts.filter((p) => p.publicado).length;

  const kpis = [
    { label: "Ingresos mes", value: fmtEur(ingresosMes), sub: deltaMes === null ? "sin mes anterior" : `${deltaMes >= 0 ? "+" : ""}${deltaMes.toFixed(0)}% vs mes anterior`, icon: "💶", good: (deltaMes ?? 0) >= 0 },
    { label: "Ingresos año", value: fmtEur(ingresosAño), sub: `${ventasAño.length} ventas`, icon: "📅" },
    { label: "Valor stock", value: fmtEur(valorStock), sub: `coste ${fmtEur(costeStock)} · margen pot. ${fmtEur(valorStock - costeStock)}`, icon: "💎" },
    { label: "Tasaciones pendientes", value: tasacionesPendientes, sub: `${tasaciones.length} totales`, icon: "📋", alert: tasacionesPendientes > 0 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Analytics</h1>
        <p className="text-stone-500 text-sm mt-1">Datos del negocio en tiempo real.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, sub, icon, alert, good }) => (
          <div key={label} className={`bg-white rounded-2xl border p-6 ${alert ? "border-amber-300 bg-amber-50" : "border-stone-200"}`}>
            <div className="text-3xl mb-3">{icon}</div>
            <div className="text-2xl font-bold text-stone-900">{value}</div>
            <div className="text-stone-500 text-sm mt-0.5">{label}</div>
            <div className={`text-xs mt-1 ${alert ? "text-amber-600 font-medium" : good === false ? "text-red-600" : good === true ? "text-emerald-600" : "text-stone-400"}`}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Ingresos por mes */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8">
        <h2 className="font-semibold text-stone-800 mb-6">Ingresos últimos 6 meses</h2>
        <div className="flex items-end gap-3 h-56">
          {meses.map((m) => (
            <div key={m.mes} className="flex-1 flex flex-col items-center">
              <div className="text-xs font-medium text-stone-600 mb-2">{fmtEur(m.ingresos)}</div>
              <div
                className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-lg transition-all"
                style={{ height: `${(m.ingresos / maxIngresos) * 100}%`, minHeight: m.ingresos > 0 ? 6 : 0 }}
                title={`${m.unidades} ventas`}
              />
              <div className="text-xs text-stone-400 mt-2 capitalize">{m.mes}</div>
              <div className="text-[10px] text-stone-400">{m.unidades} ud.</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de venta */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-800 mb-5">Catálogo por estado</h2>
          <div className="space-y-3">
            {Object.entries(porEstadoVenta).map(([k, n]) => {
              const total = Object.values(porEstadoVenta).reduce((a, b) => a + b, 0) || 1;
              const pct = (n / total) * 100;
              const color = k === "Disponible" ? "bg-emerald-500" : k === "Reservado" ? "bg-amber-500" : "bg-stone-800";
              return (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{k}</span>
                    <span className="text-stone-500">{n} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`${color} h-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-stone-400 mt-5">Total piezas: {relojes.length}</p>
        </div>

        {/* Top marcas */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-800 mb-5">Top marcas en catálogo</h2>
          {topMarcas.length === 0 ? (
            <p className="text-sm text-stone-400">Sin datos.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {topMarcas.map(([m, n]) => (
                <li key={m} className="flex justify-between py-2 text-sm">
                  <span className="font-medium">{m}</span>
                  <span className="text-stone-500">{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Blog */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-800 mb-5">Blog</h2>
          <div className="flex items-baseline gap-6">
            <div>
              <p className="text-3xl font-bold">{posts.length}</p>
              <p className="text-xs text-stone-500">artículos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">{postsPublicados}</p>
              <p className="text-xs text-stone-500">publicados</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-stone-400">{posts.length - postsPublicados}</p>
              <p className="text-xs text-stone-500">borradores</p>
            </div>
          </div>
        </div>

        {/* Operación */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-800 mb-5">Operación</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span>Tasaciones totales</span>
              <span className="font-semibold">{tasaciones.length}</span>
            </li>
            <li className="flex justify-between">
              <span>Pendientes</span>
              <span className={`font-semibold ${tasacionesPendientes > 0 ? "text-amber-600" : "text-stone-500"}`}>{tasacionesPendientes}</span>
            </li>
            <li className="flex justify-between">
              <span>Ventas este año</span>
              <span className="font-semibold">{ventasAño.length}</span>
            </li>
            <li className="flex justify-between">
              <span>Ticket medio</span>
              <span className="font-semibold">{ventasAño.length > 0 ? fmtEur(ingresosAño / ventasAño.length) : "—"}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
