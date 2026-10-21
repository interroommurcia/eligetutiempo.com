"use client";

import { useActionState } from "react";
import type { Reloj } from "@/lib/relojes";
import MarcaInput from "@/components/MarcaInput";
import ImageUploader from "@/components/ImageUploader";

const ESTADOS = ["Nuevo con etiquetas", "Como nuevo", "Muy buen estado", "En condiciones aceptables"] as const;
const ESTADOS_VENTA = ["Disponible", "Reservado", "Vendido"] as const;

type Props = {
  reloj?: Reloj;
  action: (formData: FormData) => Promise<void>;
};

export default function RelojForm({ reloj, action }: Props) {
  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await action(formData);
        return null;
      } catch (e: unknown) {
        return e instanceof Error ? e.message : "Error al guardar";
      }
    },
    null
  );

  const field = "block w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-800">Identificación</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-stone-600 mb-1">Marca *</label>
            <MarcaInput
              name="marca"
              required
              defaultValue={reloj?.marca ?? ""}
              className={field}
              placeholder="Escribe la marca (ej. Rolex, Omega...)"
            />
            <p className="text-[11px] text-stone-400 mt-1">Puedes escribir una marca que no esté en la lista.</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Modelo *</label>
            <input name="modelo" required defaultValue={reloj?.modelo ?? ""} className={field} placeholder="Submariner Date" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Referencia *</label>
            <input name="referencia" required defaultValue={reloj?.referencia ?? ""} className={field} placeholder="126610LN" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Año aproximado</label>
            <input name="año" type="number" min="1900" max="2030" defaultValue={reloj?.año ?? ""} className={field} placeholder="2021" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Estado del reloj *</label>
            <select name="estado" required defaultValue={reloj?.estado ?? ""} className={field}>
              <option value="">— Selecciona estado —</option>
              {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-stone-600 mb-1">Estado de venta *</label>
            <div className="flex flex-wrap gap-2">
              {ESTADOS_VENTA.map((e) => (
                <label key={e} className="flex items-center gap-2 text-sm px-3 py-2 border border-stone-200 rounded-xl cursor-pointer has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                  <input
                    type="radio"
                    name="estado_venta"
                    value={e}
                    defaultChecked={(reloj?.estado_venta ?? "Disponible") === e}
                    className="accent-amber-500"
                  />
                  <span>
                    {e === "Disponible" && "🟢"}
                    {e === "Reservado" && "🟡"}
                    {e === "Vendido" && "⚫"}
                    {" "}{e}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-800">Documentación</h2>
        <div className="flex gap-6 flex-wrap">
          {[
            { name: "caja", label: "Caja original", checked: reloj?.caja },
            { name: "papeles", label: "Papeles / Garantía", checked: reloj?.papeles },
            { name: "factura", label: "Factura original", checked: reloj?.factura },
          ].map(({ name, label, checked }) => (
            <label key={name} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name={name} defaultChecked={checked ?? false}
                className="w-4 h-4 accent-amber-500" />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-800">Precios</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Precio de coste (€)</label>
            <input name="precio_coste" type="number" min="0" step="0.01"
              defaultValue={reloj?.precio_coste ?? ""} className={field} placeholder="Solo visible internamente" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Precio de venta (€) *</label>
            <input name="precio_venta" type="number" min="0" step="0.01" required
              defaultValue={reloj?.precio_venta ?? ""} className={field} placeholder="12500" />
          </div>
        </div>
        {reloj?.precio_coste && reloj?.precio_venta && (
          <p className="text-xs text-stone-500">
            Margen: {(((reloj.precio_venta - reloj.precio_coste) / reloj.precio_coste) * 100).toFixed(1)}%
            ({(reloj.precio_venta - reloj.precio_coste).toLocaleString("es-ES")} €)
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-800">Descripción</h2>
        <textarea name="descripcion" rows={4} defaultValue={reloj?.descripcion ?? ""}
          className={field} placeholder="Descripción detallada del reloj, estado, historial..." />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-800">Imágenes</h2>
        <p className="text-xs text-stone-500">
          Subida desde galería (móvil), cámara, ordenador o Google Drive. Acepta HEIC/HEIF (iPhone).
          Arrastra para reordenar. Mínimo recomendado: 6-12 ángulos.
        </p>
        <ImageUploader
          bucket="relojes"
          folder="catalogo"
          name="imagenes"
          defaultUrls={reloj?.imagenes ?? []}
          multiple
          helpText="La primera imagen es la principal (portada en el catálogo)."
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="publicado" defaultChecked={reloj?.publicado ?? false}
            className="w-4 h-4 accent-amber-500" />
          <div>
            <p className="text-sm font-medium text-stone-800">Publicar en catálogo</p>
            <p className="text-xs text-stone-500">Si está marcado, el reloj será visible en la web</p>
          </div>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          {pending ? "Guardando..." : reloj ? "Guardar cambios" : "Crear reloj"}
        </button>
        <a href="/backoffice/relojes" className="text-sm text-stone-500 hover:text-stone-700">
          Cancelar
        </a>
      </div>
    </form>
  );
}
