import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TasacionCard from "./TasacionCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tasaciones — Backoffice" };

export default async function BackofficeTasacionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  const { data: tasaciones } = await supabase
    .from("tasaciones")
    .select("*")
    .order("created_at", { ascending: false });

  const pendientes = (tasaciones ?? []).filter((t) => t.estado === "Pendiente").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Tasaciones</h1>
        <p className="text-stone-500 text-sm mt-1">
          {(tasaciones ?? []).length} solicitudes · {pendientes} pendientes
        </p>
      </div>

      {(tasaciones ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-stone-500">No hay solicitudes de tasación todavía.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(tasaciones ?? []).map((t) => (
            <TasacionCard key={t.id} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
