"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";

const G = "#C9A84C";   // gold
const S = "#8a9ab0";   // steel
const P = "#13131a";   // plate
const J = "#cc3333";   // jewel red

/* ── gear path generator (centered at cx,cy) ── */
function gear(cx: number, cy: number, R: number, r: number, t: number): string {
  const slot = (Math.PI * 2) / t;
  const tf = 0.36;
  const pts: string[] = [];
  for (let i = 0; i < t; i++) {
    const b = (i / t) * Math.PI * 2;
    pts.push(
      `${(cx + r * Math.cos(b)).toFixed(1)},${(cy + r * Math.sin(b)).toFixed(1)}`,
      `${(cx + R * Math.cos(b + slot * (0.5 - tf / 2))).toFixed(1)},${(cy + R * Math.sin(b + slot * (0.5 - tf / 2))).toFixed(1)}`,
      `${(cx + R * Math.cos(b + slot * (0.5 + tf / 2))).toFixed(1)},${(cy + R * Math.sin(b + slot * (0.5 + tf / 2))).toFixed(1)}`
    );
  }
  return `M${pts.join("L")}Z`;
}

/* ── spoke circle (balance / rotor wheel) ── */
function spokeWheel(cx: number, cy: number, R: number, spokes = 4) {
  return Array.from({ length: spokes }, (_, i) => {
    const a = (i / spokes) * Math.PI * 2;
    return `M${cx},${cy}L${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

/* ── Jewel dot ── */
function Jewel({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r={3} fill={J} />;
}

/* ═══════════ MECHANICAL ═══════════ */
function SVGMecanico() {
  return (
    <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-lg">
      {/* plate */}
      <circle cx="120" cy="120" r="116" fill={P} />
      <circle cx="120" cy="120" r="116" fill="none" stroke={G} strokeWidth="1.5" opacity=".4" />
      {/* pillars */}
      {([[45,45],[195,45],[195,195],[45,195]] as [number,number][]).map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={5} fill="#2a2a38" stroke={S} strokeWidth="1" />
      ))}
      {/* barrel */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"spin-cw 22s linear infinite" }}>
        <path d={gear(68,72,40,31,26)} fill={G} opacity=".9" />
        <circle cx="68" cy="72" r="9" fill={P} />
        <circle cx="68" cy="72" r="5" fill={G} opacity=".5" />
      </g>
      <Jewel cx={68} cy={72} />
      {/* center wheel */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"spin-ccw 11s linear infinite" }}>
        <path d={gear(120,120,27,20,34)} fill={S} opacity=".85" />
        <circle cx="120" cy="120" r="7" fill={P} />
        <circle cx="120" cy="120" r="4" fill={S} opacity=".5" />
      </g>
      <Jewel cx={120} cy={120} />
      {/* third wheel */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"spin-cw 7s linear infinite" }}>
        <path d={gear(172,90,20,15,22)} fill={S} opacity=".85" />
        <circle cx="172" cy="90" r="5" fill={P} />
      </g>
      <Jewel cx={172} cy={90} />
      {/* fourth wheel */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"spin-ccw 4s linear infinite" }}>
        <path d={gear(168,152,16,12,18)} fill={S} opacity=".85" />
        <circle cx="168" cy="152" r="4" fill={P} />
      </g>
      <Jewel cx={168} cy={152} />
      {/* escape wheel */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"spin-cw 1.8s linear infinite" }}>
        <path d={gear(195,137,18,9,15)} fill={G} opacity=".9" />
        <circle cx="195" cy="137" r="4" fill={P} />
      </g>
      <Jewel cx={195} cy={137} />
      {/* balance wheel */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"balance-osc 0.55s ease-in-out infinite alternate" }}>
        <circle cx="208" cy="95" r="21" fill="none" stroke={G} strokeWidth="2.5" />
        <path d={spokeWheel(208,95,20,4)} stroke={G} strokeWidth="2" fill="none" />
        <circle cx="208" cy="95" r="4" fill={G} />
      </g>
      <Jewel cx={208} cy={95} />
      {/* hairspring suggestion */}
      <circle cx="208" cy="95" r="13" fill="none" stroke={G} strokeWidth="0.8" opacity=".3" strokeDasharray="3 4" />
      {/* center cap */}
      <circle cx="120" cy="120" r="3" fill={G} />
    </svg>
  );
}

/* ═══════════ QUARTZ ═══════════ */
function SVGCuarzo() {
  return (
    <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-lg">
      <circle cx="120" cy="120" r="116" fill={P} />
      <circle cx="120" cy="120" r="116" fill="none" stroke="#4488cc" strokeWidth="1.5" opacity=".3" />
      {/* circuit traces */}
      <path d="M80,105 L115,105 M125,120 L80,120 M80,135 L115,135" stroke="#4488cc" strokeWidth="1" opacity=".4" fill="none"/>
      <path d="M145,120 L190,90 M165,138 L190,155" stroke="#4488cc" strokeWidth="1" opacity=".4" fill="none"/>
      {/* stepper motor coil */}
      <circle cx="68" cy="120" r="30" fill="none" stroke="#4488cc" strokeWidth="1.5" opacity=".5" />
      <circle cx="68" cy="120" r="22" fill="none" stroke="#4488cc" strokeWidth="1" opacity=".4" />
      <circle cx="68" cy="120" r="14" fill={P} stroke="#4488cc" strokeWidth="2" opacity=".6" />
      {/* coil poles */}
      <path d={gear(68,120,12,8,8)} fill="#4488cc" opacity=".7" />
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"spin-cw 1s steps(1) infinite" }}>
        <path d="M60,112 L76,112 L76,128 L60,128 Z" fill="none" stroke="#4488cc" strokeWidth="1" opacity=".5"/>
        <path d="M64,116 L72,120 L64,124 Z" fill="#4488cc" opacity=".8"/>
      </g>
      <Jewel cx={68} cy={120} />
      {/* gear 1 */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"quartz-step 1s steps(1) infinite" }}>
        <path d={gear(125,118,26,19,30)} fill={S} opacity=".85" />
        <circle cx="125" cy="118" r="7" fill={P} />
        <circle cx="125" cy="118" r="4" fill={S} opacity=".5" />
      </g>
      <Jewel cx={125} cy={118} />
      {/* gear 2 */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"quartz-step 2s steps(1) infinite" }}>
        <path d={gear(172,92,19,14,22)} fill={S} opacity=".85" />
        <circle cx="172" cy="92" r="5" fill={P} />
      </g>
      <Jewel cx={172} cy={92} />
      {/* gear 3 */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"quartz-step 4s steps(1) infinite" }}>
        <path d={gear(175,152,15,11,18)} fill={S} opacity=".85" />
        <circle cx="175" cy="152" r="4" fill={P} />
      </g>
      <Jewel cx={175} cy={152} />
      {/* crystal tuning fork */}
      <rect x="76" cy="155" x1="76" y="160" width="8" height="35" rx="4" fill="#4488ff" opacity=".0" />
      <path d="M76,200 L76,172 Q76,165 80,165 Q84,165 84,172 L84,200" fill="none" stroke="#88aaff" strokeWidth="2.5" opacity=".7"/>
      <path d="M72,200 L72,168 Q72,158 80,158 Q88,158 88,168 L88,200" fill="none" stroke="#88aaff" strokeWidth="1.5" opacity=".4"/>
      <line x1="74" y1="200" x2="86" y2="200" stroke="#88aaff" strokeWidth="2" opacity=".7"/>
      {/* crystal glow */}
      <ellipse cx="80" cy="175" rx="14" ry="20" fill="#2244ff" opacity=".06" />
      {/* label */}
      <text x="68" y="212" textAnchor="middle" fontSize="7" fill="#88aaff" opacity=".6" fontFamily="monospace">32.768 kHz</text>
    </svg>
  );
}

/* ═══════════ AUTOMATIC ═══════════ */
function SVGAutomatico() {
  return (
    <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-lg">
      <circle cx="120" cy="120" r="116" fill={P} />
      <circle cx="120" cy="120" r="116" fill="none" stroke={G} strokeWidth="1.5" opacity=".4" />
      {/* pillars */}
      {([[45,45],[195,45],[195,195],[45,195]] as [number,number][]).map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={5} fill="#2a2a38" stroke={S} strokeWidth="1" />
      ))}
      {/* same gear train as mechanical */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"spin-cw 22s linear infinite" }}>
        <path d={gear(68,72,40,31,26)} fill={G} opacity=".9" />
        <circle cx="68" cy="72" r="9" fill={P} />
        <circle cx="68" cy="72" r="5" fill={G} opacity=".5" />
      </g>
      <Jewel cx={68} cy={72} />
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"spin-ccw 11s linear infinite" }}>
        <path d={gear(120,120,27,20,34)} fill={S} opacity=".85" />
        <circle cx="120" cy="120" r="7" fill={P} />
      </g>
      <Jewel cx={120} cy={120} />
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"spin-cw 7s linear infinite" }}>
        <path d={gear(172,90,20,15,22)} fill={S} opacity=".85" />
        <circle cx="172" cy="90" r="5" fill={P} />
      </g>
      <Jewel cx={172} cy={90} />
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"spin-ccw 4s linear infinite" }}>
        <path d={gear(168,152,16,12,18)} fill={S} opacity=".85" />
        <circle cx="168" cy="152" r="4" fill={P} />
      </g>
      <Jewel cx={168} cy={152} />
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"spin-cw 1.8s linear infinite" }}>
        <path d={gear(195,137,18,9,15)} fill={G} opacity=".9" />
        <circle cx="195" cy="137" r="4" fill={P} />
      </g>
      <Jewel cx={195} cy={137} />
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"balance-osc 0.55s ease-in-out infinite alternate" }}>
        <circle cx="208" cy="95" r="21" fill="none" stroke={G} strokeWidth="2.5" />
        <path d={spokeWheel(208,95,20,4)} stroke={G} strokeWidth="2" fill="none" />
        <circle cx="208" cy="95" r="4" fill={G} />
      </g>
      <Jewel cx={208} cy={95} />
      <circle cx="208" cy="95" r="13" fill="none" stroke={G} strokeWidth="0.8" opacity=".3" strokeDasharray="3 4" />
      {/* ROTOR — the defining element of an automatic */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"rotor-spin 7s linear infinite" }}>
        {/* weighted arc */}
        <path d="M120,120 L25,120 A95,95 0 0,1 215,120 Z" fill={G} opacity=".18" />
        <path d="M120,120 L25,120 A95,95 0 0,1 215,120 Z" fill="none" stroke={G} strokeWidth="1.5" opacity=".5" />
        {/* rotor rim arc */}
        <path d="M28,120 A92,92 0 0,1 212,120" fill="none" stroke={G} strokeWidth="4" opacity=".6" />
        {/* weight block */}
        <path d="M50,100 A90,90 0 0,1 190,100 L185,115 A80,80 0 0,0 55,115 Z" fill={G} opacity=".4" />
        {/* pivot */}
        <circle cx="120" cy="120" r="12" fill="#1e1e28" stroke={G} strokeWidth="1.5" />
        <circle cx="120" cy="120" r="7" fill={G} opacity=".7" />
      </g>
      {/* center cap over rotor */}
      <circle cx="120" cy="120" r="3" fill={G} />
    </svg>
  );
}

/* ═══════════ CARD WRAPPER with 3D tilt ═══════════ */
type MovType = "mecanico" | "cuarzo" | "automatico";

const INFO: Record<MovType, { label: string; sub: string; desc: string; accent: string }> = {
  mecanico: {
    label: "Manual",
    sub: "Cuerda manual",
    desc: "El corazón artesanal. Energía pura del giro de la corona, transmitida por un tren de ruedas tallado a mano.",
    accent: G,
  },
  cuarzo: {
    label: "Cuarzo",
    sub: "Precisión electrónica",
    desc: "El cristal oscila 32.768 veces por segundo. Una corriente eléctrica convierte cada pulso en el avance exacto del segundero.",
    accent: "#88aaff",
  },
  automatico: {
    label: "Automático",
    sub: "Carga por movimiento",
    desc: "El rotor gira con cada gesto del pulso. Sin pilas, sin cuerda: el tiempo se alimenta de tu propio movimiento.",
    accent: G,
  },
};

function MovCard({ tipo }: { tipo: MovType }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const info = INFO[tipo];

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`;
  }

  function onLeave() {
    if (cardRef.current)
      cardRef.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)";
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="card-3d rounded-2xl border border-[#C9A84C]/20 bg-[#0d0d12] p-5 flex flex-col items-center cursor-default"
      style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
    >
      <div className="w-52 h-52">
        {tipo === "mecanico" && <SVGMecanico />}
        {tipo === "cuarzo"   && <SVGCuarzo />}
        {tipo === "automatico" && <SVGAutomatico />}
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: info.accent }}>
          {info.sub}
        </p>
        <h3 className="text-white font-bold text-xl mb-2">{info.label}</h3>
        <p className="text-stone-400 text-sm leading-relaxed">{info.desc}</p>
      </div>
    </div>
  );
}

export default function MovimientosSection() {
  return (
    <section className="py-20 px-4 bg-[#08080f]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-[#C9A84C] mb-3">Ingeniería de precisión</p>
          <h2 className="text-3xl font-bold text-white">Tres mecanismos, una pasión</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MovCard tipo="mecanico"   />
          <MovCard tipo="cuarzo"     />
          <MovCard tipo="automatico" />
        </div>
      </div>
    </section>
  );
}
