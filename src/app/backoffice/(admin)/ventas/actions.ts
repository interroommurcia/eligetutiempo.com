"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function crearVenta(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("ventas").insert({
    marca: formData.get("marca") as string,
    modelo: formData.get("modelo") as string,
    referencia: (formData.get("referencia") as string) || null,
    precio_coste: Number(formData.get("precio_coste") || 0),
    precio_venta: Number(formData.get("precio_venta")),
    canal: formData.get("canal") as string,
    notas: (formData.get("notas") as string) || null,
    fecha: formData.get("fecha") as string,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/backoffice/ventas");
  redirect("/backoffice/ventas");
}

export async function eliminarVenta(id: string) {
  const supabase = await createClient();
  await supabase.from("ventas").delete().eq("id", id);
  revalidatePath("/backoffice/ventas");
}
