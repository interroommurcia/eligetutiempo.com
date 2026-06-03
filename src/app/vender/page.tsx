import Link from "next/link";

export const metadata = {
  title: "Vender mi Reloj — EligeTuTiempo",
};

export default function VenderPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-3">Vende sin complicaciones</p>
        <h1 className="text-4xl font-bold mb-4">Vende tu reloj al mejor precio</h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Nos encargamos de todo: tasación, fotografía profesional, publicación y venta. Tú solo cobras.
        </p>
      </div>

      {/* Pasos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { n: "01", title: "Solicita tasación", desc: "Rellena el formulario con los datos de tu reloj. Te respondemos en 24h con una oferta." },
          { n: "02", title: "Acepta la oferta", desc: "Si el precio te convence, nos envías el reloj con envío asegurado prepagado." },
          { n: "03", title: "Recibe el pago", desc: "Verificamos la autenticidad y hacemos el pago por transferencia en 24-48h." },
        ].map(({ n, title, desc }) => (
          <div key={n} className="bg-white rounded-2xl border border-stone-200 p-6 text-center">
            <div className="text-4xl font-black text-amber-200 mb-4">{n}</div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Ventajas */}
      <div className="bg-stone-900 text-white rounded-3xl p-10 mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">¿Por qué vender con nosotros?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: "🔒", t: "Pago seguro garantizado", d: "Transferencia bancaria directa sin intermediarios." },
            { icon: "⚡", t: "Proceso rápido", d: "Oferta en 24h, pago en 48h tras recibir el reloj." },
            { icon: "📦", t: "Envío prepagado", d: "Te mandamos la etiqueta de envío con seguro incluido." },
            { icon: "💎", t: "Precios de mercado", d: "Valoramos al precio real, no al precio de saldo." },
          ].map(({ icon, t, d }) => (
            <div key={t} className="flex gap-4">
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div>
                <p className="font-semibold mb-1">{t}</p>
                <p className="text-stone-400 text-sm">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/tasacion"
          className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors inline-block"
        >
          Empezar tasación gratuita
        </Link>
      </div>
    </div>
  );
}
