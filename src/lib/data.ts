// Tipo legacy que todavía usa src/app/page.tsx. Se mantiene mínimo.
// Las marcas y los relojes "reales" viven en src/lib/marcas.ts y la BBDD.
export type Reloj = {
  id: string;
  marca: string;
  modelo: string;
  referencia: string;
  precio: number;
  año: number;
  estado: string;
  caja: boolean;
  papeles: boolean;
  imagen: string;
  slug: string;
  descripcion: string;
};
