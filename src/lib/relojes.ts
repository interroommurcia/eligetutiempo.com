import { createClient } from "@/lib/supabase/server";

export type Reloj = {
  id: string;
  marca: string;
  modelo: string;
  referencia: string;
  año: number | null;
  estado: "Mint" | "Very Good" | "Good" | "Fair";
  caja: boolean;
  papeles: boolean;
  factura: boolean;
  precio_coste: number | null;
  precio_venta: number;
  descripcion: string | null;
  imagenes: string[];
  slug: string;
  publicado: boolean;
  created_at: string;
};

export async function getRelojes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("relojes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Reloj[];
}

export async function getRelojesPublicados() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("relojes")
    .select("*")
    .eq("publicado", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Reloj[];
}

export async function getRelojBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("relojes")
    .select("*")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();
  if (error) return null;
  return data as Reloj;
}

export async function getRelojById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("relojes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Reloj;
}
