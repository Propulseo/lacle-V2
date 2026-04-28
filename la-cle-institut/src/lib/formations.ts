import { ROUTES } from "@/lib/constants";

export type FormationType = "distanciel" | "presentiel";

export type FormationStatus =
  | "disponible"
  | "en_cours_de_creation"
  | "en_projet";

export interface Formation {
  /** Identifiant stable utilisé comme clé React. */
  id: string;
  /** Libellé affiché sur la carte, tel que formulé par le métier. */
  title: string;
  /** Modalité pédagogique dominante. */
  type: FormationType;
  /** Statut de disponibilité, pilote l'apparence et l'interactivité. */
  status: FormationStatus;
  /**
   * URL de destination pour les formations "disponible".
   * Les statuts non disponibles n'ont pas besoin de href : la carte est
   * rendue non cliquable et signale "Bientôt disponible".
   */
  href?: string;
}

/**
 * Catalogue unique des formations proposées par l'institut.
 * L'ordre du tableau est l'ordre d'affichage dans le carrousel.
 *
 * Note : "Analyse Transactionnelle" et "Approche Systémique" ne portent
 * pas de marqueur de format dans leur titre ; par défaut on les considère
 * distancielles, en phase avec l'orientation actuelle de l'institut.
 * Le champ pourra évoluer lorsque ces formations seront structurées.
 */
export const FORMATIONS: readonly Formation[] = [
  {
    id: "pnl-distanciel",
    title: "Distanciel \u2013 Praticien PNL",
    type: "distanciel",
    status: "disponible",
    href: ROUTES.pnlPractitioner,
  },
  {
    id: "pnl-presentiel",
    title: "Praticien PNL \u2013 Pr\u00E9sentiel",
    type: "presentiel",
    status: "en_cours_de_creation",
  },
  {
    id: "pre-maitre-distanciel",
    title: "Distanciel \u2013 Pr\u00E9 Ma\u00EEtre Praticien",
    type: "distanciel",
    status: "en_projet",
  },
  {
    id: "analyse-transactionnelle",
    title: "Analyse Transactionnelle",
    type: "distanciel",
    status: "en_projet",
  },
  {
    id: "approche-systemique",
    title: "Approche Syst\u00E9mique",
    type: "distanciel",
    status: "en_projet",
  },
];
