"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { Course, ManualAccess } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

export default function AdminAccess() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [accesses, setAccesses] = useState<ManualAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", courseId: "", reason: "", expiresAt: "" });
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.listAdminCourses(), adminApi.listManualAccess()])
      .then(([coursesRes, accessesRes]) => {
        setCourses(coursesRes.courses);
        setAccesses(accessesRes.accesses);
        setForm((prev) => ({ ...prev, courseId: prev.courseId || coursesRes.courses[0]?.id || "" }));
      })
      .catch(() => setError("No se pudo cargar la información."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.grantManualAccess({
        email: form.email,
        courseId: form.courseId,
        reason: form.reason || undefined,
        expiresAt: form.expiresAt || undefined,
      });
      setForm({ email: "", courseId: courses[0]?.id || "", reason: "", expiresAt: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo otorgar el acceso.");
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await adminApi.revokeManualAccess(id);
      load();
    } catch {
      setError("No se pudo revocar el acceso.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Accesos manuales</h1>
        <p className="text-slate-500 text-sm mt-1">
          Otorga acceso gratuito a un curso sin requerir pago
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {/* Info banner */}
      <div className="bg-blue-50 border border-brand-200 rounded-2xl p-5 flex gap-4">
        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-alivos-dark mb-1">¿Para qué sirve esta sección?</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Usa esta herramienta para dar acceso a un curso{" "}
            <strong>sin que el usuario pague</strong>. Ideal para: pago por transferencia bancaria,
            becas, cortesías, cuentas de prueba para terapeutas colaboradoras, o cualquier acceso
            especial que quieras asignar manualmente. Si el correo no tiene cuenta todavía, la API crea
            una automáticamente con una contraseña temporal (ver README de la API).
          </p>
        </div>
      </div>

      {/* Grant access form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="font-bold text-alivos-dark mb-5">Dar acceso a un curso</h2>
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ¡Acceso otorgado correctamente! El usuario podrá ingresar al curso de inmediato.
          </div>
        )}
        <form onSubmit={handleGrant} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Correo del usuario *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                placeholder="usuario@correo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Curso *</label>
              <select
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.ageRange})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Motivo / nota interna
              </label>
              <input
                type="text"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                placeholder="Ej: Pago por transferencia, beca, cortesía..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Fecha de expiración (opcional)
              </label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || !form.email || !form.courseId}
            className="flex items-center gap-2 px-6 py-3 bg-success-600 hover:bg-success-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            {saving ? "Otorgando..." : "Dar acceso al curso"}
          </button>
        </form>
      </div>

      {/* Access history */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-alivos-dark">Accesos manuales recientes</h2>
          <span className="text-xs text-slate-400">{accesses.filter((a) => a.status === "ACTIVE").length} activos</span>
        </div>
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Cargando accesos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Correo</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Curso</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Fecha</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Motivo</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Vence</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {accesses.map((access) => (
                  <tr key={access.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-alivos-dark">{access.email}</p>
                      <p className="text-xs text-slate-500 sm:hidden">{access.courseTitle}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600 hidden sm:table-cell">
                      <p className="truncate max-w-xs">{access.courseTitle}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden md:table-cell">
                      {new Date(access.grantedAt).toLocaleDateString("es-MX")}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden lg:table-cell">
                      <p className="truncate max-w-xs">{access.reason || "—"}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden lg:table-cell">
                      {access.expiresAt ? new Date(access.expiresAt).toLocaleDateString("es-MX") : "Sin vencimiento"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          access.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500 line-through"
                        }`}
                      >
                        {access.status === "ACTIVE" ? "Activo" : "Revocado"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {access.status === "ACTIVE" && (
                        <button
                          onClick={() => handleRevoke(access.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Quitar acceso
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {accesses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                      Todavía no se otorgaron accesos manuales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
