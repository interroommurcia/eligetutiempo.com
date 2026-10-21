import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buscarPrecios } from "@/lib/scrapers";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Scraping best-effort de 4 plataformas (Wallapop, eBay, Chrono24, Milanuncios).
 * Protegido por auth: solo usuarios logueados en el backoffice pueden llamarlo.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  let body: { q?: string } = {};
  try { body = await req.json(); } catch {}
  const q = (body.q || "").trim();
  if (!q || q.length < 3) {
    return NextResponse.json({ error: "La consulta debe tener al menos 3 caracteres" }, { status: 400 });
  }

  try {
    const data = await buscarPrecios(q);
    return NextResponse.json(data, { headers: { "cache-control": "no-store" } });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error inesperado" },
      { status: 500 }
    );
  }
}
