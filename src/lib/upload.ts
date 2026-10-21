import { createClient } from "@/lib/supabase/client";

const HEIC_EXT = /\.(heic|heif)$/i;
const HEIC_MIME = /^image\/(heic|heif)$/i;

/**
 * Convierte un File HEIC/HEIF a JPEG en el navegador usando heic2any
 * (carga perezosa — así no engorda el bundle principal).
 * Si no es HEIC devuelve el fichero intacto.
 */
async function convertirHeicSiEsNecesario(file: File): Promise<File> {
  const esHeic = HEIC_MIME.test(file.type) || HEIC_EXT.test(file.name);
  if (!esHeic) return file;
  try {
    const mod = await import("heic2any");
    const heic2any = (mod.default ?? mod) as (opts: {
      blob: Blob;
      toType?: string;
      quality?: number;
    }) => Promise<Blob | Blob[]>;
    const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    const blob = Array.isArray(out) ? out[0] : out;
    const nombre = file.name.replace(HEIC_EXT, ".jpg");
    return new File([blob], nombre, { type: "image/jpeg" });
  } catch (e) {
    // Si falla la conversión (p.ej. heic2any no está instalado), subimos tal cual.
    console.warn("No se pudo convertir HEIC, subiendo original:", e);
    return file;
  }
}

function sanitize(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/**
 * Sube un archivo al bucket indicado y devuelve su URL pública.
 * Carpeta por bucket + timestamp + nombre saneado => evita colisiones.
 */
export async function subirArchivo(
  bucket: "relojes" | "blog",
  file: File,
  folder = ""
): Promise<string> {
  const supabase = createClient();
  const procesado = await convertirHeicSiEsNecesario(file);
  const stamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const path = [folder, `${stamp}-${rand}-${sanitize(procesado.name)}`]
    .filter(Boolean)
    .join("/");

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, procesado, { contentType: procesado.type, upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
