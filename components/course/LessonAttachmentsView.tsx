"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { LessonAttachment } from "@/lib/api/types";
import LessonSurveyRenderer from "@/components/course/LessonSurveyRenderer";

interface LessonAttachmentsViewProps {
  attachments: LessonAttachment[];
}

function parseFields(json: string | null) {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function LessonAttachmentsView({ attachments }: LessonAttachmentsViewProps) {
  const { user } = useAuth();
  if (attachments.length === 0) return null;

  const files = attachments.filter((a) => a.type !== "SURVEY");
  const surveys = attachments.filter((a) => a.type === "SURVEY");

  return (
    <div className="space-y-4 mb-4">
      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-alivos-dark mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            Archivos adjuntos
          </h3>
          <div className="space-y-2">
            {files.map((attachment) => {
              const href = attachment.fileUrl || attachment.externalUrl || "#";
              return (
                <a
                  key={attachment.id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-brand-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-alivos-dark group-hover:text-brand-700 truncate">
                      {attachment.title}
                    </p>
                    {attachment.description && (
                      <p className="text-xs text-slate-400 truncate">{attachment.description}</p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {surveys.length > 0 &&
        (user ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-5">
            <h3 className="font-semibold text-alivos-dark flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17h6m-6-4h6m-6-4h6M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Encuestas de la lección
            </h3>
            {surveys.map((survey) => (
              <LessonSurveyRenderer
                key={survey.id}
                attachmentId={survey.id}
                title={survey.title}
                fields={parseFields(survey.formSchema)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <p className="text-sm text-slate-600">Inicia sesión para responder las encuestas de esta lección.</p>
          </div>
        ))}
    </div>
  );
}
