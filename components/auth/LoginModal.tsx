"use client";

import { useState } from "react";
import { DEMO_ADMIN_CREDENTIALS, DEMO_STUDENT_CREDENTIALS, useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const doLogin = async (loginEmail: string, loginPassword: string) => {
    setError(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin(email, password);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-alivos-dark text-lg">Iniciar sesión</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400">o entra con un usuario demo</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => doLogin(DEMO_ADMIN_CREDENTIALS.email, DEMO_ADMIN_CREDENTIALS.password)}
              className="py-2 border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Administrador Demo
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => doLogin(DEMO_STUDENT_CREDENTIALS.email, DEMO_STUDENT_CREDENTIALS.password)}
              className="py-2 border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Alumno Demo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
