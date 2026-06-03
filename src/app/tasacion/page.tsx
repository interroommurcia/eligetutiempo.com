export const metadata = {
  title: "Tasación Gratuita de Relojes — EligeTuTiempo",
};

export default function TasacionPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-3">Sin compromiso</p>
        <h1 className="text-4xl font-bold mb-4">Tasación gratuita</h1>
        <p className="text-stone-500 text-lg">
          Rellena el formulario y te enviamos una valoración real en menos de 24 horas.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
        <form className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Nombre *</label>
              <input
                type="text"
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Email *</label>
              <input
                type="email"
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Marca *</label>
              <input
                type="text"
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Ej: Rolex, Omega…"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Modelo *</label>
              <input
                type="text"
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Ej: Submariner, Speedmaster…"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Referencia</label>
              <input
                type="text"
                className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Ej: 126610LN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Año aproximado</label>
              <input
                type="number"
                min={1950}
                max={2025}
                className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Ej: 2018"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Estado del reloj *</label>
            <select
              required
              className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">Selecciona…</option>
              <option>Excelente (como nuevo)</option>
              <option>Muy bueno (signos mínimos de uso)</option>
              <option>Bueno (uso normal)</option>
              <option>Regular (arañazos visibles)</option>
            </select>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
              <input type="checkbox" className="accent-amber-600 w-4 h-4" />
              Tengo caja original
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
              <input type="checkbox" className="accent-amber-600 w-4 h-4" />
              Tengo papeles / garantía
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Información adicional</label>
            <textarea
              rows={4}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              placeholder="Cuéntanos cualquier detalle relevante sobre el reloj…"
            />
          </div>

          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            Solicitar tasación gratuita
          </button>

          <p className="text-xs text-center text-stone-400">
            Te responderemos en menos de 24 horas. Sin compromiso de venta.
          </p>
        </form>
      </div>
    </div>
  );
}
