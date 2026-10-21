"use client";

import { useState, useTransition } from "react";
import { guardarConsultaMercado } from "./actions";

type Oferta = {
  fuente: string;
  titulo: string;
  precio: number;
  moneda: string;
  url: string;
  imagen?: string | null;
  ubicacion?: string | null;
};
type ResultadoFuente = {
  fuente: string;
  nombre: string;
  ok: boolean;
  ofertas: Oferta[];
  error?: string;
  elapsed_ms: number;
  search_url: string;
};
type MercadoResponse = {
  query: string;
  fuentes: ResultadoFuente[];
  ofertas_ordenadas: Oferta[];
  stats: {
    total: number;
    min: number | null;
    max: number | null;
    media: number | null;
    mediana: number | null;
  };
};

function fmtEur(n: number | null): string {
  if (n === null) return "—";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

const FUENTE_COLOR: Record<string, string> = {
  wallapop: "bg-teal-50 text-teal-700 border-teal-200",
  ebay: "bg-red-50 text-red-700 border-red-200",
  chrono24: "bg-blue-50 text-blue-700 border-blue-200",
  milanuncios: "bg-orange-50 text-orange-700 border-orange-200",
};

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

  // Scraping en tiempo real
  const [scraping, setScraping] = useState(false);
  const [mercado, setMercado] = useState<MercadoResponse | null>(null);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [fuenteFiltro, setFuenteFiltro] = useState<string | null>(null);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.marca || !form.modelo) return;
    setBusqueda({ ...form });
    setSaved(false);
    setMercado(null);
    setScrapeError(null);
  }

  async function scrapear() {
    if (!busqueda) return;
    setScraping(true);
    setScrapeError(null);
    setMercado(null);
    try {
      const q = [busqueda.marca, busqueda.modelo, busqueda.referencia].filter(Boolean).join(" ");
      const res = await fetch("/api/mercado/scrape", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setMercado(data as MercadoResponse);
    } catch (e: unknown) {
      setScrapeError(e instanceof Error ? e.message : "Fallo al buscar precios");
    } finally {
      setScraping(false);
    }
  }

  const ofertasFiltradas = mercado
    ? (fuenteFiltro ? mercado.ofertas_ordenadas.filter((o) => o.fuente === fuenteFiltro) : mercado.ofertas_ordenadas)
    : [];

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
          {/* Scraping automático */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
              <div>
                <h2 className="font-semibold text-stone-800">
                  {busqueda.marca} {busqueda.modelo} {busqueda.referencia}
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Precios en tiempo real desde Wallapop, eBay, Chrono24 y Milanuncios.
                </p>
              </div>
              <button
                type="button"
                onClick={scrapear}
                disabled={scraping}
                className="bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-xl text-sm"
              >
                {scraping ? "Buscando…" : mercado ? "Volver a buscar" : "🔎 Buscar precios"}
              </button>
            </div>

            {scrapeError && (
              <p className="text-xs text-red-600 mb-2">{scrapeError}</p>
            )}

            {/* Estado por fuente */}
            {mercado && (
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setFuenteFiltro(null)}
                  className={`text-xs px-3 py-1 rounded-full border font-medium ${!fuenteFiltro ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"}`}
                >
                  Todas · {mercado.ofertas_ordenadas.length}
                </button>
                {mercado.fuentes.map((f) => {
                  const activo = fuenteFiltro === f.fuente;
                  return (
                    <button
                      key={f.fuente}
                      type="button"
                      onClick={() => setFuenteFiltro(activo ? null : f.fuente)}
                      className={`text-xs px-3 py-1 rounded-full border font-medium ${activo ? "ring-2 ring-amber-400" : ""} ${f.ok ? FUENTE_COLOR[f.fuente] : "bg-stone-100 text-stone-400 border-stone-200"}`}
                      title={f.ok ? `${f.ofertas.length} resultados en ${f.elapsed_ms} ms` : `Error: ${f.error ?? "no disponible"}`}
                    >
                      {f.nombre}: {f.ok ? f.ofertas.length : "✕"}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Stats */}
            {mercado && mercado.stats.total > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                  <div className="text-xs text-stone-500">Mínimo</div>
                  <div className="text-lg font-bold text-emerald-700">{fmtEur(mercado.stats.min)}</div>
                </div>
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                  <div className="text-xs text-stone-500">Mediana</div>
                  <div className="text-lg font-bold">{fmtEur(mercado.stats.mediana)}</div>
                </div>
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                  <div className="text-xs text-stone-500">Media</div>
                  <div className="text-lg font-bold">{fmtEur(mercado.stats.media)}</div>
                </div>
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                  <div className="text-xs text-stone-500">Máximo</div>
                  <div className="text-lg font-bold text-red-700">{fmtEur(mercado.stats.max)}</div>
                </div>
              </div>
            )}

            {/* Fuentes caídas: enlaces manuales de respaldo */}
            {mercado && mercado.fuentes.some((f) => !f.ok || f.ofertas.length === 0) && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <p className="font-semibold mb-1">Fuentes sin resultados automáticos (ábrelas a mano):</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {mercado.fuentes
                    .filter((f) => !f.ok || f.ofertas.length === 0)
                    .map((f) => (
                      <a key={f.fuente} href={f.search_url} target="_blank" rel="noopener noreferrer"
                        className="underline hover:text-amber-700">
                        {f.nombre} ↗
                      </a>
                    ))}
                </div>
              </div>
            )}

            {/* Resultados: lista ordenada por precio ascendente */}
            {mercado && ofertasFiltradas.length > 0 && (
              <div className="max-h-[520px] overflow-y-auto border border-stone-100 rounded-xl divide-y divide-stone-100">
                {ofertasFiltradas.map((o, i) => (
                  <a
                    key={`${o.fuente}-${i}-${o.url}`}
                    href={o.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 hover:bg-stone-50 transition-colors"
                  >
                    {o.imagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={o.imagen} alt="" className="w-14 h-14 rounded-lg object-cover bg-stone-100 flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-stone-100 flex items-center justify-center text-xl flex-shrink-0">⌚</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-stone-900 truncate">{o.titulo}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${FUENTE_COLOR[o.fuente] ?? ""}`}>
                          {o.fuente}
                        </span>
                        {o.ubicacion && <span className="text-xs text-stone-500 truncate">{o.ubicacion}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-stone-900 whitespace-nowrap">{fmtEur(o.precio)}</div>
                      <div className="text-[10px] text-stone-400">#{i + 1}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {mercado && mercado.ofertas_ordenadas.length === 0 && (
              <p className="text-sm text-stone-500 text-center py-6">
                Ninguna fuente devolvió resultados automáticos. Usa los enlaces de respaldo arriba.
              </p>
            )}
          </div>

          {/* Links a plataformas (originales, para abrir manual) */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h3 className="font-semibold text-stone-800 mb-3 text-sm">O abre manualmente:</h3>
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
