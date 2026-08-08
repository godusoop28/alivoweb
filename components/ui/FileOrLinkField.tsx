"use client";

import { useRef, useState } from "react";
import { uploadFile } from "@/lib/api/uploads";

interface FileOrLinkFieldProps {
  fileUrl: string;
  externalUrl: string;
  onChangeFileUrl: (url: string) => void;
  onChangeExternalUrl: (url: string) => void;
  accept?: string;
}

/** Lets the admin either upload a file (Cloudinary) or paste a link (Google Drive or any other URL). */
export default function FileOrLinkField({
  fileUrl,
  externalUrl,
  onChangeFileUrl,
  onChangeExternalUrl,
  accept = ".pdf,application/pdf",
}: FileOrLinkFieldProps) {
  const [mode, setMode] = useState<"file" | "link">(externalUrl ? "link" : "file");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      onChangeFileUrl(url);
      onChangeExternalUrl("");
    } catch {
      setError("No se pudo subir el archivo. Intenta de nuevo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center gap-1 mb-1.5">
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
            mode === "file" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Subir archivo
        </button>
        <button
          type="button"
          onClick={() => setMode("link")}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
            mode === "link" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Enlace (Drive u otro)
        </button>
      </div>

      {mode === "file" ? (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-50 file:text-brand-700 file:text-xs file:font-semibold hover:file:bg-brand-100 disabled:opacity-50"
          />
          {uploading && <p className="text-xs text-slate-400 mt-1">Subiendo...</p>}
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Ver archivo actual
            </a>
          )}
        </div>
      ) : (
        <div>
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => {
              onChangeExternalUrl(e.target.value);
              onChangeFileUrl("");
            }}
            placeholder="https://drive.google.com/..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="text-xs text-slate-400 mt-1">Pega un enlace de Google Drive o cualquier otra URL pública.</p>
        </div>
      )}
    </div>
  );
}
