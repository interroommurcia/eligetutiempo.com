"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type EstadoTasacion = "Pendiente" | "En análisis" | "Oferta enviada" | "Cerrado";

export async function actualizarEstadoTasacion(
  id: string,
  estado: EstadoTasacion,
  nota_interna?: string,
  oferta?: number | null
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("tasaciones")
    .update({
      estado,
      ...(nota_interna !== undefined && { nota_interna }),
      ...(oferta !== undefined && { oferta }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/backoffice/tasaciones");
}
