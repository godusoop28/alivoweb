"use client";

import { courses } from "@/lib/mockData";

interface CoursesPageProps {
  onOpenCourse: (courseId: string) => void;
}

export default function CoursesPage({ onOpenCourse }: CoursesPageProps) {
  return (
    <div className="min-h-screen bg-alivos-bg animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-alivos-dark mb-2">Cursos disponibles</h1>
          <p className="text-slate-500 text-lg">
            Elige el curso que se adapta a la etapa de desarrollo de tu bebé.
          </p>
        </div>
      </div>

      {/* Course grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {courses.map((course) => {
            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
            const completedLessons = course.modules.reduce(
              (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
              0
            );

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-100 hover:border-brand-200 transition-all flex flex-col group"
              >
                {/* Course image */}
                <div className="h-48 bg-gradient-to-br from-brand-100 via-brand-200 to-alivos-sky/20 relative overflow-hidden">
                  {course.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {course.status === "published" && (
                      <span className="bg-white/90 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                        Disponible
                      </span>
                    )}
                    {course.enrolled && (
                      <span className="bg-success-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        Inscrito
                      </span>
                    )}
                  </div>

                  {/* Age range */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-bold text-white bg-alivos-dark/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {course.ageRange}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-alivos-dark mb-1.5 group-hover:text-brand-700 transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{course.shortDescription}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-3 text-xs text-slate-400 mb-4 py-3 border-t border-b border-slate-50">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {course.modules.length} módulos
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {totalLessons} lecciones
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {course.studentsCount}
                    </span>
                  </div>

                  {/* Progress bar if enrolled */}
                  {course.enrolled && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span>Tu progreso</span>
                        <span className="font-semibold text-brand-600">
                          {completedLessons}/{totalLessons} lecciones
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{course.progress}% completado</p>
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-black text-alivos-dark">
                        ${course.price.toLocaleString("es-MX")}
                      </span>
                      <span className="text-xs text-slate-400">MXN</span>
                    </div>
                    {course.enrolled ? (
                      <button
                        onClick={() => onOpenCourse(course.id)}
                        className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.progress > 0 ? "Continuar aprendizaje" : "Empezar aprendizaje"}
                      </button>
                    ) : (
                      <button className="w-full py-2.5 bg-alivos-dark hover:bg-brand-900 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Comprar curso
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
