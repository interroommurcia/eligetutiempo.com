import Link from "next/link";
import { getPostsPublicados } from "@/lib/blog";

// Caché corta: regenera cada 2 min, se invalida al publicar/editar.
export const revalidate = 120;
export const metadata = {
  title: "Blog — EligeTuTiempo",
  description: "Artículos sobre relojería, mercado, mantenimiento y colecciones.",
};

function formatFecha(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogIndexPage() {
  const posts = await getPostsPublicados();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-stone-500 mt-2">Relojería, mercado y guías de los expertos de EligeTuTiempo.</p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-lg">Pronto publicaremos nuestros primeros artículos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all"
            >
              <div className="aspect-[16/10] bg-stone-100 flex items-center justify-center">
                {p.portada ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.portada} alt={p.titulo} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl opacity-30">📝</span>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs text-stone-400">{formatFecha(p.published_at ?? p.created_at)}</p>
                <h2 className="font-semibold text-lg mt-1 group-hover:text-amber-700">{p.titulo}</h2>
                {p.resumen && <p className="text-sm text-stone-500 mt-2 line-clamp-3">{p.resumen}</p>}
                {p.tags?.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-3">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
