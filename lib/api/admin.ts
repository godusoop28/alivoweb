import { apiFetch } from "./client";
import {
  AdminDashboard,
  Course,
  ManualAccess,
  Purchase,
  Student,
  StudentDetail,
  TaskSubmission,
} from "./types";

export async function getAdminDashboard() {
  return apiFetch<AdminDashboard>("/admin/dashboard");
}

// ----- Courses -----

export interface CourseInput {
  title: string;
  slug?: string;
  ageRange: string;
  shortDescription: string;
  longDescription?: string;
  price: number;
  coverImage?: string;
  bannerImage?: string;
  status?: "PUBLISHED" | "DRAFT" | "HIDDEN";
}

export async function listAdminCourses() {
  return apiFetch<{ courses: Course[] }>("/admin/courses");
}

export async function createCourse(input: CourseInput) {
  return apiFetch<{ course: Course }>("/admin/courses", { method: "POST", body: input });
}

export async function updateCourse(id: string, input: Partial<CourseInput>) {
  return apiFetch<{ course: Course }>(`/admin/courses/${id}`, { method: "PATCH", body: input });
}

export async function deleteCourse(id: string) {
  return apiFetch<{ ok: true }>(`/admin/courses/${id}`, { method: "DELETE" });
}

// ----- Modules -----

export interface ModuleInput {
  title: string;
  description?: string;
  order?: number;
  visible?: boolean;
  coverImage?: string;
  bannerImage?: string;
}

export async function createModule(courseId: string, input: ModuleInput) {
  return apiFetch(`/admin/courses/${courseId}/modules`, { method: "POST", body: input });
}

export async function updateModule(id: string, input: Partial<ModuleInput>) {
  return apiFetch(`/admin/modules/${id}`, { method: "PATCH", body: input });
}

export async function deleteModule(id: string) {
  return apiFetch<{ ok: true }>(`/admin/modules/${id}`, { method: "DELETE" });
}

// ----- Lessons -----

export interface LessonInput {
  title: string;
  type?: "VIDEO" | "TEXT" | "PDF" | "TASK" | "EVALUATION";
  description?: string;
  order?: number;
  durationMinutes?: number;
  visible?: boolean;
  hasMaterial?: boolean;
  materialUrl?: string;
  hasTask?: boolean;
  taskDescription?: string;
  vimeoUrl?: string;
  imageUrl?: string;
  pdfUrl?: string;
  assetType?: string;
}

export async function createLesson(moduleId: string, input: LessonInput) {
  return apiFetch(`/admin/modules/${moduleId}/lessons`, { method: "POST", body: input });
}

export async function updateLesson(id: string, input: Partial<LessonInput>) {
  return apiFetch(`/admin/lessons/${id}`, { method: "PATCH", body: input });
}

export async function deleteLesson(id: string) {
  return apiFetch<{ ok: true }>(`/admin/lessons/${id}`, { method: "DELETE" });
}

// ----- Students -----

export async function listStudents() {
  return apiFetch<{ students: Student[] }>("/admin/students");
}

export async function getStudent(id: string) {
  return apiFetch<{ student: StudentDetail }>(`/admin/students/${id}`);
}

export async function setStudentStatus(id: string, status: "ACTIVE" | "BLOCKED") {
  return apiFetch(`/admin/students/${id}/status`, { method: "PATCH", body: { status } });
}

// ----- Purchases -----

export async function listPurchases() {
  return apiFetch<{ purchases: Purchase[] }>("/admin/purchases");
}

// ----- Tasks -----

export async function listTasks() {
  return apiFetch<{ tasks: TaskSubmission[] }>("/admin/tasks");
}

export async function reviewTask(
  id: string,
  input: { status: "APPROVED" | "NEEDS_CORRECTION" | "REVIEWED"; adminComment?: string }
) {
  return apiFetch(`/admin/tasks/${id}/review`, { method: "PATCH", body: input });
}

// ----- Manual access -----

export async function listManualAccess() {
  return apiFetch<{ accesses: ManualAccess[] }>("/admin/manual-access");
}

export async function grantManualAccess(input: {
  email: string;
  courseId: string;
  reason?: string;
  expiresAt?: string;
}) {
  return apiFetch<{ access: ManualAccess }>("/admin/manual-access", { method: "POST", body: input });
}

export async function revokeManualAccess(id: string) {
  return apiFetch(`/admin/manual-access/${id}/revoke`, { method: "PATCH" });
}
