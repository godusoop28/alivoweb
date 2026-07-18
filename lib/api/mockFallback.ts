// Fallback used only when the API is unreachable, so the demo never shows a
// blank page. Adapts lib/mockData.ts (pre-API demo data) into the same
// shape the real API returns.
import { courses as mockCourses } from "@/lib/mockData";
import { Course, CourseStatus, LessonType } from "./types";

const STATUS_MAP: Record<string, CourseStatus> = {
  published: "PUBLISHED",
  draft: "DRAFT",
  hidden: "HIDDEN",
};

const TYPE_MAP: Record<string, LessonType> = {
  video: "VIDEO",
  text: "TEXT",
  pdf: "PDF",
  task: "TASK",
  evaluation: "EVALUATION",
};

export function getFallbackCourses(): Course[] {
  return mockCourses.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.id,
    ageRange: c.ageRange,
    shortDescription: c.shortDescription,
    longDescription: c.longDescription,
    price: c.price,
    imageUrl: c.imageUrl ?? null,
    bannerImage: c.bannerImage ?? null,
    status: STATUS_MAP[c.status] ?? "DRAFT",
    studentsCount: c.studentsCount,
    enrolled: c.enrolled,
    progress: c.progress,
    modules: c.modules.map((m, i) => ({
      id: m.id,
      title: m.title,
      description: null,
      order: i,
      coverImage: m.coverImage ?? null,
      bannerImage: m.bannerImage ?? null,
      lessons: m.lessons.map((l, j) => ({
        id: l.id,
        title: l.title,
        type: TYPE_MAP[l.type] ?? "VIDEO",
        description: l.description ?? null,
        order: j,
        durationMinutes: l.duration ?? null,
        visible: l.visible,
        hasMaterial: l.hasMaterial,
        materialUrl: null,
        hasTask: l.hasTask,
        taskDescription: l.taskDescription ?? null,
        vimeoId: null,
        vimeoUrl: l.vimeoUrl ?? null,
        vimeoEmbedUrl: null,
        vimeoThumbnail: null,
        imageUrl: l.imageUrl ?? null,
        pdfUrl: l.pdfUrl ?? null,
        assetType: l.assetType ?? null,
        completed: l.completed,
      })),
    })),
  }));
}
