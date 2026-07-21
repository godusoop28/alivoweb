"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

const LOGO_H = "/logos/logo-nav-horizontal-completo.png";
const LOGO_ICON = "/logos/logo-icono-isotipo.png";

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
  const [iconError, setIconError] = useState(false);

  const publicLinks: { label: string; view: View }[] = [
    { label: "Inicio", view: "home" },
    { label: "Cursos", view: "courses" },
    { label: "Contacto", view: "contact" },
  ];

  const isActive = (view: View) =>
    currentView === view || (view === "courses" && currentView === "course");

  const showBigMobileHeader = mode === "student" && currentView !== "course";

  return (
    <>
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}

      {/* Demo session bar — only visible once someone is logged in */}
      {user && (
        <div className="bg-alivos-dark px-4 sm:px-6 py-1.5 flex items-center justify-between gap-3">
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

      {/* Desktop / tablet navbar — hidden on mobile for the public site */}
      <nav className="relative md:sticky md:top-0 z-40 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-between h-[72px]">
            <button
              onClick={() => onNavigate(mode === "admin" ? "admin-dashboard" : "home")}
              className="flex items-center shrink-0"
              aria-label="Ir al inicio"
            >
              {logoError ? (
                <span className="text-alivos-dark font-black text-xl tracking-tight">ALIVOS</span>
              ) : (
                <Image
                  src={LOGO_H}
                  alt="ALIVOS Medicina de Rehabilitación"
                  width={190}
                  height={46}
                  className="h-11 w-auto object-contain"
                  onError={() => setLogoError(true)}
                  priority
                />
              )}
            </button>

            {mode === "student" && (
              <div className="flex items-center gap-8">
                {publicLinks.map((link) => (
                  <button
                    key={link.view}
                    onClick={() => onNavigate(link.view)}
                    className={`text-sm font-medium transition-colors ${
                      isActive(link.view)
                        ? "text-success-700 font-semibold"
                        : "text-slate-700 hover:text-success-700"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                {user?.role === "STUDENT" && (
                  <button
                    onClick={() => onNavigate("dashboard")}
                    className={`text-sm font-medium transition-colors ${
                      isActive("dashboard") ? "text-success-700 font-semibold" : "text-slate-500 hover:text-success-700"
                    }`}
                  >
                    Mis cursos
                  </button>
                )}
              </div>
            )}

            {mode === "admin" && (
              <span className="text-xs font-bold text-alivos-dark/60 uppercase tracking-widest bg-alivos-light px-3 py-1.5 rounded-full">
                Panel Administrador
              </span>
            )}

            <div className="flex items-center gap-4 shrink-0">
              {mode === "student" && (
                <button
                  onClick={() => onNavigate(user?.role === "STUDENT" ? "dashboard" : "home")}
                  className="relative text-slate-500 hover:text-success-700 transition-colors"
                  aria-label="Mis cursos"
                  title="Mis cursos"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 2L4 6v14a2 2 0 002 2h12a2 2 0 002-2V6l-2-4M6 2h12M6 2l-.01.01M9 10a3 3 0 006 0" />
                  </svg>
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-success-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    0
                  </span>
                </button>
              )}

              {mode === "student" && (
                <button
                  onClick={() => onNavigate("contact")}
                  className="px-5 py-2 bg-success-600 hover:bg-success-700 text-white rounded-full text-sm font-semibold transition-colors"
                >
                  Agendar Cita
                </button>
              )}

              {user ? (
                <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.name.charAt(0)}
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="text-sm font-medium text-slate-500 hover:text-success-700 transition-colors"
                >
                  Ingresar
                </button>
              )}
            </div>
          </div>

          {/* Mobile header — logo + hamburger row, then big site title/tagline */}
          {mode === "student" ? (
            showBigMobileHeader ? (
              <div className="md:hidden py-4">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => onNavigate("home")} aria-label="Ir al inicio" className="shrink-0">
                    {iconError ? (
                      <span className="text-alivos-dark font-black text-lg">+ALIVOS</span>
                    ) : (
                      <Image
                        src={LOGO_ICON}
                        alt="ALIVOS"
                        width={32}
                        height={32}
                        className="h-8 w-auto object-contain"
                        onError={() => setIconError(true)}
                        priority
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-1 text-success-700"
                    aria-label="Menú"
                  >
                    {mobileOpen ? (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                      </svg>
                    )}
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  Alivos - Educación a distancia
                </h1>
                <p className="text-sm text-slate-500 mt-1">Cursos de Estimulación Temprana</p>
              </div>
            ) : (
              <div className="md:hidden flex items-center justify-between h-16">
                <button onClick={() => onNavigate("home")} aria-label="Ir al inicio" className="shrink-0">
                  {iconError ? (
                    <span className="text-alivos-dark font-black text-lg">+ALIVOS</span>
                  ) : (
                    <Image
                      src={LOGO_ICON}
                      alt="ALIVOS"
                      width={30}
                      height={30}
                      className="h-7 w-auto object-contain"
                      onError={() => setIconError(true)}
                    />
                  )}
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="p-1 text-success-700"
                  aria-label="Menú"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </button>
              </div>
            )
          ) : (
            <div className="md:hidden flex items-center h-16">
              <span className="text-xs font-bold text-alivos-dark/60 uppercase tracking-widest">
                Panel Administrador
              </span>
            </div>
          )}
        </div>

        {/* Mobile dropdown menu (public site only) */}
        {mode === "student" && mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {mode === "student" &&
                publicLinks.map((link) => (
                  <button
                    key={link.view}
                    onClick={() => { onNavigate(link.view); setMobileOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.view)
                        ? "bg-success-50 text-success-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              {mode === "student" && user?.role === "STUDENT" && (
                <button
                  onClick={() => { onNavigate("dashboard"); setMobileOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive("dashboard") ? "bg-success-50 text-success-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Mis cursos
                </button>
              )}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                {mode === "student" && !user && (
                  <button
                    onClick={() => { setLoginOpen(true); setMobileOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-full text-sm font-semibold"
                  >
                    Ingresar
                  </button>
                )}
                {mode === "student" && user && (
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-full text-sm font-semibold"
                  >
                    Cerrar sesión ({user.name})
                  </button>
                )}
                {mode === "student" && (
                  <button
                    onClick={() => { onNavigate("contact"); setMobileOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-success-600 text-white rounded-full text-sm font-semibold"
                  >
                    Agendar Cita
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
