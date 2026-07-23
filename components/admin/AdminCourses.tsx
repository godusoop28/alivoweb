"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { Course, CourseStatus } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { alivosAssets } from "@/lib/assets/alivosAssets";
import Modal from "@/components/ui/Modal";

interface CourseFormData {
  title: string;
  ageRange: string;
  shortDescription: string;
  price: string;
  status: CourseStatus;
  coverImage: string;
  bannerImage: string;
}

const defaultForm: CourseFormData = {
  title: "",
  ageRange: "",
  shortDescription: "",
  price: "",
  status: "DRAFT",
  coverImage: "",
  bannerImage: "",
};

const coverExamples = [
  { label: "Portada Módulo 1 (bebé boca abajo)", url: alivosAssets.courseDescubriendoSuCuerpo.modules.module01.cover },
  { label: "Portada juego y desarrollo 1", url: alivosAssets.home.coverOne },
  { label: "Portada juego y desarrollo 2", url: alivosAssets.home.coverTwo },
];
const bannerExamples = [
  { label: "Banner bebés ALIVOS (horizontal)", url: alivosAssets.home.babiesBannerHorizontal },
  { label: "Banner bebés ALIVOS", url: alivosAssets.home.babiesBanner },
];

const statusLabel: Record<CourseStatus, string> = {
  PUBLISHED: "Publicado",
  DRAFT: "Borrador",
  HIDDEN: "Oculto",
};
const statusColor: Record<CourseStatus, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-yellow-100 text-yellow-700",
  HIDDEN: "bg-slate-100 text-slate-500",
};

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .listAdminCourses()
      .then(({ courses }) => setCourses(courses))
      .catch(() => setError("No se pudieron cargar los cursos."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const input = {
        title: formData.title,
        ageRange: formData.ageRange,
        shortDescription: formData.shortDescription,
        price: Number(formData.price) || 0,
        status: formData.status,
        coverImage: formData.coverImage || undefined,
        bannerImage: formData.bannerImage || undefined,
      };
      if (editingId) {
        await adminApi.updateCourse(editingId, input);
      } else {
        await adminApi.createCourse(input);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(defaultForm);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar el curso.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData({
      title: course.title,
      ageRange: course.ageRange,
      shortDescription: course.shortDescription,
      price: String(course.price),
      status: course.status,
      coverImage: course.imageUrl ?? "",
      bannerImage: course.bannerImage ?? "",
    });
    setShowForm(true);
  };

  const handleHide = async (course: Course) => {
    if (!confirm(`¿Ocultar el curso "${course.title}"? Dejará de verse en el catálogo público.`)) return;
    try {
      await adminApi.deleteCourse(course.id);
      load();
    } catch {
      setError("No se pudo ocultar el curso.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-alivos-dark">Gestión de cursos</h1>
          <p className="text-slate-500 text-sm mt-1">{courses.length} cursos en la plataforma</p>
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
          Crear nuevo curso
        </button>
      </div>

      {error && !showForm && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {/* Form modal */}
      {showForm && (
        <Modal
          title={editingId ? "Editar curso" : "Crear nuevo curso"}
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
                disabled={saving || !formData.title || !formData.ageRange}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear curso"}
              </button>
            </>
          }
        >
          {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Título del curso *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                  placeholder="Ej: Descubriendo su cuerpo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Edad recomendada *</label>
                  <input
                    type="text"
                    value={formData.ageRange}
                    onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    placeholder="Ej: 0–3 meses"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Precio (MXN) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    placeholder="5500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción corta</label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                  placeholder="Descripción breve del curso..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as CourseStatus })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
                >
                  <option value="DRAFT">Borrador</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="HIDDEN">Oculto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Imagen principal / portada</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 mb-2"
                  placeholder="/alivos-assets/..."
                />
                <div className="flex flex-wrap gap-1.5">
                  {coverExamples.map((ex) => (
                    <button
                      key={ex.url}
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: ex.url })}
                      className="px-2.5 py-1 bg-brand-50 border border-brand-100 rounded-lg text-xs font-medium text-brand-700 hover:bg-brand-100 transition-colors"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
                {formData.coverImage && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.coverImage} alt="" className="w-full h-28 object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Banner del curso</label>
                <input
                  type="text"
                  value={formData.bannerImage}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 mb-2"
                  placeholder="/alivos-assets/..."
                />
                <div className="flex flex-wrap gap-1.5">
                  {bannerExamples.map((ex) => (
                    <button
                      key={ex.url}
                      type="button"
                      onClick={() => setFormData({ ...formData, bannerImage: ex.url })}
                      className="px-2.5 py-1 bg-brand-50 border border-brand-100 rounded-lg text-xs font-medium text-brand-700 hover:bg-brand-100 transition-colors"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
        </Modal>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-sm shadow-sm border border-slate-100">
          Cargando cursos...
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-xl overflow-hidden shrink-0">
                    {course.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-alivos-dark text-sm truncate">{course.title}</p>
                    <p className="text-xs text-slate-400">{course.ageRange}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusColor[course.status]}`}>
                    {statusLabel[course.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>${course.price.toLocaleString("es-MX")}</span>
                  <span>{course.modules.length} módulos</span>
                  <span>{course.studentsCount} alumnos</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="flex-1 py-2 text-xs font-semibold text-brand-600 border border-brand-100 rounded-lg hover:bg-brand-50 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleHide(course)}
                    className="flex-1 py-2 text-xs font-semibold text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Ocultar
                  </button>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-sm border border-slate-100">
                Todavía no hay cursos creados.
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Curso</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Edad</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Precio</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Módulos</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Alumnos</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                    <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-brand-100 rounded-xl overflow-hidden shrink-0">
                            {course.imageUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-alivos-dark truncate">{course.title}</p>
                            <p className="text-xs text-slate-400 sm:hidden">{course.ageRange}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 hidden sm:table-cell">{course.ageRange}</td>
                      <td className="px-5 py-4 font-semibold text-alivos-dark hidden md:table-cell">
                        ${course.price.toLocaleString("es-MX")}
                      </td>
                      <td className="px-5 py-4 text-slate-600 hidden lg:table-cell">{course.modules.length}</td>
                      <td className="px-5 py-4 text-slate-600 hidden md:table-cell">{course.studentsCount}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[course.status]}`}>
                          {statusLabel[course.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleHide(course)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Ocultar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                        Todavía no hay cursos creados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
