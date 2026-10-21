import { fetchT, parsePrecio, limit, type Oferta, type ResultadoFuente } from "./types";

/**
 * Wallapop usa una API JSON no oficial para su buscador. Puede cambiar sin
 * aviso: hacemos best-effort y toleramos cambios de forma.
 * Categoría 14000 = Relojes.
 */
export async function scrapeWallapop(q: string): Promise<ResultadoFuente> {
  const t0 = Date.now();
  const search_url = `https://es.wallapop.com/app/search?keywords=${encodeURIComponent(q)}&category_ids=14000&order_by=price_low_to_high`;
  const apiUrl =
    "https://api.wallapop.com/api/v3/general/search" +
    `?keywords=${encodeURIComponent(q)}&category_ids=14000&order_by=price_low_to_high&items_count=30`;

  try {
    const r = await fetchT(apiUrl, {
      headers: {
        "accept": "application/json",
        "accept-language": "es-ES,es;q=0.9",
        "x-deviceos": "0",
        "user-agent": "Wallapop/8.47.0 (es.wallapop; build:1; iOS 17.5.1)",
      },
    }, 7000);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data: unknown = await r.json();

    // Formato típico: { search_objects: [{ id, title, price, currency, images, location, ... }] }
    const items =
      (data as { search_objects?: unknown[] })?.search_objects ??
      (data as { data?: { search_objects?: unknown[] } })?.data?.search_objects ??
      [];

    const ofertas: Oferta[] = (items as Record<string, unknown>[]).flatMap((it) => {
      const price = Number((it.price as number | undefined) ?? NaN);
      if (!Number.isFinite(price) || price <= 0) return [];
      const currency = String(it.currency ?? "EUR");
      if (currency !== "EUR") return [];
      const title = String(it.title ?? "Reloj");
      const id = String(it.id ?? "");
      const url =
        (it.web_slug ? `https://es.wallapop.com/item/${it.web_slug}` : null) ??
        (id ? `https://es.wallapop.com/item/${id}` : search_url);
      const imgs = (it.images as Array<{ small?: string; medium?: string; original?: string }>) ?? [];
      const imagen = imgs[0]?.medium ?? imgs[0]?.small ?? imgs[0]?.original ?? null;
      const loc = (it.location as { city?: string; country_code?: string }) ?? null;
      const ubicacion = loc?.city ?? null;

      return [{ fuente: "wallapop", titulo: title, precio: price, moneda: "EUR", url, imagen, ubicacion }];
    });

    return { fuente: "wallapop", nombre: "Wallapop", ok: true, ofertas: limit(ofertas, 20), elapsed_ms: Date.now() - t0, search_url };
  } catch (e: unknown) {
    return {
      fuente: "wallapop",
      nombre: "Wallapop",
      ok: false,
      ofertas: [],
      error: e instanceof Error ? e.message : "fallo",
      elapsed_ms: Date.now() - t0,
      search_url,
    };
  }
}

// Dummy para evitar warning de import no usado por el linter si parsePrecio queda sin uso.
void parsePrecio;
