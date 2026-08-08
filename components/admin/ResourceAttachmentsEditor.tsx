"use client";

import { ResourceAttachmentInput } from "@/lib/api/admin";
import FileOrLinkField from "@/components/ui/FileOrLinkField";

interface ResourceAttachmentsEditorProps {
  attachments: ResourceAttachmentInput[];
  onChange: (attachments: ResourceAttachmentInput[]) => void;
}

export default function ResourceAttachmentsEditor({ attachments, onChange }: ResourceAttachmentsEditorProps) {
  const update = (index: number, patch: Partial<ResourceAttachmentInput>) => {
    const next = [...attachments];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const remove = (index: number) => onChange(attachments.filter((_, i) => i !== index));

  const add = () => onChange([...attachments, { title: "", description: "", fileUrl: "", externalUrl: "" }]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Archivos adicionales {attachments.length > 0 && `(${attachments.length})`}
      </label>
      <p className="text-xs text-slate-400 -mt-2">
        Agrega tantos archivos o enlaces (Drive u otros) como quieras para este recurso.
      </p>
      {attachments.map((attachment, index) => (
        <div key={index} className="border border-slate-200 rounded-2xl bg-white shadow-sm p-4 space-y-3">
          <input
            type="text"
            value={attachment.title}
            onChange={(e) => update(index, { title: e.target.value })}
            placeholder="Título del archivo"
            className="w-full border-0 border-b-2 border-slate-200 focus:border-brand-500 px-1 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors"
          />
          <textarea
            value={attachment.description ?? ""}
            onChange={(e) => update(index, { description: e.target.value })}
            placeholder="Descripción (opcional)"
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
          <FileOrLinkField
            fileUrl={attachment.fileUrl ?? ""}
            externalUrl={attachment.externalUrl ?? ""}
            onChangeFileUrl={(url) => update(index, { fileUrl: url })}
            onChangeExternalUrl={(url) => update(index, { externalUrl: url })}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/50 text-slate-500 rounded-xl text-sm font-semibold transition-colors"
      >
        + Agregar archivo
      </button>
    </div>
  );
}
