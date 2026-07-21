"use client";

import { useEffect, useState } from "react";
import { listCourses } from "@/lib/api/courses";
import { getFallbackCourses } from "@/lib/api/mockFallback";
import { Course, Lesson } from "@/lib/api/types";
import { alivosAssets } from "@/lib/assets/alivosAssets";

interface HomePageProps {
  onNavigate: (view: "courses" | "contact" | "course" | "dashboard", courseId?: string) => void;
}

function findFirstVideo(courses: Course[]): Lesson | null {
  for (const course of courses) {
    for (const courseModule of course.modules) {
      for (const lesson of courseModule.lessons) {
        if (lesson.vimeoEmbedUrl) return lesson;
      }
    }
  }
  return null;
}

function VideoOrImage({
  embedUrl,
  imageUrl,
  alt,
  title,
}: {
  embedUrl?: string | null;
  imageUrl: string;
  alt: string;
  title: string;
}) {
  if (embedUrl) {
    return (
      <div className="aspect-video w-full overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    );
  }
  return (
    <div className="aspect-video w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let cancelled = false;
    listCourses()
      .then(({ courses }) => {
        if (!cancelled) setCourses(courses);
      })
      .catch(() => {
        if (!cancelled) setCourses(getFallbackCourses());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const modules = courses.slice(0, 4);
  const welcomeVideo = findFirstVideo(courses);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section
        className="relative flex items-center justify-center text-center min-h-[420px] sm:min-h-[560px] lg:min-h-[640px] bg-alivos-dark bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.45), rgba(15,23,42,0.45)), url('${alivosAssets.home.hero}')`,
        }}
      >
        <div className="relative z-10 px-4">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 sm:mb-8 max-w-3xl mx-auto leading-tight">
            Cursos de Estimulación Temprana
          </h1>
          <button
            onClick={() => onNavigate("courses")}
            className="px-9 py-3 bg-success-600 hover:bg-success-700 text-white font-semibold rounded-full transition-colors shadow-md"
          >
            Cursos
          </button>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 60" className="w-full h-10 sm:h-14" preserveAspectRatio="none">
            <path
              fill="#ffffff"
              d="M0,32 C240,64 480,0 720,16 C960,32 1200,64 1440,32 L1440,60 L0,60 Z"
            />
          </svg>
        </div>
      </section>

      {/* Desarrollado por el equipo de Alivos */}
      <section className="bg-white py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-center">
            <div className="rounded-xl overflow-hidden order-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={alivosAssets.home.babiesBanner}
                alt="Equipo de ALIVOS acompañando a familias"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="order-2">
              <p className="text-slate-500 text-sm sm:text-base mb-1">Desarrollado por el equipo de</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Alivos</h2>
              <div className="w-12 h-0.5 bg-black mb-5" />
              <p className="text-slate-600 leading-relaxed mb-6 max-w-[32rem]">
                Nuestro objetivo es impulsarte a mejorar tu calidad de vida. Todo el material ha sido
                construido con ayuda de especialistas, fisioterapeutas y tecnología médica actualizada.
                Siempre con una visión humana, cálida y personalizada.
              </p>
              <button
                onClick={() => onNavigate("contact")}
                className="px-7 py-3 bg-success-600 hover:bg-success-700 text-white font-semibold rounded-full transition-colors"
              >
                Conoce más de ALIVOS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Programa de Estimulación Temprana */}
      <section className="bg-white pt-4 pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-10 sm:pb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Programa de Estimulación Temprana
          </h2>
          <div className="w-10 h-0.5 bg-black mx-auto" />
        </div>
      </section>

      <section className="bg-alivos-light">
        {/* Bienvenida al curso */}
        <div className="max-w-4xl mx-auto px-0 sm:px-6 lg:px-8 pt-0 sm:pt-10">
          <VideoOrImage
            embedUrl={welcomeVideo?.vimeoEmbedUrl}
            imageUrl={alivosAssets.home.welcome}
            alt="Bienvenida al curso ALIVOS"
            title="Bienvenida al curso"
          />
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Bienvenida al curso</h3>
          <p className="text-slate-600 leading-relaxed">
            Los primeros meses son claves en el desarrollo de tu bebé. Aprende a estimularlo de forma
            adecuada, con guía de especialistas y ejercicios diseñados según su etapa.
          </p>
        </div>

        {/* ¿Cómo usar la plataforma? */}
        <div className="max-w-5xl mx-auto px-0 sm:px-6 lg:px-8 pb-10 sm:pb-16">
          <div className="grid lg:grid-cols-2 gap-0 lg:gap-10 items-center">
            <VideoOrImage
              embedUrl={null}
              imageUrl={alivosAssets.home.platformGuide}
              alt="Cómo usar la plataforma ALIVOS"
              title="Cómo usar la plataforma"
            />
            <div className="px-4 sm:px-0 py-8 lg:py-0 text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                ¿Cómo usar la plataforma?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Descubre cómo utilizar cada sección de la plataforma de forma fácil y práctica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Módulos disponibles */}
      <section className="bg-white py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Módulos disponibles</h2>
            <div className="w-10 h-0.5 bg-black mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
            {modules.map((course) => {
              const firstLessonWithVideo = course.modules
                .flatMap((m) => m.lessons)
                .find((l) => l.vimeoEmbedUrl);
              return (
                <div key={course.id} className="flex flex-col items-center text-center">
                  <div className="w-full rounded-xl overflow-hidden mb-5 shadow-sm">
                    <VideoOrImage
                      embedUrl={firstLessonWithVideo?.vimeoEmbedUrl}
                      imageUrl={course.imageUrl ?? alivosAssets.home.coverOne}
                      alt={course.title}
                      title={course.title}
                    />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-3 leading-snug">
                    {course.title} ({course.ageRange})
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">
                    {course.shortDescription}
                  </p>
                  <button
                    onClick={() => onNavigate("course", course.slug)}
                    className="px-6 py-2.5 bg-success-600 hover:bg-success-700 text-white font-semibold rounded-full text-sm transition-colors"
                  >
                    Entrar al módulo
                  </button>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-14 sm:mt-16">
            <button
              onClick={() => onNavigate("courses")}
              className="inline-flex items-center gap-2 px-7 py-3 bg-success-600 hover:bg-success-700 text-white font-semibold rounded-full transition-colors"
            >
              Ver cursos
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
