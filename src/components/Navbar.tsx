"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⌚</span>
            <span className="font-bold text-xl tracking-tight">
              elige<span className="text-amber-600">tu</span>tiempo
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/catalogo" className="hover:text-amber-600 transition-colors">Catálogo</Link>
            <Link href="/tasacion" className="hover:text-amber-600 transition-colors">Tasación gratuita</Link>
            <Link href="/vender" className="hover:text-amber-600 transition-colors">Vender</Link>
            <Link href="/sobre-nosotros" className="hover:text-amber-600 transition-colors">Nosotros</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/tasacion"
              className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Tasar mi reloj
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            <div className="w-5 h-0.5 bg-stone-900 mb-1" />
            <div className="w-5 h-0.5 bg-stone-900 mb-1" />
            <div className="w-5 h-0.5 bg-stone-900" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/catalogo" onClick={() => setOpen(false)}>Catálogo</Link>
          <Link href="/tasacion" onClick={() => setOpen(false)}>Tasación gratuita</Link>
          <Link href="/vender" onClick={() => setOpen(false)}>Vender</Link>
          <Link href="/sobre-nosotros" onClick={() => setOpen(false)}>Nosotros</Link>
          <Link
            href="/tasacion"
            className="bg-amber-600 text-white px-4 py-2 rounded-lg text-center"
            onClick={() => setOpen(false)}
          >
            Tasar mi reloj
          </Link>
        </div>
      )}
    </header>
  );
}
