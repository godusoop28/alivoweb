"use client";

import { useState } from "react";
import { courses, type Lesson } from "@/lib/mockData";

type LessonType = Lesson["type"];

interface LessonForm {
  title: string;
  type: LessonType;
  duration: string;
  vimeoUrl: string;
  description: string;
  hasTask: boolean;
  taskDescription: string;
  hasMaterial: boolean;
  visible: boolean;
}

const defaultLessonForm: LessonForm = {
  title: "",
  type: "video",
  duration: "",
  vimeoUrl: "",
  description: "",
  hasTask: false,
  taskDescription: "",
  hasMaterial: false,
  visible: true,
};

const typeOptions: { value: LessonType; label: string }[] = [
  { value: "video", label: "📹 Video" },
  { value: "text", label: "📄 Texto" },
  { value: "pdf", label: "📎 PDF" },
  { value: "task", label: "✏️ Tarea" },
  { value: "evaluation", label: "🏆 Evaluación" },
];

export default function AdminModules() {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [showAddModule, setShowAddModule] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [lessonForm, setLessonForm] = useState<LessonForm>(defaultLessonForm);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(["mod-intro", "mod-fases"]));

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const openAddLesson = (_moduleId: string) => {
    setEditingLessonId(null);
    setLessonForm(defaultLessonForm);
    setShowLessonForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Módulos y Lecciones</h1>
        <p className="text-slate-500 text-sm mt-1">Administrá el contenido de cada curso</p>
      </div>

      {/* Course selector */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Seleccionar curso</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full sm:w-auto border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white font-medium"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} ({c.ageRange})
            </option>
          ))}
        </select>
      </div>

      {/* Lesson form modal */}
      {showLessonForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-alivos-dark">
                {editingLessonId ? "Editar lección" : "Agregar lección"}
              </h2>
              <button onClick={() => setShowLessonForm(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Título *</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                  placeholder="Título de la lección"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo</label>
                  <select
                    value={lessonForm.type}
                    onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as LessonType })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
                  >
                    {typeOptions.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Duración (min)</label>
                  <input
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    placeholder="15"
                  />
                </div>
              </div>
              {lessonForm.type === "video" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Link de Vimeo</label>
                  <input
                    type="url"
                    value={lessonForm.vimeoUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, vimeoUrl: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    placeholder="https://vimeo.com/..."
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                  placeholder="Descripción de la lección..."
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lessonForm.hasMaterial}
                    onChange={(e) => setLessonForm({ ...lessonForm, hasMaterial: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
                  />
                  <span className="text-sm text-slate-700">Tiene material descargable</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lessonForm.hasTask}
                    onChange={(e) => setLessonForm({ ...lessonForm, hasTask: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
                  />
                  <span className="text-sm text-slate-700">Tiene tarea</span>
                </label>
                {lessonForm.hasTask && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Instrucciones de la tarea</label>
                    <textarea
                      value={lessonForm.taskDescription}
                      onChange={(e) => setLessonForm({ ...lessonForm, taskDescription: e.target.value })}
                      rows={2}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                      placeholder="¿Qué debe hacer el alumno?"
                    />
                  </div>
                )}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lessonForm.visible}
                    onChange={(e) => setLessonForm({ ...lessonForm, visible: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
                  />
                  <span className="text-sm text-slate-700">Visible para alumnos</span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button onClick={() => setShowLessonForm(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button onClick={() => setShowLessonForm(false)} className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors">
                Guardar lección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add module form */}
      {showAddModule && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-brand-200">
          <h3 className="font-semibold text-alivos-dark mb-3">Nuevo módulo</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="Título del módulo"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button
              onClick={() => { setShowAddModule(false); setNewModuleTitle(""); }}
              className="px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              Guardar
            </button>
            <button
              onClick={() => { setShowAddModule(false); setNewModuleTitle(""); }}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modules tree */}
      {selectedCourse && (
        <div className="space-y-3">
          {selectedCourse.modules.map((module, moduleIndex) => (
            <div key={module.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Module header */}
              <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border-b border-slate-100">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedModules.has(module.id) ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-alivos-dark">
                    Módulo {moduleIndex + 1}: {module.title}
                  </h3>
                  <p className="text-xs text-slate-500">{module.lessons.length} lecciones</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Mover arriba">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Mover abajo">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Ocultar">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openAddLesson(module.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Lección
                  </button>
                </div>
              </div>

              {/* Lessons */}
              {expandedModules.has(module.id) && (
                <div className="divide-y divide-slate-50">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                      <div className="text-xs text-slate-400 w-5 text-center">{lessonIndex + 1}</div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-slate-400">
                          {lesson.type === "video" ? "📹" :
                           lesson.type === "pdf" ? "📎" :
                           lesson.type === "task" ? "✏️" :
                           lesson.type === "evaluation" ? "🏆" : "📄"}
                        </span>
                        <span className="text-sm font-medium text-alivos-dark truncate">{lesson.title}</span>
                        {lesson.hasTask && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full shrink-0">Tarea</span>
                        )}
                        {lesson.hasMaterial && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full shrink-0 hidden sm:inline">PDF</span>
                        )}
                        {!lesson.visible && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full shrink-0">Oculta</span>
                        )}
                      </div>
                      {lesson.duration && (
                        <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{lesson.duration}min</span>
                      )}
                      <div className="flex items-center gap-1 shrink-0">
                        <button className="p-1 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors" title="Arriba">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button className="p-1 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors" title="Abajo">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setEditingLessonId(lesson.id);
                            setLessonForm({
                              title: lesson.title,
                              type: lesson.type,
                              duration: String(lesson.duration || ""),
                              vimeoUrl: lesson.vimeoUrl || "",
                              description: lesson.description || "",
                              hasTask: lesson.hasTask,
                              taskDescription: lesson.taskDescription || "",
                              hasMaterial: lesson.hasMaterial,
                              visible: lesson.visible,
                            });
                            setShowLessonForm(true);
                          }}
                          className="p-1 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                          title="Editar"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="px-5 py-3">
                    <button
                      onClick={() => openAddLesson(module.id)}
                      className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Agregar lección a este módulo
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add module button */}
          <button
            onClick={() => setShowAddModule(true)}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 hover:border-brand-300 hover:text-brand-600 text-slate-400 rounded-2xl transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar nuevo módulo
          </button>
        </div>
      )}
    </div>
  );
}
