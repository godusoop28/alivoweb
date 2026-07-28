"use client";

import { useRef, useState } from "react";
import { Upload as TusUpload } from "tus-js-client";
import { createVimeoUploadTicket, resolveVimeoUrl } from "@/lib/api/courses";

interface VimeoUploadFieldProps {
  label: string;
  value: string;
  thumbnailUrl?: string | null;
  onChange: (vimeoUrl: string) => void;
}

export default function VimeoUploadField({ label, value, thumbnailUrl, onChange }: VimeoUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [preview, setPreview] = useState<{ thumbnailUrl: string | null; title: string | null } | null>(
    thumbnailUrl ? { thumbnailUrl, title: null } : null
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      const ticket = await createVimeoUploadTicket(file.name, file.size);
      await new Promise<void>((resolve, reject) => {
        const upload = new TusUpload(file, {
          uploadUrl: ticket.uploadLink,
          retryDelays: [0, 1000, 3000, 5000],
          onError: reject,
          onProgress: (bytesUploaded, bytesTotal) => setProgress(Math.round((bytesUploaded / bytesTotal) * 100)),
          onSuccess: () => resolve(),
        });
        upload.start();
      });
      onChange(ticket.vimeoUrl);
      setPreview({ thumbnailUrl: null, title: file.name });
      try {
        const resolved = await resolveVimeoUrl(ticket.vimeoUrl);
        setPreview({ thumbnailUrl: resolved.thumbnailUrl, title: resolved.title ?? file.name });
      } catch {
        // best-effort — the video is already linked, only the thumbnail preview is missing
      }
    } catch {
      setError("No se pudo subir el video. Intenta de nuevo.");
    } finally {
      setUploading(false);
      setProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-50 file:text-brand-700 file:text-xs file:font-semibold hover:file:bg-brand-100 disabled:opacity-50"
      />
      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-brand-600 h-2 rounded-full transition-all" style={{ width: `${progress ?? 0}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-1">Subiendo a Vimeo... {progress ?? 0}%</p>
        </div>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {(preview || value) && !uploading && (
        <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
          {preview?.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.thumbnailUrl} alt="" className="w-20 h-12 object-cover rounded-lg" />
          )}
          <p className="text-xs text-slate-600">{preview?.title || (value ? "Video vinculado" : "")}</p>
        </div>
      )}
    </div>
  );
}
