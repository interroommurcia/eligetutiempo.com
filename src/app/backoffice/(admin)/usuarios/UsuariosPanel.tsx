"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { invitarUsuario, eliminarUsuario, enviarResetPassword } from "./actions";

type Usuario = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  confirmed: boolean;
  super_admin: boolean;
};

function fmt(iso: string | null) {
  if (!iso) return "nunca";
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function UsuariosPanel({
  usuarios,
  currentUserId,
  currentEmail,
}: {
  usuarios: Usuario[];
  currentUserId: string;
  currentEmail: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  function invite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFeedback(null);
    startTransition(async () => {
      const r = await invitarUsuario(formData);
      if (r.ok) {
        setFeedback({ ok: true, msg: r.msg ?? "Invitación enviada." });
        setEmail("");
        router.refresh();
      } else {
        setFeedback({ ok: false, msg: r.error });
      }
    });
  }

  function remove(u: Usuario) {
    if (!confirm(`¿Eliminar el acceso de ${u.email}? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      const r = await eliminarUsuario(u.id);
      if (r.ok) {
        setFeedback({ ok: true, msg: r.msg ?? "Usuario eliminado." });
        router.refresh();
      } else {
        setFeedback({ ok: false, msg: r.error });
      }
    });
  }

  function reset(u: Usuario) {
    if (!confirm(`¿Enviar email de reset de contraseña a ${u.email}?`)) return;
    startTransition(async () => {
      const r = await enviarResetPassword(u.email);
      setFeedback(r.ok ? { ok: true, msg: r.msg ?? "Email enviado." } : { ok: false, msg: r.error });
    });
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div className={`rounded-xl px-4 py-3 text-sm border ${feedback.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"}`}>
          {feedback.msg}
        </div>
      )}

      {/* Invitar */}
      <form onSubmit={invite} className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-800 mb-3">Invitar nuevo usuario</h2>
        <p className="text-xs text-stone-500 mb-4">
          Supabase enviará un email con un enlace para que fije su contraseña y pueda entrar al backoffice.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colaborador@ejemplo.com"
            className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={pending}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-xl text-sm"
          >
            {pending ? "Enviando…" : "Enviar invitación"}
          </button>
        </div>
      </form>

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Estado</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Último acceso</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Creado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {usuarios.map((u) => {
              const soyYo = u.id === currentUserId;
              return (
                <tr key={u.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-900">{u.email}</div>
                    <div className="flex gap-1 mt-0.5">
                      {soyYo && <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-semibold">TÚ</span>}
                      {u.super_admin && <span className="text-[10px] px-1.5 py-0.5 bg-stone-900 text-white rounded-full font-semibold">SUPER-ADMIN</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {u.confirmed ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">Activo</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Invitación pendiente</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-500">{fmt(u.last_sign_in_at)}</td>
                  <td className="px-4 py-3 text-xs text-stone-500">{fmt(u.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => reset(u)}
                        disabled={pending}
                        className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200"
                        title="Enviar email de reset de contraseña"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(u)}
                        disabled={pending || soyYo}
                        className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        title={soyYo ? "No puedes eliminarte a ti mismo" : "Eliminar usuario"}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-stone-400">
        Sesión actual: <strong>{currentEmail}</strong>. Las acciones quedan registradas en Seguridad.
      </p>
    </div>
  );
}
