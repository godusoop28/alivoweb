"use client";

import { useEffect, useState } from "react";
import { getFormResponse, submitFormResponse } from "@/lib/api/courses";
import { FormField } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

interface FormRendererProps {
  lessonId: string;
  fields: FormField[];
}

type Answers = Record<string, string | string[]>;

function hasAnswer(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.length > 0;
  return !!value && value.trim().length > 0;
}

export default function FormRenderer({ lessonId, fields }: FormRendererProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setAnswers({});
    setSubmittedAt(null);
    getFormResponse(lessonId)
      .then((response) => {
        if (cancelled || !response) return;
        try {
          setAnswers(JSON.parse(response.answers));
        } catch {
          setAnswers({});
        }
        setSubmittedAt(response.submittedAt);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  const setAnswer = (fieldId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleCheckbox = (fieldId: string, option: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[fieldId]) ? (prev[fieldId] as string[]) : [];
      const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
      return { ...prev, [fieldId]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.find((f) => f.required && !hasAnswer(answers[f.id]));
    if (missing) {
      setError(`Responde: "${missing.label || "pregunta obligatoria"}"`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const response = await submitFormResponse(lessonId, JSON.stringify(answers));
      setSubmittedAt(response.submittedAt);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo enviar el formulario.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm text-sm text-slate-400">Cargando formulario...</div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
      {submittedAt && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          Respuestas guardadas el {new Date(submittedAt).toLocaleString("es-MX")}. Puedes editarlas y volver a enviar.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {field.label || "Pregunta"} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === "TEXT" && (
              <input
                type="text"
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(field.id, e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            )}
            {field.type === "TEXTAREA" && (
              <textarea
                rows={3}
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(field.id, e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
              />
            )}
            {field.type === "CHOICE" && (
              <div className="space-y-1.5">
                {field.options.filter(Boolean).map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name={field.id}
                      checked={answers[field.id] === option}
                      onChange={() => setAnswer(field.id, option)}
                      className="text-brand-600 focus:ring-brand-300"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {field.type === "CHECKBOX" && (
              <div className="space-y-1.5">
                {field.options.filter(Boolean).map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Array.isArray(answers[field.id]) && (answers[field.id] as string[]).includes(option)}
                      onChange={() => toggleCheckbox(field.id, option)}
                      className="rounded text-brand-600 focus:ring-brand-300"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {saving ? "Enviando..." : submittedAt ? "Actualizar respuestas" : "Enviar formulario"}
        </button>
      </form>
    </div>
  );
}
