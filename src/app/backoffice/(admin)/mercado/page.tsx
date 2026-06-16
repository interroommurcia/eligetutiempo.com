import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MercadoTool from "./MercadoTool";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mercado — Backoffice" };

export default async function BackofficeMercadoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/backoffice/login");

  const { data: historial } = await supabase
    .from("consultas_mercado")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Vigilancia de mercado</h1>
        <p className="text-stone-500 text-sm mt-1">
          Consulta precios en 8 plataformas y registra el histórico de valoraciones
        </p>
      </div>
      <MercadoTool historial={historial ?? []} />
    </div>
  );
}
