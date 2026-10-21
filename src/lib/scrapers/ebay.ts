import { fetchT, parsePrecio, BROWSER_HEADERS, limit, type Oferta, type ResultadoFuente } from "./types";

/**
 * eBay España: scraping del HTML del listado con filtro de precio ascendente
 * (_sop=15). Si eBay cambia el markup, falla; devuelve ofertas=[] y search_url.
 */
export async function scrapeEbay(q: string): Promise<ResultadoFuente> {
  const t0 = Date.now();
  const search_url = `https://www.ebay.es/sch/i.html?_nkw=${encodeURIComponent(q)}&_sacat=281&_sop=15&LH_PrefLoc=2`;
  try {
    const r = await fetchT(search_url, { headers: BROWSER_HEADERS }, 7000);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();

    const ofertas: Oferta[] = [];
    // Cada item: <li class="s-item ..."> ... </li>
    const itemRe = /<li[^>]*class="[^"]*s-item[^"]*"[^>]*>([\s\S]*?)<\/li>/g;
    let m: RegExpExecArray | null;
    while ((m = itemRe.exec(html)) && ofertas.length < 25) {
      const chunk = m[1];
      const titleMatch = chunk.match(/<div[^>]*class="[^"]*s-item__title[^"]*"[^>]*>(?:<span[^>]*>)?([^<]+)/);
      const linkMatch = chunk.match(/<a[^>]*class="[^"]*s-item__link[^"]*"[^>]*href="([^"]+)"/);
      const priceMatch = chunk.match(/<span[^>]*class="[^"]*s-item__price[^"]*"[^>]*>([^<]+)<\/span>/);
      const imgMatch = chunk.match(/<img[^>]*src="([^"]+)"/);
      const locMatch = chunk.match(/<span[^>]*class="[^"]*s-item__location[^"]*"[^>]*>([^<]+)<\/span>/);
      if (!titleMatch || !linkMatch || !priceMatch) continue;

      const titulo = titleMatch[1].trim();
      if (/^Shop on eBay$/i.test(titulo)) continue;
      const url = linkMatch[1];
      const precio = parsePrecio(priceMatch[1]);
      if (!precio) continue;

      ofertas.push({
        fuente: "ebay",
        titulo,
        precio,
        moneda: "EUR",
        url,
        imagen: imgMatch?.[1] ?? null,
        ubicacion: locMatch?.[1]?.trim() ?? null,
      });
    }

    return { fuente: "ebay", nombre: "eBay España", ok: true, ofertas: limit(ofertas, 20), elapsed_ms: Date.now() - t0, search_url };
  } catch (e: unknown) {
    return {
      fuente: "ebay",
      nombre: "eBay España",
      ok: false,
      ofertas: [],
      error: e instanceof Error ? e.message : "fallo",
      elapsed_ms: Date.now() - t0,
      search_url,
    };
  }
}
