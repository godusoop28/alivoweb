"use client";

import { useState } from "react";
import { purchaseCourse } from "@/lib/api/courses";
import { Course } from "@/lib/api/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import LoginModal from "@/components/auth/LoginModal";

interface PurchaseGateProps {
  course: Course;
}

export default function PurchaseGate({ course }: PurchaseGateProps) {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setRequesting(true);
    setError(null);
    try {
      await purchaseCourse(course.slug);
      setRequested(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar la compra. Intenta de nuevo.");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center mb-6">
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 className="font-semibold text-alivos-dark mb-2">Este contenido está bloqueado</h3>
      <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">
        Compra el curso o pide acceso al equipo de ALIVOS para ver videos, PDFs y tareas de esta lección.
      </p>
      {requested ? (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 max-w-sm mx-auto">
          Tu compra quedó registrada y está pendiente de confirmación. Te avisaremos en cuanto se active tu acceso.
        </div>
      ) : (
        <>
          {error && (
            <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 max-w-sm mx-auto">
              {error}
            </div>
          )}
          <button
            onClick={handlePurchase}
            disabled={requesting}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
          >
            {requesting ? "Un momento..." : `Comprar curso — $${course.price.toLocaleString("es-MX")}`}
          </button>
        </>
      )}
    </div>
  );
}
