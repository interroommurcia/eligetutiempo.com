"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function guardarConsultaMercado(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const canales = ["chrono24", "watchcharts", "wallapop", "vinted", "milanuncios", "todocoleccion", "ebay", "amazon"];
  const precios: Record<string, { min?: number; medio?: number; max?: number; notas?: string }> = {};

  for (const canal of canales) {
    const min = formData.get(`${canal}_min`);
    const medio = formData.get(`${canal}_medio`);
    const max = formData.get(`${canal}_max`);
    const notas = formData.get(`${canal}_notas`);
    if (min || medio || max) {
      precios[canal] = {
        ...(min ? { min: Number(min) } : {}),
        ...(medio ? { medio: Number(medio) } : {}),
        ...(max ? { max: Number(max) } : {}),
        ...(notas ? { notas: notas as string } : {}),
      };
    }
  }

  const { error } = await supabase.from("consultas_mercado").insert({
    marca: formData.get("marca") as string,
    modelo: formData.get("modelo") as string,
    referencia: formData.get("referencia") as string,
    precio_sugerido: formData.get("precio_sugerido") ? Number(formData.get("precio_sugerido")) : null,
    precios,
    notas: (formData.get("notas") as string) || null,
  });

  if (error) throw error;
  revalidatePath("/backoffice/mercado");
}
