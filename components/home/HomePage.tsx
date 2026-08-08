"use client";

import { useEffect, useState } from "react";
import { listCourses } from "@/lib/api/courses";
import { getFallbackCourses } from "@/lib/api/mockFallback";
import { getHomeTestimonials } from "@/lib/api/testimonials";
import { listResources } from "@/lib/api/resources";
import { Course, HomeTestimonial, Lesson, LearningResource, ResourceType } from "@/lib/api/types";
import { alivosAssets } from "@/lib/assets/alivosAssets";

interface HomePageProps {
  onNavigate: (view: "courses" | "contact" | "course" | "dashboard" | "resources", courseId?: string) => void;
}

const resourceTypeLabel: Record<ResourceType, string> = {
  PDF: "PDF",
  VIDEO: "Video",
  ARTICLE: "Lectura",
  LINK: "Enlace",
};

const resourceTypeColor: Record<ResourceType, string> = {
  PDF: "bg-red-100 text-red-700",
  VIDEO: "bg-blue-100 text-blue-700",
  ARTICLE: "bg-purple-100 text-purple-700",
  LINK: "bg-slate-100 text-slate-600",
};

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

function CourseRating({ rating, reviewsCount }: { rating: number | null; reviewsCount: number }) {
  const rounded = rating ? Math.round(rating) : 0;
  return (
    <div className="flex items-center justify-center gap-1.5 mb-2">
      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className="w-3.5 h-3.5" fill={i < rounded ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 21.04a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        ))}
      </div>
      {reviewsCount > 0 && <span className="text-xs text-slate-400">({reviewsCount})</span>}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: HomeTestimonial }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
      {testimonial.rating != null && (
        <div className="flex items-center gap-0.5 text-amber-400 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="w-4 h-4" fill={i < testimonial.rating! ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 21.04a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          ))}
        </div>
      )}
      <p className="text-slate-600 text-sm leading-relaxed flex-1">&ldquo;{testimonial.comment}&rdquo;</p>
      <div className="flex items-center gap-3 mt-5">
        {testimonial.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={testimonial.photoUrl} alt={testimonial.authorName} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 font-bold flex items-center justify-center">
            {testimonial.authorName.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-alivos-dark text-sm">{testimonial.authorName}</p>
          {testimonial.authorContext && <p className="text-xs text-slate-400">{testimonial.authorContext}</p>}
        </div>
      </div>
    </div>
  );
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
  const [testimonials, setTestimonials] = useState<HomeTestimonial[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);

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

  useEffect(() => {
    let cancelled = false;
    getHomeTestimonials()
      .then(({ testimonials }) => {
        if (!cancelled) setTestimonials(testimonials);
      })
      .catch(() => {
        if (!cancelled) setTestimonials([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    listResources()
      .then(({ resources }) => {
        if (!cancelled) setResources(resources);
      })
      .catch(() => {
        if (!cancelled) setResources([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const modules = courses.slice(0, 4);
  const homeResources = resources.slice(0, 4);
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
                  <h3 className="font-bold text-slate-900 mb-2 leading-snug">
                    {course.title} ({course.ageRange})
                  </h3>
                  <CourseRating rating={course.averageRating} reviewsCount={course.reviewsCount} />
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

      {/* Aprende Más */}
      {homeResources.length > 0 && (
        <section className="bg-white py-14 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Aprende Más</h2>
              <div className="w-10 h-0.5 bg-black mx-auto mb-4" />
              <p className="text-slate-500 max-w-xl mx-auto">
                Recursos gratuitos del equipo de ALIVOS: PDFs, lecturas, videos y enlaces útiles.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeResources.map((resource) => (
                <button
                  key={resource.id}
                  onClick={() => onNavigate("resources")}
                  className="text-left bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-200 hover:-translate-y-0.5 transition-all flex flex-col group"
                >
                  <div className="aspect-[4/3] bg-alivos-light relative overflow-hidden">
                    {resource.coverImage || resource.vimeoThumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resource.coverImage ?? resource.vimeoThumbnail ?? undefined}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-200 text-3xl font-bold">
                        {resourceTypeLabel[resource.type]}
                      </div>
                    )}
                    <span
                      className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${resourceTypeColor[resource.type]}`}
                    >
                      {resourceTypeLabel[resource.type]}
                    </span>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-sm text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                      {resource.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
            <div className="text-center mt-12">
              <button
                onClick={() => onNavigate("resources")}
                className="inline-flex items-center gap-2 px-7 py-3 bg-success-600 hover:bg-success-700 text-white font-semibold rounded-full transition-colors"
              >
                Ver todos los recursos
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Lo que dicen las familias */}
      {testimonials.length > 0 && (
        <section className="bg-alivos-light py-14 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Lo que dicen las familias</h2>
              <div className="w-10 h-0.5 bg-black mx-auto" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
