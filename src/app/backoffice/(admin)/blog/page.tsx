import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPostsAll } from "@/lib/blog";
import PostsTable from "./PostsTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog — Backoffice" };

export default async function BackofficeBlogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  const posts = await getPostsAll();
  const publicados = posts.filter((p) => p.publicado).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Blog / Artículos</h1>
          <p className="text-stone-500 text-sm mt-1">
            {posts.length} artículos · {publicados} publicados
          </p>
        </div>
        <a href="/backoffice/blog/nuevo"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          + Nuevo artículo
        </a>
      </div>

      <PostsTable posts={posts} />
    </div>
  );
}
