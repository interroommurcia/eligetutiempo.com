"use client";

import { useRef, useState } from "react";
import { subirArchivo } from "@/lib/upload";

type Props = {
  /** Bucket destino de Supabase Storage. */
  bucket: "relojes" | "blog";
  /** Subcarpeta opcional (ej. "relojes/<id>"). */
  folder?: string;
  /** Nombre del input hidden que recibe las URLs en el form. */
  name: string;
  /** URLs iniciales (en edición). */
  defaultUrls?: string[];
  /** true = multi; false = una sola. */
  multiple?: boolean;
  /** Texto de ayuda. */
  helpText?: string;
};

/**
 * Subida de imágenes desde:
 *  - galería / cámara del móvil (input file nativo con capture)
 *  - fotos del ordenador
 *  - Google Drive (si NEXT_PUBLIC_GOOGLE_API_KEY y NEXT_PUBLIC_GOOGLE_CLIENT_ID están
 *    configuradas; si no, el botón explica cómo activarlo)
 *
 * Acepta HEIC/HEIF (iPhone): se convierten en navegador a JPEG antes de subir
 * (ver src/lib/upload.ts).
 *
 * Las URLs públicas resultantes se guardan como `\n`-separadas en un <input hidden>
 * con name={name} para que el server action las pueda leer.
 */
export default function ImageUploader({
  bucket,
  folder,
  name,
  defaultUrls = [],
  multiple = true,
  helpText,
}: Props) {
  const [urls, setUrls] = useState<string[]>(defaultUrls);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const list = Array.from(files);
      const subidas = await Promise.all(list.map((f) => subirArchivo(bucket, f, folder)));
      setUrls((prev) => (multiple ? [...prev, ...subidas] : subidas.slice(0, 1)));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function remove(url: string) {
    setUrls((prev) => prev.filter((u) => u !== url));
  }

  function move(i: number, dir: -1 | 1) {
    setUrls((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function fromGoogleDrive() {
    const KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const CLIENT = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!KEY || !CLIENT) {
      alert(
        "Google Drive no está configurado todavía.\n\n" +
          "Añade en .env.local:\n" +
          "NEXT_PUBLIC_GOOGLE_API_KEY=...\n" +
          "NEXT_PUBLIC_GOOGLE_CLIENT_ID=...\n\n" +
          "Después reinicia el servidor."
      );
      return;
    }
    try {
      await loadGoogleApis();
      // @ts-expect-error - cargado dinámico
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT,
        scope: "https://www.googleapis.com/auth/drive.readonly",
        callback: (resp: { access_token?: string }) => {
          if (!resp.access_token) return;
          abrirPicker(resp.access_token, KEY);
        },
      });
      tokenClient.requestAccessToken();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar Google Drive");
    }
  }

  function abrirPicker(token: string, key: string) {
    // @ts-expect-error - cargado dinámico
    const view = new google.picker.DocsView(google.picker.ViewId.DOCS_IMAGES)
      .setMimeTypes("image/png,image/jpeg,image/webp,image/heic,image/heif")
      .setSelectFolderEnabled(false);
    // @ts-expect-error - cargado dinámico
    const picker = new google.picker.PickerBuilder()
      .addView(view)
      // @ts-expect-error
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setOAuthToken(token)
      .setDeveloperKey(key)
      .setCallback(async (data: { action: string; docs?: { id: string; name: string; mimeType: string }[] }) => {
        // @ts-expect-error
        if (data.action !== google.picker.Action.PICKED) return;
        const docs = data.docs ?? [];
        setUploading(true);
        try {
          const subidas: string[] = [];
          for (const d of docs) {
            const res = await fetch(`https://www.googleapis.com/drive/v3/files/${d.id}?alt=media`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const blob = await res.blob();
            const file = new File([blob], d.name, { type: d.mimeType });
            const url = await subirArchivo(bucket, file, folder);
            subidas.push(url);
          }
          setUrls((prev) => (multiple ? [...prev, ...subidas] : subidas.slice(0, 1)));
        } catch (e: unknown) {
          setError(e instanceof Error ? e.message : "Error al traer de Drive");
        } finally {
          setUploading(false);
        }
      })
      .build();
    picker.setVisible(true);
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={urls.join("\n")} />

      {urls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {urls.map((u, i) => (
            <div key={u + i} className="relative group aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-xs">
                {multiple && (
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} className="px-1.5 py-0.5 bg-white/20 rounded">◀</button>
                    <span className="opacity-70">{i + 1}</span>
                    <button type="button" onClick={() => move(i, 1)} className="px-1.5 py-0.5 bg-white/20 rounded">▶</button>
                  </div>
                )}
                <button type="button" onClick={() => remove(u)} className="px-2 py-0.5 bg-red-500 rounded">Quitar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer bg-stone-900 hover:bg-stone-800 text-white text-sm px-3 py-2 rounded-lg">
          📷 Galería / Archivos
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.heic,.heif"
            multiple={multiple}
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        <label className="cursor-pointer bg-stone-700 hover:bg-stone-600 text-white text-sm px-3 py-2 rounded-lg sm:hidden">
          📸 Hacer foto
          <input
            type="file"
            accept="image/*,.heic,.heif"
            capture="environment"
            multiple={multiple}
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        <button
          type="button"
          onClick={fromGoogleDrive}
          className="bg-white border border-stone-300 hover:border-stone-400 text-stone-700 text-sm px-3 py-2 rounded-lg"
        >
          <span className="mr-1">📁</span> Google Drive
        </button>
        {uploading && <span className="text-xs text-stone-500 self-center">Subiendo…</span>}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {helpText && <p className="text-xs text-stone-500">{helpText}</p>}
    </div>
  );
}

// Carga perezosa de las librerías de Google (una sola vez).
let gapiReady: Promise<void> | null = null;
function loadGoogleApis(): Promise<void> {
  if (gapiReady) return gapiReady;
  gapiReady = new Promise<void>((resolve, reject) => {
    const scripts = [
      "https://apis.google.com/js/api.js",
      "https://accounts.google.com/gsi/client",
    ];
    let left = scripts.length;
    for (const src of scripts) {
      if (document.querySelector(`script[src="${src}"]`)) {
        if (--left === 0) resolve();
        continue;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.defer = true;
      s.onload = () => {
        if (src.endsWith("api.js")) {
          // @ts-expect-error - gapi global
          gapi.load("picker", () => {
            if (--left === 0) resolve();
          });
        } else {
          if (--left === 0) resolve();
        }
      };
      s.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
      document.head.appendChild(s);
    }
  });
  return gapiReady;
}
