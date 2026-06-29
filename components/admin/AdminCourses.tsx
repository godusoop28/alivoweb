"use client";

import { useState } from "react";
import { courses, type Course } from "@/lib/mockData";

type CourseStatus = "published" | "draft" | "hidden";

interface CourseFormData {
  title: string;
  ageRange: string;
  shortDescription: string;
  price: string;
  status: CourseStatus;
}

const defaultForm: CourseFormData = {
  title: "",
  ageRange: "",
  shortDescription: "",
  price: "",
  status: "draft",
};

const statusLabel: Record<CourseStatus, string> = {
  published: "Publicado",
  draft: "Borrador",
  hidden: "Oculto",
};
const statusColor: Record<CourseStatus, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  hidden: "bg-slate-100 text-slate-500",
};

export default function AdminCourses() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(defaultForm);
  const [localCourses, setLocalCourses] = useState<Course[]>(courses);

  const handleSave = () => {
    if (editingId) {
      setLocalCourses((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                title: formData.title,
                ageRange: formData.ageRange,
                shortDescription: formData.shortDescription,
                price: Number(formData.price),
                status: formData.status,
              }
            : c
        )
      );
    } else {
      const newCourse: Course = {
        id: `curso-new-${Date.now()}`,
        title: formData.title,
        ageRange: formData.ageRange,
        shortDescription: formData.shortDescription,
        longDescription: formData.shortDescription,
        price: Number(formData.price),
        modules: [],
        progress: 0,
        enrolled: false,
        studentsCount: 0,
        status: formData.status,
      };
      setLocalCourses((prev) => [...prev, newCourse]);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData(defaultForm);
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData({
      title: course.title,
      ageRange: course.ageRange,
      shortDescription: course.shortDescription,
      price: String(course.price),
      status: course.status,
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-alivos-dark">Gestión de cursos</h1>
          <p className="text-slate-500 text-sm mt-1">{localCourses.length} cursos en la plataforma</p>
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

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-alivos-dark text-lg">
                {editingId ? "Editar curso" : "Crear nuevo curso"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Precio (ARS) *</label>
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
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="hidden">Oculto</option>
                </select>
              </div>
              <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-sm text-slate-400 cursor-pointer hover:border-brand-300 hover:text-brand-500 transition-colors">
                <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Subir imagen del curso (PNG, JPG)
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {editingId ? "Guardar cambios" : "Crear curso"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
              {localCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                        👶
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-alivos-dark truncate">{course.title}</p>
                        <p className="text-xs text-slate-400 sm:hidden">{course.ageRange}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 hidden sm:table-cell">{course.ageRange}</td>
                  <td className="px-5 py-4 font-semibold text-alivos-dark hidden md:table-cell">
                    ${course.price.toLocaleString("es-AR")}
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
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Ver"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Desactivar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
