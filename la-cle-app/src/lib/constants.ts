export const SITE = {
  name: "La Clé",
  fullName: "Institut La Clé",
  tagline: "Institut de compréhension des mécanismes humains",
} as const;

export const ROUTES = {
  inscription: "/inscription",
  login: "/login",
  admin: {
    login: "/admin/login",
    dashboard: "/admin",
    apprenants: "/admin/apprenants",
    nouveauApprenant: "/admin/apprenants/nouveau",
    apprenant: (id: string) => `/admin/apprenants/${id}`,
    contenus: "/admin/contenus",
    modules: "/admin/contenus/modules",
    module: (id: string) => `/admin/contenus/modules/${id}`,
    video: (moduleId: string, videoId: string) =>
      `/admin/contenus/modules/${moduleId}/videos/${videoId}`,
    engagement: "/admin/engagement",
    satisfaction: "/admin/satisfaction",
    examenFinal: "/admin/contenus/examen-final",
    coffre: "/admin/contenus/coffre",
    sessions: "/admin/sessions",
    documents: "/admin/documents",
    parametres: "/admin/parametres",
    moyensTechniques: "/admin/moyens-techniques",
  },
  espace: {
    dashboard: "/espace",
    onboarding: "/espace/onboarding",
    parcours: "/espace/parcours",
    module: (id: string) => `/espace/parcours/${id}`,
    video: (moduleId: string, videoId: string) =>
      `/espace/parcours/${moduleId}/video/${videoId}`,
    examenModule: (moduleId: string) => `/espace/parcours/${moduleId}/examen`,
    examenFinal: "/espace/examen-final",
    presentiel: "/espace/presentiel",
    revision: "/espace/revision",
    documents: "/espace/documents",
    compte: "/espace/compte",
  },
} as const;
