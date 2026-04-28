/**
 * Test de positionnement — Cours 0, Qualiopi Ind.8.
 *
 * Configuration des 10 questions et scoring.
 * Le composant PositioningTest consomme ce fichier.
 *
 * TODO // Supabase: sauvegarder dans positioning_test_results
 * avec userId + answers + startingLevel + recommendations
 * + completedAt (horodatage Qualiopi Ind.8)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PosQuestionKind = "qcm" | "radio" | "textarea";

interface BasePosQuestion {
  id: string;
  order: number;
  prompt: string;
  helper?: string;
  kind: PosQuestionKind;
  /** Si true, la question est bloquante (QCM avec bonne reponse). */
  scored: boolean;
  correctAnswer?: string;
}

interface QcmPosQuestion extends BasePosQuestion {
  kind: "qcm";
  options: ReadonlyArray<{ value: string; label: string }>;
  correctAnswer: string;
  scored: true;
}

interface RadioPosQuestion extends BasePosQuestion {
  kind: "radio";
  options: ReadonlyArray<{ value: string; label: string }>;
  scored: boolean;
}

interface TextareaPosQuestion extends BasePosQuestion {
  kind: "textarea";
  placeholder?: string;
  scored: false;
}

export type PosQuestion = QcmPosQuestion | RadioPosQuestion | TextareaPosQuestion;

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export const POSITIONING_QUESTIONS: ReadonlyArray<PosQuestion> = [
  {
    id: "pnl-meaning",
    order: 1,
    prompt: "Que signifie PNL ?",
    kind: "qcm",
    scored: true,
    correctAnswer: "programmation-neuro-linguistique",
    options: [
      { value: "programmation-neuro-linguistique", label: "Programmation Neuro-Linguistique" },
      { value: "psychologie-neuro-logique", label: "Psychologie Neuro-Logique" },
      { value: "pratique-naturelle-langage", label: "Pratique Naturelle du Langage" },
      { value: "processus-normalisation", label: "Processus de Normalisation du comportement" },
    ],
  },
  {
    id: "introspection",
    order: 2,
    prompt: "Avez-vous deja pratique une technique d'introspection ?",
    kind: "radio",
    scored: true,
    correctAnswer: "regulierement",
    options: [
      { value: "jamais", label: "Jamais" },
      { value: "rarement", label: "Rarement" },
      { value: "regulierement", label: "Regulierement" },
    ],
  },
  {
    id: "pnl-focus",
    order: 3,
    prompt: "La PNL travaille principalement sur :",
    kind: "qcm",
    scored: true,
    correctAnswer: "les-deux",
    options: [
      { value: "comportements", label: "Les comportements observables" },
      { value: "croyances", label: "Les croyances et representations mentales" },
      { value: "les-deux", label: "Les deux a la fois" },
      { value: "aucun", label: "Ni l'un ni l'autre" },
    ],
  },
  {
    id: "profile-type",
    order: 4,
    prompt: "Vous etes plutot :",
    kind: "radio",
    scored: false,
    options: [
      { value: "analytique", label: "Analytique" },
      { value: "intuitif", label: "Intuitif" },
      { value: "mix", label: "Un mix des deux" },
    ],
  },
  {
    id: "recadrage",
    order: 5,
    prompt: "Avez-vous entendu parler du \"recadrage\" en PNL ?",
    kind: "radio",
    scored: true,
    correctAnswer: "oui-je-sais",
    options: [
      { value: "non", label: "Non" },
      { value: "oui-vaguement", label: "Oui, vaguement" },
      { value: "oui-je-sais", label: "Oui, je sais ce que c'est" },
    ],
  },
  {
    id: "manipulation",
    order: 6,
    prompt: "Selon vous, la PNL peut-elle etre utilisee pour manipuler ?",
    helper: "Question philosophique — il n'y a pas de bonne reponse.",
    kind: "radio",
    scored: false,
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
      { value: "depend", label: "Ca depend de l'intention" },
    ],
  },
  {
    id: "failure",
    order: 7,
    prompt: "Votre rapport a l'echec :",
    kind: "radio",
    scored: false,
    options: [
      { value: "difficilement", label: "Je le vis difficilement" },
      { value: "motive", label: "Il me motive" },
      { value: "analyse", label: "Je l'analyse pour progresser" },
    ],
  },
  {
    id: "orientation",
    order: 8,
    prompt: "Dans votre quotidien, vous etes oriente :",
    kind: "radio",
    scored: false,
    options: [
      { value: "resultats", label: "Resultats" },
      { value: "relations", label: "Relations" },
      { value: "processus", label: "Processus" },
      { value: "sens", label: "Sens" },
    ],
  },
  {
    id: "role-model",
    order: 9,
    prompt: "Avez-vous un modele dont vous aimeriez adopter certaines qualites ?",
    kind: "radio",
    scored: false,
    options: [
      { value: "oui", label: "Oui, clairement" },
      { value: "vaguement", label: "Vaguement" },
      { value: "non", label: "Non" },
    ],
  },
  {
    id: "attraction",
    order: 10,
    prompt: "Apres cette introduction, qu'est-ce qui vous attire le plus dans la PNL ?",
    kind: "textarea",
    scored: false,
    placeholder: "Exprimez-vous librement.",
  },
] as const;

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export interface PositioningResult {
  score: number;
  startingLevel: "debutant" | "initie" | "avance";
  recommendations: string[];
  completedAt: Date;
}

export function computePositioningResult(
  answers: Record<string, string>
): PositioningResult {
  let score = 0;
  for (const q of POSITIONING_QUESTIONS) {
    if (q.scored && q.correctAnswer && answers[q.id] === q.correctAnswer) {
      score++;
    }
  }

  let startingLevel: PositioningResult["startingLevel"];
  let recommendations: string[];

  if (score < 4) {
    startingLevel = "debutant";
    recommendations = [
      "Prenez le temps de bien assimiler chaque capsule avant de passer a la suivante.",
      "Les questions d'integration sont la pour consolider — ne les survolez pas.",
      "Le rythme recommande : 2 a 3 capsules par semaine.",
    ];
  } else if (score <= 7) {
    startingLevel = "initie";
    recommendations = [
      "Vous avez de bonnes bases — concentrez-vous sur les nuances.",
      "Les capsules d'approfondissement seront particulierement utiles.",
      "Le rythme recommande : 3 a 5 capsules par semaine.",
    ];
  } else {
    startingLevel = "avance";
    recommendations = [
      "Vos connaissances sont solides — visez l'integration comportementale.",
      "Les questions philosophiques vous permettront d'aller plus loin.",
      "Le rythme recommande : a votre convenance, en maintenant la regularite.",
    ];
  }

  return { score, startingLevel, recommendations, completedAt: new Date() };
}

// ---------------------------------------------------------------------------
// Flag localStorage
// ---------------------------------------------------------------------------

const COMPLETED_KEY = "positioning_test_completed";
const RESULT_KEY = "positioning_test_result";

export function hasCompletedPositioning(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(COMPLETED_KEY) === "true";
}

export function markPositioningCompleted(result: PositioningResult): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COMPLETED_KEY, "true");
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}
