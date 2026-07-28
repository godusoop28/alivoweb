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
  CHECKBOX: "Casillas",
};

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `field-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function newField(): FormField {
  return { id: makeId(), label: "", type: "TEXT", required: false, options: [] };
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <span className="text-sm text-slate-600">Obligatoria</span>
      <span className="relative inline-block w-9 h-5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-slate-200 peer-checked:bg-brand-600 transition-colors" />
        <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
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

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const field = fields[fieldIndex];
    const options = [...field.options];
    options[optionIndex] = value;
    update(fieldIndex, { options });
  };

  const addOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    update(fieldIndex, { options: [...field.options, ""] });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    update(fieldIndex, { options: field.options.filter((_, i) => i !== optionIndex) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          Preguntas {fields.length > 0 && `(${fields.length})`}
        </span>
      </div>

      {fields.length === 0 && (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
          <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17h6m-6-4h6m-6-4h6M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-slate-400">Este formulario todavía no tiene preguntas.</p>
        </div>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="h-1.5 bg-brand-500" />
          <div className="p-4 sm:p-5 space-y-4">
            {/* Question label + type */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={field.label}
                onChange={(e) => update(index, { label: e.target.value })}
                placeholder={`Pregunta ${index + 1}`}
                className="flex-1 min-w-0 border-0 border-b-2 border-slate-200 focus:border-brand-500 px-1 py-2 text-base text-slate-800 placeholder:text-slate-400 outline-none transition-colors"
              />
              <select
                value={field.type}
                onChange={(e) => update(index, { type: e.target.value as FormFieldType })}
                className="w-full sm:w-52 shrink-0 border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Options for choice/checkbox */}
            {(field.type === "CHOICE" || field.type === "CHECKBOX") && (
              <div className="space-y-2.5 pl-1">
                {field.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2.5">
                    <span className="shrink-0 text-slate-300">
                      {field.type === "CHOICE" ? (
                        <span className="block w-4 h-4 rounded-full border-2 border-current" />
                      ) : (
                        <span className="block w-4 h-4 rounded border-2 border-current" />
                      )}
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                      placeholder={`Opción ${optionIndex + 1}`}
                      className="flex-1 min-w-0 border-0 border-b border-slate-200 focus:border-brand-500 px-1 py-1.5 text-sm outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index, optionIndex)}
                      aria-label="Eliminar opción"
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
                  onClick={() => addOption(index)}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-brand-600 pl-6 py-1 transition-colors"
                >
                  <span className="w-4 h-4 flex items-center justify-center shrink-0">+</span>
                  Agregar opción
                </button>
              </div>
            )}

            {/* Footer: reorder / delete / required */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-wrap">
              <div className="flex items-center gap-1">
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
                  disabled={index === fields.length - 1}
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
                  title="Eliminar pregunta"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <Toggle checked={field.required} onChange={(required) => update(index, { required })} />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...fields, newField()])}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/50 text-slate-500 rounded-2xl text-sm font-semibold transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Agregar pregunta
      </button>
    </div>
  );
}
