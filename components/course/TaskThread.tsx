"use client";

import { useEffect, useRef, useState } from "react";
import { Upload as TusUpload } from "tus-js-client";
import { addTaskComment, createVimeoUploadTicket, getMyTask } from "@/lib/api/courses";
import { uploadFile } from "@/lib/api/uploads";
import { MyTask, TaskStatus } from "@/lib/api/types";
import TaskCommentList from "@/components/course/TaskCommentList";

interface TaskThreadProps {
  lessonId: string;
}

const STATUS_META: Record<TaskStatus, { label: string; className: string }> = {
  PENDING: { label: "Sin entregar", className: "bg-slate-100 text-slate-600" },
  DELIVERED: { label: "Entregada — esperando revisión", className: "bg-blue-100 text-blue-700" },
  REVIEWED: { label: "Revisada", className: "bg-blue-100 text-blue-700" },
  NEEDS_CORRECTION: { label: "Necesita corrección", className: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Aprobada", className: "bg-green-100 text-green-700" },
};

export default function TaskThread({ lessonId }: TaskThreadProps) {
  const [task, setTask] = useState<MyTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setTask(null);
    getMyTask(lessonId)
      .then((data) => {
        if (!cancelled) setTask(data);
      })
      .catch(() => {
        if (!cancelled) setTask(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    setUploadProgress(null);
    setFileName(file.name);
    try {
      if (file.type.startsWith("video/")) {
        // Videos go to Vimeo, same as lesson videos in the admin panel.
        const ticket = await createVimeoUploadTicket(file.name, file.size);
        await new Promise<void>((resolve, reject) => {
          const upload = new TusUpload(file, {
            uploadUrl: ticket.uploadLink,
            retryDelays: [0, 1000, 3000, 5000],
            onError: reject,
            onProgress: (bytesUploaded, bytesTotal) => {
              setUploadProgress(Math.round((bytesUploaded / bytesTotal) * 100));
            },
            onSuccess: () => resolve(),
          });
          upload.start();
        });
        setFileUrl(ticket.vimeoUrl);
      } else {
        // Photos, PDFs and anything else go to Cloudinary.
        const { url } = await uploadFile(file);
        setFileUrl(url);
      }
    } catch {
      setError("No se pudo subir el archivo. Intenta de nuevo.");
      setFileName("");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !fileUrl) return;
    setSending(true);
    setError(null);
    try {
      const updated = await addTaskComment(lessonId, { text: text.trim() || undefined, fileUrl: fileUrl || undefined });
      setTask(updated);
      setText("");
      setFileUrl("");
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("No se pudo enviar el comentario. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const isTask = task?.lessonHasTask ?? false;
  const meta = STATUS_META[task?.status ?? "PENDING"];
  const hasThread = !!task && task.comments.length > 0;

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border-l-4 border-brand-400">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <h3 className="font-semibold text-alivos-dark flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isTask ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            )}
          </svg>
          {isTask ? "Tarea de la lección" : "Comentarios de la lección"}
        </h3>
        {isTask && (
          <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.className}`}>
            {meta.label}
          </span>
        )}
      </div>
      {task?.taskInstructions && <p className="text-sm text-slate-600 leading-relaxed mb-4">{task.taskInstructions}</p>}

      {loading ? (
        <p className="text-xs text-slate-400">Cargando...</p>
      ) : (
        <>
          {hasThread && (
            <div className="mb-4">
              <TaskCommentList comments={task!.comments} viewerRole="STUDENT" />
            </div>
          )}

          <form onSubmit={handleSend}>
            <textarea
              className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
              rows={3}
              placeholder={
                hasThread ? "Escribe un comentario..." : isTask ? "Escribe tu respuesta aquí..." : "Escribe tu pregunta o comentario..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Adjuntar foto, video o PDF (opcional)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,application/pdf"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
                className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-50 file:text-brand-700 file:text-xs file:font-semibold hover:file:bg-brand-100 disabled:opacity-50"
              />
              {uploading && (
                <div className="mt-2">
                  {uploadProgress !== null ? (
                    <>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-brand-600 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Subiendo video... {uploadProgress}%</p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 mt-1">Subiendo archivo...</p>
                  )}
                </div>
              )}
              {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
              {fileUrl && !uploading && (
                <p className="text-xs text-success-600 font-medium mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Archivo listo: {fileName || "adjunto"}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-3">
              <button
                type="submit"
                disabled={uploading || sending || (!text.trim() && !fileUrl)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {sending ? "Enviando..." : hasThread ? "Enviar comentario" : isTask ? "Enviar tarea" : "Enviar"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
