"use client";

import { useEffect, useState } from "react";
import { listResources } from "@/lib/api/resources";
import { LearningResource, ResourceType } from "@/lib/api/types";
import Modal from "@/components/ui/Modal";
import RichTextView from "@/components/ui/RichTextView";

const typeLabel: Record<ResourceType, string> = {
  PDF: "PDF",
  VIDEO: "Video",
  ARTICLE: "Lectura",
  LINK: "Enlace",
};

const typeColor: Record<ResourceType, string> = {
  PDF: "bg-red-100 text-red-700",
  VIDEO: "bg-blue-100 text-blue-700",
  ARTICLE: "bg-purple-100 text-purple-700",
  LINK: "bg-slate-100 text-slate-600",
};

function TypeIcon({ type, className }: { type: ResourceType; className?: string }) {
  switch (type) {
    case "PDF":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "VIDEO":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-2.36a.75.75 0 011.03.67v6.38a.75.75 0 01-1.03.67l-4.72-2.36M4.5 6.75h9a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5v-6a1.5 1.5 0 011.5-1.5z" />
        </svg>
      );
    case "ARTICLE":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 010 5.656l-4 4a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l4-4a4 4 0 015.656 5.656l-1.5 1.5" />
        </svg>
      );
  }
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<LearningResource | null>(null);

  useEffect(() => {
    let cancelled = false;
    listResources()
      .then(({ resources }) => {
        if (!cancelled) setResources(resources);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-16">
        <div className="mb-10 sm:mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Aprende Más</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Biblioteca de recursos gratuitos del equipo de ALIVOS: PDFs, lecturas, videos cortos y más,
            complementarios a los cursos.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
            No pudimos conectar con el servidor en este momento.
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-slate-100 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-slate-100" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            Todavía no hay recursos disponibles. Vuelve pronto.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => setSelected(resource)}
                className="text-left bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-200 hover:-translate-y-0.5 transition-all flex flex-col group"
              >
                <div className="aspect-[4/3] bg-alivos-light relative overflow-hidden">
                  {resource.coverImage || resource.vimeoThumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resource.coverImage ?? resource.vimeoThumbnail ?? undefined}
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-300">
                      <TypeIcon type={resource.type} className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span
                    className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${typeColor[resource.type]}`}
                  >
                    {typeLabel[resource.type]}
                  </span>
                  {resource.attachments && resource.attachments.length > 0 && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-600 shadow-sm">
                      +{resource.attachments.length} archivo{resource.attachments.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-slate-900 mb-1.5 leading-snug group-hover:text-brand-700 transition-colors">
                    {resource.title}
                  </h3>
                  {resource.description && (
                    <p className="text-sm text-slate-500 line-clamp-3">{resource.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)} maxWidth="max-w-2xl">
          {selected.description && (
            <p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p>
          )}

          {selected.type === "VIDEO" && (
            selected.vimeoEmbedUrl ? (
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
                <iframe
                  src={selected.vimeoEmbedUrl}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={selected.title}
                />
              </div>
            ) : (
              <p className="text-sm text-slate-400">Este video todavía no está disponible.</p>
            )
          )}

          {selected.type === "ARTICLE" && (
            selected.content ? (
              /<[a-z][\s\S]*>/i.test(selected.content) ? (
                <RichTextView html={selected.content} />
              ) : (
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{selected.content}</p>
              )
            ) : (
              <p className="text-slate-400 text-sm">Este contenido todavía no está disponible.</p>
            )
          )}

          {selected.type === "PDF" && (
            selected.fileUrl ? (
              <a
                href={selected.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                <TypeIcon type="PDF" className="w-4 h-4" />
                Ver / descargar PDF
              </a>
            ) : (
              <p className="text-sm text-slate-400">Este PDF todavía no está disponible.</p>
            )
          )}

          {selected.type === "LINK" && (
            selected.externalUrl ? (
              <a
                href={selected.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                Abrir enlace
              </a>
            ) : (
              <p className="text-sm text-slate-400">Este enlace todavía no está disponible.</p>
            )
          )}

          {selected.attachments && selected.attachments.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Archivos adicionales</h4>
              <div className="space-y-2">
                {selected.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.fileUrl || attachment.externalUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-brand-50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                      <TypeIcon type="PDF" className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 group-hover:text-brand-700 truncate">
                        {attachment.title}
                      </p>
                      {attachment.description && (
                        <p className="text-xs text-slate-400 truncate">{attachment.description}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
