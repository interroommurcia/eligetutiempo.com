import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getRelojes } from "@/lib/relojes";
import RelojesTable from "./RelojesTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Relojes — Backoffice" };

export default async function BackofficeRelojesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  const relojes = await getRelojes();

  const publicados = relojes.filter((r) => r.publicado).length;
  const valorTotal = relojes.reduce((acc, r) => acc + r.precio_venta, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Relojes</h1>
          <p className="text-stone-500 text-sm mt-1">
            {relojes.length} en catálogo · {publicados} publicados · {valorTotal.toLocaleString("es-ES")} € en stock
          </p>
        </div>
        <a href="/backoffice/relojes/nuevo"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          + Añadir reloj
        </a>
      </div>

      <RelojesTable relojes={relojes} />
    </div>
  );
}
