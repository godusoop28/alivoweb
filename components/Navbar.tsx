"use client";

import { useState } from "react";
import Image from "next/image";

type AppMode = "student" | "admin";
type View =
  | "home"
  | "courses"
  | "course"
  | "dashboard"
  | "contact"
  | "admin-dashboard"
  | "admin-courses"
  | "admin-modules"
  | "admin-students"
  | "admin-purchases"
  | "admin-tasks"
  | "admin-access"
  | "admin-settings";

interface NavbarProps {
  mode: AppMode;
  currentView: View;
  onNavigate: (view: View) => void;
  onToggleMode: () => void;
}

const LOGO_HORIZONTAL = "/alivos_logos_renombrados/alivos_logos_renombrados/logo-nav-horizontal-completo.png";
const LOGO_COMPACT = "/alivos_logos_renombrados/alivos_logos_renombrados/logo-nav-compacto-sin-subtitulo.png";

export default function Navbar({ mode, currentView, onNavigate, onToggleMode }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [compactLogoError, setCompactLogoError] = useState(false);

  const studentLinks: { label: string; view: View }[] = [
    { label: "Inicio", view: "home" },
    { label: "Cursos", view: "courses" },
    { label: "Mis Cursos", view: "dashboard" },
    { label: "Contacto", view: "contact" },
  ];

  const isStudentActive = (view: View) =>
    currentView === view || (view === "courses" && currentView === "course");

  return (
    <>
      {/* Demo mode bar */}
      <div className="bg-alivos-dark text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <span className="text-blue-200 font-medium">
          🎭 Modo Demo — Vista:{" "}
          <span className="text-white font-bold">
            {mode === "student" ? "Alumno / Usuario" : "Administrador"}
          </span>
        </span>
        <button
          onClick={onToggleMode}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors"
        >
          <span className="hidden sm:inline">Cambiar a</span>
          <span>{mode === "student" ? "🔑 Admin" : "👤 Alumno"}</span>
        </button>
      </div>

      {/* Main navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => onNavigate(mode === "admin" ? "admin-dashboard" : "home")}
              className="flex items-center flex-shrink-0"
            >
              {/* Desktop logo */}
              <div className="hidden sm:block">
                {logoError ? (
                  <span className="text-alivos-dark font-bold text-xl tracking-tight">ALIVOS</span>
                ) : (
                  <Image
                    src={LOGO_HORIZONTAL}
                    alt="ALIVOS Medicina de Rehabilitación"
                    width={180}
                    height={44}
                    className="h-10 w-auto object-contain"
                    onError={() => setLogoError(true)}
                    priority
                  />
                )}
              </div>
              {/* Mobile logo */}
              <div className="sm:hidden">
                {compactLogoError ? (
                  <span className="text-alivos-dark font-bold text-xl tracking-tight">ALIVOS</span>
                ) : (
                  <Image
                    src={LOGO_COMPACT}
                    alt="ALIVOS"
                    width={120}
                    height={40}
                    className="h-9 w-auto object-contain"
                    onError={() => setCompactLogoError(true)}
                    priority
                  />
                )}
              </div>
            </button>

            {/* Student nav links */}
            {mode === "student" && (
              <div className="hidden md:flex items-center gap-1">
                {studentLinks.map((link) => (
                  <button
                    key={link.view}
                    onClick={() => onNavigate(link.view)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isStudentActive(link.view)
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-600 hover:text-brand-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}

            {/* Admin breadcrumb */}
            {mode === "admin" && (
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                <span className="px-2 py-1 bg-alivos-light text-alivos-dark rounded font-semibold text-xs">
                  Panel Administrador
                </span>
              </div>
            )}

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {mode === "student" && (
                <>
                  {/* Cart */}
                  <button className="relative p-2 text-slate-500 hover:text-brand-700 hover:bg-slate-50 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      2
                    </span>
                  </button>

                  {/* Agendar cita */}
                  <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Agendar cita
                  </button>
                </>
              )}

              {/* Mobile menu button */}
              {mode === "student" && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 text-slate-500 hover:text-brand-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {mobileOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mode === "student" && mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {studentLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  onNavigate(link.view);
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isStudentActive(link.view)
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-success-600 text-white rounded-lg text-sm font-semibold mt-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Agendar cita
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
