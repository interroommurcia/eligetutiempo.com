"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseForm(formData: FormData) {
  const marca = formData.get("marca") as string;
  const modelo = formData.get("modelo") as string;
  const referencia = formData.get("referencia") as string;
  return {
    marca,
    modelo,
    referencia,
    año: formData.get("año") ? Number(formData.get("año")) : null,
    estado: formData.get("estado") as string,
    caja: formData.get("caja") === "on",
    papeles: formData.get("papeles") === "on",
    factura: formData.get("factura") === "on",
    precio_coste: formData.get("precio_coste") ? Number(formData.get("precio_coste")) : null,
    precio_venta: Number(formData.get("precio_venta")),
    descripcion: (formData.get("descripcion") as string) || null,
    imagenes: (formData.get("imagenes") as string)
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean),
    slug: slugify(`${marca}-${modelo}-${referencia}`),
    publicado: formData.get("publicado") === "on",
  };
}

export async function crearReloj(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("relojes").insert(parseForm(formData));
  if (error) throw error;

  revalidatePath("/backoffice/relojes");
  revalidatePath("/catalogo");
  redirect("/backoffice/relojes");
}

export async function actualizarReloj(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("relojes")
    .update({ ...parseForm(formData), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/backoffice/relojes");
  revalidatePath("/catalogo");
  redirect("/backoffice/relojes");
}

export async function eliminarReloj(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("relojes").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/backoffice/relojes");
  revalidatePath("/catalogo");
}

export async function togglePublicado(id: string, publicado: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("relojes")
    .update({ publicado, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/backoffice/relojes");
  revalidatePath("/catalogo");
}
