"use client";

import { adminStats, purchases, taskSubmissions, courses } from "@/lib/mockData";

export default function AdminDashboard() {
  const recentPurchases = purchases.slice(0, 4);
  const pendingTasks = taskSubmissions.filter((t) => t.status === "pending" || t.status === "delivered");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen general de la plataforma</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total alumnos",
            value: adminStats.totalStudents,
            change: "+5 este mes",
            icon: "👥",
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Cursos publicados",
            value: adminStats.publishedCourses,
            change: "Todos activos",
            icon: "📚",
            color: "bg-purple-50 text-purple-600",
          },
          {
            label: "Ventas del mes",
            value: `$${adminStats.monthlyRevenue.toLocaleString("es-AR")}`,
            change: "+12% vs mes anterior",
            icon: "💰",
            color: "bg-green-50 text-green-600",
          },
          {
            label: "Tareas pendientes",
            value: adminStats.pendingTasks,
            change: "Por revisar",
            icon: "📝",
            color: "bg-orange-50 text-orange-600",
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-black text-alivos-dark mb-0.5">{stat.value}</div>
            <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
            <div className="text-xs text-slate-400">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent purchases */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-alivos-dark">Últimas compras</h2>
            <span className="text-xs text-slate-400">Mercado Pago</span>
          </div>
          <div className="divide-y divide-slate-50">
            {recentPurchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                  {purchase.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-alivos-dark truncate">{purchase.studentName}</p>
                  <p className="text-xs text-slate-500 truncate">{purchase.courseTitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-alivos-dark">${purchase.amount.toLocaleString("es-AR")}</p>
                  <span
                    className={`text-xs font-semibold ${
                      purchase.status === "paid"
                        ? "text-green-600"
                        : purchase.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {purchase.status === "paid" ? "Pagado" : purchase.status === "pending" ? "Pendiente" : "Fallido"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-alivos-dark">Tareas por revisar</h2>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingTasks.length}
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-xs font-bold shrink-0">
                  {task.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-alivos-dark truncate">{task.studentName}</p>
                  <p className="text-xs text-slate-500 truncate">{task.lessonTitle}</p>
                </div>
                <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0">
                  {task.status === "pending" ? "Sin entregar" : "Entregada"}
                </span>
              </div>
            ))}
            {pendingTasks.length === 0 && (
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
          <h2 className="font-bold text-alivos-dark">Cursos — actividad</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                👶
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-alivos-dark">{course.title}</p>
                <p className="text-xs text-slate-500">{course.ageRange}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 text-sm">
                <div className="text-center">
                  <p className="font-bold text-alivos-dark">{course.studentsCount}</p>
                  <p className="text-xs text-slate-400">alumnos</p>
                </div>
                <div className="hidden sm:block text-center">
                  <p className="font-bold text-alivos-dark">
                    {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                  </p>
                  <p className="text-xs text-slate-400">lecciones</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    course.status === "published"
                      ? "bg-green-100 text-green-700"
                      : course.status === "draft"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {course.status === "published" ? "Publicado" : course.status === "draft" ? "Borrador" : "Oculto"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
