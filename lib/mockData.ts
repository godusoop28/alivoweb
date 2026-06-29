export interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "pdf" | "task" | "evaluation";
  duration?: number;
  completed: boolean;
  vimeoUrl?: string;
  description?: string;
  hasMaterial: boolean;
  hasTask: boolean;
  taskDescription?: string;
  visible: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  ageRange: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  modules: Module[];
  progress: number;
  enrolled: boolean;
  studentsCount: number;
  status: "published" | "draft" | "hidden";
  lastLessonId?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  courses: string[];
  avgProgress: number;
  lastAccess: string;
  status: "active" | "blocked";
}

export interface Purchase {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  method: string;
  paymentId: string;
  date: string;
}

export interface TaskSubmission {
  id: string;
  studentName: string;
  courseTitle: string;
  lessonTitle: string;
  deliveredAt: string;
  status: "pending" | "delivered" | "reviewed" | "needs_correction";
  taskInstructions: string;
  studentAnswer: string;
  adminComment: string;
}

export interface ManualAccess {
  id: string;
  email: string;
  courseTitle: string;
  grantedAt: string;
  grantedBy: string;
  reason: string;
  expiresAt?: string;
  status: "active" | "revoked";
}

export const courses: Course[] = [
  {
    id: "curso-0-3",
    title: "Descubriendo su cuerpo",
    ageRange: "0–3 meses",
    shortDescription:
      "Acompañá el desarrollo sensorial y corporal de tu bebé en sus primeros meses de vida con guías claras y ejercicios profesionales.",
    longDescription:
      "Este curso está diseñado para padres y cuidadores que quieren acompañar activamente el desarrollo de su bebé en la etapa más crítica. Aprenderás técnicas de estimulación sensorial, posturas seguras y actividades que favorecen la organización corporal desde los primeros días.",
    price: 5500,
    enrolled: true,
    progress: 45,
    studentsCount: 87,
    status: "published",
    lastLessonId: "l-fase1",
    modules: [
      {
        id: "mod-intro",
        title: "Introducción",
        lessons: [
          {
            id: "l-bienvenida",
            title: "Bienvenida",
            type: "video",
            duration: 5,
            completed: true,
            description: "Conocé la metodología del curso y cómo vas a trabajar con tu bebé.",
            hasMaterial: false,
            hasTask: false,
            visible: true,
          },
          {
            id: "l-objetivo",
            title: "Objetivo del módulo",
            type: "video",
            duration: 8,
            completed: true,
            description: "Entendé qué habilidades vas a estimular en esta etapa.",
            hasMaterial: true,
            hasTask: false,
            visible: true,
          },
          {
            id: "l-tips",
            title: "Tips antes de empezar",
            type: "text",
            duration: 4,
            completed: true,
            description: "Consejos prácticos para preparar el ambiente y tu estado de ánimo.",
            hasMaterial: false,
            hasTask: false,
            visible: true,
          },
          {
            id: "l-materiales",
            title: "Materiales necesarios",
            type: "pdf",
            duration: 3,
            completed: false,
            description: "Lista completa de materiales que vas a necesitar durante el curso.",
            hasMaterial: true,
            hasTask: false,
            visible: true,
          },
        ],
      },
      {
        id: "mod-fases",
        title: "Fases de estimulación",
        lessons: [
          {
            id: "l-fase1",
            title: "Fase 1: Regulación y organización corporal",
            type: "video",
            duration: 18,
            completed: false,
            description:
              "Técnicas para ayudar a tu bebé a regular su sistema nervioso y encontrar su organización corporal natural.",
            hasMaterial: true,
            hasTask: true,
            taskDescription:
              "Practicá las técnicas de regulación por 3 días y contanos cómo respondió tu bebé. Adjuntá una foto o video corto (máx. 1 min).",
            visible: true,
          },
          {
            id: "l-fase2",
            title: "Fase 2: Posturas fundamentales",
            type: "video",
            duration: 22,
            completed: false,
            description:
              "Aprenderás las posturas más importantes para el desarrollo motor temprano y cómo realizarlas con seguridad.",
            hasMaterial: true,
            hasTask: false,
            visible: true,
          },
          {
            id: "l-fase3",
            title: "Fase 3: Activación abdominal",
            type: "video",
            duration: 15,
            completed: false,
            description: "Ejercicios suaves para activar la musculatura abdominal del bebé.",
            hasMaterial: false,
            hasTask: true,
            taskDescription: "Realizá la rutina de activación abdominal y documentá tu experiencia.",
            visible: true,
          },
          {
            id: "l-fase4",
            title: "Fase 4: Estimulación vestibular",
            type: "video",
            duration: 20,
            completed: false,
            description:
              "Actividades que estimulan el sistema vestibular para mejorar el equilibrio y la percepción espacial.",
            hasMaterial: true,
            hasTask: false,
            visible: true,
          },
        ],
      },
      {
        id: "mod-extra",
        title: "Recursos y cierre",
        lessons: [
          {
            id: "l-extra",
            title: "Contenido extra",
            type: "pdf",
            duration: 10,
            completed: false,
            description: "Material complementario con referencias científicas y recursos adicionales.",
            hasMaterial: true,
            hasTask: false,
            visible: true,
          },
          {
            id: "l-faq",
            title: "Preguntas frecuentes",
            type: "text",
            duration: 6,
            completed: false,
            description: "Respuestas a las preguntas más comunes de los papás que cursaron.",
            hasMaterial: false,
            hasTask: false,
            visible: true,
          },
          {
            id: "l-acompaniamiento",
            title: "Acompañamiento",
            type: "text",
            duration: 5,
            completed: false,
            description: "Información sobre cómo contactarte con el equipo de ALIVOS si necesitás apoyo.",
            hasMaterial: false,
            hasTask: false,
            visible: true,
          },
          {
            id: "l-evaluacion",
            title: "Evaluación final",
            type: "evaluation",
            duration: 15,
            completed: false,
            description: "Cuestionario final para evaluar los conocimientos adquiridos.",
            hasMaterial: false,
            hasTask: false,
            visible: true,
          },
        ],
      },
    ],
  },
  {
    id: "curso-3-6",
    title: "Descubriendo el movimiento",
    ageRange: "3–6 meses",
    shortDescription:
      "Estimulá las habilidades motoras de tu bebé en la etapa en que comienza a descubrir el movimiento voluntario.",
    longDescription:
      "A los 3-6 meses tu bebé empieza a moverse con más intención. Este curso te enseña cómo estimular esos movimientos tempranos, favorecer el rolado y preparar su cuerpo para las siguientes etapas del desarrollo.",
    price: 5500,
    enrolled: true,
    progress: 20,
    studentsCount: 64,
    status: "published",
    lastLessonId: "l3-intro2",
    modules: [
      {
        id: "mod3-intro",
        title: "Introducción",
        lessons: [
          {
            id: "l3-intro1",
            title: "Bienvenida al curso",
            type: "video",
            duration: 5,
            completed: true,
            description: "Presentación del curso y del equipo de ALIVOS.",
            hasMaterial: false,
            hasTask: false,
            visible: true,
          },
          {
            id: "l3-intro2",
            title: "Objetivos de la etapa",
            type: "video",
            duration: 10,
            completed: false,
            description: "Qué habilidades esperamos que tu bebé desarrolle en esta etapa.",
            hasMaterial: false,
            hasTask: false,
            visible: true,
          },
        ],
      },
      {
        id: "mod3-fases",
        title: "Desarrollo motor",
        lessons: [
          {
            id: "l3-rolado",
            title: "Preparando el rolado",
            type: "video",
            duration: 20,
            completed: false,
            description: "Técnicas para estimular el rolado de manera segura y progresiva.",
            hasMaterial: true,
            hasTask: true,
            taskDescription: "Practica las técnicas de rolado y documenta el progreso con fotos.",
            visible: true,
          },
          {
            id: "l3-manos",
            title: "Juego de manos y pies",
            type: "video",
            duration: 15,
            completed: false,
            description: "Actividades para estimular el descubrimiento de manos y pies.",
            hasMaterial: false,
            hasTask: false,
            visible: true,
          },
          {
            id: "l3-prono",
            title: "Tiempo boca abajo",
            type: "video",
            duration: 18,
            completed: false,
            description: "Cómo hacer el tiempo boca abajo de manera divertida y efectiva.",
            hasMaterial: true,
            hasTask: false,
            visible: true,
          },
        ],
      },
    ],
  },
  {
    id: "curso-6-9",
    title: "Preparándose para gatear",
    ageRange: "6–9 meses",
    shortDescription:
      "Guiá a tu bebé en la etapa de preparación para el gateo, una de las más importantes para el desarrollo neurológico.",
    longDescription:
      "El gateo es una etapa fundamental que muchos bebés saltan. Este curso explica por qué es importante y cómo estimular todos los patrones de movimiento que preparan a tu bebé para gatear correctamente.",
    price: 5500,
    enrolled: false,
    progress: 0,
    studentsCount: 52,
    status: "published",
    modules: [
      {
        id: "mod6-intro",
        title: "Introducción",
        lessons: [
          {
            id: "l6-intro",
            title: "Importancia del gateo",
            type: "video",
            duration: 12,
            completed: false,
            description: "Por qué el gateo es fundamental para el desarrollo neurológico.",
            hasMaterial: false,
            hasTask: false,
            visible: true,
          },
        ],
      },
      {
        id: "mod6-prep",
        title: "Preparación para el gateo",
        lessons: [
          {
            id: "l6-cuatro",
            title: "Posición en cuatro puntos",
            type: "video",
            duration: 20,
            completed: false,
            description: "Cómo ayudar a tu bebé a mantener la posición de cuatro puntos.",
            hasMaterial: true,
            hasTask: false,
            visible: true,
          },
          {
            id: "l6-peso",
            title: "Traslado de peso",
            type: "video",
            duration: 18,
            completed: false,
            description: "Ejercicios para trabajar el traslado de peso lateral y anterior.",
            hasMaterial: false,
            hasTask: true,
            taskDescription: "Practica el traslado de peso y observa la respuesta de tu bebé.",
            visible: true,
          },
        ],
      },
    ],
  },
  {
    id: "curso-caminar",
    title: "Aprendiendo a caminar",
    ageRange: "9–15 meses",
    shortDescription:
      "Acompañá a tu bebé en los primeros pasos, entendiendo cada etapa del proceso y cómo estimularla de manera segura.",
    longDescription:
      "Caminar es el logro más esperado. Este curso te guía por todas las etapas previas al primer paso independiente y te enseña a acompañar el proceso sin apresurarlo, respetando los tiempos de tu bebé.",
    price: 5500,
    enrolled: false,
    progress: 0,
    studentsCount: 41,
    status: "published",
    modules: [
      {
        id: "mod9-intro",
        title: "Introducción",
        lessons: [
          {
            id: "l9-intro",
            title: "El camino hacia el primer paso",
            type: "video",
            duration: 10,
            completed: false,
            description: "Resumen de todas las etapas previas a caminar.",
            hasMaterial: false,
            hasTask: false,
            visible: true,
          },
        ],
      },
      {
        id: "mod9-bipedestacion",
        title: "Bipedestación",
        lessons: [
          {
            id: "l9-pararse",
            title: "Aprendiendo a pararse",
            type: "video",
            duration: 22,
            completed: false,
            description: "Técnicas para estimular la posición de pie con apoyo.",
            hasMaterial: true,
            hasTask: false,
            visible: true,
          },
          {
            id: "l9-marcha",
            title: "Primeros pasos con apoyo",
            type: "video",
            duration: 25,
            completed: false,
            description: "Cómo guiar los primeros pasos de manera segura.",
            hasMaterial: true,
            hasTask: true,
            taskDescription: "Documentá los avances de tu bebé con un video corto.",
            visible: true,
          },
        ],
      },
    ],
  },
];

export const students: Student[] = [
  {
    id: "st-001",
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+54 9 11 1234-5678",
    courses: ["curso-0-3", "curso-3-6"],
    avgProgress: 45,
    lastAccess: "2026-06-28",
    status: "active",
  },
  {
    id: "st-002",
    name: "Laura Fernández",
    email: "laura.fernandez@email.com",
    phone: "+54 9 11 2345-6789",
    courses: ["curso-0-3"],
    avgProgress: 80,
    lastAccess: "2026-06-27",
    status: "active",
  },
  {
    id: "st-003",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@email.com",
    phone: "+54 9 11 3456-7890",
    courses: ["curso-3-6", "curso-6-9"],
    avgProgress: 30,
    lastAccess: "2026-06-25",
    status: "active",
  },
  {
    id: "st-004",
    name: "Carolina López",
    email: "carolina.lopez@email.com",
    phone: "+54 9 11 4567-8901",
    courses: ["curso-0-3"],
    avgProgress: 60,
    lastAccess: "2026-06-20",
    status: "blocked",
  },
  {
    id: "st-005",
    name: "Valentina Martínez",
    email: "valentina.martinez@email.com",
    phone: "+54 9 11 5678-9012",
    courses: ["curso-6-9", "curso-caminar"],
    avgProgress: 15,
    lastAccess: "2026-06-29",
    status: "active",
  },
];

export const purchases: Purchase[] = [
  {
    id: "pch-001",
    studentName: "María González",
    studentEmail: "maria.gonzalez@email.com",
    courseTitle: "Descubriendo su cuerpo (0–3 meses)",
    amount: 5500,
    status: "paid",
    method: "Mercado Pago",
    paymentId: "MP-12345678",
    date: "2026-06-15",
  },
  {
    id: "pch-002",
    studentName: "Laura Fernández",
    studentEmail: "laura.fernandez@email.com",
    courseTitle: "Descubriendo su cuerpo (0–3 meses)",
    amount: 5500,
    status: "paid",
    method: "Mercado Pago",
    paymentId: "MP-23456789",
    date: "2026-06-18",
  },
  {
    id: "pch-003",
    studentName: "Ana Rodríguez",
    studentEmail: "ana.rodriguez@email.com",
    courseTitle: "Descubriendo el movimiento (3–6 meses)",
    amount: 5500,
    status: "paid",
    method: "Mercado Pago",
    paymentId: "MP-34567890",
    date: "2026-06-20",
  },
  {
    id: "pch-004",
    studentName: "Valentina Martínez",
    studentEmail: "valentina.martinez@email.com",
    courseTitle: "Preparándose para gatear (6–9 meses)",
    amount: 5500,
    status: "pending",
    method: "Mercado Pago",
    paymentId: "MP-45678901",
    date: "2026-06-28",
  },
  {
    id: "pch-005",
    studentName: "Carolina López",
    studentEmail: "carolina.lopez@email.com",
    courseTitle: "Aprendiendo a caminar",
    amount: 5500,
    status: "failed",
    method: "Mercado Pago",
    paymentId: "MP-56789012",
    date: "2026-06-22",
  },
];

export const taskSubmissions: TaskSubmission[] = [
  {
    id: "task-001",
    studentName: "María González",
    courseTitle: "Descubriendo su cuerpo (0–3 meses)",
    lessonTitle: "Fase 1: Regulación y organización corporal",
    deliveredAt: "2026-06-27",
    status: "delivered",
    taskInstructions:
      "Practicá las técnicas de regulación por 3 días y contanos cómo respondió tu bebé. Adjuntá una foto o video corto.",
    studentAnswer:
      "Practiqué las técnicas durante 3 días. El primer día Tomás estaba muy inquieto pero al tercer día ya se calmaba más rápido. Le gustó mucho la técnica de presión en el abdomen.",
    adminComment: "",
  },
  {
    id: "task-002",
    studentName: "Laura Fernández",
    courseTitle: "Descubriendo su cuerpo (0–3 meses)",
    lessonTitle: "Fase 3: Activación abdominal",
    deliveredAt: "2026-06-25",
    status: "needs_correction",
    taskInstructions:
      "Realizá la rutina de activación abdominal y documentá tu experiencia con fotos o video.",
    studentAnswer: "Hice los ejercicios pero no entendí bien la posición de la segunda técnica.",
    adminComment:
      "¡Gracias por tu entrega! Para la segunda técnica recordá que el bebé debe estar en decúbito dorsal con las piernas flexionadas. Revisá el video de la Fase 3 de nuevo y volvé a enviarnos.",
  },
  {
    id: "task-003",
    studentName: "Ana Rodríguez",
    courseTitle: "Descubriendo el movimiento (3–6 meses)",
    lessonTitle: "Preparando el rolado",
    deliveredAt: "2026-06-29",
    status: "pending",
    taskInstructions:
      "Practica las técnicas de rolado y documenta el progreso con fotos o un video corto de no más de 1 minuto.",
    studentAnswer: "",
    adminComment: "",
  },
];

export const manualAccesses: ManualAccess[] = [
  {
    id: "mac-001",
    email: "beca.alumna@email.com",
    courseTitle: "Descubriendo su cuerpo (0–3 meses)",
    grantedAt: "2026-06-10",
    grantedBy: "Admin ALIVOS",
    reason: "Beca por situación socioeconómica",
    status: "active",
  },
  {
    id: "mac-002",
    email: "prueba.terapeuta@email.com",
    courseTitle: "Preparándose para gatear (6–9 meses)",
    grantedAt: "2026-06-20",
    grantedBy: "Admin ALIVOS",
    reason: "Cuenta de prueba para terapeuta colaboradora",
    expiresAt: "2026-07-20",
    status: "active",
  },
  {
    id: "mac-003",
    email: "pago.transferencia@email.com",
    courseTitle: "Aprendiendo a caminar",
    grantedAt: "2026-06-25",
    grantedBy: "Admin ALIVOS",
    reason: "Pago realizado por transferencia bancaria",
    status: "active",
  },
];

export const adminStats = {
  totalStudents: 87,
  publishedCourses: 4,
  monthlyRevenue: 71500,
  pendingTasks: 3,
};
