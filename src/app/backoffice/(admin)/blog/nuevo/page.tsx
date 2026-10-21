import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BlogForm from "../BlogForm";
import { crearPost } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nuevo artículo — Backoffice" };

export default async function NuevoPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Nuevo artículo</h1>
      <BlogForm action={crearPost} />
    </div>
  );
}
