"use client";

import { useState } from "react";
import { students, courses, purchases, taskSubmissions } from "@/lib/mockData";

export default function AdminStudents() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-alivos-dark">Alumnos</h1>
          <p className="text-slate-500 text-sm mt-1">{students.length} alumnos registrados</p>
        </div>
      </div>

      {/* Profile modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-alivos-dark">Perfil del alumno</h2>
              <button
                onClick={() => setSelectedStudentId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-black text-xl">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-alivos-dark">{selectedStudent.name}</h3>
                  <p className="text-sm text-slate-500">{selectedStudent.email}</p>
                  <p className="text-sm text-slate-500">{selectedStudent.phone}</p>
                </div>
                <span
                  className={`ml-auto px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedStudent.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedStudent.status === "active" ? "Activo" : "Bloqueado"}
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-alivos-dark mb-3 text-sm">Cursos activos</h4>
                <div className="space-y-2">
                  {selectedStudent.courses.map((courseId) => {
                    const course = courses.find((c) => c.id === courseId);
                    if (!course) return null;
                    return (
                      <div key={courseId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-100 shrink-0">
                          {course.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
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
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-alivos-dark mb-3 text-sm">Compras</h4>
                <div className="space-y-2">
                  {purchases
                    .filter((p) => p.studentEmail === selectedStudent.email)
                    .map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-alivos-dark">{p.courseTitle}</p>
                          <p className="text-xs text-slate-500">{p.date}</p>
                        </div>
                        <span className="text-sm font-bold">${p.amount.toLocaleString("es-MX")}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          p.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {p.status === "paid" ? "Pagado" : "Pendiente"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-alivos-dark mb-3 text-sm">Tareas</h4>
                <div className="space-y-2">
                  {taskSubmissions
                    .filter((t) => t.studentName === selectedStudent.name)
                    .map((t) => (
                      <div key={t.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-alivos-dark">{t.lessonTitle}</p>
                          <p className="text-xs text-slate-500">{t.courseTitle}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          t.status === "reviewed" ? "bg-green-100 text-green-700" :
                          t.status === "needs_correction" ? "bg-red-100 text-red-700" :
                          t.status === "delivered" ? "bg-brand-100 text-brand-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {t.status === "reviewed" ? "Revisada" :
                           t.status === "needs_correction" ? "Corrección" :
                           t.status === "delivered" ? "Entregada" : "Pendiente"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                  {selectedStudent.status === "active" ? "Bloquear alumno" : "Reactivar alumno"}
                </button>
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
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

      {/* Mobile cards (visible on small screens) */}
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
                student.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {student.status === "active" ? "Activo" : "Bloqueado"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
              <span>{student.courses.length} curso{student.courses.length !== 1 ? "s" : ""}</span>
              <span>Progreso: {student.avgProgress}%</span>
              <span>Último acceso: {student.lastAccess}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: `${student.avgProgress}%` }} />
            </div>
            <button
              onClick={() => setSelectedStudentId(student.id)}
              className="w-full py-2 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors border border-brand-100"
            >
              Ver perfil completo
            </button>
          </div>
        ))}
      </div>

      {/* Desktop table (hidden on small screens) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumno</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Teléfono</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Cursos</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Progreso</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Último acceso</th>
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
                  <td className="px-5 py-4 text-slate-600 text-sm hidden lg:table-cell">{student.phone}</td>
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
                  <td className="px-5 py-4 text-slate-500 text-xs hidden xl:table-cell">{student.lastAccess}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      student.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {student.status === "active" ? "Activo" : "Bloqueado"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedStudentId(student.id)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Ver perfil
                    </button>
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
