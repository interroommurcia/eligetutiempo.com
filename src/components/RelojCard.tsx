import Link from "next/link";
import type { Reloj } from "@/lib/data";

function formatPrecio(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default function RelojCard({ reloj }: { reloj: Reloj }) {
  return (
    <Link
      href={`/catalogo/${reloj.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all"
    >
      <div className="aspect-square bg-stone-100 flex items-center justify-center text-7xl">
        ⌚
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">{reloj.marca}</p>
            <h3 className="font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
              {reloj.modelo}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">Ref. {reloj.referencia}</p>
          </div>
          <p className="text-xl font-bold text-stone-900 whitespace-nowrap">{formatPrecio(reloj.precio)}</p>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            reloj.estado === "Excelente"
              ? "bg-green-50 text-green-700"
              : reloj.estado === "Muy bueno"
              ? "bg-blue-50 text-blue-700"
              : "bg-stone-100 text-stone-600"
          }`}>
            {reloj.estado}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">{reloj.año}</span>
          {reloj.caja && <span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">+ Caja</span>}
          {reloj.papeles && <span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">+ Papeles</span>}
        </div>
      </div>
    </Link>
  );
}
