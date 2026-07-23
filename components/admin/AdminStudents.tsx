"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { Student, StudentDetail } from "@/lib/api/types";
import Modal from "@/components/ui/Modal";

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    adminApi
      .listStudents()
      .then(({ students }) => setStudents(students))
      .catch(() => setError("No se pudieron cargar los alumnos."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openProfile = async (id: string) => {
    setDetailLoading(true);
    try {
      const { student } = await adminApi.getStudent(id);
      setSelectedStudent(student);
    } catch {
      setError("No se pudo cargar el perfil del alumno.");
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!selectedStudent) return;
    const nextStatus = selectedStudent.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    try {
      await adminApi.setStudentStatus(selectedStudent.id, nextStatus);
      setSelectedStudent({ ...selectedStudent, status: nextStatus });
      setStudents((prev) =>
        prev.map((s) => (s.id === selectedStudent.id ? { ...s, status: nextStatus } : s))
      );
    } catch {
      setError("No se pudo actualizar el estado del alumno.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-alivos-dark">Alumnos</h1>
          <p className="text-slate-500 text-sm mt-1">{students.length} alumnos registrados</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {/* Profile modal */}
      {(selectedStudent || detailLoading) && (
        <Modal
          title="Perfil del alumno"
          onClose={() => setSelectedStudent(null)}
          maxWidth="max-w-xl"
        >
            {detailLoading || !selectedStudent ? (
              <div className="py-10 text-center text-slate-400 text-sm">Cargando perfil...</div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-black text-xl">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-alivos-dark">{selectedStudent.name}</h3>
                    <p className="text-sm text-slate-500">{selectedStudent.email}</p>
                    <p className="text-sm text-slate-500">{selectedStudent.phone || "Sin teléfono"}</p>
                  </div>
                  <span
                    className={`ml-auto px-2.5 py-1 rounded-full text-xs font-bold ${
                      selectedStudent.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedStudent.status === "ACTIVE" ? "Activo" : "Bloqueado"}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-alivos-dark mb-3 text-sm">Cursos</h4>
                  <div className="space-y-2">
                    {selectedStudent.courses.length === 0 && (
                      <p className="text-sm text-slate-400">Sin cursos activos.</p>
                    )}
                    {selectedStudent.courses.map((course) => (
                      <div key={course.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-100 shrink-0">
                          {course.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-alivos-dark">{course.title}</p>
                          <p className="text-xs text-slate-500">{course.ageRange}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-brand-600">{course.progress}%</p>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${course.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-alivos-dark mb-3 text-sm">Compras</h4>
                  <div className="space-y-2">
                    {selectedStudent.purchases.length === 0 && (
                      <p className="text-sm text-slate-400">Sin compras registradas.</p>
                    )}
                    {selectedStudent.purchases.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-alivos-dark">{p.courseTitle}</p>
                          <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString("es-MX")}</p>
                        </div>
                        <span className="text-sm font-bold">${p.amount.toLocaleString("es-MX")}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          p.status === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {p.status === "PAID" ? "Pagado" : "Pendiente"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-alivos-dark mb-3 text-sm">Tareas</h4>
                  <div className="space-y-2">
                    {selectedStudent.tasks.length === 0 && (
                      <p className="text-sm text-slate-400">Sin tareas entregadas.</p>
                    )}
                    {selectedStudent.tasks.map((t) => (
                      <div key={t.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-alivos-dark">{t.lessonTitle}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          t.status === "REVIEWED" || t.status === "APPROVED" ? "bg-green-100 text-green-700" :
                          t.status === "NEEDS_CORRECTION" ? "bg-red-100 text-red-700" :
                          t.status === "DELIVERED" ? "bg-brand-100 text-brand-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {t.status === "REVIEWED" ? "Revisada" : t.status === "APPROVED" ? "Aprobada" :
                           t.status === "NEEDS_CORRECTION" ? "Corrección" :
                           t.status === "DELIVERED" ? "Entregada" : "Pendiente"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={toggleStatus}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    {selectedStudent.status === "ACTIVE" ? "Bloquear alumno" : "Reactivar alumno"}
                  </button>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
        </Modal>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-sm border border-slate-100">
          Cargando alumnos...
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((student) => (
              <div key={student.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-sm font-bold shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-alivos-dark text-sm">{student.name}</p>
                    <p className="text-xs text-slate-500 truncate">{student.email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                    student.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {student.status === "ACTIVE" ? "Activo" : "Bloqueado"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>{student.courses.length} curso{student.courses.length !== 1 ? "s" : ""}</span>
                  <span>Progreso: {student.avgProgress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${student.avgProgress}%` }} />
                </div>
                <button
                  onClick={() => openProfile(student.id)}
                  className="w-full py-2 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors border border-brand-100"
                >
                  Ver perfil completo
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-sm border border-slate-100">
                No se encontraron alumnos.
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumno</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Teléfono</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Cursos</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Progreso</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                    <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-alivos-dark">{student.name}</p>
                            <p className="text-xs text-slate-500 truncate">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-sm hidden lg:table-cell">{student.phone || "—"}</td>
                      <td className="px-5 py-4">
                        <span className="text-slate-600 text-sm">{student.courses.length} curso{student.courses.length !== 1 ? "s" : ""}</span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${student.avgProgress}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{student.avgProgress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          student.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {student.status === "ACTIVE" ? "Activo" : "Bloqueado"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => openProfile(student.id)}
                          className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Ver perfil
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">
                        No se encontraron alumnos.
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
