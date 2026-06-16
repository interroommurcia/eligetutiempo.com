"use client";

import { useTransition } from "react";
import type { Reloj } from "@/lib/relojes";
import { eliminarReloj, togglePublicado } from "./actions";

const ESTADO_COLOR: Record<string, string> = {
  Mint: "bg-emerald-100 text-emerald-700",
  "Very Good": "bg-blue-100 text-blue-700",
  Good: "bg-amber-100 text-amber-700",
  Fair: "bg-stone-100 text-stone-600",
};

function RowActions({ reloj }: { reloj: Reloj }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`¿Eliminar ${reloj.marca} ${reloj.modelo}? Esta acción no se puede deshacer.`)) return;
    startTransition(() => eliminarReloj(reloj.id));
  }

  function handleToggle() {
    startTransition(() => togglePublicado(reloj.id, !reloj.publicado));
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <button onClick={handleToggle} disabled={pending}
        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
          reloj.publicado
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-stone-100 text-stone-500 hover:bg-stone-200"
        }`}>
        {reloj.publicado ? "Publicado" : "Oculto"}
      </button>
      <a href={`/backoffice/relojes/${reloj.id}/editar`}
        className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
        Editar
      </a>
      <button onClick={handleDelete} disabled={pending}
        className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
        Eliminar
      </button>
    </div>
  );
}

export default function RelojesTable({ relojes }: { relojes: Reloj[] }) {
  if (relojes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <p className="text-4xl mb-3">⌚</p>
        <p className="text-stone-500">No hay relojes en el catálogo todavía.</p>
        <a href="/backoffice/relojes/nuevo"
          className="inline-block mt-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          Añadir primer reloj
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 border-b border-stone-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Reloj</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Ref.</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Estado</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">P. Venta</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Margen</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {relojes.map((r) => {
            const margen = r.precio_coste
              ? (((r.precio_venta - r.precio_coste) / r.precio_coste) * 100).toFixed(0) + "%"
              : "—";
            return (
              <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{r.marca}</p>
                  <p className="text-stone-500 text-xs">{r.modelo} {r.año ? `· ${r.año}` : ""}</p>
                </td>
                <td className="px-4 py-3 text-stone-600 font-mono text-xs">{r.referencia}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[r.estado] ?? "bg-stone-100 text-stone-600"}`}>
                    {r.estado}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-stone-900">
                  {r.precio_venta.toLocaleString("es-ES")} €
                </td>
                <td className="px-4 py-3 text-right text-stone-500">{margen}</td>
                <td className="px-4 py-3">
                  <RowActions reloj={r} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
