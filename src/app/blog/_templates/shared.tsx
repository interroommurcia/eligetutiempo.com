import Link from "next/link";

export type ProductoRel = {
  id: string;
  slug: string;
  marca: string;
  modelo: string;
  referencia: string;
  precio_venta: number;
  imagenes: string[];
  estado_venta?: string | null;
};

export function formatFecha(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}

export function formatPrecio(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

/**
 * Convierte el contenido (texto plano con dobles saltos de línea, o pseudo-markdown
 * sencillo: # titulo, ## subtitulo, ![alt](url) para imagen) a React.
 * No usamos dangerouslySetInnerHTML: tratamos todo como data no fiable.
 */
export function renderContent(contenido: string) {
  const bloques = contenido.split(/\n\s*\n/);
  return bloques.map((raw, i) => {
    const b = raw.trim();
    if (!b) return null;
    if (b.startsWith("# ")) return <h2 key={i} className="text-3xl font-bold mt-10 mb-4">{b.slice(2)}</h2>;
    if (b.startsWith("## ")) return <h3 key={i} className="text-2xl font-semibold mt-8 mb-3">{b.slice(3)}</h3>;
    if (b.startsWith("### ")) return <h4 key={i} className="text-xl font-semibold mt-6 mb-2">{b.slice(4)}</h4>;
    const img = b.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (img) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={img[2]} alt={img[1]} className="w-full rounded-2xl my-6" />
      );
    }
    if (b.startsWith("> ")) {
      return <blockquote key={i} className="border-l-4 border-amber-400 pl-4 italic text-stone-600 my-6">{b.slice(2)}</blockquote>;
    }
    return <p key={i} className="my-4 leading-relaxed text-stone-700">{b}</p>;
  });
}

export function ProductosRelacionados({ productos }: { productos: ProductoRel[] }) {
  if (!productos || productos.length === 0) return null;
  return (
    <section className="mt-16 border-t border-stone-200 pt-10">
      <h3 className="text-xl font-semibold mb-6">Mencionados en este artículo</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productos.map((p) => (
          <Link
            key={p.id}
            href={`/catalogo/${p.slug}`}
            className="group bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-amber-400 hover:shadow transition-all"
          >
            <div className="aspect-square bg-stone-100 flex items-center justify-center">
              {p.imagenes?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imagenes[0]} alt={`${p.marca} ${p.modelo}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">⌚</span>
              )}
            </div>
            <div className="p-3">
              <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider">{p.marca}</p>
              <p className="text-sm font-medium text-stone-900 line-clamp-1 group-hover:text-amber-700">{p.modelo}</p>
              <p className="text-sm font-semibold mt-1">{formatPrecio(p.precio_venta)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
