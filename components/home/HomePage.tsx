"use client";

import { useState } from "react";
import Image from "next/image";
import { courses } from "@/lib/mockData";

const LOGO_VERTICAL =
  "/alivos_logos_renombrados/alivos_logos_renombrados/logo-inicio-vertical-completo.png";

interface HomePageProps {
  onNavigate: (view: "courses" | "contact" | "course" | "dashboard", courseId?: string) => void;
}

const benefits = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Desde tu hogar",
    description: "Accedé a todos los contenidos cuando quieras, desde cualquier dispositivo, sin salir de casa.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Videos guiados",
    description: "Clases en video explicadas por profesionales de ALIVOS Medicina de Rehabilitación.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Avanzá por módulos",
    description: "Estructura clara en módulos y lecciones para que puedas aprender de manera progresiva.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Acompañamiento profesional",
    description: "Podés consultar dudas y recibir feedback de los profesionales del equipo ALIVOS.",
  },
];

const steps = [
  { step: "01", title: "Elegí tu curso", description: "Seleccioná el curso que corresponde a la etapa de tu bebé." },
  { step: "02", title: "Accedé a tus módulos", description: "Una vez realizado el pago, accedés de inmediato a todo el contenido." },
  { step: "03", title: "Avanzá a tu ritmo", description: "Mirá los videos, descargá materiales y completá las actividades cuando puedas." },
  { step: "04", title: "Realizá las tareas", description: "Enviá tus tareas y recibí correcciones personalizadas del equipo." },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-alivos-dark via-brand-800 to-brand-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-400 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                ALIVOS Medicina de Rehabilitación
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Cursos de{" "}
                <span className="text-blue-300">Estimulación</span>{" "}
                Temprana
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-8 max-w-lg">
                Aprendé con una guía clara, profesional y pensada para acompañar
                el desarrollo de tu bebé desde casa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate("courses")}
                  className="px-8 py-3.5 bg-white text-alivos-dark font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Ver cursos
                </button>
                <button
                  onClick={() => onNavigate("contact")}
                  className="px-8 py-3.5 bg-success-600 hover:bg-success-700 text-white font-bold rounded-xl transition-colors shadow-lg"
                >
                  Agendar cita
                </button>
              </div>
            </div>

            {/* Logo illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                {logoError ? (
                  <div className="text-center text-white">
                    <div className="text-7xl font-black mb-2">A</div>
                    <div className="text-2xl font-bold">ALIVOS</div>
                    <div className="text-sm text-blue-200 mt-1">Medicina de Rehabilitación</div>
                  </div>
                ) : (
                  <Image
                    src={LOGO_VERTICAL}
                    alt="ALIVOS Medicina de Rehabilitación"
                    width={240}
                    height={240}
                    className="object-contain p-8"
                    onError={() => setLogoError(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-alivos-dark mb-4">
              ¿Por qué elegir ALIVOS?
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Una plataforma diseñada por profesionales de rehabilitación para acompañarte en cada etapa.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-alivos-bg hover:bg-brand-50 border border-transparent hover:border-brand-100 transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-brand-600 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-alivos-dark mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="py-16 sm:py-20 bg-alivos-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-alivos-dark mb-2">Nuestros cursos</h2>
              <p className="text-slate-500">Cada curso está diseñado para una etapa específica del desarrollo.</p>
            </div>
            <button
              onClick={() => onNavigate("courses")}
              className="text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1 shrink-0"
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 hover:border-brand-200 transition-all group cursor-pointer"
                onClick={() => onNavigate("courses")}
              >
                <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="text-4xl mb-2">👶</div>
                    <span className="text-xs font-semibold text-brand-700 bg-white/80 px-3 py-0.5 rounded-full">
                      {course.ageRange}
                    </span>
                  </div>
                  {course.enrolled && (
                    <div className="absolute top-3 right-3 bg-success-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Inscripta
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1">{course.ageRange}</p>
                  <h3 className="font-bold text-alivos-dark mb-2 group-hover:text-brand-700 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{course.shortDescription}</p>
                  {course.enrolled && course.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Progreso</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-alivos-dark">${course.price.toLocaleString("es-AR")}</span>
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
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-alivos-dark mb-4">¿Cómo funciona?</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Comenzar es fácil y rápido. En minutos ya podés estar viendo tu primera lección.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-brand-100 z-0 -translate-x-6" />
                )}
                <div className="relative z-10 text-center p-6 rounded-2xl bg-alivos-bg">
                  <div className="w-16 h-16 bg-alivos-dark text-white rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-alivos-dark mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate("courses")}
              className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Empezar ahora
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-alivos-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-xl font-black mb-3">ALIVOS</div>
              <p className="text-sm text-blue-200 leading-relaxed">
                Medicina de Rehabilitación. Cursos de estimulación temprana y rehabilitación pediátrica.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Plataforma</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><button onClick={() => onNavigate("courses")} className="hover:text-white transition-colors">Cursos</button></li>
                <li><button onClick={() => onNavigate("dashboard")} className="hover:text-white transition-colors">Mis cursos</button></li>
                <li><button onClick={() => onNavigate("contact")} className="hover:text-white transition-colors">Contacto</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contacto</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>📧 info@alivosestimulacion.com</li>
                <li>📱 WhatsApp disponible</li>
                <li>🌐 alivosestimulacion.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm text-blue-300">
            © {new Date().getFullYear()} ALIVOS Medicina de Rehabilitación. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
