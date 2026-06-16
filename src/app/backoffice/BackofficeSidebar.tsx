"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/backoffice", label: "Dashboard", icon: "📊" },
  { href: "/backoffice/relojes", label: "Relojes", icon: "⌚" },
  { href: "/backoffice/tasaciones", label: "Tasaciones", icon: "📋" },
  { href: "/backoffice/mercado", label: "Mercado", icon: "📈" },
];

export default function BackofficeSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/backoffice/login");
    router.refresh();
  }

  return (
    <aside className="w-56 bg-stone-900 text-white flex flex-col min-h-screen flex-shrink-0">
      <div className="p-6 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">⌚</span>
          <span className="font-bold text-sm">
            elige<span className="text-amber-400">tu</span>tiempo
          </span>
        </div>
        <p className="text-stone-500 text-xs mt-1">Backoffice</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href;
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
  );
}
