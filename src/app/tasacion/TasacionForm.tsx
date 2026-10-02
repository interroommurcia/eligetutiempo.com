"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { enviarTasacion } from "./actions";

type Foto = { file: File; preview: string; url: string | null; uploading: boolean };
type State = { ok: boolean; error?: string } | null;

const ANGULOS = [
  { icon: "🕛", label: "Esfera frontal" },
  { icon: "↔️", label: "Perfil izquierdo y derecho" },
  { icon: "🔄", label: "Trasera / caseback" },
  { icon: "🔗", label: "Correa y cierre" },
  { icon: "⚙️", label: "Corona y pulsadores" },
  { icon: "📦", label: "Caja y papeles (si los tienes)" },
];

const field = "w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]";

export default function TasacionForm() {
  const [state, setState] = useState<State>(null);
  const [pending, setPending] = useState(false);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFiles(files: FileList) {
    const supabase = createClient();
    const nuevas: Foto[] = Array.from(files).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      url: null,
      uploading: true,
    }));
    setFotos((prev) => [...prev, ...nuevas]);

    for (const foto of nuevas) {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${foto.file.name}`;
      const { data, error } = await supabase.storage
        .from("tasaciones")
        .upload(path, foto.file, { upsert: false });
      const url = !error && data
        ? supabase.storage.from("tasaciones").getPublicUrl(data.path).data.publicUrl
        : null;
      setFotos((prev) =>
        prev.map((p) => p.file === foto.file ? { ...p, url, uploading: false } : p)
      );
    }
  }

  function quitarFoto(idx: number) {
    setFotos((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fotos.some((f) => f.uploading)) return;
    setPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const urls = fotos.filter((f) => f.url).map((f) => f.url!);
      formData.set("fotos_urls", JSON.stringify(urls));
      await enviarTasacion(formData);
      setState({ ok: true });
    } catch {
      setState({ ok: false, error: "Error al enviar. Inténtalo de nuevo." });
    } finally {
      setPending(false);
    }
  }

  if (state?.ok) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">✅</p>
        <h2 className="text-2xl font-bold mb-2">Solicitud recibida</h2>
        <p className="text-stone-500">Te responderemos en menos de 24 horas.</p>
      </div>
    );
  }

  const uploading = fotos.some((f) => f.uploading);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Nombre *</label>
          <input name="nombre" type="text" required className={field} placeholder="Tu nombre" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Email *</label>
          <input name="email" type="email" required className={field} placeholder="tu@email.com" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Teléfono</label>
        <input name="telefono" type="tel" className={field} placeholder="+34 600 000 000" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Marca *</label>
          <input name="marca" type="text" required className={field} placeholder="Ej: Rolex, Omega…" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Modelo *</label>
          <input name="modelo" type="text" required className={field} placeholder="Ej: Submariner, Speedmaster…" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Referencia</label>
          <input name="referencia" type="text" className={field} placeholder="Ej: 126610LN" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Año aproximado</label>
          <input name="año" type="number" min={1950} max={2030} className={field} placeholder="Ej: 2018" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Estado del reloj *</label>
        <select name="estado_reloj" required className={field}>
          <option value="">Selecciona…</option>
          <option value="Nuevo con etiquetas">Nuevo con etiquetas</option>
          <option value="Como nuevo">Como nuevo</option>
          <option value="Muy buen estado">Muy buen estado</option>
          <option value="En condiciones aceptables">En condiciones aceptables</option>
        </select>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input type="checkbox" name="caja" className="accent-[#C9A84C] w-4 h-4" />
          Tengo caja original
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input type="checkbox" name="papeles" className="accent-[#C9A84C] w-4 h-4" />
          Tengo papeles / garantía
        </label>
      </div>

      {/* ── Sección fotos ── */}
      <div className="border border-stone-200 rounded-2xl overflow-hidden">
        <div className="bg-stone-50 px-5 py-4 border-b border-stone-200">
          <p className="font-semibold text-stone-800 text-sm mb-1">📸 Fotos del reloj</p>
          <p className="text-xs text-stone-500">
            Cuantas más fotos y de mejor calidad, más precisa será tu valoración. Sube fotos desde todos los ángulos.
          </p>
        </div>

        <div className="px-5 py-4 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {ANGULOS.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-stone-500">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Zona de subida */}
          <div
            className="border-2 border-dashed border-stone-300 hover:border-[#C9A84C] rounded-xl p-6 text-center cursor-pointer transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
          >
            <p className="text-3xl mb-2">📷</p>
            <p className="text-sm font-medium text-stone-700">Haz clic o arrastra las fotos aquí</p>
            <p className="text-xs text-stone-400 mt-1">JPG, PNG, HEIC — múltiples archivos</p>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>

          {/* Previews */}
          {fotos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
              {fotos.map((foto, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-stone-100 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.preview} alt="" className="w-full h-full object-cover" />
                  {foto.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {!foto.uploading && (
                    <button
                      type="button"
                      onClick={() => quitarFoto(i)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  )}
                  {foto.url && (
                    <div className="absolute bottom-1 right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                      <span className="text-white text-[8px]">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Información adicional</label>
        <textarea name="notas" rows={4} className={`${field} resize-none`}
          placeholder="Cuéntanos cualquier detalle relevante sobre el reloj…" />
      </div>

      <button
        type="submit"
        disabled={pending || uploading}
        className="bg-[#C9A84C] hover:bg-[#E2C36A] disabled:opacity-50 text-black py-4 rounded-xl font-semibold text-lg transition-colors"
      >
        {uploading ? "Subiendo fotos…" : pending ? "Enviando…" : "Solicitar valoración gratuita"}
      </button>

      <p className="text-xs text-center text-stone-400">
        Te responderemos en menos de 24 horas. Sin compromiso de venta.
      </p>
    </form>
  );
}
