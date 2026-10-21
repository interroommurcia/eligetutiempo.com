import { getPostBySlug, getProductosRelacionados } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Minimalista from "../_templates/Minimalista";
import Revista from "../_templates/Revista";
import Moderno from "../_templates/Moderno";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: post.seo_title ?? `${post.titulo} — EligeTuTiempo`,
    description: post.seo_description ?? post.resumen ?? undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const productos = await getProductosRelacionados(post.productos_relacionados ?? []);

  const Template =
    post.template === "revista" ? Revista :
    post.template === "moderno" ? Moderno :
    Minimalista;

  return (
    <article>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/blog" className="text-sm text-stone-400 hover:text-stone-700">← Volver al blog</Link>
      </div>
      <Template post={post} productos={productos} />
    </article>
  );
}
