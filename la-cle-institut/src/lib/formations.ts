import { ROUTES } from "@/lib/constants";

export type FormationType = "distanciel" | "presentiel";

/**
 * Terminologie fixée par Marien (16/07/2026) :
 *  - disponible          : formation ouverte
 *  - cohorte_pilote      : première promotion, validation pédagogique
 *  - en_developpement    : contenus en cours de conception
 * Remplace l'ancien jeu (beta_test / en_cours_de_creation / en_projet).
 */
export type FormationStatus = "disponible" | "cohorte_pilote" | "en_developpement";

export interface Formation {
  /** Identifiant stable utilisé comme clé React. */
  id: string;
  /** Libellé affiché sur la carte. */
  title: string;
  /** Modalité pédagogique dominante (affichée en badge). */
  type: FormationType;
  /** Statut de disponibilité : pilote l'apparence de la carte. */
  status: FormationStatus;
  /**
   * Position dans un cursus en plusieurs étapes (ex. « Étape 1 / 2 »).
   * Sert à faire comprendre l'enchaînement distanciel -> présentiel.
   */
  etape?: string;
  /** Ce que l'étape délivre (« Attestation », « Certification »). */
  delivrable?: string;
  /**
   * URL de destination. C'est la SEULE condition de cliquabilité : une étape
   * sans page reste inerte quel que soit son statut (et inversement, une
   * cohorte pilote dotée d'une page reste cliquable).
   */
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
 * Un carrousel par parcours ; chaque étape porte un badge de statut et une
 * modalité. Source de vérité unique, prête à brancher sur Supabase plus tard.
 *
 * Nommage et statuts fixés par Marien (16/07/2026) : le cursus Praticien PNL
 * se lit en deux étapes — Pré-praticien en distanciel (attestation), puis
 * Praticien en présentiel (certification). Les deux sont en cohorte pilote
 * (cours tournés, montage en cours). Le Maître Praticien est en cours
 * d'écriture.
 */
export const PARCOURS: readonly Parcours[] = [
  {
    id: "pnl",
    label: "Programmation Neuro-Linguistique",
    description:
      "Le parcours fondateur de l'institut, du Pré-praticien au Maître Praticien.",
    steps: [
      {
        id: "pnl-pre-praticien-distanciel",
        title: "Pré-praticien PNL",
        type: "distanciel",
        status: "cohorte_pilote",
        etape: "Étape 1 / 2",
        delivrable: "Attestation",
        href: ROUTES.pnlPractitioner,
      },
      {
        id: "pnl-praticien-presentiel",
        title: "Praticien PNL",
        type: "presentiel",
        status: "cohorte_pilote",
        etape: "Étape 2 / 2",
        delivrable: "Certification",
      },
      {
        id: "pnl-maitre-praticien",
        title: "Maître Praticien PNL",
        type: "distanciel",
        status: "en_developpement",
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
        status: "en_developpement",
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
        status: "en_developpement",
      },
    ],
  },
];

/** Liste à plat (rétro-compatibilité / usages transverses). */
export const FORMATIONS: readonly Formation[] = PARCOURS.flatMap(
  (p) => p.steps,
);
