"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
      return;
    }

    router.push("/backoffice");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-stone-900 rounded-2xl p-8 border border-stone-800">
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="admin@eligetutiempo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-2">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </div>
    </form>
  );
}
