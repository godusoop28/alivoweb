"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { Testimonial, TestimonialStatus } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import Modal from "@/components/ui/Modal";
import FileUploadField from "@/components/ui/FileUploadField";

interface TestimonialFormData {
  authorName: string;
  authorContext: string;
  photoUrl: string;
  rating: string;
  comment: string;
  status: TestimonialStatus;
  displayOrder: string;
}

const defaultForm: TestimonialFormData = {
  authorName: "",
  authorContext: "",
  photoUrl: "",
  rating: "5",
  comment: "",
  status: "PUBLISHED",
  displayOrder: "",
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .listAdminTestimonials()
      .then(({ testimonials }) => setTestimonials(testimonials))
      .catch(() => setError("No se pudieron cargar los testimonios."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const input = {
        authorName: formData.authorName,
        authorContext: formData.authorContext || undefined,
        photoUrl: formData.photoUrl || undefined,
        rating: formData.rating ? Number(formData.rating) : undefined,
        comment: formData.comment,
        status: formData.status,
        displayOrder: formData.displayOrder ? Number(formData.displayOrder) : undefined,
      };
      if (editingId) {
        await adminApi.updateTestimonial(editingId, input);
      } else {
        await adminApi.createTestimonial(input);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(defaultForm);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar el testimonio.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      authorName: testimonial.authorName,
      authorContext: testimonial.authorContext ?? "",
      photoUrl: testimonial.photoUrl ?? "",
      rating: testimonial.rating ? String(testimonial.rating) : "",
      comment: testimonial.comment,
      status: testimonial.status,
      displayOrder: testimonial.displayOrder != null ? String(testimonial.displayOrder) : "",
    });
    setShowForm(true);
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (!confirm(`¿Eliminar el testimonio de "${testimonial.authorName}"?`)) return;
    try {
      await adminApi.deleteTestimonial(testimonial.id);
      load();
    } catch {
      setError("No se pudo eliminar el testimonio.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-alivos-dark">Testimonios</h1>
          <p className="text-slate-500 text-sm mt-1">
            Testimonios escritos a mano que aparecen junto a las reseñas en la sección de inicio
          </p>
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
          Agregar testimonio
        </button>
      </div>

      {error && !showForm && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {showForm && (
        <Modal
          title={editingId ? "Editar testimonio" : "Agregar testimonio"}
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
                disabled={saving || !formData.authorName || !formData.comment}
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
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                placeholder="Ej: Familia García"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contexto</label>
              <input
                type="text"
                value={formData.authorContext}
                onChange={(e) => setFormData({ ...formData, authorContext: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                placeholder="Ej: Mamá de Sofía, 8 meses"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Comentario *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Estrellas (opcional)</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
              >
                <option value="">Sin estrellas</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Orden</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TestimonialStatus })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
              >
                <option value="PUBLISHED">Publicado</option>
                <option value="HIDDEN">Oculto</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-sm shadow-sm border border-slate-100">
          Cargando testimonios...
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Autor</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Comentario</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-slate-50 transition-colors align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium text-alivos-dark">{testimonial.authorName}</p>
                      <p className="text-xs text-slate-500">{testimonial.authorContext}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden md:table-cell max-w-sm">
                      <p className="line-clamp-3">{testimonial.comment}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          testimonial.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {testimonial.status === "PUBLISHED" ? "Publicado" : "Oculto"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="text-xs font-semibold text-brand-600 hover:bg-brand-50 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial)}
                          className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {testimonials.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-400 text-sm">
                      Todavía no hay testimonios creados.
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
