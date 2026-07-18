"use client";

import { useEffect, useState } from "react";
import { completeLesson, getCourse, submitTask } from "@/lib/api/courses";
import { getFallbackCourses } from "@/lib/api/mockFallback";
import { Course, Lesson, Module } from "@/lib/api/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";

interface CourseViewerProps {
  courseId: string;
  onBack: () => void;
}

const typeLabel: Record<Lesson["type"], string> = {
  VIDEO: "Video",
  TEXT: "Texto",
  PDF: "PDF",
  TASK: "Tarea",
  EVALUATION: "Evaluación",
};

const typeIcon = (type: Lesson["type"]) => {
  switch (type) {
    case "VIDEO":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "PDF":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "TASK":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "EVALUATION":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      );
    default:
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
};

export default function CourseViewer({ courseId, onBack }: CourseViewerProps) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskAnswer, setTaskAnswer] = useState("");
  const [taskSent, setTaskSent] = useState(false);
  const [completedOverrides, setCompletedOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    getCourse(courseId)
      .then(({ course }) => {
        if (cancelled) return;
        setCourse(course);
        const allLessons = course.modules.flatMap((m) => m.lessons);
        setCurrentLessonId(allLessons[0]?.id ?? "");
      })
      .catch((err) => {
        if (cancelled) return;
        const fallback = getFallbackCourses().find((c) => c.slug === courseId || c.id === courseId);
        if (fallback) {
          setCourse(fallback);
          const allLessons = fallback.modules.flatMap((m) => m.lessons);
          setCurrentLessonId(allLessons[0]?.id ?? "");
        } else if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400 text-sm">
        Cargando curso...
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <p className="text-slate-500">Curso no encontrado.</p>
        <button onClick={onBack} className="text-brand-600 font-semibold text-sm hover:text-brand-700">
          Volver a cursos
        </button>
      </div>
    );
  }

  const allLessons: { lesson: Lesson; moduleTitle: string }[] = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ lesson: l, moduleTitle: m.title }))
  );

  const isCompleted = (lesson: Lesson) => completedOverrides[lesson.id] ?? lesson.completed;

  const currentEntry = allLessons.find((e) => e.lesson.id === currentLessonId);
  const currentLesson = currentEntry?.lesson;
  const currentIndex = allLessons.findIndex((e) => e.lesson.id === currentLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((e) => isCompleted(e.lesson)).length;
  const progressPercent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const markComplete = async () => {
    if (!currentLessonId) return;
    setCompletedOverrides((prev) => ({ ...prev, [currentLessonId]: true }));
    if (user) {
      completeLesson(currentLessonId).catch(() => {
        // best-effort — UI already reflects completion; the API stays out of sync
        // only if the request fails, which is acceptable for this demo.
      });
    }
    if (nextLesson) setCurrentLessonId(nextLesson.lesson.id);
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLesson) return;
    try {
      await submitTask(currentLesson.id, { answer: taskAnswer });
      setTaskSent(true);
      setTimeout(() => setTaskSent(false), 4000);
    } catch {
      // keep the answer in the textarea so the user doesn't lose their work
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-96px)] bg-white animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-slate-50 rounded-lg transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="font-bold text-alivos-dark truncate text-sm sm:text-base">
              {course.title}
              <span className="ml-2 text-xs font-normal text-slate-400">{course.ageRange}</span>
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-xs text-slate-500">{progressPercent}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentLesson && !isCompleted(currentLesson) && (
            <button
              onClick={markComplete}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-success-600 hover:bg-success-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Marcar como completo
            </button>
          )}
          {currentLesson && isCompleted(currentLesson) && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-success-600 font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completado
            </span>
          )}
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-slate-500 hover:text-brand-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:relative z-40 lg:z-auto w-80 h-full bg-white border-r border-slate-100 flex flex-col overflow-hidden transition-transform duration-200 lg:transition-none`}
        >
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
            <span className="text-sm font-semibold text-alivos-dark">Contenido del curso</span>
            <span className="text-xs text-slate-400">{completedCount}/{totalLessons}</span>
          </div>
          <div className="flex-1 overflow-y-auto sidebar-scroll py-2">
            {course.modules.map((module: Module) => (
              <div key={module.id} className="mb-1">
                {module.coverImage && (
                  <div className="mx-4 mt-2 mb-1 rounded-xl overflow-hidden h-16 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={module.coverImage}
                      alt={module.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}
                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {module.title}
                </div>
                {module.lessons.map((lesson: Lesson) => {
                  const completed = isCompleted(lesson);
                  const isCurrent = lesson.id === currentLessonId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setCurrentLessonId(lesson.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isCurrent
                          ? "bg-brand-50 text-brand-700"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          completed
                            ? "border-success-600 bg-success-600"
                            : isCurrent
                            ? "border-brand-600"
                            : "border-slate-300"
                        }`}
                      >
                        {completed && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${isCurrent ? "text-brand-700" : "text-slate-700"}`}>
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-slate-400">
                          {typeIcon(lesson.type)}
                          <span className="text-xs">{typeLabel[lesson.type]}</span>
                          {lesson.durationMinutes && (
                            <span className="text-xs">· {lesson.durationMinutes}min</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Video area */}
              {currentLesson.type === "VIDEO" && (
                <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden mb-6 shadow-md relative">
                  {currentLesson.vimeoEmbedUrl ? (
                    <iframe
                      key={currentLesson.id}
                      src={currentLesson.vimeoEmbedUrl}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center relative"
                      style={
                        currentLesson.vimeoThumbnail
                          ? {
                              backgroundImage: `linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.75)), url('${currentLesson.vimeoThumbnail}')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : undefined
                      }
                    >
                      <div className="text-center text-white px-6">
                        <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-2.36a.75.75 0 011.03.67v6.38a.75.75 0 01-1.03.67l-4.72-2.36M4.5 6.75h9a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5v-6a1.5 1.5 0 011.5-1.5z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium">Video pendiente por configurar</p>
                        <p className="text-xs text-slate-300 mt-1">
                          El equipo de ALIVOS todavía no cargó el video de esta lección.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PDF area (recursos, actividades sueltas, diario de ejercicios) */}
              {currentLesson.type === "PDF" && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 text-center">
                  {currentLesson.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentLesson.imageUrl}
                      alt={currentLesson.title}
                      className="w-full max-h-64 object-cover"
                    />
                  )}
                  <div className="p-8">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="font-semibold text-alivos-dark mb-2">{currentLesson.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      {currentLesson.pdfUrl || currentLesson.materialUrl
                        ? "Documento PDF disponible para descargar"
                        : "El material de esta lección aún no fue cargado."}
                    </p>
                    {(currentLesson.pdfUrl || currentLesson.materialUrl) && (
                      <a
                        href={currentLesson.pdfUrl ?? currentLesson.materialUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
                      >
                        {currentLesson.assetType === "resource" ? "Descargar diario de ejercicios" : "Descargar PDF"}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Evaluation */}
              {currentLesson.type === "EVALUATION" && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 text-center">
                  {currentLesson.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentLesson.imageUrl}
                      alt={`Evaluación — ${currentLesson.title}`}
                      className="w-full max-h-64 object-cover"
                    />
                  )}
                  <div className="p-8">
                    {!currentLesson.imageUrl && (
                      <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                    )}
                    <h3 className="font-semibold text-alivos-dark mb-2">{currentLesson.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Completa la evaluación para avanzar en el curso.
                      {currentLesson.durationMinutes ? ` Duración estimada: ${currentLesson.durationMinutes} minutos.` : ""}
                    </p>
                    {currentLesson.pdfUrl ? (
                      <a
                        href={currentLesson.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-2.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
                      >
                        Ver evaluación (PDF)
                      </a>
                    ) : (
                      <button className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
                        Comenzar evaluación
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Illustrative image for text lessons (objetivos, materiales, contenido extra, FAQ) */}
              {currentLesson.type === "TEXT" && currentLesson.imageUrl && (
                <div className="rounded-2xl overflow-hidden mb-6 shadow-sm border border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentLesson.imageUrl}
                    alt={currentLesson.title}
                    className="w-full max-h-80 object-cover"
                  />
                </div>
              )}

              {/* Lesson header */}
              <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                        {typeIcon(currentLesson.type)}
                        {typeLabel[currentLesson.type]}
                      </span>
                      {currentLesson.durationMinutes && (
                        <span className="text-xs text-slate-400">{currentLesson.durationMinutes} min</span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-alivos-dark">
                      {currentLesson.title}
                    </h2>
                  </div>
                  {isCompleted(currentLesson) ? (
                    <span className="shrink-0 flex items-center gap-1.5 text-sm text-success-600 font-semibold bg-success-50 px-3 py-1.5 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Completado
                    </span>
                  ) : (
                    <button
                      onClick={markComplete}
                      className="shrink-0 flex items-center gap-1.5 text-sm bg-success-600 hover:bg-success-700 text-white font-semibold px-3 py-1.5 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Marcar completo
                    </button>
                  )}
                </div>

                {currentLesson.description && (
                  <p className="text-slate-600 leading-relaxed">{currentLesson.description}</p>
                )}
              </div>

              {/* Materials */}
              {currentLesson.hasMaterial && (
                <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                  <h3 className="font-semibold text-alivos-dark mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Materiales descargables
                  </h3>
                  <a
                    href={currentLesson.pdfUrl ?? currentLesson.materialUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-brand-50 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-alivos-dark group-hover:text-brand-700">
                        {currentLesson.assetType === "activities"
                          ? "Ver actividades (PDF)"
                          : `Guía de actividades — ${currentLesson.title}`}
                      </p>
                      <p className="text-xs text-slate-400">
                        {currentLesson.pdfUrl || currentLesson.materialUrl ? "Descargar material" : "Material pendiente por cargar"}
                      </p>
                    </div>
                  </a>
                </div>
              )}

              {/* Task */}
              {currentLesson.hasTask && (
                <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border-l-4 border-brand-400">
                  <h3 className="font-semibold text-alivos-dark mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Tarea de la lección
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {currentLesson.taskDescription}
                  </p>
                  {taskSent && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                      ¡Tarea enviada! El equipo de ALIVOS la revisará pronto.
                    </div>
                  )}
                  <form onSubmit={handleSubmitTask}>
                    <textarea
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                      rows={4}
                      placeholder="Escribe tu respuesta aquí..."
                      value={taskAnswer}
                      onChange={(e) => setTaskAnswer(e.target.value)}
                    />
                    <div className="flex gap-3 mt-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Enviar tarea
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => prevLesson && setCurrentLessonId(prevLesson.lesson.id)}
                  disabled={!prevLesson}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>
                <span className="text-xs text-slate-400">
                  {currentIndex + 1} / {totalLessons}
                </span>
                <button
                  onClick={() => nextLesson && setCurrentLessonId(nextLesson.lesson.id)}
                  disabled={!nextLesson}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-400">
              Selecciona una lección del panel izquierdo
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
