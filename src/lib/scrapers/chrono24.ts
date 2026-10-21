import { fetchT, parsePrecio, BROWSER_HEADERS, limit, type Oferta, type ResultadoFuente } from "./types";

/**
 * Chrono24 español, orden ascendente por precio (sortorder=1).
 * El HTML cambia a veces: hacemos regex tolerante y, si no sale nada,
 * ofertas=[] + search_url para abrir manualmente.
 */
export async function scrapeChrono24(q: string): Promise<ResultadoFuente> {
  const t0 = Date.now();
  const search_url = `https://www.chrono24.es/search/index.htm?query=${encodeURIComponent(q)}&sortorder=1`;
  try {
    const r = await fetchT(search_url, { headers: BROWSER_HEADERS }, 8000);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();

    const ofertas: Oferta[] = [];
    // Cada card es un <a class="article-item ..."> con URL del detalle.
    // Precio: <span class="currency">€</span><span class="price">1.234</span> o atributo data-amount.
    const cardRe = /<a[^>]*class="[^"]*article-item[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let m: RegExpExecArray | null;
    while ((m = cardRe.exec(html)) && ofertas.length < 25) {
      const href = m[1];
      const inner = m[2];
      const url = href.startsWith("http") ? href : `https://www.chrono24.es${href}`;

      const titleMatch = inner.match(/<div[^>]*class="[^"]*text-bold[^"]*"[^>]*>([^<]+)<\/div>/) ||
                         inner.match(/<p[^>]*class="[^"]*text-bold[^"]*"[^>]*>([^<]+)<\/p>/);
      const price1 = inner.match(/data-amount="([\d.,]+)"/);
      const price2 = inner.match(/<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>/);
      const imgMatch = inner.match(/<img[^>]*src="([^"]+)"/);

      const precio = parsePrecio(price1?.[1] ?? price2?.[1] ?? "");
      if (!precio) continue;
      const titulo = (titleMatch?.[1] ?? q).trim();

      ofertas.push({
        fuente: "chrono24",
        titulo,
        precio,
        moneda: "EUR",
        url,
        imagen: imgMatch?.[1] ?? null,
      });
    }

    return { fuente: "chrono24", nombre: "Chrono24", ok: true, ofertas: limit(ofertas, 20), elapsed_ms: Date.now() - t0, search_url };
  } catch (e: unknown) {
    return {
      fuente: "chrono24",
      nombre: "Chrono24",
      ok: false,
      ofertas: [],
      error: e instanceof Error ? e.message : "fallo",
      elapsed_ms: Date.now() - t0,
      search_url,
    };
  }
}
