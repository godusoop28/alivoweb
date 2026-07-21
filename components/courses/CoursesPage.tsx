"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { listCourses } from "@/lib/api/courses";
import { getFallbackCourses } from "@/lib/api/mockFallback";
import { Course } from "@/lib/api/types";

const LOGO_ICON = "/logos/logo-inicio-vertical-completo.png";

interface CoursesPageProps {
  onOpenCourse: (courseId: string) => void;
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 21.04a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function CoursesPage({ onOpenCourse }: CoursesPageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    listCourses()
      .then(({ courses }) => {
        if (!cancelled) setCourses(courses);
      })
      .catch(() => {
        if (!cancelled) {
          setCourses(getFallbackCourses());
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-16">
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
            No pudimos conectar con el servidor en este momento. Mostrando un catálogo de referencia.
          </div>
        )}

        {/* Sort filter (decorative, matches the original catalog layout) */}
        <div className="flex justify-center sm:justify-start mb-10 sm:mb-12">
          <div className="relative w-full sm:w-80">
            <select
              defaultValue="recent"
              className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="recent">Fecha de lanzamiento (más recientes primero)</option>
            </select>
            <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-slate-100 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-slate-100" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No hay cursos disponibles por ahora.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 justify-items-start">
            {courses.map((course) => (
              <div
                key={course.id}
                className="w-full max-w-sm border border-slate-200 rounded-lg overflow-hidden flex flex-col"
              >
                {/* Cover image with ALIVOS logo overlay + bookmark */}
                <div className="relative aspect-[4/3] bg-alivos-light overflow-hidden">
                  {course.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                  <div className="absolute inset-0 bg-white/25" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image src={LOGO_ICON} alt="ALIVOS" width={110} height={110} className="w-24 sm:w-28 h-auto object-contain drop-shadow" />
                  </div>
                  <button
                    onClick={() => setBookmarked((prev) => ({ ...prev, [course.id]: !prev[course.id] }))}
                    aria-label="Guardar curso"
                    className="absolute top-3 right-3 w-8 h-8 rounded-md bg-white/90 flex items-center justify-center text-brand-500 hover:text-brand-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill={bookmarked[course.id] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <Stars />
                  <h3 className="text-lg font-semibold text-slate-900 mt-3 mb-2 leading-snug">
                    {course.title} ({course.ageRange.replace("–", "-")})
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {course.studentsCount}
                  </div>

                  <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
                    <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      A
                    </div>
                    <p className="text-sm text-slate-500">
                      <span className="text-slate-400">por</span> admin <span className="text-slate-400">en</span> Estimulación Temprana
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenCourse(course.slug)}
                    className="mt-auto w-full py-2.5 border border-brand-400 text-brand-600 hover:bg-brand-50 font-medium rounded-md transition-colors text-sm"
                  >
                    Inscripción en el curso
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
