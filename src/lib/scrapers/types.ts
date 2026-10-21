export type Oferta = {
  fuente: string;         // "wallapop", "ebay", "chrono24", ...
  titulo: string;
  precio: number;         // en EUR
  moneda: string;         // "EUR"
  url: string;
  imagen?: string | null;
  ubicacion?: string | null;
  estado?: string | null;
};

export type ResultadoFuente = {
  fuente: string;
  nombre: string;
  ok: boolean;
  ofertas: Oferta[];
  error?: string;
  elapsed_ms: number;
  search_url: string;    // link de respaldo para abrir manualmente
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

export const BROWSER_HEADERS: HeadersInit = {
  "user-agent": UA,
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "es-ES,es;q=0.9,en;q=0.8",
  "cache-control": "no-cache",
};

/** fetch con timeout; devuelve Response o lanza Error. */
export async function fetchT(url: string, init: RequestInit = {}, timeoutMs = 7000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, redirect: "follow" });
  } finally {
    clearTimeout(t);
  }
}

/** Normaliza "1.234,50 €" / "1234.50" / "1,234 EUR" a número en EUR. */
export function parsePrecio(raw: string | null | undefined): number | null {
  if (!raw) return null;
  // Nos quedamos solo con dígitos, comas y puntos.
  const s = raw.replace(/[^\d.,]/g, "").trim();
  if (!s) return null;
  // Si hay coma y punto, el último separador es decimal.
  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  let normal = s;
  if (lastDot !== -1 && lastComma !== -1) {
    if (lastComma > lastDot) {
      // Formato europeo: 1.234,50 → quitar puntos y cambiar coma por punto
      normal = s.replace(/\./g, "").replace(",", ".");
    } else {
      // Formato US: 1,234.50 → quitar comas
      normal = s.replace(/,/g, "");
    }
  } else if (lastComma !== -1 && lastDot === -1) {
    // Solo coma: puede ser 1234 o 1,50
    if (s.length - lastComma - 1 === 2) normal = s.replace(",", ".");
    else normal = s.replace(/,/g, "");
  }
  const n = Number(normal);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function limit<T>(arr: T[], n: number): T[] { return arr.slice(0, n); }
