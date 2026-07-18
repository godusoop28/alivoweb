"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { TaskStatus, TaskSubmission } from "@/lib/api/types";

const statusLabel: Record<TaskStatus, string> = {
  PENDING: "Pendiente",
  DELIVERED: "Entregada",
  REVIEWED: "Revisada",
  APPROVED: "Aprobada",
  NEEDS_CORRECTION: "Requiere corrección",
};
const statusColor: Record<TaskStatus, string> = {
  PENDING: "bg-slate-100 text-slate-600",
  DELIVERED: "bg-blue-100 text-blue-700",
  REVIEWED: "bg-green-100 text-green-700",
  APPROVED: "bg-green-100 text-green-700",
  NEEDS_CORRECTION: "bg-red-100 text-red-700",
};

export default function AdminTasks() {
  const [tasks, setTasks] = useState<TaskSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskSubmission | null>(null);
  const [adminComment, setAdminComment] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .listTasks()
      .then(({ tasks }) => setTasks(tasks))
      .catch(() => setError("No se pudieron cargar las tareas."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const review = async (status: "APPROVED" | "NEEDS_CORRECTION") => {
    if (!selectedTask) return;
    setSaving(true);
    try {
      await adminApi.reviewTask(selectedTask.id, { status, adminComment });
      setSelectedTask(null);
      setAdminComment("");
      load();
    } catch {
      setError("No se pudo guardar la revisión.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Tareas de alumnos</h1>
        <p className="text-slate-500 text-sm mt-1">
          {tasks.filter((t) => t.status === "DELIVERED").length} tareas para revisar
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {/* Review modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="font-bold text-alivos-dark">Revisar tarea</h2>
              <button
                onClick={() => { setSelectedTask(null); setAdminComment(""); }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Alumno</p>
                  <p className="font-semibold text-alivos-dark">{selectedTask.studentName}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Lección</p>
                  <p className="font-semibold text-alivos-dark">{selectedTask.lessonTitle}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-alivos-dark mb-2">Instrucciones de la tarea</p>
                <div className="p-4 bg-brand-50 border border-brand-100 rounded-xl">
                  <p className="text-sm text-slate-700">{selectedTask.taskInstructions ?? "Sin instrucciones."}</p>
                </div>
                {selectedTask.lessonPdfUrl && (
                  <a
                    href={selectedTask.lessonPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Ver guía de actividades (PDF)
                  </a>
                )}
              </div>

              {selectedTask.studentAnswer ? (
                <div>
                  <p className="text-sm font-semibold text-alivos-dark mb-2">Respuesta del alumno</p>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedTask.studentAnswer}</p>
                  </div>
                  {selectedTask.fileUrl && (
                    <a
                      href={selectedTask.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-alivos-dark">Archivo adjunto</p>
                      </div>
                      <span className="text-xs text-brand-600 font-medium">Ver</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                  El alumno aún no ha entregado esta tarea.
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-alivos-dark mb-2">
                  Comentario del administrador
                </label>
                <textarea
                  rows={4}
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                  placeholder="Escribe tu feedback para el alumno..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => review("NEEDS_CORRECTION")}
                disabled={saving}
                className="flex-1 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 rounded-xl text-sm font-semibold transition-colors"
              >
                Pedir corrección
              </button>
              <button
                onClick={() => review("APPROVED")}
                disabled={saving}
                className="flex-1 py-2.5 bg-success-600 hover:bg-success-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Aprobar tarea
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Cargando tareas...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumno</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Lección</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Curso</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Fecha</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-xs font-bold shrink-0">
                          {task.studentName.charAt(0)}
                        </div>
                        <p className="font-medium text-alivos-dark">{task.studentName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 hidden sm:table-cell">
                      <p className="truncate max-w-xs">{task.lessonTitle}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden md:table-cell">
                      <p className="truncate max-w-xs">{task.courseTitle}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden lg:table-cell">
                      {new Date(task.deliveredAt).toLocaleDateString("es-MX")}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[task.status]}`}>
                        {statusLabel[task.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => { setSelectedTask(task); setAdminComment(task.adminComment ?? ""); }}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Revisar
                      </button>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">
                      No hay tareas registradas todavía.
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
