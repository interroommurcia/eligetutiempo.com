import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { crearReloj } from "../actions";
import RelojForm from "../RelojForm";

export const metadata = { title: "Nuevo reloj — Backoffice" };

export default async function NuevoRelojPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  return (
    <div>
      <div className="mb-8">
        <a href="/backoffice/relojes" className="text-sm text-stone-500 hover:text-stone-700 mb-2 inline-block">
          ← Volver a relojes
        </a>
        <h1 className="text-2xl font-bold text-stone-900">Añadir reloj</h1>
      </div>
      <RelojForm action={crearReloj} />
    </div>
  );
}
