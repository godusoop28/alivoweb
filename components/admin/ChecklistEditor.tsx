"use client";

import { ChecklistItem } from "@/lib/api/types";

interface ChecklistEditorProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function ChecklistEditor({ items, onChange }: ChecklistEditorProps) {
  const update = (index: number, text: string) => {
    const next = [...items];
    next[index] = { ...next[index], text };
    onChange(next);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  const add = () => onChange([...items, { id: makeId(), text: "" }]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">Checklist de materiales</label>
      <p className="text-xs text-slate-400">Lista de materiales o cosas que el estudiante necesita para esta lección.</p>
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <span className="w-4 h-4 shrink-0 rounded border-2 border-slate-300" />
          <input
            type="text"
            value={item.text}
            onChange={(e) => update(index, e.target.value)}
            placeholder={`Material ${index + 1}`}
            className="flex-1 min-w-0 border-0 border-b border-slate-200 focus:border-brand-500 px-1 py-1.5 text-sm outline-none transition-colors"
          />
          <button
            type="button"
            onClick={() => remove(index)}
            aria-label="Eliminar material"
            className="shrink-0 p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-brand-600 py-1 transition-colors"
      >
        <span className="w-4 h-4 flex items-center justify-center shrink-0">+</span>
        Agregar material
      </button>
    </div>
  );
}
