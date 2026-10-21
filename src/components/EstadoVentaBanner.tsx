type Estado = "Disponible" | "Reservado" | "Vendido";

const STYLES: Record<Estado, string> = {
  Disponible: "bg-emerald-600 text-white",
  Reservado: "bg-amber-500 text-black",
  Vendido: "bg-stone-900 text-white",
};

/**
 * Banda diagonal en la esquina superior izquierda del card del catálogo.
 * Se oculta en "Disponible" por defecto (puede forzarse con alwaysShow).
 */
export default function EstadoVentaBanner({
  estado,
  alwaysShow = false,
}: {
  estado: Estado | string;
  alwaysShow?: boolean;
}) {
  if (!alwaysShow && estado === "Disponible") return null;
  const style = STYLES[estado as Estado] ?? "bg-stone-700 text-white";
  return (
    <div className="absolute top-0 left-0 z-10 pointer-events-none select-none">
      <div
        className={`${style} text-[10px] sm:text-xs font-bold uppercase tracking-wider px-6 py-1 shadow-md`}
        style={{
          transform: "translate(-28%, 60%) rotate(-45deg)",
          transformOrigin: "center",
        }}
      >
        {estado}
      </div>
    </div>
  );
}
