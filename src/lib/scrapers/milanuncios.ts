import { fetchT, parsePrecio, BROWSER_HEADERS, limit, type Oferta, type ResultadoFuente } from "./types";

/**
 * Milanuncios: listado de relojes con orden ascendente de precio.
 * Markup muy cambiante; parsing tolerante.
 */
export async function scrapeMilanuncios(q: string): Promise<ResultadoFuente> {
  const t0 = Date.now();
  const search_url =
    `https://www.milanuncios.com/relojes-en-venta/?texto=${encodeURIComponent(q)}&orden=precio_asc`;
  try {
    const r = await fetchT(search_url, { headers: BROWSER_HEADERS }, 7000);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();

    const ofertas: Oferta[] = [];
    // Buscamos bloques <article ...> ... </article>
    const articleRe = /<article[^>]*>([\s\S]*?)<\/article>/g;
    let m: RegExpExecArray | null;
    while ((m = articleRe.exec(html)) && ofertas.length < 25) {
      const chunk = m[1];
      const linkMatch = chunk.match(/<a[^>]*href="(\/[^"]+)"/);
      const titleMatch = chunk.match(/<h\d[^>]*>([^<]+)<\/h\d>/) ||
                         chunk.match(/<a[^>]*>([^<]{10,120})<\/a>/);
      // precios tipo "1.234 €"
      const priceMatch = chunk.match(/(\d[\d\.\,]{0,8}\s*€)/);
      const imgMatch = chunk.match(/<img[^>]*src="([^"]+)"/);
      if (!linkMatch || !priceMatch) continue;
      const precio = parsePrecio(priceMatch[1]);
      if (!precio) continue;

      ofertas.push({
        fuente: "milanuncios",
        titulo: (titleMatch?.[1] ?? q).trim().slice(0, 160),
        precio,
        moneda: "EUR",
        url: `https://www.milanuncios.com${linkMatch[1]}`,
        imagen: imgMatch?.[1] ?? null,
      });
    }

    return { fuente: "milanuncios", nombre: "Milanuncios", ok: true, ofertas: limit(ofertas, 20), elapsed_ms: Date.now() - t0, search_url };
  } catch (e: unknown) {
    return {
      fuente: "milanuncios",
      nombre: "Milanuncios",
      ok: false,
      ofertas: [],
      error: e instanceof Error ? e.message : "fallo",
      elapsed_ms: Date.now() - t0,
      search_url,
    };
  }
}
