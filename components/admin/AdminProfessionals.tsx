"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { Professional } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import Modal from "@/components/ui/Modal";
import FileUploadField from "@/components/ui/FileUploadField";

interface ProfessionalFormData {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  active: boolean;
  slotMinutes: string;
  workDays: string;
  startTime: string;
  endTime: string;
}

const defaultForm: ProfessionalFormData = {
  name: "",
  title: "",
  bio: "",
  photoUrl: "",
  active: true,
  slotMinutes: "30",
  workDays: "1,2,3,4,5",
  startTime: "09:00",
  endTime: "18:00",
};

const dayOptions = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
  { value: 7, label: "Dom" },
];

export default function AdminProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfessionalFormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .listAdminProfessionals()
      .then(({ professionals }) => setProfessionals(professionals))
      .catch(() => setError("No se pudieron cargar los profesionales."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const selectedDays = new Set(formData.workDays.split(",").map((d) => d.trim()).filter(Boolean).map(Number));
  const toggleDay = (day: number) => {
    const next = new Set(selectedDays);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    setFormData({ ...formData, workDays: Array.from(next).sort().join(",") });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const input = {
        name: formData.name,
        title: formData.title,
        bio: formData.bio || undefined,
        photoUrl: formData.photoUrl || undefined,
        active: formData.active,
        slotMinutes: Number(formData.slotMinutes) || 30,
        workDays: formData.workDays,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };
      if (editingId) {
        await adminApi.updateProfessional(editingId, input);
      } else {
        await adminApi.createProfessional(input);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(defaultForm);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar el profesional.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (professional: Professional) => {
    setEditingId(professional.id);
    setFormData({
      name: professional.name,
      title: professional.title,
      bio: professional.bio ?? "",
      photoUrl: professional.photoUrl ?? "",
      active: professional.active,
      slotMinutes: String(professional.slotMinutes),
      workDays: professional.workDays,
      startTime: professional.startTime,
      endTime: professional.endTime,
    });
    setShowForm(true);
  };

  const handleDeactivate = async (professional: Professional) => {
    if (!confirm(`¿Desactivar a "${professional.name}"? Dejará de aparecer para agendar nuevas citas.`)) return;
    try {
      await adminApi.deactivateProfessional(professional.id);
      load();
    } catch {
      setError("No se pudo desactivar al profesional.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-alivos-dark">Profesionales</h1>
          <p className="text-slate-500 text-sm mt-1">Fisioterapeutas, rehabilitadores y demás especialistas que atienden citas</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData(defaultForm);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar profesional
        </button>
      </div>

      {error && !showForm && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {showForm && (
        <Modal
          title={editingId ? "Editar profesional" : "Agregar profesional"}
          onClose={() => setShowForm(false)}
          maxWidth="max-w-lg"
          footer={
            <>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.title}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Agregar"}
              </button>
            </>
          }
        >
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                placeholder="Ej: Dra. Ana Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Especialidad *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                placeholder="Ej: Fisioterapeuta"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción breve</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
            />
          </div>
          <FileUploadField
            label="Foto (opcional)"
            value={formData.photoUrl}
            onChange={(url) => setFormData({ ...formData, photoUrl: url })}
            accept="image/*"
            preview="image"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Días disponibles</label>
            <div className="flex flex-wrap gap-2">
              {dayOptions.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    selectedDays.has(day.value)
                      ? "bg-brand-600 border-brand-600 text-white"
                      : "border-slate-200 text-slate-500 hover:border-brand-300"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Hora de inicio</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Hora de fin</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Duración (min)</label>
              <input
                type="number"
                min={5}
                step={5}
                value={formData.slotMinutes}
                onChange={(e) => setFormData({ ...formData, slotMinutes: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
            />
            Activo (visible para agendar)
          </label>
        </Modal>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-sm shadow-sm border border-slate-100">
          Cargando profesionales...
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Profesional</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Horario</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {professionals.map((professional) => (
                  <tr key={professional.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-alivos-dark">{professional.name}</p>
                      <p className="text-xs text-slate-500">{professional.title}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600 hidden sm:table-cell text-xs">
                      {professional.startTime}–{professional.endTime} · cada {professional.slotMinutes} min
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          professional.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {professional.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(professional)}
                          className="text-xs font-semibold text-brand-600 hover:bg-brand-50 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          Editar
                        </button>
                        {professional.active && (
                          <button
                            onClick={() => handleDeactivate(professional)}
                            className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            Desactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {professionals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-400 text-sm">
                      Todavía no hay profesionales registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
