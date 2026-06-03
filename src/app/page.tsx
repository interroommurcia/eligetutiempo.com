import Link from "next/link";
import { relojesDestacados, marcasPopulares } from "@/lib/data";
import RelojCard from "@/components/RelojCard";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">
            Compraventa y tasación de relojes de lujo
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            El mercado de relojes<br />
            <span className="text-amber-400">de confianza</span>
          </h1>
          <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">
            Compra relojes verificados, vende el tuyo al mejor precio o descubre cuánto vale tu reloj con nuestra tasación gratuita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogo"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              Ver catálogo
            </Link>
            <Link
              href="/tasacion"
              className="border border-white/30 hover:border-white text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              Tasar mi reloj gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-amber-600 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: "+500", label: "Relojes vendidos" },
            { n: "+200", label: "Marcas y referencias" },
            { n: "100%", label: "Autenticidad verificada" },
            { n: "24h", label: "Respuesta de tasación" },
          ].map(({ n, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold">{n}</div>
              <div className="text-amber-100 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Marcas */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-stone-400 mb-8">
            Marcas más buscadas
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {marcasPopulares.map((marca) => (
              <Link
                key={marca}
                href={`/catalogo?marca=${encodeURIComponent(marca)}`}
                className="px-5 py-2.5 border border-stone-200 rounded-full text-sm font-medium hover:border-amber-500 hover:text-amber-700 transition-colors"
              >
                {marca}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Relojes destacados */}
      <section className="py-16 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Relojes destacados</h2>
            <Link href="/catalogo" className="text-amber-600 hover:text-amber-700 font-medium text-sm">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relojesDestacados.map((reloj) => (
              <RelojCard key={reloj.id} reloj={reloj} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA tasación */}
      <section className="py-20 px-4 bg-stone-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">¿Cuánto vale tu reloj?</h2>
          <p className="text-stone-300 text-lg mb-8">
            Envíanos fotos y referencia. Te respondemos en menos de 24 horas con una valoración real de mercado, sin compromiso.
          </p>
          <Link
            href="/tasacion"
            className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors inline-block"
          >
            Solicitar tasación gratuita
          </Link>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Envíanos tu reloj",
                desc: "Rellena el formulario con fotos y la referencia de tu reloj. Sin compromiso.",
              },
              {
                step: "02",
                title: "Recibe tu tasación",
                desc: "En menos de 24h te enviamos una valoración real basada en el mercado actual.",
              },
              {
                step: "03",
                title: "Vende o compra",
                desc: "Si aceptas la oferta, gestionamos todo. Pago seguro y envío asegurado.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="text-5xl font-black text-amber-200 mb-4">{step}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-stone-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
