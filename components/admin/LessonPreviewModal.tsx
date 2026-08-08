"use client";

import { Lesson } from "@/lib/api/types";
import Modal from "@/components/ui/Modal";
import RichTextView from "@/components/ui/RichTextView";
import ChecklistView from "@/components/course/ChecklistView";
import LessonAttachmentsView from "@/components/course/LessonAttachmentsView";

interface LessonPreviewModalProps {
  lesson: Lesson;
  onClose: () => void;
}

function parseChecklist(raw: string | null) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function LessonPreviewModal({ lesson, onClose }: LessonPreviewModalProps) {
  return (
    <Modal title={`Vista previa · ${lesson.title}`} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-4">
        {lesson.type === "VIDEO" && (
          <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-md">
            {lesson.vimeoEmbedUrl ? (
              <iframe src={lesson.vimeoEmbedUrl} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={lesson.title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-sm">Video pendiente por configurar</div>
            )}
          </div>
        )}

        {(lesson.type === "PDF" || lesson.type === "EVALUATION") && (lesson.pdfUrl || lesson.materialUrl) && (
          <a
            href={lesson.pdfUrl ?? lesson.materialUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            Ver documento
          </a>
        )}

        {lesson.type === "TEXT" && lesson.imageUrl && (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lesson.imageUrl} alt={lesson.title} className="w-full max-h-64 object-cover" />
          </div>
        )}

        <div className="bg-slate-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
              {lesson.type}
            </span>
            {lesson.durationMinutes ? <span className="text-xs text-slate-400">{lesson.durationMinutes} min</span> : null}
          </div>
          <h2 className="text-xl font-bold text-alivos-dark mb-2">{lesson.title}</h2>
          {lesson.description &&
            (/<[a-z][\s\S]*>/i.test(lesson.description) ? (
              <RichTextView html={lesson.description} />
            ) : (
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{lesson.description}</p>
            ))}
        </div>

        <ChecklistView lessonId={`preview-${lesson.id}`} items={parseChecklist(lesson.checklistItems)} />
        <LessonAttachmentsView attachments={lesson.attachments ?? []} />

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="px-2.5 py-1 bg-slate-100 rounded-full">
            {lesson.commentsEnabled ? "Comentarios habilitados" : "Comentarios deshabilitados"}
          </span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-full">
            {lesson.advisoryEnabled ? "Muestra botón de agendar cita" : "No muestra botón de agendar cita"}
          </span>
        </div>
      </div>
    </Modal>
  );
}
