import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#C9A84C]/20 text-stone-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⌚</span>
              <span className="font-bold text-white text-xl">
                elige<span className="text-[#C9A84C]">tu</span>tiempo
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Especialistas en compraventa y valoración de relojes. Autenticidad garantizada en cada operación.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogo" className="hover:text-white transition-colors">Comprar relojes</Link></li>
              <li><Link href="/vender" className="hover:text-white transition-colors">Vender mi reloj</Link></li>
              <li><Link href="/tasacion" className="hover:text-white transition-colors">Valoración gratuita</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Información</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#C9A84C]/20 mt-10 pt-6 text-xs text-stone-600 text-center">
          © {new Date().getFullYear()} eligetutiempo.com — Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}
