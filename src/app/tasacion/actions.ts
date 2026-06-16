"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function enviarTasacion(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasaciones").insert({
    nombre: formData.get("nombre") as string,
    email: formData.get("email") as string,
    telefono: (formData.get("telefono") as string) || null,
    marca: formData.get("marca") as string,
    modelo: formData.get("modelo") as string,
    referencia: (formData.get("referencia") as string) || null,
    año: formData.get("año") ? Number(formData.get("año")) : null,
    estado_reloj: formData.get("estado_reloj") as string,
    caja: formData.get("caja") === "on",
    papeles: formData.get("papeles") === "on",
    notas: (formData.get("notas") as string) || null,
  });

  if (error) throw new Error("Error al enviar la solicitud");

  revalidatePath("/backoffice/tasaciones");
}
