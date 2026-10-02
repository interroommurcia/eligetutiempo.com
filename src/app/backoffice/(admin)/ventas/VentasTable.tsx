"use client";

import { useTransition } from "react";
import { eliminarVenta } from "./actions";

type Venta = {
  id: string;
  marca: string;
  modelo: string;
  referencia: string | null;
  precio_coste: number;
  precio_venta: number;
  canal: string;
  notas: string | null;
  fecha: string;
};

const CANAL_COLOR: Record<string, string> = {
  Web: "bg-blue-100 text-blue-700",
  Wallapop: "bg-teal-100 text-teal-700",
  Milanuncios: "bg-orange-100 text-orange-700",
  "Todocolección": "bg-purple-100 text-purple-700",
  eBay: "bg-red-100 text-red-700",
  Chrono24: "bg-indigo-100 text-indigo-700",
  Presencial: "bg-green-100 text-green-700",
  Otro: "bg-stone-100 text-stone-600",
};

function Row({ venta }: { venta: Venta }) {
  const [pending, startTransition] = useTransition();
  const margen = venta.precio_venta - venta.precio_coste;
  const margenPct = venta.precio_coste > 0 ? Math.round((margen / venta.precio_coste) * 100) : null;

  return (
    <tr className="hover:bg-stone-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-stone-900">
        {venta.marca} {venta.modelo}
        {venta.referencia && <span className="block text-xs text-stone-400 font-mono">{venta.referencia}</span>}
      </td>
      <td className="px-4 py-3 text-sm text-stone-600">
        {new Date(venta.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CANAL_COLOR[venta.canal] ?? CANAL_COLOR.Otro}`}>
          {venta.canal}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-right text-stone-500">{venta.precio_coste.toLocaleString("es-ES")} €</td>
      <td className="px-4 py-3 text-sm text-right font-semibold text-stone-900">{venta.precio_venta.toLocaleString("es-ES")} €</td>
      <td className="px-4 py-3 text-sm text-right font-semibold text-green-700">
        +{margen.toLocaleString("es-ES")} €
        {margenPct !== null && <span className="text-xs font-normal text-green-500 ml-1">({margenPct}%)</span>}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          disabled={pending}
          onClick={() => { if (confirm("¿Eliminar esta venta?")) startTransition(() => eliminarVenta(venta.id)); }}
          className="text-xs text-stone-400 hover:text-red-500 transition-colors disabled:opacity-40"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}

export default function VentasTable({ ventas }: { ventas: Venta[] }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 border-b border-stone-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">Reloj</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">Fecha</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">Canal</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase tracking-wide">Coste</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase tracking-wide">Venta</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase tracking-wide">Margen</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {ventas.map((v) => <Row key={v.id} venta={v} />)}
        </tbody>
      </table>
    </div>
  );
}
