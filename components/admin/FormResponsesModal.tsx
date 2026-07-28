"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { FormField, FormResponse } from "@/lib/api/types";
import Modal from "@/components/ui/Modal";

interface FormResponsesModalProps {
  lessonId: string;
  lessonTitle: string;
  fields: FormField[];
  onClose: () => void;
}

export default function FormResponsesModal({ lessonId, lessonTitle, fields, onClose }: FormResponsesModalProps) {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .listFormResponses(lessonId)
      .then(({ responses }) => setResponses(responses))
      .catch(() => setError("No se pudieron cargar las respuestas."))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const fieldLabel = (id: string) => fields.find((f) => f.id === id)?.label || id;

  return (
    <Modal title={`Respuestas — ${lessonTitle}`} onClose={onClose} maxWidth="max-w-2xl">
      {loading ? (
        <p className="text-sm text-slate-400">Cargando...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : responses.length === 0 ? (
        <p className="text-sm text-slate-400">Todavía nadie ha respondido este formulario.</p>
      ) : (
        <div className="space-y-4">
          {responses.map((response) => {
            let parsed: Record<string, string | string[]> = {};
            try {
              parsed = JSON.parse(response.answers);
            } catch {
              parsed = {};
            }
            return (
              <div key={response.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-alivos-dark text-sm">{response.studentName}</p>
                  <p className="text-xs text-slate-400">{new Date(response.submittedAt).toLocaleString("es-MX")}</p>
                </div>
                <p className="text-xs text-slate-400 mb-3">{response.studentEmail}</p>
                <div className="space-y-2">
                  {Object.entries(parsed).map(([fieldId, value]) => (
                    <div key={fieldId} className="text-sm">
                      <p className="font-medium text-slate-600">{fieldLabel(fieldId)}</p>
                      <p className="text-slate-700">{Array.isArray(value) ? value.join(", ") || "—" : value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
