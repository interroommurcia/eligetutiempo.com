import { getRelojBySlug } from "@/lib/relojes";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatPrecio(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

const ESTADO_BADGE: Record<string, string> = {
  Mint: "bg-emerald-50 text-emerald-700",
  "Very Good": "bg-blue-50 text-blue-700",
  Good: "bg-amber-50 text-amber-700",
  Fair: "bg-stone-100 text-stone-600",
};

export default async function RelojPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reloj = await getRelojBySlug(slug);
  if (!reloj) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/catalogo" className="text-sm text-stone-400 hover:text-stone-700 mb-8 inline-block">
        ← Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen principal */}
        <div>
          {reloj.imagenes?.[0] ? (
            <img src={reloj.imagenes[0]} alt={`${reloj.marca} ${reloj.modelo}`}
              className="w-full aspect-square object-cover rounded-3xl bg-stone-100" />
          ) : (
            <div className="aspect-square bg-stone-100 rounded-3xl flex items-center justify-center text-[10rem]">⌚</div>
          )}
          {reloj.imagenes?.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {reloj.imagenes.slice(1).map((img, i) => (
                <img key={i} src={img} alt="" className="w-20 h-20 object-cover rounded-xl bg-stone-100 flex-shrink-0" />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm">{reloj.marca}</p>
          <h1 className="text-4xl font-bold mt-1 mb-2">{reloj.modelo}</h1>
          <p className="text-stone-400 text-sm mb-6">
            Ref. {reloj.referencia}{reloj.año ? ` · ${reloj.año}` : ""}
          </p>

          <p className="text-4xl font-bold text-stone-900 mb-8">{formatPrecio(reloj.precio_venta)}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${ESTADO_BADGE[reloj.estado] ?? "bg-stone-100 text-stone-600"}`}>
              {reloj.estado}
            </span>
            {reloj.caja && <span className="px-3 py-1.5 rounded-full text-sm bg-stone-100 text-stone-700">Caja original</span>}
            {reloj.papeles && <span className="px-3 py-1.5 rounded-full text-sm bg-stone-100 text-stone-700">Papeles</span>}
            {reloj.factura && <span className="px-3 py-1.5 rounded-full text-sm bg-stone-100 text-stone-700">Factura</span>}
          </div>

          {reloj.descripcion && (
            <p className="text-stone-600 leading-relaxed mb-10">{reloj.descripcion}</p>
          )}

          <div className="flex flex-col gap-3">
            <a href={`mailto:hola@eligetutiempo.com?subject=Interés en ${reloj.marca} ${reloj.modelo} (${reloj.referencia})`}
              className="bg-amber-600 hover:bg-amber-500 text-white text-center py-4 rounded-xl font-semibold text-lg transition-colors">
              Estoy interesado
            </a>
            <Link href="/tasacion"
              className="border border-stone-300 hover:border-amber-400 text-stone-700 text-center py-4 rounded-xl font-semibold transition-colors">
              Tasar mi reloj
            </Link>
          </div>

          <div className="mt-8 p-4 bg-stone-50 rounded-xl border border-stone-200 text-sm text-stone-500">
            <span className="font-semibold text-stone-700">Garantía de autenticidad:</span> Todos los relojes son verificados por nuestros expertos antes de publicarse.
          </div>
        </div>
      </div>
    </div>
  );
}
