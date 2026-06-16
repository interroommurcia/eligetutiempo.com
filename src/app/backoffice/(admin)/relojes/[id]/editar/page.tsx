import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getRelojById } from "@/lib/relojes";
import { actualizarReloj } from "../../actions";
import RelojForm from "../../RelojForm";

export const metadata = { title: "Editar reloj — Backoffice" };

export default async function EditarRelojPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  const reloj = await getRelojById(id);
  if (!reloj) notFound();

  const action = actualizarReloj.bind(null, id);

  return (
    <div>
      <div className="mb-8">
        <a href="/backoffice/relojes" className="text-sm text-stone-500 hover:text-stone-700 mb-2 inline-block">
          ← Volver a relojes
        </a>
        <h1 className="text-2xl font-bold text-stone-900">
          {reloj.marca} {reloj.modelo}
        </h1>
        <p className="text-stone-500 text-sm mt-1">Ref. {reloj.referencia}</p>
      </div>
      <RelojForm reloj={reloj} action={action} />
    </div>
  );
}
