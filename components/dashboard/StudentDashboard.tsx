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

const statIcons = {
  courses: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  lessons: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  tasks: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  progress: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

export default function StudentDashboard({ onOpenCourse }: StudentDashboardProps) {
  const enrolledCourses = courses.filter((c) => c.enrolled);
  const myPurchases = purchases.slice(0, 3);
  const myTasks = taskSubmissions.slice(0, 3);

  const totalCompleted = enrolledCourses.reduce((acc, c) =>
    acc + c.modules.reduce((ma, m) => ma + m.lessons.filter((l) => l.completed).length, 0), 0
  );
  const avgProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / enrolledCourses.length)
    : 0;

  const stats = [
    { label: "Cursos activos", value: enrolledCourses.length, icon: statIcons.courses, color: "bg-blue-50 text-blue-600" },
    { label: "Lecciones completadas", value: totalCompleted, icon: statIcons.lessons, color: "bg-green-50 text-green-600" },
    { label: "Tareas pendientes", value: myTasks.filter((t) => t.status === "pending").length, icon: statIcons.tasks, color: "bg-yellow-50 text-yellow-600" },
    { label: "Progreso promedio", value: `${avgProgress}%`, icon: statIcons.progress, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-alivos-bg animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
              MG
            </div>
            <div>
              <h1 className="text-2xl font-bold text-alivos-dark">¡Hola, María!</h1>
              <p className="text-slate-500 text-sm mt-0.5">Bienvenida de nuevo a tu plataforma de aprendizaje.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-black text-alivos-dark mb-0.5">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Continue where you left off */}
        {enrolledCourses.some((c) => c.progress > 0 && c.progress < 100) && (
          <div>
            <h2 className="text-lg font-bold text-alivos-dark mb-4">Continúa donde te quedaste</h2>
            {enrolledCourses
              .filter((c) => c.progress > 0 && c.progress < 100)
              .slice(0, 1)
              .map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="h-40 sm:h-auto sm:w-56 bg-gradient-to-br from-brand-100 to-brand-200 shrink-0 relative overflow-hidden">
                      {course.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      )}
                    </div>
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1">
                          {course.ageRange}
                        </p>
                        <h3 className="text-lg font-bold text-alivos-dark mb-2">{course.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{course.shortDescription}</p>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                          <span>Progreso</span>
                          <span className="font-semibold text-brand-600">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${course.progress}%` }} />
                        </div>
                        <button
                          onClick={() => onOpenCourse(course.id)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Continuar lección
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Enrolled courses */}
        <div>
          <h2 className="text-lg font-bold text-alivos-dark mb-4">Mis cursos</h2>
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
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-200 shrink-0 relative">
                      {course.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-brand-600 mb-0.5">{course.ageRange}</p>
                      <h3 className="font-bold text-alivos-dark truncate text-sm">{course.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
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
          <h2 className="text-lg font-bold text-alivos-dark mb-4">Mis tareas</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {myTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No tienes tareas por ahora.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {myTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-alivos-dark truncate">{task.lessonTitle}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{task.courseTitle}</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{task.deliveredAt}</span>
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
          <h2 className="text-lg font-bold text-alivos-dark mb-4">Mis compras recientes</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-50">
              {myPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-alivos-dark truncate">{purchase.courseTitle}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{purchase.date} · {purchase.method}</p>
                  </div>
                  <span className="shrink-0 font-bold text-alivos-dark text-sm">
                    ${purchase.amount.toLocaleString("es-MX")}
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
