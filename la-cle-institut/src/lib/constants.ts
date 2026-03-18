export const SITE = {
  name: "La Clé",
  tagline: "Institut de compréhension des mécanismes humains",
  baseline: "Comprendre avant d\u2019agir",
} as const;

export const ROUTES = {
  home: "/",
  discover: "/nous-decouvrir",
  vocation: "/nous-decouvrir/notre-vocation",
  concept: "/nous-decouvrir/le-concept",
  team: "/nous-decouvrir/equipe",
  formations: "/formations",
  pnlPractitioner: "/formations/pnl-praticien",
  accessSpace: "/acces-espace",
  legal: "/mentions-legales",
  terms: "/cgv",
  contact: "/contact",
} as const;

export const SPLASH_DURATION = 1800;
export const SPLASH_STORAGE_KEY = "la-cle-splash-shown";
