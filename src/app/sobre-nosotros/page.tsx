export const metadata = {
  title: "Sobre Nosotros — EligeTuTiempo",
};

export default function SobreNosotrosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-3">Quiénes somos</p>
        <h1 className="text-4xl font-bold mb-4">Apasionados por los relojes</h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Somos especialistas en el mercado de relojes de segunda mano de lujo, con años de experiencia verificando, comprando y vendiendo piezas excepcionales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Nuestra misión</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Queremos democratizar el acceso a relojes de lujo verificados, ofreciendo una plataforma transparente donde compradores y vendedores puedan operar con total confianza.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Cada reloj que publicamos ha pasado por un proceso riguroso de verificación de autenticidad realizado por nuestros expertos con más de 15 años de experiencia en el sector.
          </p>
        </div>
        <div className="bg-amber-50 rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">En números</h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: "+500", l: "Relojes vendidos" },
              { n: "+200", l: "Clientes satisfechos" },
              { n: "15+", l: "Años de experiencia" },
              { n: "100%", l: "Autenticidad garantizada" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div className="text-3xl font-bold text-amber-700">{n}</div>
                <div className="text-stone-500 text-sm mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-stone-900 text-white rounded-3xl p-10 text-center">
        <h2 className="text-2xl font-bold mb-3">¿Tienes alguna pregunta?</h2>
        <p className="text-stone-400 mb-6">Estamos aquí para ayudarte. Escríbenos y te respondemos lo antes posible.</p>
        <a
          href="mailto:hola@eligetutiempo.com"
          className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-block"
        >
          hola@eligetutiempo.com
        </a>
      </div>
    </div>
  );
}
