import { crearVenta } from "../actions";

export const metadata = { title: "Nueva venta — Backoffice" };

const CANALES = ["Web", "Wallapop", "Milanuncios", "Todocolección", "eBay", "Chrono24", "Presencial", "Otro"];

export default function NuevaVentaPage() {
  const field = "w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]";

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <a href="/backoffice/ventas" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">← Volver a ventas</a>
        <h1 className="text-2xl font-bold text-stone-900 mt-2">Registrar venta</h1>
      </div>

      <form action={crearVenta} className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Marca *</label>
            <input name="marca" required className={field} placeholder="Omega" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Modelo *</label>
            <input name="modelo" required className={field} placeholder="Speedmaster" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5">Referencia</label>
          <input name="referencia" className={field} placeholder="Ej: 311.30.42.30.01.005" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Precio coste (€)</label>
            <input name="precio_coste" type="number" min={0} className={field} placeholder="0" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Precio venta (€) *</label>
            <input name="precio_venta" type="number" min={0} required className={field} placeholder="0" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Canal *</label>
            <select name="canal" required className={field}>
              {CANALES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Fecha venta *</label>
            <input name="fecha" type="date" required className={field}
              defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5">Notas internas</label>
          <textarea name="notas" rows={3} className={`${field} resize-none`}
            placeholder="Cualquier detalle relevante de la operación…" />
        </div>

        <button type="submit"
          className="bg-[#C9A84C] hover:bg-[#E2C36A] text-black font-semibold py-3 rounded-xl text-sm transition-colors">
          Registrar venta
        </button>
      </form>
    </div>
  );
}
