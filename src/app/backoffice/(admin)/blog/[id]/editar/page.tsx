import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getPostById } from "@/lib/blog";
import BlogForm from "../../BlogForm";
import { actualizarPost } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar artículo — Backoffice" };

export default async function EditarPostPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  const action = actualizarPost.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Editar artículo</h1>
      <BlogForm post={post} action={action} />
    </div>
  );
}
