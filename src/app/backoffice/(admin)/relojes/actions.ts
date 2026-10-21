"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const ESTADOS_VALIDOS = [
  "Nuevo con etiquetas",
  "Como nuevo",
  "Muy buen estado",
  "En condiciones aceptables",
] as const;
const ESTADOS_VENTA_VALIDOS = ["Disponible", "Reservado", "Vendido"] as const;

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function parseForm(formData: FormData) {
  const marca = str(formData, "marca");
  const modelo = str(formData, "modelo");
  const referencia = str(formData, "referencia");
  const estado = str(formData, "estado");
  const estadoVentaRaw = str(formData, "estado_venta") || "Disponible";

  // Validaciones humanas, no excepciones feas:
  if (!marca) throw new Error("Falta la marca.");
  if (!modelo) throw new Error("Falta el modelo.");
  if (!referencia) throw new Error("Falta la referencia.");
  if (!ESTADOS_VALIDOS.includes(estado as (typeof ESTADOS_VALIDOS)[number])) {
    throw new Error(`Selecciona el estado del reloj. Debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}`);
  }
  const estado_venta = (ESTADOS_VENTA_VALIDOS as readonly string[]).includes(estadoVentaRaw)
    ? estadoVentaRaw
    : "Disponible";

  const precioVentaRaw = str(formData, "precio_venta");
  const precio_venta = Number(precioVentaRaw);
  if (!precioVentaRaw || !Number.isFinite(precio_venta) || precio_venta <= 0) {
    throw new Error("Precio de venta inválido.");
  }

  const precioCosteRaw = str(formData, "precio_coste");
  const precio_coste = precioCosteRaw ? Number(precioCosteRaw) : null;

  const añoRaw = str(formData, "año");
  const año = añoRaw ? Number(añoRaw) : null;

  return {
    marca,
    modelo,
    referencia,
    año,
    estado,
    estado_venta,
    caja: formData.get("caja") === "on",
    papeles: formData.get("papeles") === "on",
    factura: formData.get("factura") === "on",
    precio_coste,
    precio_venta,
    descripcion: str(formData, "descripcion") || null,
    imagenes: str(formData, "imagenes")
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean),
    slug: slugify(`${marca}-${modelo}-${referencia}`),
    publicado: formData.get("publicado") === "on",
  };
}

export async function cambiarEstadoVenta(id: string, estado_venta: "Disponible" | "Reservado" | "Vendido") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado.");

  const { error } = await supabase
    .from("relojes")
    .update({ estado_venta, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "reloj.estado_venta", resource_type: "reloj", resource_id: id, metadata: { estado_venta } });

  revalidatePath("/backoffice/relojes");
  revalidatePath("/catalogo");
}

export type RelojActionResult = { ok: true; redirect?: string } | { ok: false; error: string };

/**
 * En Next.js 16 cualquier throw desde un server action se enmascara en
 * producción como "An error occurred in the Server Components render.
 * The specific message is omitted...". Para enseñar al usuario el error
 * de validación / de Postgres, devolvemos un objeto en vez de lanzar.
 */
export async function crearReloj(formData: FormData): Promise<RelojActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "No autorizado." };

    const payload = parseForm(formData);
    const { data, error } = await supabase.from("relojes").insert(payload).select("id").single();
    if (error) return { ok: false, error: humanize(error.message) };

    await logAudit({ action: "reloj.create", resource_type: "reloj", resource_id: data?.id, metadata: { marca: payload.marca, modelo: payload.modelo } });

    revalidatePath("/backoffice/relojes");
    revalidatePath("/catalogo");
    return { ok: true, redirect: "/backoffice/relojes" };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Error inesperado al guardar." };
  }
}

export async function actualizarReloj(id: string, formData: FormData): Promise<RelojActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "No autorizado." };

    const payload = parseForm(formData);
    const { error } = await supabase
      .from("relojes")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { ok: false, error: humanize(error.message) };

    await logAudit({ action: "reloj.update", resource_type: "reloj", resource_id: id, metadata: { marca: payload.marca, modelo: payload.modelo } });

    revalidatePath("/backoffice/relojes");
    revalidatePath("/catalogo");
    return { ok: true, redirect: "/backoffice/relojes" };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Error inesperado al guardar." };
  }
}

/** Traduce errores crudos de Postgres a algo que un humano entienda. */
function humanize(msg: string): string {
  if (/relojes_estado_check/i.test(msg)) {
    return "El estado del reloj no coincide con los permitidos por la base de datos. Ejecuta la migración migrations/005_fix_estado_check.sql en Supabase.";
  }
  if (/relojes_estado_venta_check/i.test(msg)) {
    return "El estado de venta debe ser Disponible, Reservado o Vendido.";
  }
  if (/duplicate key.*slug/i.test(msg)) {
    return "Ya existe un reloj con la misma combinación marca-modelo-referencia (slug duplicado).";
  }
  if (/null value in column "([^"]+)"/i.test(msg)) {
    const col = /null value in column "([^"]+)"/i.exec(msg)?.[1];
    return `Falta rellenar el campo "${col}".`;
  }
  return msg;
}

export async function eliminarReloj(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado.");

  const { error } = await supabase.from("relojes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "reloj.delete", resource_type: "reloj", resource_id: id });

  revalidatePath("/backoffice/relojes");
  revalidatePath("/catalogo");
}

export async function togglePublicado(id: string, publicado: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado.");

  const { error } = await supabase
    .from("relojes")
    .update({ publicado, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "reloj.update", resource_type: "reloj", resource_id: id, metadata: { publicado } });

  revalidatePath("/backoffice/relojes");
  revalidatePath("/catalogo");
}
