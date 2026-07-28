"use client";

import { FormField, FormFieldType } from "@/lib/api/types";

interface FormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

const typeLabels: Record<FormFieldType, string> = {
  TEXT: "Respuesta corta",
  TEXTAREA: "Párrafo",
  CHOICE: "Opción única",
  CHECKBOX: "Casillas (varias opciones)",
};

function newField(): FormField {
  return { id: crypto.randomUUID(), label: "", type: "TEXT", required: false, options: [] };
}

export default function FormBuilder({ fields, onChange }: FormBuilderProps) {
  const update = (index: number, patch: Partial<FormField>) => {
    const next = [...fields];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    const next = [...fields];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="border border-slate-200 rounded-xl p-3 space-y-2 bg-slate-50">
          <div className="flex items-start gap-2">
            <input
              type="text"
              value={field.label}
              onChange={(e) => update(index, { label: e.target.value })}
              placeholder={`Pregunta ${index + 1}`}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
            />
            <select
              value={field.type}
              onChange={(e) => update(index, { type: e.target.value as FormFieldType })}
              className="border border-slate-200 rounded-lg px-2 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
            >
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {(field.type === "CHOICE" || field.type === "CHECKBOX") && (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Opciones (una por línea)</label>
              <textarea
                rows={3}
                value={field.options.join("\n")}
                onChange={(e) => update(index, { options: e.target.value.split("\n") })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none bg-white"
                placeholder={"Opción 1\nOpción 2"}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => update(index, { required: e.target.checked })}
                className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
              />
              Obligatoria
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="p-1 text-slate-400 hover:text-brand-600 disabled:opacity-30 text-sm"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === fields.length - 1}
                className="p-1 text-slate-400 hover:text-brand-600 disabled:opacity-30 text-sm"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1 text-red-500 hover:text-red-700 text-xs font-semibold"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...fields, newField()])}
        className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-brand-300 hover:text-brand-600 text-slate-400 rounded-xl text-sm font-medium transition-colors"
      >
        + Agregar pregunta
      </button>
    </div>
  );
}
