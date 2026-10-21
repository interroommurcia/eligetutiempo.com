import type { BlogPost } from "@/lib/blog";
import { renderContent, formatFecha, ProductosRelacionados, type ProductoRel } from "./shared";

export default function Revista({ post, productos }: { post: BlogPost; productos: ProductoRel[] }) {
  return (
    <div>
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[380px] bg-stone-900 overflow-hidden">
        {post.portada && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.portada}
            alt={post.titulo}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-white">
          {post.tags?.length > 0 && (
            <div className="flex gap-2 mb-4">
              {post.tags.map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 bg-amber-500/90 text-black rounded-full font-semibold">{t}</span>
              ))}
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-4xl">{post.titulo}</h1>
          <p className="mt-4 text-sm uppercase tracking-widest opacity-80">
            {formatFecha(post.published_at ?? post.created_at)} · por {post.autor ?? "EligeTuTiempo"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {post.resumen && (
          <p className="text-2xl font-serif italic text-stone-700 border-l-4 border-amber-400 pl-5 mb-10">
            {post.resumen}
          </p>
        )}
        <div className="prose-content text-lg">{renderContent(post.contenido)}</div>
        <ProductosRelacionados productos={productos} />
      </div>
    </div>
  );
}
