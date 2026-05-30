/**
 * Variantes d'accroche d'entrée. Décision de contenu (Marien) :
 * changer ACTIVE_BASELINE bascule l'accroche partout (splash, footer, etc.)
 * sans toucher aux composants.
 */
export const BASELINE_VARIANTS = {
  puis: "Comprendre puis agir",
  et: "Comprendre et agir",
  avant: "Comprendre avant d’agir",
} as const;

export const ACTIVE_BASELINE: keyof typeof BASELINE_VARIANTS = "puis";

export const SITE = {
  name: "La Clé",
  tagline: "Institut de compréhension des mécanismes humains",
  baseline: BASELINE_VARIANTS[ACTIVE_BASELINE],
  /** Adresse de contact officielle (source unique de vérité). */
  email: "contact@institutlacle.fr",
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
  accessibility: "/accessibilite",
} as const;

export const SPLASH_DURATION = 1800;
export const SPLASH_STORAGE_KEY = "la-cle-splash-shown";
