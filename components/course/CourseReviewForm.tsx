"use client";

import { useState } from "react";
import { submitCourseReview } from "@/lib/api/courses";
import { CourseReview } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

interface CourseReviewFormProps {
  slug: string;
  existingReview: CourseReview | null;
  onSubmitted: (review: CourseReview) => void;
}

export default function CourseReviewForm({ slug, existingReview, onSubmitted }: CourseReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      setError("Selecciona una calificación de estrellas.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const review = await submitCourseReview(slug, { rating, comment: comment.trim() || undefined });
      onSubmitted(review);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar tu reseña.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-brand-100">
      <h3 className="font-semibold text-alivos-dark mb-1">
        {existingReview ? "Tu reseña" : "¡Terminaste el curso! Déjanos tu reseña"}
      </h3>
      <p className="text-sm text-slate-500 mb-4">Tu opinión ayuda a otras familias a elegir este curso.</p>
      {sent && (
        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          ¡Gracias por tu reseña!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5"
              aria-label={`${star} estrellas`}
            >
              <svg
                className={`w-7 h-7 transition-colors ${
                  (hoverRating || rating) >= star ? "text-amber-400" : "text-slate-200"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 21.04a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </button>
          ))}
        </div>
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <textarea
          className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
          rows={3}
          placeholder="Cuéntanos qué te pareció el curso (opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="submit"
          disabled={saving}
          className="mt-3 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {saving ? "Guardando..." : existingReview ? "Actualizar reseña" : "Enviar reseña"}
        </button>
      </form>
    </div>
  );
}
