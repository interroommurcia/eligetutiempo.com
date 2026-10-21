import Link from "next/link";
import EstadoVentaBanner from "./EstadoVentaBanner";

export type RelojCardData = {
  id: string;
  marca: string;
  modelo: string;
  referencia: string;
  precio: number;
  año: number;
  estado: string;
  estado_venta?: "Disponible" | "Reservado" | "Vendido";
  caja: boolean;
  papeles: boolean;
  imagen: string;
  slug: string;
  descripcion?: string;
};

function formatPrecio(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default function RelojCard({ reloj }: { reloj: RelojCardData }) {
  const vendido = reloj.estado_venta === "Vendido";
  return (
    <Link
      href={`/catalogo/${reloj.slug}`}
      className="relative group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all"
    >
      <EstadoVentaBanner estado={reloj.estado_venta ?? "Disponible"} />

      <div className={`aspect-square bg-stone-100 flex items-center justify-center ${vendido ? "opacity-60" : ""}`}>
        {reloj.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={reloj.imagen} alt={`${reloj.marca} ${reloj.modelo}`} className="w-full h-full object-cover" />
        ) : (
          <span className="text-7xl">⌚</span>
        )}
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
          <p className={`text-xl font-bold whitespace-nowrap ${vendido ? "text-stone-400 line-through" : "text-stone-900"}`}>
            {formatPrecio(reloj.precio)}
          </p>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-stone-100 text-stone-600">
            {reloj.estado}
          </span>
          {reloj.año > 0 && <span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">{reloj.año}</span>}
          {reloj.caja && <span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">+ Caja</span>}
          {reloj.papeles && <span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">+ Papeles</span>}
        </div>
      </div>
    </Link>
  );
}
