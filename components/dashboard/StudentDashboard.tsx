"use client";

import { courses, purchases, taskSubmissions } from "@/lib/mockData";

interface StudentDashboardProps {
  onOpenCourse: (courseId: string) => void;
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  delivered: "bg-brand-100 text-brand-700",
  reviewed: "bg-green-100 text-green-700",
  needs_correction: "bg-red-100 text-red-700",
};
const statusLabel: Record<string, string> = {
  pending: "Pendiente",
  delivered: "Entregada",
  reviewed: "Revisada",
  needs_correction: "Requiere corrección",
};

export default function StudentDashboard({ onOpenCourse }: StudentDashboardProps) {
  const enrolledCourses = courses.filter((c) => c.enrolled);
  const myPurchases = purchases.slice(0, 3);
  const myTasks = taskSubmissions.slice(0, 3);

  return (
    <div className="min-h-screen bg-alivos-bg animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-lg">
              MG
            </div>
            <div>
              <h1 className="text-2xl font-bold text-alivos-dark">¡Hola, María!</h1>
              <p className="text-slate-500 text-sm">Bienvenida de nuevo a tu plataforma de aprendizaje.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Cursos activos", value: enrolledCourses.length, icon: "📚", color: "bg-blue-50 text-blue-600" },
            { label: "Lecciones completadas", value: "12", icon: "✅", color: "bg-green-50 text-green-600" },
            { label: "Tareas pendientes", value: "2", icon: "📝", color: "bg-yellow-50 text-yellow-600" },
            { label: "Progreso promedio", value: "33%", icon: "📊", color: "bg-purple-50 text-purple-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-black text-alivos-dark mb-0.5">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Enrolled courses */}
        <div>
          <h2 className="text-xl font-bold text-alivos-dark mb-4">Mis cursos</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {enrolledCourses.map((course) => {
              const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              const completedLessons = course.modules.reduce(
                (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
                0
              );
              return (
                <div key={course.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      👶
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-brand-600 mb-0.5">{course.ageRange}</p>
                      <h3 className="font-bold text-alivos-dark truncate">{course.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {completedLessons} / {totalLessons} lecciones completadas
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>Progreso</span>
                      <span className="font-semibold text-brand-600">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <button
                      onClick={() => onOpenCourse(course.id)}
                      className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.progress > 0 ? "Continuar" : "Comenzar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <h2 className="text-xl font-bold text-alivos-dark mb-4">Mis tareas</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {myTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No tenés tareas por ahora.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {myTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-alivos-dark truncate">{task.lessonTitle}</p>
                      <p className="text-xs text-slate-500">{task.courseTitle}</p>
                    </div>
                    <div className="text-xs text-slate-400 shrink-0">{task.deliveredAt}</div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[task.status]}`}>
                      {statusLabel[task.status]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent purchases */}
        <div>
          <h2 className="text-xl font-bold text-alivos-dark mb-4">Mis compras recientes</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-50">
              {myPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-alivos-dark truncate">{purchase.courseTitle}</p>
                    <p className="text-xs text-slate-500">{purchase.date} · {purchase.method}</p>
                  </div>
                  <span className="shrink-0 font-bold text-alivos-dark">
                    ${purchase.amount.toLocaleString("es-AR")}
                  </span>
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      purchase.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : purchase.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {purchase.status === "paid" ? "Pagado" : purchase.status === "pending" ? "Pendiente" : "Fallido"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
