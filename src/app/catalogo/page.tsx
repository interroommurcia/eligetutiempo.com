import { getRelojesPublicados } from "@/lib/relojes";
import { marcasPopulares } from "@/lib/data";
import RelojCard from "@/components/RelojCard";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Catálogo de Relojes — EligeTuTiempo" };

const MARCAS = marcasPopulares;
const ESTADOS = ["Mint", "Very Good", "Good", "Fair"];

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ marca?: string; estado?: string }>;
}) {
  const { marca, estado } = await searchParams;
  const todos = await getRelojesPublicados();

  const filtrados = todos.filter((r) => {
    if (marca && r.marca !== marca) return false;
    if (estado && r.estado !== estado) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">Catálogo</h1>
      <p className="text-stone-500 mb-10">Todos nuestros relojes verificados disponibles</p>

      <div className="flex gap-8 flex-col lg:flex-row">
        <aside className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sticky top-24">
            <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-stone-400">Marca</h2>
            <div className="flex flex-col gap-1">
              <Link href="/catalogo"
                className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${!marca ? "bg-amber-50 text-amber-700 font-medium" : "hover:bg-stone-50"}`}>
                Todas
              </Link>
              {MARCAS.map((m) => (
                <Link key={m} href={`/catalogo?marca=${encodeURIComponent(m)}`}
                  className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${marca === m ? "bg-amber-50 text-amber-700 font-medium" : "hover:bg-stone-50"}`}>
                  {m}
                </Link>
              ))}
            </div>

            <h2 className="font-semibold mt-6 mb-4 text-sm uppercase tracking-wider text-stone-400">Estado</h2>
            <div className="flex flex-col gap-1">
              {ESTADOS.map((e) => (
                <Link key={e}
                  href={`/catalogo?${marca ? `marca=${encodeURIComponent(marca)}&` : ""}estado=${encodeURIComponent(e)}`}
                  className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${estado === e ? "bg-amber-50 text-amber-700 font-medium" : "hover:bg-stone-50"}`}>
                  {e}
                </Link>
              ))}
            </div>
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
                  <RelojCard key={r.id} reloj={{
                    id: r.id,
                    marca: r.marca,
                    modelo: r.modelo,
                    referencia: r.referencia,
                    precio: r.precio_venta,
                    año: r.año ?? 0,
                    estado: r.estado as "Excelente" | "Muy bueno" | "Bueno",
                    caja: r.caja,
                    papeles: r.papeles,
                    imagen: r.imagenes?.[0] ?? "",
                    slug: r.slug,
                    descripcion: r.descripcion ?? "",
                  }} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
