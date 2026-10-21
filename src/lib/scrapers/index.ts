import { scrapeWallapop } from "./wallapop";
import { scrapeEbay } from "./ebay";
import { scrapeChrono24 } from "./chrono24";
import { scrapeMilanuncios } from "./milanuncios";
import type { Oferta, ResultadoFuente } from "./types";

export type MercadoResponse = {
  query: string;
  fuentes: ResultadoFuente[];
  ofertas_ordenadas: Oferta[];      // todas combinadas, ascendente por precio
  stats: {
    total: number;
    min: number | null;
    max: number | null;
    media: number | null;
    mediana: number | null;
  };
};

export async function buscarPrecios(q: string): Promise<MercadoResponse> {
  const query = q.trim();

  // Paralelizamos las 4 fuentes con sus propios timeouts.
  const [wallapop, ebay, chrono24, milanuncios] = await Promise.all([
    scrapeWallapop(query),
    scrapeEbay(query),
    scrapeChrono24(query),
    scrapeMilanuncios(query),
  ]);

  const fuentes = [wallapop, ebay, chrono24, milanuncios];
  const todas = fuentes.flatMap((f) => f.ofertas);
  todas.sort((a, b) => a.precio - b.precio);

  const precios = todas.map((o) => o.precio);
  const stats = {
    total: todas.length,
    min: precios.length ? Math.min(...precios) : null,
    max: precios.length ? Math.max(...precios) : null,
    media: precios.length ? Math.round(precios.reduce((a, b) => a + b, 0) / precios.length) : null,
    mediana: mediana(precios),
  };

  return { query, fuentes, ofertas_ordenadas: todas, stats };
}

function mediana(xs: number[]): number | null {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}
