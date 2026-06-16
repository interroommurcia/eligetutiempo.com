"use client";

import { useTransition, useState } from "react";
import { actualizarEstadoTasacion, type EstadoTasacion } from "./actions";

type Tasacion = {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  marca: string;
  modelo: string;
  referencia: string | null;
  año: number | null;
  estado_reloj: string;
  caja: boolean;
  papeles: boolean;
  notas: string | null;
  estado: EstadoTasacion;
  nota_interna: string | null;
  oferta: number | null;
  created_at: string;
};

const ESTADOS: EstadoTasacion[] = ["Pendiente", "En análisis", "Oferta enviada", "Cerrado"];

const ESTADO_COLOR: Record<EstadoTasacion, string> = {
  Pendiente: "bg-amber-100 text-amber-700",
  "En análisis": "bg-blue-100 text-blue-700",
  "Oferta enviada": "bg-purple-100 text-purple-700",
  Cerrado: "bg-stone-100 text-stone-500",
};

export default function TasacionCard({ t }: { t: Tasacion }) {
  const [expanded, setExpanded] = useState(false);
  const [estado, setEstado] = useState(t.estado);
  const [nota, setNota] = useState(t.nota_interna ?? "");
  const [oferta, setOferta] = useState(t.oferta?.toString() ?? "");
  const [pending, startTransition] = useTransition();

  function guardar() {
    startTransition(() =>
      actualizarEstadoTasacion(t.id, estado, nota, oferta ? Number(oferta) : null)
    );
  }

  const fecha = new Date(t.created_at).toLocaleDateString("es-ES", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div
        className="p-5 cursor-pointer hover:bg-stone-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[estado]}`}>
                {estado}
              </span>
              <span className="text-xs text-stone-400">{fecha}</span>
            </div>
            <p className="font-semibold text-stone-900">{t.nombre}</p>
            <p className="text-sm text-stone-500">{t.email}{t.telefono ? ` · ${t.telefono}` : ""}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-stone-900">{t.marca} {t.modelo}</p>
            <p className="text-xs text-stone-400 font-mono">{t.referencia ?? "Sin ref."}{t.año ? ` · ${t.año}` : ""}</p>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-stone-100 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Estado reloj</p>
              <p>{t.estado_reloj}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Documentación</p>
              <p>{[t.caja && "Caja", t.papeles && "Papeles"].filter(Boolean).join(", ") || "Sin documentación"}</p>
            </div>
            {t.notas && (
              <div className="col-span-2">
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Notas del cliente</p>
                <p className="text-stone-600">{t.notas}</p>
              </div>
            )}
          </div>

          <div className="border-t border-stone-100 pt-4 space-y-3">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Gestión interna</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Estado</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoTasacion)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm">
                  {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Oferta (€)</label>
                <input type="number" value={oferta} onChange={(e) => setOferta(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="Ej: 3500" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-500 mb-1">Nota interna</label>
              <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={2}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm resize-none"
                placeholder="Solo visible en backoffice…" />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={guardar} disabled={pending}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                {pending ? "Guardando…" : "Guardar"}
              </button>
              {t.oferta && (
                <a href={`mailto:${t.email}?subject=Tasación de tu ${t.marca} ${t.modelo}&body=Hola ${t.nombre},%0A%0ATras revisar tu reloj, te ofrecemos ${t.oferta.toLocaleString("es-ES")} €.%0A%0AEligeTuTiempo`}
                  className="text-sm text-stone-500 hover:text-stone-700 underline">
                  Enviar oferta por email
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
