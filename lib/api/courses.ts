import { apiFetch } from "./client";
import { Course, StudentDashboard, VimeoResolved } from "./types";

export async function listCourses(token?: string | null) {
  return apiFetch<{ courses: Course[] }>("/courses", { token });
}

export async function getCourse(slug: string, token?: string | null) {
  return apiFetch<{ course: Course }>(`/courses/${slug}`, { token });
}

export async function listMyCourses() {
  return apiFetch<{ courses: Course[] }>("/my/courses");
}

export async function getMyDashboard() {
  return apiFetch<StudentDashboard>("/my/dashboard");
}

export async function completeLesson(lessonId: string) {
  return apiFetch<{ ok: true }>(`/lessons/${lessonId}/complete`, { method: "POST" });
}

export async function submitTask(lessonId: string, input: { answer?: string; fileUrl?: string }) {
  return apiFetch(`/tasks/${lessonId}/submit`, { method: "POST", body: input });
}

export async function resolveVimeoUrl(url: string) {
  return apiFetch<VimeoResolved>("/vimeo/resolve", { method: "POST", body: { url } });
}
