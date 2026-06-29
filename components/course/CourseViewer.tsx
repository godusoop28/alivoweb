"use client";

import { useState } from "react";
import { courses, type Lesson, type Module } from "@/lib/mockData";

interface CourseViewerProps {
  courseId: string;
  onBack: () => void;
}

const typeLabel: Record<Lesson["type"], string> = {
  video: "Video",
  text: "Texto",
  pdf: "PDF",
  task: "Tarea",
  evaluation: "Evaluación",
};

const typeIcon = (type: Lesson["type"]) => {
  switch (type) {
    case "video":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "pdf":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "task":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "evaluation":
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
  const course = courses.find((c) => c.id === courseId);

  const allLessons: { lesson: Lesson; moduleTitle: string }[] = course
    ? course.modules.flatMap((m) => m.lessons.map((l) => ({ lesson: l, moduleTitle: m.title })))
    : [];

  const [currentLessonId, setCurrentLessonId] = useState(
    course?.lastLessonId || allLessons[0]?.lesson.id || ""
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskAnswer, setTaskAnswer] = useState("");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(allLessons.filter((l) => l.lesson.completed).map((l) => l.lesson.id))
  );

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Curso no encontrado.</p>
      </div>
    );
  }

  const currentEntry = allLessons.find((e) => e.lesson.id === currentLessonId);
  const currentLesson = currentEntry?.lesson;
  const currentIndex = allLessons.findIndex((e) => e.lesson.id === currentLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const totalLessons = allLessons.length;
  const completedCount = completedLessons.size;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const markComplete = () => {
    if (currentLessonId) {
      setCompletedLessons((prev) => new Set([...prev, currentLessonId]));
      if (nextLesson) setCurrentLessonId(nextLesson.lesson.id);
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
          {currentLesson && !completedLessons.has(currentLessonId) && (
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
          {currentLesson && completedLessons.has(currentLessonId) && (
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
                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {module.title}
                </div>
                {module.lessons.map((lesson: Lesson) => {
                  const isCompleted = completedLessons.has(lesson.id);
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
                          isCompleted
                            ? "border-success-600 bg-success-600"
                            : isCurrent
                            ? "border-brand-600"
                            : "border-slate-300"
                        }`}
                      >
                        {isCompleted && (
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
                          {lesson.duration && (
                            <span className="text-xs">· {lesson.duration}min</span>
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
              {currentLesson.type === "video" && (
                <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden mb-6 shadow-md flex items-center justify-center relative">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors cursor-pointer">
                      <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-300">
                      Video: {currentLesson.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {currentLesson.duration} min · Video Vimeo (integración disponible en producción)
                    </p>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {currentLesson.duration}:00
                  </div>
                </div>
              )}

              {/* PDF area */}
              {currentLesson.type === "pdf" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6 text-center">
                  <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="font-semibold text-alivos-dark mb-2">{currentLesson.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">Documento PDF disponible para descargar</p>
                  <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors">
                    Descargar PDF
                  </button>
                </div>
              )}

              {/* Evaluation */}
              {currentLesson.type === "evaluation" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6 text-center">
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-alivos-dark mb-2">Evaluación final</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Completá la evaluación para finalizar el curso. Duración estimada: {currentLesson.duration} minutos.
                  </p>
                  <button className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
                    Comenzar evaluación
                  </button>
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
                      {currentLesson.duration && (
                        <span className="text-xs text-slate-400">{currentLesson.duration} min</span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-alivos-dark">
                      {currentLesson.title}
                    </h2>
                  </div>
                  {completedLessons.has(currentLessonId) ? (
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
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-brand-50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-alivos-dark group-hover:text-brand-700">
                        Guía de actividades — {currentLesson.title}
                      </p>
                      <p className="text-xs text-slate-400">PDF · 2.4 MB</p>
                    </div>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
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
                  <textarea
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                    rows={4}
                    placeholder="Escribe tu respuesta aquí..."
                    value={taskAnswer}
                    onChange={(e) => setTaskAnswer(e.target.value)}
                  />
                  <div className="flex gap-3 mt-3">
                    <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Adjuntar archivo
                    </button>
                    <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Enviar tarea
                    </button>
                  </div>
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
