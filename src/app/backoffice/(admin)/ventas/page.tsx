import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import VentasTable from "./VentasTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ventas — Backoffice" };

export default async function BackofficeVentasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  const { data: ventas } = await supabase
    .from("ventas")
    .select("*")
    .order("fecha", { ascending: false });

  const lista = ventas ?? [];
  const totalVentas = lista.reduce((acc, v) => acc + v.precio_venta, 0);
  const totalCoste = lista.reduce((acc, v) => acc + v.precio_coste, 0);
  const margenTotal = totalVentas - totalCoste;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Ventas</h1>
          <p className="text-stone-500 text-sm mt-1">{lista.length} operaciones registradas</p>
        </div>
        <a href="/backoffice/ventas/nueva"
          className="bg-[#C9A84C] hover:bg-[#E2C36A] text-black font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          + Registrar venta
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total vendido", value: `${totalVentas.toLocaleString("es-ES")} €` },
          { label: "Coste total", value: `${totalCoste.toLocaleString("es-ES")} €` },
          { label: "Margen bruto", value: `${margenTotal.toLocaleString("es-ES")} €`, highlight: true },
        ].map(({ label, value, highlight }) => (
          <div key={label} className={`bg-white rounded-xl border p-4 ${highlight ? "border-green-200 bg-green-50" : "border-stone-200"}`}>
            <div className={`text-xl font-bold ${highlight ? "text-green-700" : "text-stone-900"}`}>{value}</div>
            <div className="text-xs text-stone-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {lista.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <p className="text-4xl mb-3">💶</p>
          <p className="text-stone-500">No hay ventas registradas todavía.</p>
          <a href="/backoffice/ventas/nueva"
            className="inline-block mt-4 text-sm text-[#C9A84C] hover:underline">
            Registrar primera venta →
          </a>
        </div>
      ) : (
        <VentasTable ventas={lista} />
      )}
    </div>
  );
}
