"use client";

import { useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    contactPhone: "+54 9 11 0000-0000",
    contactEmail: "info@alivosestimulacion.com",
    instagram: "@alivosestimulacion",
    facebook: "alivosestimulacion",
    website: "alivosestimulacion.com",
    appointmentButtonText: "Agendar cita",
    brandName: "ALIVOS Medicina de Rehabilitación",
    primaryColor: "#1a3a5c",
    whatsappNumber: "5491100000000",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Configuración</h1>
        <p className="text-slate-500 text-sm mt-1">Ajustá los datos de contacto y marca de la plataforma</p>
      </div>

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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp</label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo de contacto</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Número de WhatsApp (para el botón)</label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="5491100000000"
            />
            <p className="text-xs text-slate-400 mt-1">Sin + ni espacios. Ej: 5491112345678</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sitio web</label>
            <input
              type="text"
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
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
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
              <input
                type="text"
                value={settings.instagram.replace("@", "")}
                onChange={(e) => setSettings({ ...settings, instagram: "@" + e.target.value })}
                className="w-full border border-slate-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Facebook</label>
            <input
              type="text"
              value={settings.facebook}
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
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre de la marca</label>
            <input
              type="text"
              value={settings.brandName}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Texto del botón &quot;Agendar cita&quot;</label>
            <input
              type="text"
              value={settings.appointmentButtonText}
              onChange={(e) => setSettings({ ...settings, appointmentButtonText: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Color principal</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Guardar configuración
      </button>
    </div>
  );
}
