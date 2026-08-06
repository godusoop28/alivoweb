export type Role = "ADMIN" | "STUDENT";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type CourseStatus = "PUBLISHED" | "DRAFT" | "HIDDEN";
export type LessonType = "VIDEO" | "TEXT" | "PDF" | "TASK" | "EVALUATION" | "FORM";
export type EnrollmentSource = "PURCHASE" | "MANUAL" | "COURTESY" | "TRANSFER" | "SCHOLARSHIP" | "TEST";
export type PurchaseStatus = "PAID" | "PENDING" | "FAILED";
export type PurchaseMethod = "MERCADO_PAGO" | "TRANSFER" | "MANUAL";
export type PurchaseType = "COURSE" | "APPOINTMENT";
export type TaskStatus = "PENDING" | "DELIVERED" | "REVIEWED" | "NEEDS_CORRECTION" | "APPROVED";
export type ManualAccessStatus = "ACTIVE" | "REVOKED";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
export type BookingSource = "USER" | "ADMIN";
export type CourseReviewStatus = "APPROVED" | "HIDDEN";
export type TestimonialStatus = "PUBLISHED" | "HIDDEN";
export type FormFieldType = "TEXT" | "TEXTAREA" | "CHOICE" | "CHECKBOX";
export type ResourceType = "PDF" | "VIDEO" | "ARTICLE" | "LINK";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  avatarUrl?: string | null;
  status: UserStatus;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  description: string | null;
  order: number;
  durationMinutes: number | null;
  visible: boolean;
  hasMaterial: boolean;
  materialUrl: string | null;
  hasTask: boolean;
  taskDescription: string | null;
  vimeoId: string | null;
  vimeoUrl: string | null;
  vimeoEmbedUrl: string | null;
  vimeoThumbnail: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  assetType: string | null;
  formSchema: string | null;
  completed: boolean;
  locked: boolean;
}

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  coverImage: string | null;
  bannerImage: string | null;
  lessons: Lesson[];
}

export interface CourseReview {
  id: string;
  studentName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  ageRange: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  imageUrl: string | null;
  bannerImage: string | null;
  previewVimeoUrl: string | null;
  previewVimeoEmbedUrl: string | null;
  previewVimeoThumbnail: string | null;
  status: CourseStatus;
  studentsCount: number;
  enrolled: boolean;
  progress: number;
  hasAccess: boolean;
  averageRating: number | null;
  reviewsCount: number;
  reviews: CourseReview[];
  myReview: CourseReview | null;
  canReview: boolean;
  modules: Module[];
}

export interface StudentDashboard {
  stats: {
    activeCourses: number;
    lessonsCompleted: number;
    lessonsTotal: number;
    pendingTasks: number;
    avgProgress: number;
  };
  courses: {
    id: string;
    slug: string;
    title: string;
    ageRange: string;
    shortDescription: string;
    imageUrl: string | null;
    progress: number;
  }[];
  tasks: {
    id: string;
    lessonTitle: string;
    courseTitle: string;
    status: TaskStatus;
    deliveredAt: string;
  }[];
  purchases: {
    id: string;
    courseTitle: string;
    amount: number;
    status: PurchaseStatus;
    method: PurchaseMethod;
    createdAt: string;
  }[];
}

export interface AdminDashboard {
  stats: {
    totalStudents: number;
    publishedCourses: number;
    monthlyRevenue: number;
    pendingTasks: number;
  };
  recentPurchases: {
    id: string;
    studentName: string;
    courseTitle: string;
    amount: number;
    status: PurchaseStatus;
    createdAt: string;
  }[];
  pendingTasks: {
    id: string;
    studentName: string;
    lessonTitle: string;
    status: TaskStatus;
  }[];
  courses: {
    id: string;
    title: string;
    ageRange: string;
    imageUrl: string | null;
    status: CourseStatus;
    studentsCount: number;
    lessonsCount: number;
  }[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: UserStatus;
  avgProgress: number;
  lastAccess: string;
  courses: {
    id: string;
    title: string;
    ageRange: string;
    imageUrl: string | null;
    progress: number;
  }[];
}

export interface StudentDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: UserStatus;
  createdAt: string;
  courses: {
    id: string;
    title: string;
    ageRange: string;
    imageUrl: string | null;
    progress: number;
    status: string;
    source: EnrollmentSource;
  }[];
  purchases: {
    id: string;
    courseTitle: string;
    amount: number;
    status: PurchaseStatus;
    method: PurchaseMethod;
    paymentId: string | null;
    createdAt: string;
  }[];
  tasks: {
    id: string;
    lessonTitle: string;
    status: TaskStatus;
    deliveredAt: string;
  }[];
}

export interface Purchase {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  type: PurchaseType;
  amount: number;
  status: PurchaseStatus;
  method: PurchaseMethod;
  paymentId: string | null;
  createdAt: string;
  initPoint: string | null;
}

export interface TaskComment {
  id: string;
  authorName: string;
  authorRole: Role;
  text: string | null;
  fileUrl: string | null;
  createdAt: string;
}

export interface TaskSubmission {
  id: string;
  studentName: string;
  studentEmail: string;
  lessonTitle: string;
  courseTitle: string;
  lessonHasTask: boolean;
  taskInstructions: string | null;
  lessonPdfUrl: string | null;
  lessonImageUrl: string | null;
  status: TaskStatus;
  comments: TaskComment[];
  deliveredAt: string;
  reviewedAt: string | null;
}

export interface MyTask {
  lessonHasTask: boolean;
  taskInstructions: string | null;
  lessonPdfUrl: string | null;
  lessonImageUrl: string | null;
  status: TaskStatus | null;
  comments: TaskComment[];
  deliveredAt: string | null;
  reviewedAt: string | null;
}

export interface FormResponse {
  id: string;
  studentName: string;
  studentEmail: string;
  answers: string;
  submittedAt: string;
}

export interface Appointment {
  id: string;
  studentName: string;
  studentEmail: string;
  professionalId: string | null;
  professionalName: string | null;
  date: string;
  time: string;
  notes: string | null;
  status: AppointmentStatus;
  adminNote: string | null;
  amount: number | null;
  purchaseStatus: PurchaseStatus | null;
  bookingSource: BookingSource;
  createdAt: string;
}

export interface AppointmentBooking {
  appointment: Appointment;
  purchase: Purchase | null;
  requiresPayment: boolean;
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  photoUrl: string | null;
  active: boolean;
  slotMinutes: number;
  workDays: string;
  startTime: string;
  endTime: string;
}

export interface ManualAccess {
  id: string;
  email: string;
  courseTitle: string;
  grantedAt: string;
  grantedBy: string;
  reason: string | null;
  expiresAt: string | null;
  status: ManualAccessStatus;
}

export interface AppointmentAccess {
  id: string;
  email: string;
  grantedAt: string;
  grantedBy: string;
  reason: string | null;
  expiresAt: string | null;
  status: ManualAccessStatus;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorContext: string | null;
  photoUrl: string | null;
  rating: number | null;
  comment: string;
  status: TestimonialStatus;
  displayOrder: number | null;
  createdAt: string;
}

export interface HomeTestimonial {
  authorName: string;
  authorContext: string | null;
  photoUrl: string | null;
  rating: number | null;
  comment: string;
  createdAt: string;
}

export interface AdminCourseReview {
  id: string;
  courseTitle: string;
  studentName: string;
  rating: number;
  comment: string | null;
  status: CourseReviewStatus;
  createdAt: string;
}

export interface Settings {
  whatsapp: string | null;
  email: string | null;
  appointmentUrl: string | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
  brandName: string | null;
  advisoryEnabled: boolean | null;
  advisoryPrice: number | null;
  advisorySlotMinutes: number | null;
  advisoryDays: string | null;
  advisoryStartTime: string | null;
  advisoryEndTime: string | null;
}

export interface LearningResource {
  id: string;
  title: string;
  description: string | null;
  type: ResourceType;
  coverImage: string | null;
  fileUrl: string | null;
  vimeoUrl: string | null;
  vimeoEmbedUrl: string | null;
  vimeoThumbnail: string | null;
  content: string | null;
  externalUrl: string | null;
  visible: boolean;
  createdAt: string;
}

export interface VimeoResolved {
  vimeoId: string | null;
  title: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  embedUrl: string | null;
}

export interface VimeoUploadTicket {
  uploadLink: string;
  vimeoUri: string;
  vimeoId: string;
  vimeoUrl: string;
}
