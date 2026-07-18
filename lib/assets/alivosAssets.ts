/**
 * Single source of truth for real ALIVOS media living in `public/alivos-assets`.
 * Everything else (mockData, mockFallback, seed data, components) should
 * reference these constants instead of hardcoding `/alivos-assets/...` paths.
 */

const BASE = "/alivos-assets";

export const alivosAssets = {
  brand: {
    squareOne: `${BASE}/brand/logo-alivos-cuadrado-01.jpg`,
    squareTwo: `${BASE}/brand/logo-alivos-cuadrado-02.jpg`,
    minimalWhite: `${BASE}/brand/logo-alivos-minimal-blanco.jpg`,
  },
  home: {
    hero: `${BASE}/home/hero-madre-bebe-bloques-alivos.png`,
    welcome: `${BASE}/home/bienvenida-al-curso-doctora.png`,
    platformGuide: `${BASE}/home/como-usar-la-plataforma-madre-tablet.png`,
    coverOne: `${BASE}/home/portada-principal-juego-desarrollo-01.png`,
    coverTwo: `${BASE}/home/portada-principal-juego-desarrollo-02.png`,
    babiesBanner: `${BASE}/home/banner-bebes-alivos.png`,
    babiesBannerHorizontal: `${BASE}/home/banner-bebes-alivos-horizontal.jpg`,
  },
  courseDescubriendoSuCuerpo: {
    slug: "descubriendo-su-cuerpo-0-3-meses",
    cover: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-01/portada-modulo-01-bebe-boca-abajo.png`,
    banner: `${BASE}/home/banner-bebes-alivos-horizontal.jpg`,
    modules: {
      module01: {
        banner: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-01/banner-programa-casa-modulo-01.png`,
        cover: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-01/portada-modulo-01-bebe-boca-abajo.png`,
        objectives: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-01/objetivos-modulo-01.png`,
        materials: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-01/materiales-modulo-01.png`,
        extra: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-01/contenido-extra-modulo-01.png`,
        faq: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-01/preguntas-frecuentes-modulo-01.png`,
        activitiesPdf: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-01/actividades-modulo-01.pdf`,
        evaluationPdf: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-01/evaluacion-modulo-01.pdf`,
      },
      module02: {
        banner: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-02/banner-programa-casa-modulo-02.png`,
        cover: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-02/portada-modulo-02-bebe-sentado.png`,
        objectives: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-02/objetivos-modulo-02.png`,
        materials: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-02/materiales-modulo-02.png`,
        extra: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-02/contenido-extra-modulo-02.png`,
        faq: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-02/preguntas-frecuentes-modulo-02.png`,
        activitiesPdf: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-02/actividades-modulo-02.pdf`,
        evaluationPdf: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-02/evaluacion-modulo-02.pdf`,
      },
      module03: {
        banner: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-03/banner-programa-casa-modulo-03.png`,
        cover: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-03/portada-modulo-03-bebe-gateo.png`,
        objectives: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-03/objetivos-modulo-03.png`,
        materials: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-03/materiales-modulo-03.png`,
        extra: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-03/contenido-extra-modulo-03.png`,
        faq: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-03/preguntas-frecuentes-modulo-03.png`,
        activitiesPdf: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-03/actividades-modulo-03.pdf`,
        evaluationPdf: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-03/evaluacion-modulo-03.pdf`,
      },
      module04: {
        banner: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-04/banner-programa-casa-modulo-04.png`,
        cover: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-04/portada-modulo-04-bebe-caminando.png`,
        objectives: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-04/objetivos-modulo-04.png`,
        materials: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-04/materiales-modulo-04.png`,
        extra: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-04/contenido-extra-modulo-04.png`,
        faq: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-04/preguntas-frecuentes-modulo-04.png`,
        activitiesPdf: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-04/actividades-modulo-04.pdf`,
        evaluationPdf: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/modulo-04/evaluacion-modulo-04.pdf`,
      },
    },
    resources: {
      exerciseDiaryPdf: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/recursos/diario-de-ejercicios.pdf`,
    },
    evaluation: {
      imageOne: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/evaluacion/imagen-evaluacion-pediatra-01.png`,
      imageTwo: `${BASE}/courses/descubriendo-su-cuerpo-0-3-meses/evaluacion/imagen-evaluacion-pediatra-02.png`,
    },
  },
} as const;

export type AlivosModuleAssetKey = keyof typeof alivosAssets.courseDescubriendoSuCuerpo.modules;

export const DESCUBRIENDO_SU_CUERPO_SLUG = alivosAssets.courseDescubriendoSuCuerpo.slug;

const moduleAssetList = Object.values(alivosAssets.courseDescubriendoSuCuerpo.modules);

/** Module asset bundle by 1-based module order (1..4), or null outside that range. */
export function getModuleAssetsByOrder(order: number) {
  return moduleAssetList[order - 1] ?? null;
}
