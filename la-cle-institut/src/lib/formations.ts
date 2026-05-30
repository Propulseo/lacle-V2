import { ROUTES } from "@/lib/constants";

export type FormationType = "distanciel" | "presentiel";

export type FormationStatus =
  | "disponible"
  | "beta_test"
  | "en_cours_de_creation"
  | "en_projet";

export interface Formation {
  /** Identifiant stable utilisé comme clé React. */
  id: string;
  /** Libellé affiché sur la carte. */
  title: string;
  /** Modalité pédagogique dominante (affichée en badge). */
  type: FormationType;
  /** Statut de disponibilité : pilote l'apparence et l'interactivité. */
  status: FormationStatus;
  /** URL de destination pour les formations « disponible ». */
  href?: string;
}

export interface Parcours {
  /** Identifiant stable du parcours. */
  id: string;
  /** Nom du parcours, titre de son carrousel. */
  label: string;
  /** Phrase courte de contexte (optionnelle). */
  description?: string;
  /** Étapes ordonnées (ordre d'affichage). */
  steps: readonly Formation[];
}

/**
 * Catalogue organisé par PARCOURS (retour A14).
 * Un carrousel par parcours ; chaque étape porte un badge de statut
 * (disponible / en cours de création / en projet) et une modalité.
 * Source de vérité unique, prête à brancher sur Supabase plus tard.
 */
export const PARCOURS: readonly Parcours[] = [
  {
    id: "pnl",
    label: "Programmation Neuro-Linguistique",
    description:
      "Le parcours fondateur de l'institut, du Praticien au Maître Praticien.",
    steps: [
      {
        id: "pnl-praticien-distanciel",
        title: "Praticien PNL",
        type: "distanciel",
        status: "disponible",
        href: ROUTES.pnlPractitioner,
      },
      {
        id: "pnl-praticien-presentiel",
        title: "Praticien PNL en présentiel",
        type: "presentiel",
        status: "beta_test",
      },
      {
        id: "pnl-pre-maitre",
        title: "Pré Maître Praticien",
        type: "distanciel",
        status: "en_projet",
      },
    ],
  },
  {
    id: "analyse-transactionnelle",
    label: "Analyse Transactionnelle",
    description: "Un parcours en cours de conception.",
    steps: [
      {
        id: "at-praticien",
        title: "Praticien en Analyse Transactionnelle",
        type: "distanciel",
        status: "en_projet",
      },
    ],
  },
  {
    id: "systemique",
    label: "Approche Systémique",
    description: "Un parcours en cours de conception.",
    steps: [
      {
        id: "systemique-praticien",
        title: "Praticien en Approche Systémique",
        type: "distanciel",
        status: "en_projet",
      },
    ],
  },
];

/** Liste à plat (rétro-compatibilité / usages transverses). */
export const FORMATIONS: readonly Formation[] = PARCOURS.flatMap(
  (p) => p.steps,
);
