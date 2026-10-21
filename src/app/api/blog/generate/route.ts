import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Generador de borrador con Claude. Devuelve { titulo, resumen, contenido }.
 * Requiere ANTHROPIC_API_KEY en el entorno; sin ella, responde con 503 y
 * explica cómo configurarla (el frontend muestra el error).
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Generación por IA no configurada. Añade ANTHROPIC_API_KEY en .env.local y reinicia el servidor.",
      },
      { status: 503 }
    );
  }

  let body: { tema?: string; tono?: string; palabras?: number } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const tema = (body.tema || "").trim();
  if (!tema) return NextResponse.json({ error: "Falta el tema" }, { status: 400 });
  const tono = body.tono || "Experto cercano";
  const palabras = Math.min(Math.max(Number(body.palabras) || 800, 200), 3000);

  const system =
    "Eres un redactor senior de EligeTuTiempo, una compraventa de relojes en España. " +
    "Escribes artículos de blog en español natural, cercanos y con criterio técnico (relojería, mercado, historia, mantenimiento). " +
    "Nunca inventas precios, referencias ni datos técnicos; si no estás seguro, lo evitas. " +
    "Devuelves SIEMPRE JSON válido con esta forma exacta:\n" +
    "{\"titulo\": string, \"resumen\": string, \"contenido\": string}\n" +
    "El campo \"contenido\" usa texto plano con dobles saltos de línea entre párrafos, " +
    "encabezados # ## ###, citas con '> ' y, si procede, imágenes como ![alt](url). No incluyas HTML.";

  const prompt = `Tema: ${tema}
Tono: ${tono}
Longitud objetivo: ~${palabras} palabras.
Devuelve solo el JSON, sin ningún texto fuera del JSON.`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-7",
        max_tokens: 4096,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return NextResponse.json({ error: `Anthropic API: ${resp.status} ${txt.slice(0, 300)}` }, { status: 502 });
    }
    const data = await resp.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ error: "La IA no devolvió JSON" }, { status: 502 });

    let parsed: { titulo?: string; resumen?: string; contenido?: string };
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return NextResponse.json({ error: "JSON malformado de la IA" }, { status: 502 });
    }
    return NextResponse.json({
      titulo: String(parsed.titulo ?? ""),
      resumen: String(parsed.resumen ?? ""),
      contenido: String(parsed.contenido ?? ""),
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error inesperado" }, { status: 500 });
  }
}
