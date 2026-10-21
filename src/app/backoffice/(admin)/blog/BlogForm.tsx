"use client";

import { useActionState, useState } from "react";
import type { BlogPost, BlogTemplate } from "@/lib/blog";
import ImageUploader from "@/components/ImageUploader";

type Props = {
  post?: BlogPost;
  action: (formData: FormData) => Promise<void>;
};

const TEMPLATES: { id: BlogTemplate; label: string; desc: string; emoji: string }[] = [
  { id: "minimalista", label: "Minimalista", desc: "Columna estrecha, lectura concentrada", emoji: "📄" },
  { id: "revista", label: "Revista", desc: "Hero grande con fotos a toda página", emoji: "📰" },
  { id: "moderno", label: "Moderno", desc: "Rejilla con sidebar y tipografías grandes", emoji: "✨" },
];

export default function BlogForm({ post, action }: Props) {
  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await action(formData);
        return null;
      } catch (e: unknown) {
        return e instanceof Error ? e.message : "Error al guardar";
      }
    },
    null
  );

  // Estado controlado solo para el textarea de contenido (para "generación auto")
  const [contenido, setContenido] = useState<string>(post?.contenido ?? "");
  const [titulo, setTitulo] = useState<string>(post?.titulo ?? "");
  const [resumen, setResumen] = useState<string>(post?.resumen ?? "");
  const [generando, setGenerando] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [tema, setTema] = useState("");
  const [tono, setTono] = useState("Experto cercano");
  const [palabras, setPalabras] = useState(800);

  async function generar() {
    if (!tema.trim()) {
      setGenError("Escribe un tema o idea.");
      return;
    }
    setGenerando(true);
    setGenError(null);
    try {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tema, tono, palabras }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar");
      setTitulo(data.titulo || titulo);
      setResumen(data.resumen || resumen);
      setContenido(data.contenido || contenido);
    } catch (e: unknown) {
      setGenError(e instanceof Error ? e.message : "Error al generar");
    } finally {
      setGenerando(false);
    }
  }

  const field = "block w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Generador automático */}
      <div className="bg-gradient-to-br from-amber-50 to-stone-50 border border-amber-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-stone-800">✨ Generar artículo automáticamente</h2>
          <span className="text-[11px] px-2 py-0.5 bg-amber-500 text-black rounded-full font-semibold">IA</span>
        </div>
        <p className="text-xs text-stone-500">
          Rellena el tema y la IA te propondrá título, resumen y contenido. Puedes editar todo antes de publicar.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Tema (ej. 'historia del Rolex Submariner')"
            className={`${field} md:col-span-2`}
          />
          <select value={tono} onChange={(e) => setTono(e.target.value)} className={field}>
            <option>Experto cercano</option>
            <option>Formal</option>
            <option>Divulgativo</option>
            <option>Narrativo</option>
            <option>SEO comercial</option>
          </select>
          <input
            type="number"
            min="200" max="3000" step="100"
            value={palabras}
            onChange={(e) => setPalabras(Number(e.target.value))}
            className={field}
            placeholder="palabras"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={generar}
            disabled={generando}
            className="bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl"
          >
            {generando ? "Generando..." : "Generar borrador"}
          </button>
          {genError && <p className="text-xs text-red-600">{genError}</p>}
        </div>
      </div>

      {/* Básicos */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Título *</label>
          <input name="titulo" required value={titulo} onChange={(e) => setTitulo(e.target.value)} className={field} placeholder="Historia del Rolex Submariner" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Slug (URL)</label>
          <input name="slug" defaultValue={post?.slug ?? ""} className={field} placeholder="historia-rolex-submariner (si se deja vacío, se genera del título)" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Resumen</label>
          <textarea name="resumen" rows={2} value={resumen} onChange={(e) => setResumen(e.target.value)} className={field} placeholder="Dos líneas de gancho; aparecerán en el listado del blog." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Autor</label>
            <input name="autor" defaultValue={post?.autor ?? ""} className={field} placeholder="EligeTuTiempo" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Tags (separados por coma)</label>
            <input name="tags" defaultValue={post?.tags?.join(", ") ?? ""} className={field} placeholder="rolex, submariner, historia" />
          </div>
        </div>
      </div>

      {/* Plantilla */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-800">Plantilla de diseño</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <label key={t.id} className="cursor-pointer border border-stone-200 rounded-xl p-4 hover:border-amber-400 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
              <input
                type="radio"
                name="template"
                value={t.id}
                defaultChecked={(post?.template ?? "minimalista") === t.id}
                className="sr-only peer"
              />
              <div className="text-3xl mb-2">{t.emoji}</div>
              <p className="font-semibold text-sm">{t.label}</p>
              <p className="text-xs text-stone-500 mt-1">{t.desc}</p>
            </label>
          ))}
        </div>
      </div>

      {/* Portada */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
        <h2 className="font-semibold text-stone-800">Portada</h2>
        <p className="text-xs text-stone-500">Una sola imagen. Desde galería, cámara, ordenador o Google Drive. Acepta HEIC (iPhone).</p>
        <ImageUploader
          bucket="blog"
          folder="portadas"
          name="portada"
          defaultUrls={post?.portada ? [post.portada] : []}
          multiple={false}
        />
      </div>

      {/* Contenido */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
        <h2 className="font-semibold text-stone-800">Contenido</h2>
        <p className="text-xs text-stone-500">
          Separa párrafos con línea en blanco. Encabezados con <code>#</code>, <code>##</code>, <code>###</code>. Imagen inline: <code>![alt](url)</code>. Cita: <code>&gt; texto</code>.
        </p>
        <textarea
          name="contenido"
          rows={18}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
          className={`${field} font-mono text-sm leading-relaxed`}
          placeholder={"# Un título dentro del artículo\n\nTu primer párrafo...\n\n## Sección\n\n![alt](https://url-imagen)"}
        />
      </div>

      {/* Productos del catálogo */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
        <h2 className="font-semibold text-stone-800">Productos relacionados del catálogo</h2>
        <p className="text-xs text-stone-500">
          Pega los IDs (UUID) de los relojes separados por coma o espacio. Aparecerán como tarjetas al final del artículo, llevando tráfico al catálogo.
        </p>
        <textarea
          name="productos_relacionados"
          rows={2}
          defaultValue={post?.productos_relacionados?.join(", ") ?? ""}
          className={`${field} font-mono text-xs`}
          placeholder="e3b0c442-..., 6ba7b810-..."
        />
      </div>

      {/* SEO */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
        <h2 className="font-semibold text-stone-800">SEO (opcional)</h2>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Título SEO</label>
          <input name="seo_title" defaultValue={post?.seo_title ?? ""} className={field} />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Meta description</label>
          <textarea name="seo_description" rows={2} defaultValue={post?.seo_description ?? ""} className={field} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="publicado" defaultChecked={post?.publicado ?? false} className="w-4 h-4 accent-amber-500" />
          <div>
            <p className="text-sm font-medium text-stone-800">Publicar</p>
            <p className="text-xs text-stone-500">Desmarcado = guardar como borrador. Marcado = visible en /blog.</p>
          </div>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          {pending ? "Guardando..." : post ? "Guardar cambios" : "Crear artículo"}
        </button>
        <a href="/backoffice/blog" className="text-sm text-stone-500 hover:text-stone-700">Cancelar</a>
      </div>
    </form>
  );
}
