"use client";

import { useState } from "react";
import { LessonAttachmentInput } from "@/lib/api/admin";
import { FormField } from "@/lib/api/types";
import FileOrLinkField from "@/components/ui/FileOrLinkField";
import FormBuilder from "@/components/admin/FormBuilder";
import LessonSurveyResponsesModal from "@/components/admin/LessonSurveyResponsesModal";

interface LessonAttachmentsEditorProps {
  attachments: LessonAttachmentInput[];
  onChange: (attachments: LessonAttachmentInput[]) => void;
}

const typeLabels: Record<LessonAttachmentInput["type"], string> = {
  PDF: "PDF",
  LINK: "Enlace",
  SURVEY: "Encuesta",
};

function parseFields(json: string | undefined): FormField[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function LessonAttachmentsEditor({ attachments, onChange }: LessonAttachmentsEditorProps) {
  const [viewingResponsesFor, setViewingResponsesFor] = useState<LessonAttachmentInput | null>(null);

  const update = (index: number, patch: Partial<LessonAttachmentInput>) => {
    const next = [...attachments];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const remove = (index: number) => onChange(attachments.filter((_, i) => i !== index));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= attachments.length) return;
    const next = [...attachments];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const add = (type: LessonAttachmentInput["type"]) => {
    onChange([
      ...attachments,
      { title: type === "SURVEY" ? "Nueva encuesta" : "Nuevo adjunto", type, description: "", fileUrl: "", externalUrl: "", formSchema: "[]" },
    ]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          Adjuntos de la lección {attachments.length > 0 && `(${attachments.length})`}
        </span>
      </div>
      <p className="text-xs text-slate-400 -mt-2">
        PDFs, enlaces (por ejemplo de Google Drive) o encuestas. Puedes agregar todos los que quieras.
      </p>

      {attachments.map((attachment, index) => (
        <div key={index} className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={attachment.title}
                onChange={(e) => update(index, { title: e.target.value })}
                placeholder="Título del adjunto"
                className="flex-1 min-w-0 border-0 border-b-2 border-slate-200 focus:border-brand-500 px-1 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors"
              />
              <select
                value={attachment.type}
                onChange={(e) => update(index, { type: e.target.value as LessonAttachmentInput["type"] })}
                className="w-full sm:w-40 shrink-0 border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={attachment.description ?? ""}
              onChange={(e) => update(index, { description: e.target.value })}
              placeholder="Descripción (opcional)"
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />

            {attachment.type === "SURVEY" ? (
              <div className="pt-1 space-y-2">
                {attachment.id && (
                  <button
                    type="button"
                    onClick={() => setViewingResponsesFor(attachment)}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Ver respuestas
                  </button>
                )}
                <FormBuilder
                  fields={parseFields(attachment.formSchema)}
                  onChange={(fields) => update(index, { formSchema: JSON.stringify(fields) })}
                />
              </div>
            ) : (
              <FileOrLinkField
                fileUrl={attachment.fileUrl ?? ""}
                externalUrl={attachment.externalUrl ?? ""}
                onChangeFileUrl={(url) => update(index, { fileUrl: url })}
                onChangeExternalUrl={(url) => update(index, { externalUrl: url })}
                accept={attachment.type === "PDF" ? ".pdf,application/pdf" : undefined}
              />
            )}

            <div className="flex items-center gap-1 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                title="Subir"
                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === attachments.length - 1}
                title="Bajar"
                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                title="Eliminar adjunto"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => add("PDF")}
          className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/50 text-slate-500 rounded-xl text-xs font-semibold transition-colors"
        >
          + PDF / enlace
        </button>
        <button
          type="button"
          onClick={() => add("SURVEY")}
          className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/50 text-slate-500 rounded-xl text-xs font-semibold transition-colors"
        >
          + Encuesta
        </button>
      </div>

      {viewingResponsesFor?.id && (
        <LessonSurveyResponsesModal
          attachmentId={viewingResponsesFor.id}
          title={viewingResponsesFor.title}
          fields={parseFields(viewingResponsesFor.formSchema)}
          onClose={() => setViewingResponsesFor(null)}
        />
      )}
    </div>
  );
}
