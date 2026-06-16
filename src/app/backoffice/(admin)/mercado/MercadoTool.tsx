"use client";

import { useState, useTransition } from "react";
import { guardarConsultaMercado } from "./actions";

type Canal = {
  key: string;
  nombre: string;
  url: (q: { marca: string; modelo: string; referencia: string }) => string;
  color: string;
};

const CANALES: Canal[] = [
  {
    key: "chrono24",
    nombre: "Chrono24",
    url: ({ marca, modelo, referencia }) =>
      `https://www.chrono24.es/search/index.htm?query=${encodeURIComponent(`${marca} ${modelo} ${referencia}`)}`,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    key: "watchcharts",
    nombre: "WatchCharts",
    url: ({ referencia }) =>
      `https://watchcharts.com/watches/search?q=${encodeURIComponent(referencia)}`,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    key: "wallapop",
    nombre: "Wallapop",
    url: ({ marca, modelo, referencia }) =>
      `https://es.wallapop.com/app/search?keywords=${encodeURIComponent(`${marca} ${modelo} ${referencia}`)}&category_ids=14000`,
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    key: "vinted",
    nombre: "Vinted",
    url: ({ marca, modelo }) =>
      `https://www.vinted.es/catalog?search_text=${encodeURIComponent(`${marca} ${modelo}`)}`,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    key: "milanuncios",
    nombre: "Milanuncios",
    url: ({ marca, modelo }) =>
      `https://www.milanuncios.com/relojes-en-venta/?texto=${encodeURIComponent(`${marca} ${modelo}`)}`,
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    key: "todocoleccion",
    nombre: "Todocolección",
    url: ({ marca, modelo }) =>
      `https://www.todocoleccion.net/relojes/_t-${encodeURIComponent(`${marca} ${modelo}`)}`,
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    key: "ebay",
    nombre: "eBay España",
    url: ({ marca, modelo, referencia }) =>
      `https://www.ebay.es/sch/i.html?_nkw=${encodeURIComponent(`${marca} ${modelo} ${referencia}`)}&_sacat=281&LH_Sold=1`,
    color: "bg-red-50 text-red-700 border-red-200",
  },
  {
    key: "amazon",
    nombre: "Amazon ES",
    url: ({ marca, modelo }) =>
      `https://www.amazon.es/s?k=${encodeURIComponent(`${marca} ${modelo}`)}&i=watch`,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

type Busqueda = { marca: string; modelo: string; referencia: string };

function PrecioInput({ canal }: { canal: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {["min", "medio", "max"].map((campo) => (
        <div key={campo}>
          <label className="block text-xs text-stone-400 mb-1">{campo === "min" ? "Mín." : campo === "medio" ? "Medio" : "Máx."}</label>
          <input
            name={`${canal}_${campo}`}
            type="number"
            min="0"
            className="w-full border border-stone-200 rounded-lg px-2 py-1.5 text-sm"
            placeholder="€"
          />
        </div>
      ))}
    </div>
  );
}

export default function MercadoTool({
  historial,
}: {
  historial: Array<{
    id: string;
    marca: string;
    modelo: string;
    referencia: string;
    precio_sugerido: number | null;
    precios: Record<string, { min?: number; medio?: number; max?: number }>;
    notas: string | null;
    created_at: string;
  }>;
}) {
  const [busqueda, setBusqueda] = useState<Busqueda | null>(null);
  const [form, setForm] = useState({ marca: "", modelo: "", referencia: "" });
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.marca || !form.modelo) return;
    setBusqueda({ ...form });
    setSaved(false);
  }

  function handleGuardar(formData: FormData) {
    startTransition(async () => {
      await guardarConsultaMercado(formData);
      setSaved(true);
    });
  }

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Consultar mercado</h2>
        <form onSubmit={buscar} className="flex gap-3 flex-wrap">
          <input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })}
            placeholder="Marca *" required
            className="border border-stone-200 rounded-xl px-3 py-2 text-sm flex-1 min-w-32 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <input value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            placeholder="Modelo *" required
            className="border border-stone-200 rounded-xl px-3 py-2 text-sm flex-1 min-w-32 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <input value={form.referencia} onChange={(e) => setForm({ ...form, referencia: e.target.value })}
            placeholder="Referencia"
            className="border border-stone-200 rounded-xl px-3 py-2 text-sm flex-1 min-w-28 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <button type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors">
            Buscar
          </button>
        </form>
      </div>

      {busqueda && (
        <>
          {/* Links a plataformas */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-semibold text-stone-800 mb-1">
              {busqueda.marca} {busqueda.modelo} {busqueda.referencia}
            </h2>
            <p className="text-xs text-stone-400 mb-4">Abre cada plataforma, anota los precios abajo y guarda la consulta.</p>
            <div className="flex flex-wrap gap-2">
              {CANALES.map((canal) => (
                <a key={canal.key}
                  href={canal.url(busqueda)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-75 ${canal.color}`}>
                  {canal.nombre}
                  <span className="text-xs opacity-60">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Tabla de precios */}
          <form action={handleGuardar} className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-semibold text-stone-800 mb-4">Registrar precios encontrados</h2>

            <input type="hidden" name="marca" value={busqueda.marca} />
            <input type="hidden" name="modelo" value={busqueda.modelo} />
            <input type="hidden" name="referencia" value={busqueda.referencia} />

            <div className="space-y-4">
              {CANALES.map((canal) => (
                <div key={canal.key} className="grid grid-cols-[140px_1fr] gap-4 items-center">
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg border text-center ${canal.color}`}>
                    {canal.nombre}
                  </span>
                  <PrecioInput canal={canal.key} />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Precio sugerido de venta (€)</label>
                  <input name="precio_sugerido" type="number" min="0"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Precio orientativo calculado" />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Notas</label>
                  <input name="notas" type="text"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Observaciones de mercado…" />
                </div>
              </div>

              <button type="submit" disabled={pending}
                className="bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                {pending ? "Guardando…" : "Guardar consulta"}
              </button>
              {saved && <p className="text-xs text-emerald-600">Consulta guardada en historial.</p>}
            </div>
          </form>
        </>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-semibold text-stone-800">Historial de consultas</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Reloj</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Wallapop</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">eBay</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Chrono24</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Sugerido</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {historial.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.marca} {c.modelo}</p>
                    <p className="text-xs text-stone-400 font-mono">{c.referencia}</p>
                  </td>
                  {["wallapop", "ebay", "chrono24"].map((canal) => {
                    const p = c.precios?.[canal];
                    return (
                      <td key={canal} className="px-4 py-3 text-xs text-stone-600">
                        {p?.medio ? `${p.medio.toLocaleString("es-ES")} €` : p?.min ? `${p.min.toLocaleString("es-ES")}–${p.max?.toLocaleString("es-ES")} €` : "—"}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-right font-semibold">
                    {c.precio_sugerido ? `${c.precio_sugerido.toLocaleString("es-ES")} €` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-stone-400">
                    {new Date(c.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
