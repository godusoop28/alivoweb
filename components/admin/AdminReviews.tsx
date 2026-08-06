"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { AdminCourseReview } from "@/lib/api/types";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<AdminCourseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi
      .listAdminReviews()
      .then(({ reviews }) => setReviews(reviews))
      .catch(() => setError("No se pudieron cargar las reseñas."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (review: AdminCourseReview) => {
    const nextStatus = review.status === "APPROVED" ? "HIDDEN" : "APPROVED";
    setBusyId(review.id);
    setError(null);
    try {
      await adminApi.updateReviewStatus(review.id, nextStatus);
      setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, status: nextStatus } : r)));
    } catch {
      setError("No se pudo actualizar la reseña.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Reseñas de cursos</h1>
        <p className="text-slate-500 text-sm mt-1">
          Controla qué reseñas se ven públicamente en cada curso y en la sección de testimonios del inicio
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Cargando reseñas...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Curso</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumno</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Comentario</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50 transition-colors align-top">
                    <td className="px-5 py-4 text-slate-700">{review.courseTitle}</td>
                    <td className="px-5 py-4 text-slate-700">{review.studentName}</td>
                    <td className="px-5 py-4 text-amber-500 font-semibold">{"★".repeat(review.rating)}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden md:table-cell max-w-sm">
                      <p className="line-clamp-3">{review.comment || "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          review.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {review.status === "APPROVED" ? "Visible" : "Oculta"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleToggle(review)}
                        disabled={busyId === review.id}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                          review.status === "APPROVED"
                            ? "text-red-600 hover:bg-red-50"
                            : "text-success-600 hover:bg-success-50"
                        }`}
                      >
                        {review.status === "APPROVED" ? "Ocultar" : "Mostrar"}
                      </button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">
                      Todavía no hay reseñas de cursos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
