"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/lib/api/settings";
import { Settings } from "@/lib/api/types";

const emptySettings: Settings = {
  whatsapp: "",
  email: "",
  appointmentUrl: "",
  instagram: "",
  facebook: "",
  website: "",
  brandName: "",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings()
      .then(({ settings }) => setSettings({ ...emptySettings, ...settings }))
      .catch(() => setError("No se pudo cargar la configuración."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const { settings: updated } = await updateSettings(settings);
      setSettings({ ...emptySettings, ...updated });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("No se pudo guardar la configuración.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Configuración</h1>
        <p className="text-slate-500 text-sm mt-1">Ajusta los datos de contacto y marca de la plataforma</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Configuración guardada correctamente.
        </div>
      )}

      {/* Contact info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <h2 className="font-bold text-alivos-dark flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Datos de contacto
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp (con código de país, sin +)</label>
            <input
              type="text"
              value={settings.whatsapp ?? ""}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="5215528132020"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo de contacto</label>
            <input
              type="email"
              value={settings.email ?? ""}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sitio web</label>
            <input
              type="text"
              value={settings.website ?? ""}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Link para agendar cita</label>
            <input
              type="text"
              value={settings.appointmentUrl ?? ""}
              onChange={(e) => setSettings({ ...settings, appointmentUrl: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Social media */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <h2 className="font-bold text-alivos-dark flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          Redes sociales
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Instagram</label>
            <input
              type="text"
              value={settings.instagram ?? ""}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="@alivosestimulacion"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Facebook</label>
            <input
              type="text"
              value={settings.facebook ?? ""}
              onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
        </div>
      </div>

      {/* Brand config */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <h2 className="font-bold text-alivos-dark flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Configuración de marca
        </h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre de la marca</label>
          <input
            type="text"
            value={settings.brandName ?? ""}
            onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {saving ? "Guardando..." : "Guardar configuración"}
      </button>
    </div>
  );
}
