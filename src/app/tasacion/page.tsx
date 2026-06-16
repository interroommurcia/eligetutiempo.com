import TasacionForm from "./TasacionForm";

export const metadata = {
  title: "Tasación Gratuita de Relojes — EligeTuTiempo",
};

export default function TasacionPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-3">Sin compromiso</p>
        <h1 className="text-4xl font-bold mb-4">Tasación gratuita</h1>
        <p className="text-stone-500 text-lg">
          Rellena el formulario y te enviamos una valoración real en menos de 24 horas.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
        <TasacionForm />
      </div>
    </div>
  );
}
