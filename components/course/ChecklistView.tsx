"use client";

import { useEffect, useState } from "react";
import { ChecklistItem } from "@/lib/api/types";

interface ChecklistViewProps {
  lessonId: string;
  items: ChecklistItem[];
}

export default function ChecklistView({ lessonId, items }: ChecklistViewProps) {
  const storageKey = `alivos_checklist_${lessonId}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      setChecked(raw ? JSON.parse(raw) : {});
    } catch {
      setChecked({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // best-effort
      }
      return next;
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
      <h3 className="font-semibold text-alivos-dark mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Checklist de materiales
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={() => toggle(item.id)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
              />
              <span className={`text-sm ${checked[item.id] ? "text-slate-400 line-through" : "text-slate-700"}`}>
                {item.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
