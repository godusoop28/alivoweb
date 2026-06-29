"use client";

import { useState } from "react";
import Image from "next/image";
import { courses } from "@/lib/mockData";

const LOGO_VERTICAL =
  "/alivos_logos_renombrados/alivos_logos_renombrados/logo-inicio-vertical-completo.png";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1920&q=80";

interface HomePageProps {
  onNavigate: (view: "courses" | "contact" | "course" | "dashboard", courseId?: string) => void;
}

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Desde tu hogar",
    description: "Accede a todos los contenidos cuando quieras, desde cualquier dispositivo, sin salir de casa.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Videos guiados",
    description: "Clases en video explicadas por especialistas de ALIVOS Medicina de Rehabilitación.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Avanza por módulos",
    description: "Estructura clara en módulos y lecciones para aprender de manera progresiva y a tu ritmo.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Acompañamiento profesional",
    description: "Consulta dudas y recibe retroalimentación personalizada del equipo de ALIVOS.",
  },
];

const steps = [
  {
    step: "01",
    title: "Elige tu curso",
    description: "Selecciona el curso que corresponde a la etapa de desarrollo de tu bebé.",
  },
  {
    step: "02",
    title: "Accede al contenido",
    description: "Una vez realizado el pago, accedes de inmediato a todos los módulos y materiales.",
  },
  {
    step: "03",
    title: "Aprende a tu ritmo",
    description: "Mira los videos, descarga materiales y completa las actividades cuando puedas.",
  },
  {
    step: "04",
    title: "Realiza las tareas",
    description: "Envía tus tareas y recibe correcciones personalizadas del equipo de especialistas.",
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [logoError, setLogoError] = useState(false);

  const featuredCourses = courses.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section
        className="relative text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(26,58,92,0.92) 0%, rgba(26,58,92,0.78) 50%, rgba(37,99,235,0.60) 100%), url('${HERO_IMAGE}') center/cover no-repeat`,
          minHeight: "580px",
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                ALIVOS Medicina de Rehabilitación
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Cursos de{" "}
                <span className="text-blue-300">Estimulación</span>{" "}
                Temprana
              </h1>
              <p className="text-lg sm:text-xl text-blue-100/90 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Aprende con una guía clara, profesional y pensada para acompañar
                el desarrollo de tu bebé desde casa.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => onNavigate("courses")}
                  className="px-8 py-3.5 bg-white text-alivos-dark font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base"
                >
                  Ver cursos
                </button>
                <button
                  onClick={() => onNavigate("contact")}
                  className="px-8 py-3.5 bg-success-600 hover:bg-success-700 text-white font-bold rounded-xl transition-colors shadow-lg text-base"
                >
                  Agendar cita
                </button>
              </div>
            </div>

            {/* Logo / Floating card */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl">
                  {logoError ? (
                    <div className="text-center text-white">
                      <div className="text-6xl font-black mb-2">A</div>
                      <div className="text-xl font-bold">ALIVOS</div>
                      <div className="text-sm text-blue-200 mt-1">Medicina de Rehabilitación</div>
                    </div>
                  ) : (
                    <Image
                      src={LOGO_VERTICAL}
                      alt="ALIVOS Medicina de Rehabilitación"
                      width={220}
                      height={220}
                      className="object-contain p-8"
                      onError={() => setLogoError(true)}
                    />
                  )}
                </div>
                {/* Floating stat card */}
                <div className="absolute -bottom-4 -right-4 bg-white text-alivos-dark rounded-2xl px-4 py-3 shadow-xl border border-slate-100">
                  <p className="text-2xl font-black">+244</p>
                  <p className="text-xs text-slate-500 font-medium">familias acompañadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-alivos-dark mb-3">
              ¿Por qué elegir ALIVOS?
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Una plataforma diseñada por especialistas en rehabilitación para acompañarte en cada etapa del desarrollo de tu bebé.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-alivos-bg hover:bg-brand-50 border border-transparent hover:border-brand-100 transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-alivos-dark mb-2 text-sm">{benefit.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="py-14 sm:py-20 bg-alivos-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-alivos-dark mb-2">Nuestros cursos</h2>
              <p className="text-slate-500">Cada curso está diseñado para una etapa específica del desarrollo.</p>
            </div>
            <button
              onClick={() => onNavigate("courses")}
              className="text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1 shrink-0 text-sm"
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 hover:border-brand-200 transition-all group cursor-pointer"
                onClick={() => onNavigate("courses")}
              >
                {/* Course image */}
                <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-200 relative overflow-hidden">
                  {course.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-bold text-white bg-alivos-dark/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {course.ageRange}
                    </span>
                  </div>
                  {course.enrolled && (
                    <div className="absolute top-3 right-3 bg-success-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Inscrito
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-alivos-dark mb-1.5 text-sm group-hover:text-brand-700 transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{course.shortDescription}</p>
                  {course.enrolled && course.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progreso</span>
                        <span className="font-medium text-brand-600">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <span className="font-bold text-alivos-dark text-sm">${course.price.toLocaleString("es-MX")}</span>
                    <span className="text-xs text-slate-400">
                      {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lecciones
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-alivos-dark mb-3">¿Cómo funciona?</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Comenzar es sencillo y rápido. En minutos ya puedes ver tu primera lección.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-brand-100 z-0" style={{ left: "calc(50% + 2rem)", width: "calc(100% - 4rem)" }} />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-alivos-dark text-white rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4 shadow-md">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-alivos-dark mb-2 text-sm">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate("courses")}
              className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Empezar ahora
            </button>
          </div>
        </div>
      </section>

      {/* Companion strip */}
      <section className="py-14 sm:py-16 bg-alivos-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-alivos-dark mb-4">
            Diseñado para acompañarte desde casa
          </h2>
          <p className="text-slate-500 leading-relaxed mb-8 max-w-2xl mx-auto">
            No necesitas equipo especial ni experiencia previa. Nuestros cursos están pensados para que
            cualquier mamá o papá pueda aplicar las técnicas de estimulación de manera segura, efectiva y con amor.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate("courses")}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors"
            >
              Ver los cursos disponibles
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="px-6 py-3 border-2 border-brand-200 text-brand-700 hover:bg-brand-50 font-semibold rounded-xl transition-colors"
            >
              Hablar con un especialista
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-alivos-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-lg font-black mb-3 tracking-tight">ALIVOS</div>
              <p className="text-sm text-blue-200/80 leading-relaxed">
                Medicina de Rehabilitación. Cursos de estimulación temprana y rehabilitación pediátrica para familias.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Plataforma</h4>
              <ul className="space-y-2 text-sm text-blue-200/70">
                <li>
                  <button onClick={() => onNavigate("courses")} className="hover:text-white transition-colors">
                    Cursos
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("dashboard")} className="hover:text-white transition-colors">
                    Mis cursos
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("contact")} className="hover:text-white transition-colors">
                    Contacto
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Contacto</h4>
              <ul className="space-y-2 text-sm text-blue-200/70">
                <li>info@alivosestimulacion.com</li>
                <li>WhatsApp disponible</li>
                <li>alivosestimulacion.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm text-blue-300/60">
            © {new Date().getFullYear()} ALIVOS Medicina de Rehabilitación. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
