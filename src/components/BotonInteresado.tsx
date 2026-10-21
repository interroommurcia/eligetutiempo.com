"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  marca: string;
  modelo: string;
  referencia: string;
  precio?: number;
  email?: string;      // Destinatario del mailto.
  telefono?: string;   // En formato internacional sin "+" ni espacios para wa.me (ej. 34622647176).
  disabled?: boolean;
  labelDisabled?: string;
  label?: string;
};

/**
 * Botón "Estoy interesado" que al pulsarse ofrece dos vías:
 *   - Email (mailto con asunto + cuerpo precargados)
 *   - WhatsApp (wa.me con mensaje precargado)
 *
 * El componente es cliente para poder mostrar el popover y cerrarse al
 * clicar fuera o pulsar Escape.
 */
export default function BotonInteresado({
  marca,
  modelo,
  referencia,
  precio,
  email = "hola@eligetutiempo.com",
  telefono = "34622647176",
  disabled,
  labelDisabled = "Esta pieza ya ha sido vendida",
  label = "Estoy interesado",
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  if (disabled) {
    return (
      <div className="bg-stone-100 border border-stone-200 text-stone-600 text-center py-4 rounded-xl font-semibold">
        {labelDisabled}
      </div>
    );
  }

  const asunto = `Interés en ${marca} ${modelo} (${referencia})`;
  const cuerpo = [
    `Hola,`,
    ``,
    `Estoy interesado en el ${marca} ${modelo} (ref. ${referencia})${precio ? ` publicado por ${precio.toLocaleString("es-ES")} €` : ""}.`,
    `¿Sigue disponible? ¿Me podéis dar más detalles?`,
    ``,
    `Gracias.`,
  ].join("\n");

  const mailtoHref =
    `mailto:${encodeURIComponent(email)}` +
    `?subject=${encodeURIComponent(asunto)}` +
    `&body=${encodeURIComponent(cuerpo)}`;

  // wa.me quiere teléfono sin + y mensaje url-encoded.
  const telWa = telefono.replace(/[^0-9]/g, "");
  const waHref = `https://wa.me/${telWa}?text=${encodeURIComponent(asunto + "\n\n" + cuerpo)}`;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full bg-amber-600 hover:bg-amber-500 text-white text-center py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
      >
        {label}
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl p-2 z-20">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            <span className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl flex-shrink-0" aria-hidden>
              {/* Logo WhatsApp inline (SVG) */}
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.588-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.555-5.338 11.89-11.893 11.89a11.9 11.9 0 01-5.688-1.449L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.298-.496.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-stone-900">WhatsApp</p>
              <p className="text-xs text-stone-500">Respuesta más rápida · +34 622 647 176</p>
            </div>
          </a>

          <a
            href={mailtoHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-amber-50 transition-colors"
          >
            <span className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl flex-shrink-0" aria-hidden>
              ✉️
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-stone-900">Email</p>
              <p className="text-xs text-stone-500 truncate">{email}</p>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
