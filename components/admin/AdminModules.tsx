"use client";

import { useEffect, useRef, useState } from "react";
import { Upload as TusUpload } from "tus-js-client";
import * as adminApi from "@/lib/api/admin";
import { createVimeoUploadTicket, resolveVimeoUrl } from "@/lib/api/courses";
import { Course, Lesson, LessonType } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { alivosAssets, getModuleAssetsByOrder } from "@/lib/assets/alivosAssets";
import Modal from "@/components/ui/Modal";

interface LessonForm {
  title: string;
  type: LessonType;
  duration: string;
  vimeoUrl: string;
  description: string;
  hasTask: boolean;
  taskDescription: string;
  hasMaterial: boolean;
  materialUrl: string;
  imageUrl: string;
  pdfUrl: string;
  assetType: string;
  visible: boolean;
}

const defaultLessonForm: LessonForm = {
  title: "",
  type: "VIDEO",
  duration: "",
  vimeoUrl: "",
  description: "",
  hasTask: false,
  taskDescription: "",
  hasMaterial: false,
  materialUrl: "",
  imageUrl: "",
  pdfUrl: "",
  assetType: "",
  visible: true,
};

const typeOptions: { value: LessonType; label: string }[] = [
  { value: "VIDEO", label: "Video" },
  { value: "TEXT", label: "Texto" },
  { value: "PDF", label: "PDF" },
  { value: "TASK", label: "Tarea" },
  { value: "EVALUATION", label: "Evaluación" },
];

export default function AdminModules() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState<LessonForm>(defaultLessonForm);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [vimeoResolving, setVimeoResolving] = useState(false);
  const [vimeoPreview, setVimeoPreview] = useState<{ thumbnailUrl: string | null; title: string | null } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const load = () => {
    setLoading(true);
    adminApi
      .listAdminCourses()
      .then(({ courses }) => {
        setCourses(courses);
        setSelectedCourseId((prev) => prev || courses[0]?.id || "");
        setExpandedModules(new Set(courses[0]?.modules.map((m) => m.id) ?? []));
      })
      .catch(() => setError("No se pudieron cargar los cursos."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const activeModuleOrder = activeModuleId
    ? (selectedCourse?.modules.findIndex((m) => m.id === activeModuleId) ?? -1) + 1
    : 0;

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const openAddLesson = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setEditingLessonId(null);
    setLessonForm(defaultLessonForm);
    setVimeoPreview(null);
    setShowLessonForm(true);
  };

  const openEditLesson = (moduleId: string, lesson: Lesson) => {
    setActiveModuleId(moduleId);
    setEditingLessonId(lesson.id);
    setLessonForm({
      title: lesson.title,
      type: lesson.type,
      duration: String(lesson.durationMinutes ?? ""),
      vimeoUrl: lesson.vimeoUrl ?? "",
      description: lesson.description ?? "",
      hasTask: lesson.hasTask,
      taskDescription: lesson.taskDescription ?? "",
      hasMaterial: lesson.hasMaterial,
      materialUrl: lesson.materialUrl ?? "",
      imageUrl: lesson.imageUrl ?? "",
      pdfUrl: lesson.pdfUrl ?? "",
      assetType: lesson.assetType ?? "",
      visible: lesson.visible,
    });
    setVimeoPreview(
      lesson.vimeoThumbnail ? { thumbnailUrl: lesson.vimeoThumbnail, title: lesson.title } : null
    );
    setShowLessonForm(true);
  };

  const handleAddModule = async () => {
    if (!selectedCourseId || !newModuleTitle.trim()) return;
    try {
      await adminApi.createModule(selectedCourseId, { title: newModuleTitle.trim() });
      setShowAddModule(false);
      setNewModuleTitle("");
      load();
    } catch {
      setError("No se pudo crear el módulo.");
    }
  };

  const handleResolveVimeo = async () => {
    if (!lessonForm.vimeoUrl) return;
    setVimeoResolving(true);
    try {
      const resolved = await resolveVimeoUrl(lessonForm.vimeoUrl);
      setVimeoPreview({ thumbnailUrl: resolved.thumbnailUrl, title: resolved.title });
      setLessonForm((prev) => ({
        ...prev,
        duration: resolved.duration ? String(resolved.duration) : prev.duration,
        title: prev.title || resolved.title || prev.title,
      }));
    } catch {
      setError("No se pudo resolver el video de Vimeo. Verifica el enlace.");
    } finally {
      setVimeoResolving(false);
    }
  };

  const handleUploadVideo = async (file: File) => {
    setError(null);
    setUploading(true);
    setUploadProgress(0);
    try {
      const ticket = await createVimeoUploadTicket(file.name, file.size);
      await new Promise<void>((resolve, reject) => {
        const upload = new TusUpload(file, {
          uploadUrl: ticket.uploadLink,
          retryDelays: [0, 1000, 3000, 5000],
          onError: reject,
          onProgress: (bytesUploaded, bytesTotal) => {
            setUploadProgress(Math.round((bytesUploaded / bytesTotal) * 100));
          },
          onSuccess: () => resolve(),
        });
        upload.start();
      });

      setLessonForm((prev) => ({ ...prev, vimeoUrl: ticket.vimeoUrl }));
      setVimeoPreview({ thumbnailUrl: null, title: file.name });

      // Vimeo tarda unos momentos en procesar el video, así que la miniatura
      // real puede no estar lista todavía — este resolve es best-effort.
      try {
        const resolved = await resolveVimeoUrl(ticket.vimeoUrl);
        setVimeoPreview({ thumbnailUrl: resolved.thumbnailUrl, title: resolved.title ?? file.name });
        setLessonForm((prev) => ({
          ...prev,
          title: prev.title || resolved.title || prev.title,
        }));
      } catch {
        // Ignorable: el video ya quedó vinculado, solo falta refrescar metadata más tarde.
      }
    } catch {
      setError("No se pudo subir el video a Vimeo. Intenta de nuevo.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveLesson = async () => {
    if (!activeModuleId) return;
    setSaving(true);
    setError(null);
    try {
      const input = {
        title: lessonForm.title,
        type: lessonForm.type,
        durationMinutes: lessonForm.duration ? Number(lessonForm.duration) : undefined,
        vimeoUrl: lessonForm.vimeoUrl || undefined,
        description: lessonForm.description || undefined,
        hasMaterial: lessonForm.hasMaterial,
        materialUrl: lessonForm.materialUrl || undefined,
        hasTask: lessonForm.hasTask,
        taskDescription: lessonForm.hasTask ? lessonForm.taskDescription : undefined,
        imageUrl: lessonForm.imageUrl || undefined,
        pdfUrl: lessonForm.pdfUrl || undefined,
        assetType: lessonForm.assetType || undefined,
        visible: lessonForm.visible,
      };
      if (editingLessonId) {
        await adminApi.updateLesson(editingLessonId, input);
      } else {
        await adminApi.createLesson(activeModuleId, input);
      }
      setShowLessonForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar la lección.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("¿Eliminar esta lección? Esta acción no se puede deshacer.")) return;
    try {
      await adminApi.deleteLesson(lessonId);
      load();
    } catch {
      setError("No se pudo eliminar la lección.");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("¿Eliminar este módulo y todas sus lecciones?")) return;
    try {
      await adminApi.deleteModule(moduleId);
      load();
    } catch {
      setError("No se pudo eliminar el módulo.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Cargando módulos...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Módulos y Lecciones</h1>
        <p className="text-slate-500 text-sm mt-1">Administra el contenido de cada curso</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

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
        <Modal
          title={editingLessonId ? "Editar lección" : "Agregar lección"}
          onClose={() => setShowLessonForm(false)}
          maxWidth="max-w-lg"
          footer={
            <>
              <button onClick={() => setShowLessonForm(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSaveLesson}
                disabled={saving || uploading || !lessonForm.title}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {saving ? "Guardando..." : "Guardar lección"}
              </button>
            </>
          }
        >
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
              {lessonForm.type === "VIDEO" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Subir un video nuevo</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadVideo(file);
                      }}
                      className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-50 file:text-brand-700 file:text-xs file:font-semibold hover:file:bg-brand-100 disabled:opacity-50"
                    />
                    {uploading && (
                      <div className="mt-2">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-brand-600 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress ?? 0}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Subiendo a Vimeo... {uploadProgress ?? 0}%</p>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      La miniatura puede tardar unos minutos en generarse; puedes editar la lección más tarde para actualizarla.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">O pegar un link de Vimeo existente</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={lessonForm.vimeoUrl}
                        onChange={(e) => setLessonForm({ ...lessonForm, vimeoUrl: e.target.value })}
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                        placeholder="https://vimeo.com/..."
                      />
                      <button
                        type="button"
                        onClick={handleResolveVimeo}
                        disabled={!lessonForm.vimeoUrl || vimeoResolving || uploading}
                        className="px-4 py-2.5 bg-alivos-dark hover:bg-brand-900 disabled:opacity-50 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-colors"
                      >
                        {vimeoResolving ? "Resolviendo..." : "Obtener datos"}
                      </button>
                    </div>
                    {vimeoPreview && (
                      <div className="mt-3 flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                        {vimeoPreview.thumbnailUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={vimeoPreview.thumbnailUrl} alt="" className="w-20 h-12 object-cover rounded-lg" />
                        )}
                        <p className="text-xs text-slate-600">{vimeoPreview.title || "Metadata obtenida"}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {lessonForm.type === "PDF" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">URL del material (PDF)</label>
                  <input
                    type="url"
                    value={lessonForm.materialUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, materialUrl: e.target.value, hasMaterial: true })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    placeholder="https://..."
                  />
                </div>
              )}

              {/* Real ALIVOS assets — quick pick for "Descubriendo su cuerpo" */}
              {selectedCourse?.slug === alivosAssets.courseDescubriendoSuCuerpo.slug &&
                activeModuleOrder && (
                  <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl">
                    <p className="text-xs font-semibold text-alivos-dark mb-2">
                      Assets reales del Módulo {activeModuleOrder} (clic para asociar)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const assets = getModuleAssetsByOrder(activeModuleOrder);
                        if (!assets) return null;
                        const picks: { label: string; imageUrl?: string; pdfUrl?: string; assetType: string }[] = [
                          { label: "Portada", imageUrl: assets.cover, assetType: "cover" },
                          { label: "Objetivos", imageUrl: assets.objectives, assetType: "objectives" },
                          { label: "Materiales", imageUrl: assets.materials, assetType: "materials" },
                          { label: "Contenido extra", imageUrl: assets.extra, assetType: "extra" },
                          { label: "FAQ", imageUrl: assets.faq, assetType: "faq" },
                          { label: "Actividades (PDF)", pdfUrl: assets.activitiesPdf, assetType: "activities" },
                          { label: "Evaluación (PDF)", pdfUrl: assets.evaluationPdf, assetType: "evaluation" },
                        ];
                        return picks.map((pick) => (
                          <button
                            key={pick.label}
                            type="button"
                            onClick={() =>
                              setLessonForm((prev) => ({
                                ...prev,
                                imageUrl: pick.imageUrl ?? prev.imageUrl,
                                pdfUrl: pick.pdfUrl ?? prev.pdfUrl,
                                hasMaterial: pick.pdfUrl ? true : prev.hasMaterial,
                                materialUrl: pick.pdfUrl ?? prev.materialUrl,
                                assetType: pick.assetType,
                              }))
                            }
                            className="px-2.5 py-1 bg-white border border-brand-200 rounded-lg text-xs font-medium text-brand-700 hover:bg-brand-100 transition-colors"
                          >
                            {pick.label}
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Imagen ilustrativa (URL)</label>
                  <input
                    type="text"
                    value={lessonForm.imageUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, imageUrl: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    placeholder="/alivos-assets/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">PDF asociado (URL)</label>
                  <input
                    type="text"
                    value={lessonForm.pdfUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, pdfUrl: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    placeholder="/alivos-assets/....pdf"
                  />
                </div>
              </div>
              {lessonForm.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={lessonForm.imageUrl} alt="" className="w-full h-32 object-cover" />
                </div>
              )}
              {lessonForm.pdfUrl && (
                <a
                  href={lessonForm.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Ver PDF asociado
                </a>
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
        </Modal>
      )}

      {/* Add module form */}
      {showAddModule && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-brand-200">
          <h3 className="font-semibold text-alivos-dark mb-3">Nuevo módulo</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="Título del módulo"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddModule}
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
                {module.coverImage && (
                  <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={module.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-alivos-dark">
                    Módulo {moduleIndex + 1}: {module.title}
                  </h3>
                  <p className="text-xs text-slate-500">{module.lessons.length} lecciones</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDeleteModule(module.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar módulo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          lesson.type === "VIDEO" ? "bg-blue-100 text-blue-700" :
                          lesson.type === "PDF" ? "bg-red-100 text-red-700" :
                          lesson.type === "TASK" ? "bg-orange-100 text-orange-700" :
                          lesson.type === "EVALUATION" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {lesson.type === "VIDEO" ? "VID" :
                           lesson.type === "PDF" ? "PDF" :
                           lesson.type === "TASK" ? "TAR" :
                           lesson.type === "EVALUATION" ? "EVAL" : "TXT"}
                        </span>
                        <span className="text-sm font-medium text-alivos-dark truncate">{lesson.title}</span>
                        {lesson.vimeoEmbedUrl && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full shrink-0 hidden sm:inline">Vimeo</span>
                        )}
                        {lesson.hasTask && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full shrink-0">Tarea</span>
                        )}
                        {!lesson.visible && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full shrink-0">Oculta</span>
                        )}
                      </div>
                      {lesson.durationMinutes && (
                        <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{lesson.durationMinutes}min</span>
                      )}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openEditLesson(module.id, lesson)}
                          className="p-1 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                          title="Editar"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar"
                        >
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

      {!selectedCourse && !loading && (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-sm border border-slate-100">
          Crea un curso primero para poder agregar módulos y lecciones.
        </div>
      )}
    </div>
  );
}
