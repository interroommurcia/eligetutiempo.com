export const metadata = {
  title: "Política de Privacidad — EligeTuTiempo",
};

const FECHA = "17 de junio de 2025";

export default function PrivacidadPage() {
  const h2 = "text-xl font-bold text-white mt-10 mb-3";
  const p = "text-stone-400 leading-relaxed mb-4";
  const li = "text-stone-400 leading-relaxed";

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-4xl font-bold mb-2">Política de Privacidad</h1>
        <p className="text-stone-500 text-sm mb-12">Última actualización: {FECHA}</p>

        <p className={p}>
          En <strong className="text-white">eligetutiempo.com</strong> nos tomamos muy en serio la privacidad de
          nuestros usuarios. Esta política explica qué datos recogemos, cómo los usamos y qué derechos tienes
          sobre ellos, de conformidad con el <strong className="text-white">Reglamento (UE) 2016/679 (RGPD)</strong> y
          la <strong className="text-white">Ley Orgánica 3/2018 (LOPDGDD)</strong>.
        </p>

        <h2 className={h2}>1. Responsable del tratamiento</h2>
        <ul className="space-y-1 mb-6">
          {[
            ["Denominación", "EligeTuTiempo"],
            ["Dominio", "eligetutiempo.com"],
            ["Actividad", "Compraventa y valoración de relojes"],
            ["Contacto", "hola@eligetutiempo.com"],
          ].map(([k, v]) => (
            <li key={k} className={li}>
              <span className="text-stone-300 font-medium">{k}:</span> {v}
            </li>
          ))}
        </ul>

        <h2 className={h2}>2. Datos que recogemos</h2>
        <p className={p}>Recogemos únicamente los datos necesarios para prestar el servicio:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          {[
            "Nombre y apellidos",
            "Dirección de correo electrónico",
            "Número de teléfono (opcional)",
            "Información sobre el reloj que deseas tasar o vender (marca, modelo, referencia, fotos)",
            "Datos de navegación anónimos (páginas visitadas, tiempo de sesión)",
          ].map((item) => (
            <li key={item} className={li}>{item}</li>
          ))}
        </ul>

        <h2 className={h2}>3. Finalidad del tratamiento</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border border-stone-800 rounded-xl overflow-hidden">
            <thead className="bg-stone-900">
              <tr>
                <th className="text-left px-4 py-3 text-stone-300 font-semibold">Finalidad</th>
                <th className="text-left px-4 py-3 text-stone-300 font-semibold">Base jurídica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {[
                ["Gestionar tu solicitud de tasación o valoración", "Ejecución de un precontrato (art. 6.1.b RGPD)"],
                ["Responderte por email o teléfono", "Interés legítimo (art. 6.1.f RGPD)"],
                ["Enviarte información sobre relojes de tu interés", "Consentimiento (art. 6.1.a RGPD)"],
                ["Mejorar el funcionamiento de la web", "Interés legítimo (art. 6.1.f RGPD)"],
                ["Cumplir obligaciones legales", "Obligación legal (art. 6.1.c RGPD)"],
              ].map(([fin, base]) => (
                <tr key={fin} className="hover:bg-stone-900/50 transition-colors">
                  <td className="px-4 py-3 text-stone-400">{fin}</td>
                  <td className="px-4 py-3 text-stone-500 text-xs">{base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className={h2}>4. Conservación de los datos</h2>
        <p className={p}>
          Conservamos tus datos el tiempo estrictamente necesario para cumplir la finalidad para la que fueron
          recogidos y, posteriormente, durante los plazos legales de prescripción aplicables (máximo 5 años para
          datos contractuales, 3 años para comunicaciones comerciales con tu consentimiento).
        </p>

        <h2 className={h2}>5. Destinatarios y transferencias internacionales</h2>
        <p className={p}>
          Tus datos no se ceden a terceros salvo obligación legal. Utilizamos los siguientes proveedores de
          servicios que actúan como encargados del tratamiento:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          {[
            "Vercel Inc. (alojamiento web) — servidores en la UE/EEE",
            "Supabase Inc. (base de datos) — servidores en la UE",
            "Estas empresas cuentan con cláusulas contractuales tipo de la Comisión Europea.",
          ].map((item) => (
            <li key={item} className={li}>{item}</li>
          ))}
        </ul>

        <h2 className={h2}>6. Tus derechos</h2>
        <p className={p}>En cualquier momento puedes ejercer los siguientes derechos escribiéndonos a <strong className="text-[#C9A84C]">hola@eligetutiempo.com</strong>:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          {[
            "Acceso — conocer qué datos tenemos sobre ti",
            "Rectificación — corregir datos inexactos o incompletos",
            "Supresión — solicitar la eliminación de tus datos («derecho al olvido»)",
            "Limitación — restringir el tratamiento en determinadas circunstancias",
            "Portabilidad — recibir tus datos en formato estructurado",
            "Oposición — oponerte al tratamiento basado en interés legítimo",
            "Retirada del consentimiento — en cualquier momento, sin efectos retroactivos",
          ].map((item) => (
            <li key={item} className={li}>{item}</li>
          ))}
        </ul>
        <p className={p}>
          Si consideras que tus derechos no han sido atendidos correctamente, puedes presentar una reclamación
          ante la <strong className="text-white">Agencia Española de Protección de Datos (AEPD)</strong> en{" "}
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] underline">www.aepd.es</a>.
        </p>

        <h2 className={h2}>7. Cookies</h2>
        <p className={p}>
          Esta web utiliza únicamente cookies técnicas estrictamente necesarias para su funcionamiento
          (gestión de sesión en el área privada). No utilizamos cookies de seguimiento, publicidad o análisis
          de terceros. No se requiere tu consentimiento para estas cookies al amparo del art. 22.2 de la
          Ley 34/2002 (LSSI).
        </p>

        <h2 className={h2}>8. Seguridad</h2>
        <p className={p}>
          Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos: conexión cifrada
          mediante HTTPS/TLS, control de acceso con autenticación segura, almacenamiento cifrado en base de
          datos y acceso restringido a personal autorizado.
        </p>

        <h2 className={h2}>9. Menores de edad</h2>
        <p className={p}>
          Nuestros servicios están dirigidos a mayores de 18 años. No recogemos conscientemente datos de
          menores. Si detectamos que hemos recibido datos de un menor, los eliminaremos de inmediato.
        </p>

        <h2 className={h2}>10. Cambios en esta política</h2>
        <p className={p}>
          Podemos actualizar esta política ocasionalmente. La versión vigente estará siempre disponible en
          esta página con la fecha de última actualización. Te recomendamos revisarla periódicamente.
        </p>

        <div className="mt-12 p-6 border border-[#C9A84C]/20 rounded-2xl">
          <p className="text-stone-400 text-sm">
            <strong className="text-white">¿Preguntas sobre privacidad?</strong><br />
            Escríbenos a{" "}
            <a href="mailto:hola@eligetutiempo.com" className="text-[#C9A84C]">hola@eligetutiempo.com</a>{" "}
            y te responderemos en un plazo máximo de 30 días.
          </p>
        </div>
      </div>
    </div>
  );
}
