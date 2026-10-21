import type { BlogPost } from "@/lib/blog";
import { renderContent, formatFecha, ProductosRelacionados, type ProductoRel } from "./shared";

export default function Moderno({ post, productos }: { post: BlogPost; productos: ProductoRel[] }) {
  return (
    <div className="bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-5 gap-10 mb-14">
          <div className="md:col-span-3">
            {post.tags?.length > 0 && (
              <div className="flex gap-2 mb-5">
                {post.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2.5 py-1 bg-stone-900 text-white rounded-full font-medium">{t}</span>
                ))}
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">{post.titulo}</h1>
            {post.resumen && <p className="text-xl text-stone-600 mt-6 leading-relaxed">{post.resumen}</p>}
            <p className="text-xs uppercase tracking-widest text-stone-400 mt-6">
              {formatFecha(post.published_at ?? post.created_at)} · {post.autor ?? "EligeTuTiempo"}
            </p>
          </div>
          {post.portada && (
            <div className="md:col-span-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.portada}
                alt={post.titulo}
                className="w-full h-full object-cover rounded-3xl shadow-xl aspect-square md:aspect-auto"
              />
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="prose-content">{renderContent(post.contenido)}</div>
          <ProductosRelacionados productos={productos} />
        </div>
      </div>
    </div>
  );
}
