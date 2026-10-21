"use client";

import { useState, useEffect } from "react";
import { HONEYPOT_FIELD, TIMESTAMP_FIELD } from "@/lib/antibot";

/**
 * Añade los dos campos ocultos (honeypot + timestamp) a cualquier formulario
 * público. Visualmente ocultos para humanos; invisibles para lectores de
 * pantalla (aria-hidden) y marcados tabIndex={-1}.
 */
export default function HoneypotFields() {
  const [ts, setTs] = useState<number>(0);

  // Timestamp solo tras montar el formulario en el cliente, para que los bots
  // que inspeccionan HTML pre-render no lo vean con valor realista.
  useEffect(() => {
    setTs(Date.now());
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: 1,
        height: 1,
        overflow: "hidden",
        opacity: 0,
      }}
    >
      <label>
        No rellenes esto
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
      <input type="hidden" name={TIMESTAMP_FIELD} value={ts} />
    </div>
  );
}
