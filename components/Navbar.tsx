"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

const LOGO_H = "/logos/logo-nav-horizontal-completo.png";
const LOGO_C = "/logos/logo-nav-compacto-sin-subtitulo.png";

type AppMode = "student" | "admin";
type View =
  | "home" | "courses" | "course" | "dashboard" | "contact"
  | "admin-dashboard" | "admin-courses" | "admin-modules" | "admin-students"
  | "admin-purchases" | "admin-tasks" | "admin-access" | "admin-settings";

interface NavbarProps {
  mode: AppMode;
  currentView: View;
  onNavigate: (view: View) => void;
  onToggleMode: () => void;
}

export default function Navbar({ mode, currentView, onNavigate, onToggleMode }: NavbarProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [compactLogoError, setCompactLogoError] = useState(false);

  const studentLinks: { label: string; view: View }[] = [
    { label: "Inicio", view: "home" },
    { label: "Cursos", view: "courses" },
    { label: "Mis Cursos", view: "dashboard" },
    { label: "Contacto", view: "contact" },
  ];

  const isActive = (view: View) =>
    currentView === view || (view === "courses" && currentView === "course");

  return (
    <>
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}

      {/* Session / demo bar */}
      {user && (
        <div className="bg-alivos-dark border-b border-white/10 px-4 sm:px-6 py-1.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs min-w-0">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                mode === "student" ? "bg-blue-400" : "bg-amber-400"
              }`}
            />
            <span className="text-white/50 hidden sm:inline">Sesión:</span>
            <span className="text-white/80 font-semibold truncate">
              {user.name} · {user.role === "ADMIN" ? "Administrador" : "Alumno"}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleMode}
              className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white px-3 py-1 rounded-full text-xs font-medium transition-all"
              title="Vista de demostración: alternar panel"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Ver como {mode === "student" ? "Admin" : "Alumno"} (demo)</span>
            </button>
            <button
              onClick={logout}
              className="text-white/60 hover:text-white text-xs font-medium px-2.5 py-1 rounded-full hover:bg-white/10 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {/* Main navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => onNavigate(mode === "admin" ? "admin-dashboard" : "home")}
              className="flex items-center shrink-0"
              aria-label="Ir al inicio"
            >
              <div className="hidden sm:block">
                {logoError ? (
                  <span className="text-alivos-dark font-black text-xl tracking-tight">ALIVOS</span>
                ) : (
                  <Image
                    src={LOGO_H}
                    alt="ALIVOS Medicina de Rehabilitación"
                    width={180}
                    height={44}
                    className="h-10 w-auto object-contain"
                    onError={() => setLogoError(true)}
                    priority
                  />
                )}
              </div>
              <div className="sm:hidden">
                {compactLogoError ? (
                  <span className="text-alivos-dark font-black text-xl">ALIVOS</span>
                ) : (
                  <Image
                    src={LOGO_C}
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
              <div className="hidden md:flex items-center gap-0.5">
                {studentLinks.map((link) => (
                  <button
                    key={link.view}
                    onClick={() => onNavigate(link.view)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.view)
                        ? "bg-brand-50 text-brand-700 font-semibold"
                        : "text-slate-600 hover:text-alivos-dark hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}

            {/* Admin breadcrumb */}
            {mode === "admin" && (
              <div className="hidden md:flex items-center">
                <span className="text-xs font-bold text-alivos-dark/60 uppercase tracking-widest bg-alivos-light px-3 py-1.5 rounded-full">
                  Panel Administrador
                </span>
              </div>
            )}

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {mode === "student" && (
                <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Agendar cita
                </button>
              )}

              {user ? (
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-100">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                    {user.name.charAt(0)}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  Ingresar
                </button>
              )}

              {mode === "student" && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 text-slate-500 hover:text-brand-700 hover:bg-slate-50 rounded-lg transition-colors"
                  aria-label="Menú"
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
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {studentLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => { onNavigate(link.view); setMobileOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.view)
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                {!user && (
                  <button
                    onClick={() => { setLoginOpen(true); setMobileOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold"
                  >
                    Ingresar
                  </button>
                )}
                {user && (
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold"
                  >
                    Cerrar sesión ({user.name})
                  </button>
                )}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-success-600 text-white rounded-lg text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Agendar cita
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
