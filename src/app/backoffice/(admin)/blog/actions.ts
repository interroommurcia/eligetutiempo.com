"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/blog";
import { logAudit } from "@/lib/audit";

function parseForm(formData: FormData) {
  const titulo = (formData.get("titulo") as string).trim();
  const slugRaw = ((formData.get("slug") as string) || "").trim();
  const templateRaw = (formData.get("template") as string) || "minimalista";
  const template = ["minimalista", "revista", "moderno"].includes(templateRaw) ? templateRaw : "minimalista";

  const productos_relacionados = ((formData.get("productos_relacionados") as string) || "")
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const tags = ((formData.get("tags") as string) || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    titulo,
    slug: slugify(slugRaw || titulo),
    resumen: ((formData.get("resumen") as string) || "").trim() || null,
    contenido: (formData.get("contenido") as string) || "",
    portada: ((formData.get("portada") as string) || "").trim() || null,
    template,
    autor: ((formData.get("autor") as string) || "").trim() || null,
    publicado: formData.get("publicado") === "on",
    productos_relacionados,
    tags,
    seo_title: ((formData.get("seo_title") as string) || "").trim() || null,
    seo_description: ((formData.get("seo_description") as string) || "").trim() || null,
  };
}

export async function crearPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const data = parseForm(formData);
  const payload = {
    ...data,
    published_at: data.publicado ? new Date().toISOString() : null,
  };

  const { data: inserted, error } = await supabase.from("blog_posts").insert(payload).select("id").single();
  if (error) throw new Error(error.message);

  await logAudit({ action: data.publicado ? "blog.publish" : "blog.create", resource_type: "blog_post", resource_id: inserted?.id, metadata: { titulo: data.titulo, template: data.template } });

  revalidatePath("/backoffice/blog");
  revalidatePath("/blog");
  redirect("/backoffice/blog");
}

export async function actualizarPost(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const data = parseForm(formData);
  const { data: existing } = await supabase.from("blog_posts").select("published_at, publicado").eq("id", id).single();
  const published_at =
    data.publicado && !(existing?.publicado)
      ? new Date().toISOString()
      : existing?.published_at ?? null;

  const { error } = await supabase
    .from("blog_posts")
    .update({ ...data, published_at, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "blog.update", resource_type: "blog_post", resource_id: id, metadata: { titulo: data.titulo, publicado: data.publicado } });

  revalidatePath("/backoffice/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  redirect("/backoffice/blog");
}

export async function eliminarPost(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado.");

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "blog.delete", resource_type: "blog_post", resource_id: id });

  revalidatePath("/backoffice/blog");
  revalidatePath("/blog");
}

export async function togglePublicadoPost(id: string, publicado: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado.");

  const patch: Record<string, unknown> = { publicado, updated_at: new Date().toISOString() };
  if (publicado) patch.published_at = new Date().toISOString();

  const { error } = await supabase.from("blog_posts").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: publicado ? "blog.publish" : "blog.update", resource_type: "blog_post", resource_id: id, metadata: { publicado } });

  revalidatePath("/backoffice/blog");
  revalidatePath("/blog");
}
