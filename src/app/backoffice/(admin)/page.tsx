import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { relojesDestacados } from "@/lib/data";

export const metadata = { title: "Dashboard — Backoffice EligeTuTiempo" };

export default async function BackofficeDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  const stats = [
    { label: "Relojes en catálogo", value: relojesDestacados.length, icon: "⌚" },
    { label: "Tasaciones pendientes", value: 0, icon: "📋" },
    { label: "Ventas este mes", value: 0, icon: "💶" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Bienvenido, {user.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="text-3xl mb-3">{icon}</div>
            <div className="text-3xl font-bold text-stone-900">{value}</div>
            <div className="text-stone-500 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-900 mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/backoffice/relojes/nuevo"
            className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-amber-400 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-medium text-sm">Añadir reloj</p>
              <p className="text-stone-400 text-xs">Publicar nuevo reloj en el catálogo</p>
            </div>
          </a>
          <a
            href="/backoffice/tasaciones"
            className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-amber-400 transition-colors"
          >
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-medium text-sm">Ver tasaciones</p>
              <p className="text-stone-400 text-xs">Gestionar solicitudes pendientes</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
