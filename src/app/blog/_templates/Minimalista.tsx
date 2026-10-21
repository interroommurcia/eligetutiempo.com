import type { BlogPost } from "@/lib/blog";
import { renderContent, formatFecha, ProductosRelacionados, type ProductoRel } from "./shared";

export default function Minimalista({ post, productos }: { post: BlogPost; productos: ProductoRel[] }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-stone-400">
          {formatFecha(post.published_at ?? post.created_at)} · {post.autor ?? "EligeTuTiempo"}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-3 leading-tight">{post.titulo}</h1>
        {post.resumen && <p className="text-lg text-stone-500 mt-4 leading-relaxed">{post.resumen}</p>}
      </header>

      {post.portada && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.portada} alt={post.titulo} className="w-full rounded-2xl mb-10" />
      )}

      <div className="prose-content">{renderContent(post.contenido)}</div>

      <ProductosRelacionados productos={productos} />
    </div>
  );
}
