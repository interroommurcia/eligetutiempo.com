"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-black border-b border-[#C9A84C]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Elige Tu Tiempo" width={44} height={44} className="rounded-full" />
            <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
              elige<span className="text-[#C9A84C]">tu</span>tiempo
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/catalogo" className="text-stone-300 hover:text-[#C9A84C] transition-colors">Catálogo</Link>
            <Link href="/tasacion" className="text-stone-300 hover:text-[#C9A84C] transition-colors">Valoración gratuita</Link>
            <Link href="/vender" className="text-stone-300 hover:text-[#C9A84C] transition-colors">Vender</Link>
            <Link href="/sobre-nosotros" className="text-stone-300 hover:text-[#C9A84C] transition-colors">Nosotros</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/tasacion"
              className="bg-[#C9A84C] hover:bg-[#E2C36A] text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Solicitar valoración de mi reloj
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#C9A84C]/20 bg-black px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/catalogo" className="text-stone-300" onClick={() => setOpen(false)}>Catálogo</Link>
          <Link href="/tasacion" className="text-stone-300" onClick={() => setOpen(false)}>Valoración gratuita</Link>
          <Link href="/vender" className="text-stone-300" onClick={() => setOpen(false)}>Vender</Link>
          <Link href="/sobre-nosotros" className="text-stone-300" onClick={() => setOpen(false)}>Nosotros</Link>
          <Link
            href="/tasacion"
            className="bg-[#C9A84C] hover:bg-[#E2C36A] text-black px-4 py-2 rounded-lg text-center font-semibold"
            onClick={() => setOpen(false)}
          >
            Solicitar valoración de mi reloj
          </Link>
        </div>
      )}
    </header>
  );
}
