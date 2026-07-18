import { alivosAssets, DESCUBRIENDO_SU_CUERPO_SLUG } from "@/lib/assets/alivosAssets";

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
  /** Illustrative image for the lesson (objectives, materials, FAQ, etc). */
  imageUrl?: string;
  /** Downloadable PDF (activities, evaluation, resources). */
  pdfUrl?: string;
  /** Free-form tag describing which kind of real asset this lesson uses. */
  assetType?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  coverImage?: string;
  bannerImage?: string;
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
  imageUrl?: string;
  bannerImage?: string;
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

const course1ModuleThemes: { title: string; description: string; taskDescription: string }[] = [
  {
    title: "Módulo 1: Regulación y contacto corporal",
    description: "Primeras semanas: organización del sistema nervioso y contacto piel a piel.",
    taskDescription:
      "Practica las técnicas de regulación por 3 días y cuéntanos cómo respondió tu bebé. Adjunta una foto o video corto (máx. 1 min).",
  },
  {
    title: "Módulo 2: Control postural y equilibrio",
    description: "Sentamos las bases del control de tronco que tu bebé irá dominando en los próximos meses.",
    taskDescription: "Realiza los ejercicios de base postural y documenta tu experiencia con fotos o video.",
  },
  {
    title: "Módulo 3: Preparando el desplazamiento",
    description: "Estimulación temprana de los patrones que, más adelante, facilitarán el gateo.",
    taskDescription: "Practica las activaciones de esta fase y cuéntanos cómo respondió tu bebé.",
  },
  {
    title: "Módulo 4: Cierre, integración y siguientes pasos",
    description: "Repaso general del curso y una mirada hacia las próximas etapas del desarrollo motor.",
    taskDescription: "Completa la actividad de cierre y comparte tus observaciones finales.",
  },
];

function buildCourse1Modules(): Module[] {
  const moduleKeys = ["module01", "module02", "module03", "module04"] as const;
  return course1ModuleThemes.map((theme, i) => {
    const n = i + 1;
    const assets = alivosAssets.courseDescubriendoSuCuerpo.modules[moduleKeys[i]];
    const completed = n <= 2; // Módulos 1 y 2 completos ≈ 45% de avance (ver progress más abajo)
    const lessons: Lesson[] = [
      {
        id: `l-m${n}-portada`,
        title: "Portada del módulo",
        type: "video",
        duration: 5,
        completed,
        description: `Presentación visual del ${theme.title.toLowerCase()}.`,
        hasMaterial: false,
        hasTask: false,
        visible: true,
        imageUrl: assets.cover,
        assetType: "cover",
        ...(n === 1 ? { vimeoUrl: "https://vimeo.com/76979871" } : {}),
      },
      {
        id: `l-m${n}-objetivos`,
        title: "Objetivos del módulo",
        type: "text",
        duration: 6,
        completed,
        description: theme.description,
        hasMaterial: false,
        hasTask: false,
        visible: true,
        imageUrl: assets.objectives,
        assetType: "objectives",
      },
      {
        id: `l-m${n}-materiales`,
        title: "Materiales necesarios",
        type: "text",
        duration: 3,
        completed,
        description: "Estos son los materiales que vas a necesitar para las actividades de este módulo.",
        hasMaterial: false,
        hasTask: false,
        visible: true,
        imageUrl: assets.materials,
        assetType: "materials",
      },
      {
        id: `l-m${n}-extra`,
        title: "Contenido extra",
        type: "text",
        duration: 8,
        completed,
        description: "Material complementario con referencias y recursos adicionales para profundizar.",
        hasMaterial: false,
        hasTask: false,
        visible: true,
        imageUrl: assets.extra,
        assetType: "extra",
      },
      {
        id: `l-m${n}-faq`,
        title: "Preguntas frecuentes",
        type: "text",
        duration: 6,
        completed,
        description: "Respuestas a las preguntas más comunes de las familias que cursaron este módulo.",
        hasMaterial: false,
        hasTask: false,
        visible: true,
        imageUrl: assets.faq,
        assetType: "faq",
      },
      {
        id: `l-m${n}-actividades`,
        title: "Actividades del módulo",
        type: "task",
        duration: 20,
        completed,
        description: "Pon en práctica lo aprendido con la guía de actividades de este módulo.",
        hasMaterial: true,
        hasTask: true,
        taskDescription: theme.taskDescription,
        visible: true,
        imageUrl: assets.materials,
        pdfUrl: assets.activitiesPdf,
        assetType: "activities",
      },
      {
        id: `l-m${n}-evaluacion`,
        title: "Evaluación del módulo",
        type: "evaluation",
        duration: 15,
        completed: false,
        description: "Cuestionario para evaluar los conocimientos adquiridos en este módulo.",
        hasMaterial: true,
        hasTask: false,
        visible: true,
        imageUrl:
          n % 2 === 1
            ? alivosAssets.courseDescubriendoSuCuerpo.evaluation.imageOne
            : alivosAssets.courseDescubriendoSuCuerpo.evaluation.imageTwo,
        pdfUrl: assets.evaluationPdf,
        assetType: "evaluation",
      },
    ];

    if (n === 4) {
      lessons.push({
        id: "l-diario-ejercicios",
        title: "Diario de ejercicios (recurso descargable)",
        type: "pdf",
        duration: 5,
        completed: false,
        description: "Plantilla para llevar el registro de las actividades realizadas durante todo el curso.",
        hasMaterial: true,
        hasTask: false,
        visible: true,
        pdfUrl: alivosAssets.courseDescubriendoSuCuerpo.resources.exerciseDiaryPdf,
        assetType: "resource",
      });
    }

    return {
      id: `mod-0${n}`,
      title: theme.title,
      coverImage: assets.cover,
      bannerImage: assets.banner,
      lessons,
    };
  });
}

export const courses: Course[] = [
  {
    id: DESCUBRIENDO_SU_CUERPO_SLUG,
    title: "Descubriendo su cuerpo",
    ageRange: "0–3 meses",
    imageUrl: alivosAssets.courseDescubriendoSuCuerpo.cover,
    bannerImage: alivosAssets.courseDescubriendoSuCuerpo.banner,
    shortDescription:
      "Acompaña el desarrollo sensorial y corporal de tu bebé en sus primeros meses de vida con guías claras y ejercicios profesionales.",
    longDescription:
      "Este curso está diseñado para padres y cuidadores que quieren acompañar activamente el desarrollo de su bebé en la etapa más crítica. Aprenderás técnicas de estimulación sensorial, posturas seguras y actividades que favorecen la organización corporal desde los primeros días.",
    price: 5500,
    enrolled: true,
    progress: 45,
    studentsCount: 87,
    status: "published",
    lastLessonId: "l-m2-actividades",
    modules: buildCourse1Modules(),
  },
  {
    id: "curso-3-6",
    title: "Descubriendo el movimiento",
    ageRange: "3–6 meses",
    imageUrl: alivosAssets.home.coverOne,
    shortDescription:
      "Estimula las habilidades motoras de tu bebé en la etapa en que comienza a descubrir el movimiento voluntario.",
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
            taskDescription: "Practica las técnicas de rolado y documenta el progreso con fotos o un video corto.",
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
    imageUrl: alivosAssets.home.coverTwo,
    shortDescription:
      "Guía a tu bebé en la etapa de preparación para el gateo, una de las más importantes para el desarrollo neurológico.",
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
            taskDescription: "Practica el traslado de peso y observa la respuesta de tu bebé. Cuéntanos tus observaciones.",
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
    imageUrl: alivosAssets.home.babiesBanner,
    shortDescription:
      "Acompaña a tu bebé en los primeros pasos, entendiendo cada etapa del proceso y cómo estimularla de manera segura.",
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
            taskDescription: "Documenta los avances de tu bebé con un video corto.",
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
    courses: [DESCUBRIENDO_SU_CUERPO_SLUG, "curso-3-6"],
    avgProgress: 45,
    lastAccess: "2026-06-28",
    status: "active",
  },
  {
    id: "st-002",
    name: "Laura Fernández",
    email: "laura.fernandez@email.com",
    phone: "+54 9 11 2345-6789",
    courses: [DESCUBRIENDO_SU_CUERPO_SLUG],
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
    courses: [DESCUBRIENDO_SU_CUERPO_SLUG],
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
      "Practica las técnicas de regulación por 3 días y cuéntanos cómo respondió tu bebé. Adjunta una foto o video corto.",
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
      "Realiza la rutina de activación abdominal y documenta tu experiencia con fotos o video.",
    studentAnswer: "Hice los ejercicios pero no entendí bien la posición de la segunda técnica.",
    adminComment:
      "¡Gracias por tu entrega! Para la segunda técnica recuerda que el bebé debe estar en decúbito dorsal con las piernas flexionadas. Revisa el video de la Fase 3 de nuevo y vuelve a enviárnoslo.",
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
