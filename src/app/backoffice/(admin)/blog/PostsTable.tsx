"use client";

import { useTransition } from "react";
import type { BlogPost } from "@/lib/blog";
import { eliminarPost, togglePublicadoPost } from "./actions";

function RowActions({ post }: { post: BlogPost }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`¿Eliminar "${post.titulo}"? No se puede deshacer.`)) return;
    startTransition(() => eliminarPost(post.id));
  }

  function handleToggle() {
    startTransition(() => togglePublicadoPost(post.id, !post.publicado));
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <button onClick={handleToggle} disabled={pending}
        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
          post.publicado
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-stone-100 text-stone-500 hover:bg-stone-200"
        }`}>
        {post.publicado ? "Publicado" : "Borrador"}
      </button>
      <a href={`/backoffice/blog/${post.id}/editar`}
        className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
        Editar
      </a>
      {post.publicado && (
        <a href={`/blog/${post.slug}`} target="_blank"
          className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
          Ver
        </a>
      )}
      <button onClick={handleDelete} disabled={pending}
        className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
        Eliminar
      </button>
    </div>
  );
}

export default function PostsTable({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <p className="text-4xl mb-3">📝</p>
        <p className="text-stone-500">Aún no has escrito artículos.</p>
        <a href="/backoffice/blog/nuevo"
          className="inline-block mt-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          Escribir primero
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 border-b border-stone-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Título</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Plantilla</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Actualizado</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {posts.map((p) => (
            <tr key={p.id} className="hover:bg-stone-50 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-stone-900">{p.titulo}</p>
                <p className="text-xs text-stone-400">/blog/{p.slug}</p>
              </td>
              <td className="px-4 py-3 text-stone-600 capitalize">{p.template}</td>
              <td className="px-4 py-3 text-stone-500 text-xs">
                {new Date(p.updated_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td className="px-4 py-3">
                <RowActions post={p} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
