"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { ContactMessage } from "@/lib/api/types";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .listContactMessages()
      .then(({ messages }) => setMessages(messages))
      .catch(() => setError("No se pudieron cargar los mensajes."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Mensajes de contacto</h1>
        <p className="text-slate-500 text-sm mt-1">Mensajes enviados desde el formulario de contacto público</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="text-center text-slate-400 text-sm py-10">Cargando mensajes...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-sm border border-slate-100">
          Todavía no hay mensajes de contacto.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-alivos-dark">
                  {message.name} {message.lastName ?? ""}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(message.createdAt).toLocaleString("es-MX")}
                </span>
              </div>
              <a href={`mailto:${message.email}`} className="text-xs text-brand-600 hover:text-brand-700">
                {message.email}
              </a>
              <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">{message.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
