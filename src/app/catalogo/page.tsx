import { getRelojesPublicados } from "@/lib/relojes";
import RelojCard from "@/components/RelojCard";
import Link from "next/link";

// Caché corta: regenera el catálogo cada 60s, se invalida al publicar/editar.
export const revalidate = 60;
export const metadata = { title: "Catálogo de Relojes — EligeTuTiempo" };

const ESTADOS_VENTA = ["Disponible", "Reservado", "Vendido"] as const;

type SearchParams = {
  marca?: string;
  estado_venta?: string;
  min?: string;
  max?: string;
};

function buildHref(base: SearchParams, patch: Partial<SearchParams>) {
  const next: SearchParams = { ...base, ...patch };
  const params = new URLSearchParams();
  Object.entries(next).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) params.set(k, v);
  });
  const q = params.toString();
  return q ? `/catalogo?${q}` : "/catalogo";
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { marca, estado_venta, min, max } = sp;
  const minN = min ? Number(min) : undefined;
  const maxN = max ? Number(max) : undefined;

  const todos = await getRelojesPublicados();

  // Marcas disponibles a partir del catálogo real (no listado estático).
  const marcasDisponibles = Array.from(new Set(todos.map((r) => r.marca))).sort();

  const filtrados = todos.filter((r) => {
    if (marca && r.marca !== marca) return false;
    if (estado_venta && (r.estado_venta ?? "Disponible") !== estado_venta) return false;
    if (minN !== undefined && r.precio_venta < minN) return false;
    if (maxN !== undefined && r.precio_venta > maxN) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">Catálogo</h1>
      <p className="text-stone-500 mb-10">Todos nuestros relojes verificados disponibles</p>

      <div className="flex gap-8 flex-col lg:flex-row">
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 lg:sticky lg:top-24">
            {/* Estado de venta */}
            <h2 className="font-semibold mb-3 text-sm uppercase tracking-wider text-stone-400">Estado</h2>
            <div className="flex flex-col gap-1">
              <Link
                href={buildHref(sp, { estado_venta: undefined })}
                className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${!estado_venta ? "bg-amber-50 text-amber-700 font-medium" : "hover:bg-stone-50"}`}
              >
                Todos
              </Link>
              {ESTADOS_VENTA.map((e) => (
                <Link
                  key={e}
                  href={buildHref(sp, { estado_venta: e })}
                  className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${estado_venta === e ? "bg-amber-50 text-amber-700 font-medium" : "hover:bg-stone-50"}`}
                >
                  {e === "Disponible" && "🟢 "}
                  {e === "Reservado" && "🟡 "}
                  {e === "Vendido" && "⚫ "}
                  {e}
                </Link>
              ))}
            </div>

            {/* Marca */}
            <h2 className="font-semibold mt-6 mb-3 text-sm uppercase tracking-wider text-stone-400">Marca</h2>
            <div className="flex flex-col gap-1 max-h-72 overflow-auto">
              <Link
                href={buildHref(sp, { marca: undefined })}
                className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${!marca ? "bg-amber-50 text-amber-700 font-medium" : "hover:bg-stone-50"}`}
              >
                Todas
              </Link>
              {marcasDisponibles.map((m) => (
                <Link
                  key={m}
                  href={buildHref(sp, { marca: m })}
                  className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${marca === m ? "bg-amber-50 text-amber-700 font-medium" : "hover:bg-stone-50"}`}
                >
                  {m}
                </Link>
              ))}
            </div>

            {/* Precio */}
            <h2 className="font-semibold mt-6 mb-3 text-sm uppercase tracking-wider text-stone-400">Precio (€)</h2>
            <form action="/catalogo" method="get" className="flex flex-col gap-2">
              {marca && <input type="hidden" name="marca" value={marca} />}
              {estado_venta && <input type="hidden" name="estado_venta" value={estado_venta} />}
              <div className="flex gap-2">
                <input
                  type="number"
                  name="min"
                  defaultValue={min ?? ""}
                  placeholder="Desde"
                  min="0"
                  className="w-full text-sm border border-stone-200 rounded-lg px-2 py-1.5"
                />
                <input
                  type="number"
                  name="max"
                  defaultValue={max ?? ""}
                  placeholder="Hasta"
                  min="0"
                  className="w-full text-sm border border-stone-200 rounded-lg px-2 py-1.5"
                />
              </div>
              <button type="submit" className="bg-stone-900 hover:bg-stone-800 text-white text-sm py-1.5 rounded-lg">
                Aplicar
              </button>
              {(min || max) && (
                <Link
                  href={buildHref(sp, { min: undefined, max: undefined })}
                  className="text-xs text-stone-500 hover:text-stone-700 text-center"
                >
                  Limpiar precio
                </Link>
              )}
            </form>
          </div>
        </aside>

        <div className="flex-1">
          {filtrados.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <p className="text-5xl mb-4">⌚</p>
              <p className="text-lg">No hay relojes con estos filtros.</p>
              <Link href="/catalogo" className="text-amber-600 mt-2 inline-block">Ver todos</Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-stone-400 mb-6">{filtrados.length} relojes encontrados</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtrados.map((r) => (
                  <RelojCard
                    key={r.id}
                    reloj={{
                      id: r.id,
                      marca: r.marca,
                      modelo: r.modelo,
                      referencia: r.referencia,
                      precio: r.precio_venta,
                      año: r.año ?? 0,
                      estado: r.estado,
                      estado_venta: r.estado_venta ?? "Disponible",
                      caja: r.caja,
                      papeles: r.papeles,
                      imagen: r.imagenes?.[0] ?? "",
                      slug: r.slug,
                      descripcion: r.descripcion ?? "",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
