"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import Modal from "@/components/ui/Modal";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : mode === "login"
          ? "No se pudo iniciar sesión. Intenta de nuevo."
          : "No se pudo crear la cuenta. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={mode === "login" ? "Iniciar sesión" : "Crear cuenta"} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
        <button
          type="button"
          onClick={() => switchMode("login")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            mode === "login" ? "bg-white text-alivos-dark shadow-sm" : "text-slate-500"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => switchMode("register")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            mode === "register" ? "bg-white text-alivos-dark shadow-sm" : "text-slate-500"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
        )}
        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="Tu nombre completo"
            />
          </div>
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
            minLength={mode === "register" ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            placeholder="••••••••"
          />
          {mode === "register" && (
            <p className="text-xs text-slate-400 mt-1">Mínimo 8 caracteres.</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
        >
          {loading ? "Un momento..." : mode === "login" ? "Ingresar" : "Crear cuenta"}
        </button>
      </form>
    </Modal>
  );
}
