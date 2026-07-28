"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { LearningResource, ResourceType } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import Modal from "@/components/ui/Modal";
import FileUploadField from "@/components/ui/FileUploadField";
import VimeoUploadField from "@/components/admin/VimeoUploadField";

interface ResourceFormData {
  title: string;
  description: string;
  type: ResourceType;
  coverImage: string;
  fileUrl: string;
  vimeoUrl: string;
  vimeoThumbnail: string | null;
  content: string;
  externalUrl: string;
  visible: boolean;
}

const defaultForm: ResourceFormData = {
  title: "",
  description: "",
  type: "PDF",
  coverImage: "",
  fileUrl: "",
  vimeoUrl: "",
  vimeoThumbnail: null,
  content: "",
  externalUrl: "",
  visible: true,
};

const typeOptions: { value: ResourceType; label: string }[] = [
  { value: "PDF", label: "PDF" },
  { value: "VIDEO", label: "Video" },
  { value: "ARTICLE", label: "Lectura" },
  { value: "LINK", label: "Enlace externo" },
];

const typeColor: Record<ResourceType, string> = {
  PDF: "bg-red-100 text-red-700",
  VIDEO: "bg-blue-100 text-blue-700",
  ARTICLE: "bg-purple-100 text-purple-700",
  LINK: "bg-slate-100 text-slate-600",
};

export default function AdminResources() {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ResourceFormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .listAdminResources()
      .then(({ resources }) => setResources(resources))
      .catch(() => setError("No se pudieron cargar los recursos."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setShowForm(true);
  };

  const openEdit = (resource: LearningResource) => {
    setEditingId(resource.id);
    setFormData({
      title: resource.title,
      description: resource.description ?? "",
      type: resource.type,
      coverImage: resource.coverImage ?? "",
      fileUrl: resource.fileUrl ?? "",
      vimeoUrl: resource.vimeoUrl ?? "",
      vimeoThumbnail: resource.vimeoThumbnail,
      content: resource.content ?? "",
      externalUrl: resource.externalUrl ?? "",
      visible: resource.visible,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const input = {
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type,
        coverImage: formData.coverImage || undefined,
        fileUrl: formData.type === "PDF" ? formData.fileUrl || undefined : undefined,
        vimeoUrl: formData.type === "VIDEO" ? formData.vimeoUrl : undefined,
        content: formData.type === "ARTICLE" ? formData.content || undefined : undefined,
        externalUrl: formData.type === "LINK" ? formData.externalUrl || undefined : undefined,
        visible: formData.visible,
      };
      if (editingId) {
        await adminApi.updateResource(editingId, input);
      } else {
        await adminApi.createResource(input);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar el recurso.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (resource: LearningResource) => {
    if (!confirm(`¿Eliminar el recurso "${resource.title}"? Esta acción no se puede deshacer.`)) return;
    try {
      await adminApi.deleteResource(resource.id);
      load();
    } catch {
      setError("No se pudo eliminar el recurso.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-alivos-dark">Aprende Más</h1>
          <p className="text-slate-500 text-sm mt-1">Biblioteca de recursos gratuitos, fuera de los cursos</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar recurso
        </button>
      </div>

      {error && !showForm && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {showForm && (
        <Modal
          title={editingId ? "Editar recurso" : "Nuevo recurso"}
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
                disabled={saving || !formData.title}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear recurso"}
              </button>
            </>
          }
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="Ej: Guía de estimulación temprana en casa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción corta</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
              placeholder="Se muestra en la tarjeta de la biblioteca..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de recurso</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceType })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
            >
              {typeOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {formData.type === "PDF" && (
            <FileUploadField
              label="Archivo PDF"
              value={formData.fileUrl}
              onChange={(url) => setFormData({ ...formData, fileUrl: url })}
              accept="application/pdf"
              preview="pdf"
            />
          )}
          {formData.type === "VIDEO" && (
            <VimeoUploadField
              label="Video"
              value={formData.vimeoUrl}
              thumbnailUrl={formData.vimeoThumbnail}
              onChange={(url) => setFormData({ ...formData, vimeoUrl: url })}
            />
          )}
          {formData.type === "ARTICLE" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contenido de la lectura</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                placeholder="Escribe el texto completo de la lectura. Los saltos de línea se respetan al mostrarla."
              />
            </div>
          )}
          {formData.type === "LINK" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">URL del enlace</label>
              <input
                type="text"
                value={formData.externalUrl}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                placeholder="https://..."
              />
            </div>
          )}

          <FileUploadField
            label="Imagen de portada (opcional)"
            value={formData.coverImage}
            onChange={(url) => setFormData({ ...formData, coverImage: url })}
            accept="image/*"
            preview="image"
          />

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.visible}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
            />
            <span className="text-sm text-slate-700">Visible para alumnos</span>
          </label>
        </Modal>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Cargando recursos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Recurso</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Visibilidad</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-alivos-dark">{resource.title}</p>
                      {resource.description && (
                        <p className="text-xs text-slate-400 truncate max-w-sm">{resource.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeColor[resource.type]}`}>
                        {typeOptions.find((t) => t.value === resource.type)?.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          resource.visible ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {resource.visible ? "Visible" : "Oculto"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(resource)}
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(resource)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {resources.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-400 text-sm">
                      Todavía no hay recursos creados.
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
