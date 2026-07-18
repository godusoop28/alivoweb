export type Role = "ADMIN" | "STUDENT";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type CourseStatus = "PUBLISHED" | "DRAFT" | "HIDDEN";
export type LessonType = "VIDEO" | "TEXT" | "PDF" | "TASK" | "EVALUATION";
export type EnrollmentSource = "PURCHASE" | "MANUAL" | "COURTESY" | "TRANSFER" | "SCHOLARSHIP" | "TEST";
export type PurchaseStatus = "PAID" | "PENDING" | "FAILED";
export type PurchaseMethod = "MERCADO_PAGO" | "TRANSFER" | "MANUAL";
export type TaskStatus = "PENDING" | "DELIVERED" | "REVIEWED" | "NEEDS_CORRECTION" | "APPROVED";
export type ManualAccessStatus = "ACTIVE" | "REVOKED";

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
  completed: boolean;
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
  status: CourseStatus;
  studentsCount: number;
  enrolled: boolean;
  progress: number;
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
  amount: number;
  status: PurchaseStatus;
  method: PurchaseMethod;
  paymentId: string | null;
  createdAt: string;
}

export interface TaskSubmission {
  id: string;
  studentName: string;
  studentEmail: string;
  lessonTitle: string;
  courseTitle: string;
  taskInstructions: string | null;
  studentAnswer: string | null;
  fileUrl: string | null;
  lessonPdfUrl: string | null;
  lessonImageUrl: string | null;
  status: TaskStatus;
  adminComment: string | null;
  deliveredAt: string;
  reviewedAt: string | null;
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

export interface Settings {
  whatsapp: string | null;
  email: string | null;
  appointmentUrl: string | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
  brandName: string | null;
}

export interface VimeoResolved {
  vimeoId: string | null;
  title: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  embedUrl: string | null;
}
