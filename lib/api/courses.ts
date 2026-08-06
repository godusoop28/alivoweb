import { apiFetch } from "./client";
import {
  Appointment,
  AppointmentBooking,
  Course,
  CourseReview,
  FormResponse,
  MyTask,
  Professional,
  Purchase,
  StudentDashboard,
  VimeoResolved,
  VimeoUploadTicket,
} from "./types";

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

export async function getMyTask(lessonId: string) {
  return apiFetch<MyTask>(`/tasks/${lessonId}`);
}

export async function addTaskComment(lessonId: string, input: { text?: string; fileUrl?: string }) {
  return apiFetch<MyTask>(`/tasks/${lessonId}/comments`, { method: "POST", body: input });
}

export async function submitCourseReview(slug: string, input: { rating: number; comment?: string }) {
  return apiFetch<CourseReview>(`/courses/${slug}/reviews`, { method: "POST", body: input });
}

export async function purchaseCourse(slug: string) {
  return apiFetch<Purchase>(`/courses/${slug}/purchase`, { method: "POST" });
}

export async function getFormResponse(lessonId: string) {
  return apiFetch<FormResponse | null>(`/lessons/${lessonId}/form-response`);
}

export async function submitFormResponse(lessonId: string, answers: string) {
  return apiFetch<FormResponse>(`/lessons/${lessonId}/form-response`, { method: "POST", body: { answers } });
}

export async function listProfessionals() {
  return apiFetch<{ professionals: Professional[] }>("/advisory/professionals", { token: null });
}

export async function getAdvisoryAvailability(professionalId: string, date: string) {
  return apiFetch<{ slots: string[] }>(
    `/advisory/availability?professionalId=${professionalId}&date=${date}`,
    { token: null }
  );
}

export async function createAppointment(input: {
  professionalId: string;
  date: string;
  time: string;
  notes?: string;
}) {
  return apiFetch<AppointmentBooking>("/advisory/appointments", { method: "POST", body: input });
}

export async function getMyAppointments() {
  return apiFetch<{ appointments: Appointment[] }>("/advisory/appointments/me");
}

export async function resolveVimeoUrl(url: string) {
  return apiFetch<VimeoResolved>("/vimeo/resolve", { method: "POST", body: { url } });
}

export async function createVimeoUploadTicket(fileName: string, fileSizeBytes: number) {
  return apiFetch<VimeoUploadTicket>("/vimeo/upload-ticket", {
    method: "POST",
    body: { fileName, fileSizeBytes },
  });
}
