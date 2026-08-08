import { apiFetch } from "./client";
import {
  AdminCourseReview,
  AdminDashboard,
  Appointment,
  AppointmentAccess,
  AppointmentStatus,
  ContactMessage,
  Course,
  CourseReviewStatus,
  FormResponse,
  LearningResource,
  LessonAttachmentType,
  LessonSurveyResponse,
  ManualAccess,
  Professional,
  Purchase,
  ResourceType,
  Student,
  StudentDetail,
  TaskSubmission,
  Testimonial,
  TestimonialStatus,
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
  previewVimeoUrl?: string;
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

export interface LessonAttachmentInput {
  id?: string;
  type: LessonAttachmentType;
  title: string;
  description?: string;
  fileUrl?: string;
  externalUrl?: string;
  formSchema?: string;
  order?: number;
}

export interface LessonInput {
  title: string;
  type?: "VIDEO" | "TEXT" | "PDF" | "TASK" | "EVALUATION" | "FORM";
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
  formSchema?: string;
  checklistItems?: string;
  commentsEnabled?: boolean;
  advisoryEnabled?: boolean;
  attachments?: LessonAttachmentInput[];
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

export async function listFormResponses(lessonId: string) {
  return apiFetch<{ responses: FormResponse[] }>(`/admin/lessons/${lessonId}/form-responses`);
}

export async function listLessonSurveyResponses(attachmentId: string) {
  return apiFetch<{ responses: LessonSurveyResponse[] }>(`/admin/lesson-attachments/${attachmentId}/survey-responses`);
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

export async function updatePurchaseStatus(id: string, status: "PAID" | "FAILED") {
  return apiFetch<Purchase>(`/admin/purchases/${id}/status`, { method: "PATCH", body: { status } });
}

// ----- Tasks -----

export async function listTasks() {
  return apiFetch<{ tasks: TaskSubmission[] }>("/admin/tasks");
}

export async function reviewTask(
  id: string,
  input: { status: "APPROVED" | "NEEDS_CORRECTION" | "REVIEWED"; adminComment?: string }
) {
  return apiFetch<TaskSubmission>(`/admin/tasks/${id}/review`, { method: "PATCH", body: input });
}

export async function addAdminTaskComment(id: string, input: { text?: string; fileUrl?: string }) {
  return apiFetch<TaskSubmission>(`/admin/tasks/${id}/comments`, { method: "POST", body: input });
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

// ----- Appointments -----

export async function listAppointments() {
  return apiFetch<{ appointments: Appointment[] }>("/admin/appointments");
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus, adminNote?: string) {
  return apiFetch<Appointment>(`/admin/appointments/${id}/status`, { method: "PATCH", body: { status, adminNote } });
}

export async function rescheduleAppointment(id: string, date: string, time: string) {
  return apiFetch<Appointment>(`/admin/appointments/${id}/reschedule`, { method: "PATCH", body: { date, time } });
}

export async function createAdminAppointment(input: {
  userEmail: string;
  professionalId: string;
  date: string;
  time: string;
  notes?: string;
  status?: AppointmentStatus;
}) {
  return apiFetch<{ appointment: Appointment }>("/admin/appointments", { method: "POST", body: input });
}

// ----- Professionals -----

export interface ProfessionalInput {
  name: string;
  title: string;
  bio?: string;
  photoUrl?: string;
  active?: boolean;
  slotMinutes?: number;
  workDays?: string;
  startTime?: string;
  endTime?: string;
}

export async function listAdminProfessionals() {
  return apiFetch<{ professionals: Professional[] }>("/admin/professionals");
}

export async function createProfessional(input: ProfessionalInput) {
  return apiFetch<{ professional: Professional }>("/admin/professionals", { method: "POST", body: input });
}

export async function updateProfessional(id: string, input: Partial<ProfessionalInput>) {
  return apiFetch<{ professional: Professional }>(`/admin/professionals/${id}`, { method: "PATCH", body: input });
}

export async function deactivateProfessional(id: string) {
  return apiFetch<{ ok: true }>(`/admin/professionals/${id}`, { method: "DELETE" });
}

// ----- Appointment access (free bookings) -----

export async function listAppointmentAccess() {
  return apiFetch<{ accesses: AppointmentAccess[] }>("/admin/appointment-access");
}

export async function grantAppointmentAccess(input: { email: string; reason?: string; expiresAt?: string }) {
  return apiFetch<{ access: AppointmentAccess }>("/admin/appointment-access", { method: "POST", body: input });
}

export async function revokeAppointmentAccess(id: string) {
  return apiFetch(`/admin/appointment-access/${id}/revoke`, { method: "PATCH" });
}

// ----- Review moderation -----

export async function listAdminReviews() {
  return apiFetch<{ reviews: AdminCourseReview[] }>("/admin/reviews");
}

export async function updateReviewStatus(id: string, status: CourseReviewStatus) {
  return apiFetch<{ ok: true }>(`/admin/reviews/${id}/status`, { method: "PATCH", body: { status } });
}

// ----- Testimonials -----

export interface TestimonialInput {
  authorName: string;
  authorContext?: string;
  photoUrl?: string;
  rating?: number;
  comment: string;
  status?: TestimonialStatus;
  displayOrder?: number;
}

export async function listAdminTestimonials() {
  return apiFetch<{ testimonials: Testimonial[] }>("/admin/testimonials");
}

export async function createTestimonial(input: TestimonialInput) {
  return apiFetch<{ testimonial: Testimonial }>("/admin/testimonials", { method: "POST", body: input });
}

export async function updateTestimonial(id: string, input: Partial<TestimonialInput>) {
  return apiFetch<{ testimonial: Testimonial }>(`/admin/testimonials/${id}`, { method: "PATCH", body: input });
}

export async function deleteTestimonial(id: string) {
  return apiFetch<{ ok: true }>(`/admin/testimonials/${id}`, { method: "DELETE" });
}

// ----- Learning resources ("Aprende Más") -----

export interface ResourceAttachmentInput {
  id?: string;
  title: string;
  description?: string;
  fileUrl?: string;
  externalUrl?: string;
  order?: number;
}

export interface LearningResourceInput {
  title: string;
  description?: string;
  type: ResourceType;
  coverImage?: string;
  fileUrl?: string;
  vimeoUrl?: string;
  content?: string;
  externalUrl?: string;
  visible?: boolean;
  order?: number;
  attachments?: ResourceAttachmentInput[];
}

export async function listAdminResources() {
  return apiFetch<{ resources: LearningResource[] }>("/admin/resources");
}

export async function createResource(input: LearningResourceInput) {
  return apiFetch<LearningResource>("/admin/resources", { method: "POST", body: input });
}

export async function updateResource(id: string, input: Partial<LearningResourceInput>) {
  return apiFetch<LearningResource>(`/admin/resources/${id}`, { method: "PATCH", body: input });
}

export async function deleteResource(id: string) {
  return apiFetch<{ ok: true }>(`/admin/resources/${id}`, { method: "DELETE" });
}

// ----- Contact messages -----

export async function listContactMessages() {
  return apiFetch<{ messages: ContactMessage[] }>("/admin/contact");
}
