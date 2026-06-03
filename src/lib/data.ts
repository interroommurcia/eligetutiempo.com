export type Reloj = {
  id: string;
  marca: string;
  modelo: string;
  referencia: string;
  precio: number;
  año: number;
  estado: "Excelente" | "Muy bueno" | "Bueno";
  caja: boolean;
  papeles: boolean;
  imagen: string;
  slug: string;
  descripcion: string;
};

export const marcasPopulares = [
  "Rolex", "Omega", "Patek Philippe", "Audemars Piguet",
  "IWC", "Cartier", "TAG Heuer", "Breitling", "Tudor", "Longines",
];

export const relojesDestacados: Reloj[] = [
  {
    id: "1",
    marca: "Rolex",
    modelo: "Submariner Date",
    referencia: "126610LN",
    precio: 12500,
    año: 2021,
    estado: "Excelente",
    caja: true,
    papeles: true,
    imagen: "/placeholder-watch.jpg",
    slug: "rolex-submariner-date-126610ln",
    descripcion: "Rolex Submariner Date con esfera negra. Completo con caja y papeles. Sin uso.",
  },
  {
    id: "2",
    marca: "Omega",
    modelo: "Speedmaster Professional",
    referencia: "310.30.42.50.01.001",
    precio: 5800,
    año: 2022,
    estado: "Excelente",
    caja: true,
    papeles: true,
    imagen: "/placeholder-watch.jpg",
    slug: "omega-speedmaster-professional-moonwatch",
    descripcion: "Moonwatch con correa de acero. Edición Moonwatch Only. Impecable.",
  },
  {
    id: "3",
    marca: "Tudor",
    modelo: "Black Bay 58",
    referencia: "M79030N",
    precio: 3200,
    año: 2020,
    estado: "Muy bueno",
    caja: true,
    papeles: false,
    imagen: "/placeholder-watch.jpg",
    slug: "tudor-black-bay-58-m79030n",
    descripcion: "Tudor BB58 con esfera azul. Excelente estado. Con caja original.",
  },
  {
    id: "4",
    marca: "IWC",
    modelo: "Portugieser Chronograph",
    referencia: "IW371605",
    precio: 7900,
    año: 2019,
    estado: "Muy bueno",
    caja: false,
    papeles: true,
    imagen: "/placeholder-watch.jpg",
    slug: "iwc-portugieser-chronograph-iw371605",
    descripcion: "Cronógrafo automático con esfera plateada. Excelente estado general.",
  },
  {
    id: "5",
    marca: "Cartier",
    modelo: "Santos de Cartier",
    referencia: "WSSA0018",
    precio: 6400,
    año: 2023,
    estado: "Excelente",
    caja: true,
    papeles: true,
    imagen: "/placeholder-watch.jpg",
    slug: "cartier-santos-wssa0018",
    descripcion: "Santos mediano en acero. Correa de acero y piel intercambiables. Completo.",
  },
  {
    id: "6",
    marca: "Breitling",
    modelo: "Navitimer B01",
    referencia: "AB0139211G1A1",
    precio: 7200,
    año: 2021,
    estado: "Excelente",
    caja: true,
    papeles: true,
    imagen: "/placeholder-watch.jpg",
    slug: "breitling-navitimer-b01-chronograph-43",
    descripcion: "Navitimer B01 43mm con calibre manufactura. Esfera negra. Impecable.",
  },
];
