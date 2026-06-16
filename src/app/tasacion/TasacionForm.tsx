"use client";

import { useActionState } from "react";
import { enviarTasacion } from "./actions";

type State = { ok: boolean; error?: string } | null;

export default function TasacionForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      try {
        await enviarTasacion(formData);
        return { ok: true };
      } catch {
        return { ok: false, error: "Error al enviar. Inténtalo de nuevo." };
      }
    },
    null
  );

  const field = "w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

  if (state?.ok) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">✅</p>
        <h2 className="text-2xl font-bold mb-2">Solicitud recibida</h2>
        <p className="text-stone-500">Te responderemos en menos de 24 horas.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Nombre *</label>
          <input name="nombre" type="text" required className={field} placeholder="Tu nombre" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Email *</label>
          <input name="email" type="email" required className={field} placeholder="tu@email.com" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Teléfono</label>
        <input name="telefono" type="tel" className={field} placeholder="+34 600 000 000" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Marca *</label>
          <input name="marca" type="text" required className={field} placeholder="Ej: Rolex, Omega…" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Modelo *</label>
          <input name="modelo" type="text" required className={field} placeholder="Ej: Submariner, Speedmaster…" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Referencia</label>
          <input name="referencia" type="text" className={field} placeholder="Ej: 126610LN" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Año aproximado</label>
          <input name="año" type="number" min={1950} max={2030} className={field} placeholder="Ej: 2018" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Estado del reloj *</label>
        <select name="estado_reloj" required className={field}>
          <option value="">Selecciona…</option>
          <option value="Mint">Mint (como nuevo)</option>
          <option value="Very Good">Very Good (signos mínimos de uso)</option>
          <option value="Good">Good (uso normal)</option>
          <option value="Fair">Fair (arañazos visibles)</option>
        </select>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input type="checkbox" name="caja" className="accent-amber-600 w-4 h-4" />
          Tengo caja original
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input type="checkbox" name="papeles" className="accent-amber-600 w-4 h-4" />
          Tengo papeles / garantía
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Información adicional</label>
        <textarea name="notas" rows={4} className={`${field} resize-none`}
          placeholder="Cuéntanos cualquier detalle relevante sobre el reloj…" />
      </div>

      <button type="submit" disabled={pending}
        className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-colors">
        {pending ? "Enviando…" : "Solicitar tasación gratuita"}
      </button>

      <p className="text-xs text-center text-stone-400">
        Te responderemos en menos de 24 horas. Sin compromiso de venta.
      </p>
    </form>
  );
}
