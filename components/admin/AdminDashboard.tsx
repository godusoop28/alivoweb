"use client";

import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/lib/api/admin";
import { AdminDashboard as AdminDashboardData } from "@/lib/api/types";

const statIcons = {
  students: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  courses: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  revenue: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  tasks: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
};

const taskStatusLabel: Record<string, string> = {
  PENDING: "Sin entregar",
  DELIVERED: "Entregada",
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAdminDashboard()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Cargando dashboard...</div>;
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        No pudimos cargar el dashboard. Verifica que la API esté disponible.
      </div>
    );
  }

  const stats = [
    {
      label: "Total alumnos",
      value: data.stats.totalStudents,
      icon: statIcons.students,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Cursos publicados",
      value: data.stats.publishedCourses,
      icon: statIcons.courses,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Ventas del mes",
      value: `$${data.stats.monthlyRevenue.toLocaleString("es-MX")}`,
      icon: statIcons.revenue,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Tareas pendientes",
      value: data.stats.pendingTasks,
      icon: statIcons.tasks,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen general de la plataforma</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-black text-alivos-dark mb-0.5">{stat.value}</div>
            <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent purchases */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-alivos-dark">Últimas compras</h2>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Mercado Pago</span>
          </div>
          <div className="divide-y divide-slate-50">
            {data.recentPurchases.length === 0 ? (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">Todavía no hay compras registradas.</div>
            ) : (
              data.recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                    {purchase.studentName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-alivos-dark truncate">{purchase.studentName}</p>
                    <p className="text-xs text-slate-500 truncate">{purchase.courseTitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-alivos-dark">${purchase.amount.toLocaleString("es-MX")}</p>
                    <span
                      className={`text-xs font-semibold ${
                        purchase.status === "PAID"
                          ? "text-green-600"
                          : purchase.status === "PENDING"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {purchase.status === "PAID" ? "Pagado" : purchase.status === "PENDING" ? "Pendiente" : "Fallido"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-alivos-dark">Tareas por revisar</h2>
            {data.pendingTasks.length > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {data.pendingTasks.length}
              </span>
            )}
          </div>
          <div className="divide-y divide-slate-50">
            {data.pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-xs font-bold shrink-0">
                  {task.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-alivos-dark truncate">{task.studentName}</p>
                  <p className="text-xs text-slate-500 truncate">{task.lessonTitle}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 bg-blue-100 text-blue-700">
                  {taskStatusLabel[task.status] ?? task.status}
                </span>
              </div>
            ))}
            {data.pendingTasks.length === 0 && (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">
                No hay tareas pendientes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Courses overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50">
          <h2 className="font-bold text-alivos-dark">Actividad por curso</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {data.courses.map((course) => (
            <div key={course.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-100 shrink-0 relative">
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
                <p className="font-medium text-alivos-dark text-sm truncate">{course.title}</p>
                <p className="text-xs text-slate-500">{course.ageRange}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 text-sm">
                <div className="text-center hidden sm:block">
                  <p className="font-bold text-alivos-dark">{course.studentsCount}</p>
                  <p className="text-xs text-slate-400">alumnos</p>
                </div>
                <div className="hidden md:block text-center">
                  <p className="font-bold text-alivos-dark">{course.lessonsCount}</p>
                  <p className="text-xs text-slate-400">lecciones</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    course.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : course.status === "DRAFT"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {course.status === "PUBLISHED" ? "Publicado" : course.status === "DRAFT" ? "Borrador" : "Oculto"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
