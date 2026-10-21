import { createClient } from "@/lib/supabase/server";

export type BlogTemplate = "minimalista" | "revista" | "moderno";

export type BlogPost = {
  id: string;
  slug: string;
  titulo: string;
  resumen: string | null;
  contenido: string;
  portada: string | null;
  template: BlogTemplate;
  autor: string | null;
  publicado: boolean;
  productos_relacionados: string[];
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export async function getPostsPublicados() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("publicado", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function getPostsAll() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();
  if (error) return null;
  return data as BlogPost;
}

export async function getPostById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as BlogPost;
}

/** Devuelve los relojes referenciados en productos_relacionados, filtrando los publicados. */
export async function getProductosRelacionados(ids: string[]) {
  if (!ids || ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("relojes")
    .select("id, slug, marca, modelo, referencia, precio_venta, imagenes, estado_venta, publicado")
    .in("id", ids)
    .eq("publicado", true);
  if (error) throw error;
  return data ?? [];
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}
