"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/backoffice", label: "Dashboard", icon: "📊" },
  { href: "/backoffice/relojes", label: "Relojes", icon: "⌚" },
  { href: "/backoffice/tasaciones", label: "Valoraciones", icon: "📋" },
  { href: "/backoffice/ventas", label: "Ventas", icon: "💶" },
  { href: "/backoffice/blog", label: "Blog / Artículos", icon: "📝" },
  { href: "/backoffice/analytics", label: "Analytics", icon: "📈" },
  { href: "/backoffice/seguridad", label: "Seguridad", icon: "🔒" },
  { href: "/backoffice/mercado", label: "Mercado", icon: "🔎" },
];

export default function BackofficeSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Cerrar el drawer al cambiar de ruta.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/backoffice/login");
    router.refresh();
  }

  const current = nav.find((n) => pathname === n.href) ?? nav.find((n) => pathname.startsWith(n.href + "/"));

  return (
    <>
      {/* Top bar móvil */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-stone-900 text-white px-4 h-14 border-b border-stone-800">
        <button
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-stone-800"
        >
          <div className="w-5 h-0.5 bg-white mb-1.5" />
          <div className="w-5 h-0.5 bg-white mb-1.5" />
          <div className="w-5 h-0.5 bg-white" />
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{current?.icon ?? "⌚"}</span>
          <span>{current?.label ?? "Backoffice"}</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar: fija en escritorio, drawer en móvil */}
      <aside
        className={`bg-stone-900 text-white flex flex-col flex-shrink-0 z-50
          fixed md:sticky md:top-0 inset-y-0 left-0 md:min-h-screen
          w-64 md:w-56 transform transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⌚</span>
              <span className="font-bold text-sm">
                elige<span className="text-amber-400">tu</span>tiempo
              </span>
            </div>
            <p className="text-stone-500 text-xs mt-1">Backoffice</p>
          </div>
          <button
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="md:hidden text-stone-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {nav.map(({ href, label, icon }) => {
            const active = pathname === href || (href !== "/backoffice" && pathname.startsWith(href + "/"));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-amber-600 text-white"
                    : "text-stone-400 hover:text-white hover:bg-stone-800"
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <span>🚪</span> Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
