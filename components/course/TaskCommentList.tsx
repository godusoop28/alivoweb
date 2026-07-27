"use client";

import { TaskComment } from "@/lib/api/types";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

interface TaskCommentListProps {
  comments: TaskComment[];
  viewerRole: "STUDENT" | "ADMIN";
}

export default function TaskCommentList({ comments, viewerRole }: TaskCommentListProps) {
  if (comments.length === 0) return null;

  return (
    <div className="space-y-3">
      {comments.map((c) => {
        const isViewer = c.authorRole === viewerRole;
        return (
          <div key={c.id} className={`flex gap-2.5 ${isViewer ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                c.authorRole === "STUDENT" ? "bg-brand-100 text-brand-700" : "bg-orange-100 text-orange-700"
              }`}
            >
              {initials(c.authorName)}
            </div>
            <div className={`max-w-[80%] flex flex-col ${isViewer ? "items-end" : "items-start"}`}>
              <div
                className={`inline-block px-3.5 py-2.5 rounded-2xl text-sm ${
                  isViewer ? "bg-brand-50 text-slate-700 rounded-tr-sm" : "bg-slate-100 text-slate-700 rounded-tl-sm"
                }`}
              >
                <p className="text-xs font-semibold mb-0.5 text-slate-500">
                  {c.authorName}
                  {c.authorRole === "ADMIN" ? " · ALIVOS" : ""}
                </p>
                {c.text && <p className="whitespace-pre-wrap">{c.text}</p>}
                {c.fileUrl && (
                  <a
                    href={c.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Ver archivo adjunto
                  </a>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {new Date(c.createdAt).toLocaleString("es-MX", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
