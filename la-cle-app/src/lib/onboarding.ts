/**
 * Bilan d'accueil — configuration, scoring, flag localStorage.
 *
 * Les 10 questions sont affichées une à une par le composant
 * `OnboardingAssessment`. Le scoring est volontairement simple et
 * vit côté front tant que la persistance Supabase n'est pas en place.
 *
 * TODO // Supabase: sauvegarder dans onboarding_results avec horodatage
 */

import type { OnboardingResult } from "@/types";

// ---------------------------------------------------------------------------
// Types de question
// ---------------------------------------------------------------------------

export type OnboardingQuestionKind = "text" | "textarea" | "radio" | "scale";

interface BaseQuestion {
  id: string;
  order: number;
  prompt: string;
  helper?: string;
  required: boolean;
}

interface TextQuestion extends BaseQuestion {
  kind: "text";
  placeholder?: string;
}

interface TextareaQuestion extends BaseQuestion {
  kind: "textarea";
  placeholder?: string;
}

interface RadioQuestion extends BaseQuestion {
  kind: "radio";
  options: ReadonlyArray<{ value: string; label: string }>;
}

interface ScaleQuestion extends BaseQuestion {
  kind: "scale";
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

export type OnboardingQuestion =
  | TextQuestion
  | TextareaQuestion
  | RadioQuestion
  | ScaleQuestion;

// ---------------------------------------------------------------------------
// Options partagées
// ---------------------------------------------------------------------------

const PRIOR_KNOWLEDGE_OPTIONS = [
  { value: "non", label: "Non" },
  { value: "vaguement", label: "Oui, vaguement" },
  { value: "bases", label: "Oui, j'ai des bases" },
] as const;

const GOAL_OPTIONS = [
  { value: "personnel", label: "Personnel" },
  { value: "professionnel", label: "Professionnel" },
  { value: "les-deux", label: "Les deux" },
] as const;

const LEARNER_PROFILE_OPTIONS = [
  { value: "rapide", label: "Je lis et j'assimile vite" },
  { value: "temps", label: "J'ai besoin de temps" },
  { value: "visuel", label: "Je suis visuel" },
  { value: "pratique", label: "J'apprends en pratiquant" },
] as const;

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export const ONBOARDING_QUESTIONS: ReadonlyArray<OnboardingQuestion> = [
  {
    id: "firstName",
    order: 1,
    prompt: "Quel est votre prénom ?",
    helper: "Pour personnaliser votre parcours.",
    required: true,
    kind: "text",
    placeholder: "Votre prénom",
  },
  {
    id: "whyNow",
    order: 2,
    prompt: "Pourquoi la PNL maintenant ? Qu'est-ce qui vous a amené ici ?",
    required: true,
    kind: "textarea",
    placeholder: "Prenez le temps de nous raconter.",
  },
  {
    id: "priorKnowledge",
    order: 3,
    prompt: "Avez-vous déjà entendu parler de la PNL avant aujourd'hui ?",
    required: true,
    kind: "radio",
    options: PRIOR_KNOWLEDGE_OPTIONS,
  },
  {
    id: "selfRating",
    order: 4,
    prompt: "Comment évaluez-vous votre connaissance de la PNL aujourd'hui ?",
    helper: "1 = aucune, 5 = solide.",
    required: true,
    kind: "scale",
    min: 1,
    max: 5,
    minLabel: "Aucune",
    maxLabel: "Solide",
  },
  {
    id: "goal",
    order: 5,
    prompt: "Quel est votre objectif principal avec cette formation ?",
    required: true,
    kind: "radio",
    options: GOAL_OPTIONS,
  },
  {
    id: "learnerProfile",
    order: 6,
    prompt: "Comment vous décririez-vous en tant qu'apprenant ?",
    required: true,
    kind: "radio",
    options: LEARNER_PROFILE_OPTIONS,
  },
  {
    id: "weeklyTime",
    order: 7,
    prompt: "Combien de temps par semaine prévoyez-vous pour cette formation ?",
    helper: "Une estimation honnête vaut mieux qu'un idéal.",
    required: true,
    kind: "text",
    placeholder: "ex. 3 heures",
  },
  {
    id: "concreteProject",
    order: 8,
    prompt:
      "Avez-vous un projet concret lié à la PNL (reconversion, accompagnement, etc.) ?",
    required: true,
    kind: "textarea",
    placeholder: "Même une intuition suffit.",
  },
  {
    id: "concerns",
    order: 9,
    prompt: "Quelque chose vous inquiète ou vous questionne sur cette formation ?",
    helper: "Optionnel — mais bon à nous partager.",
    required: false,
    kind: "textarea",
    placeholder: "Un doute, une contrainte, une question ouverte.",
  },
  {
    id: "motivationLevel",
    order: 10,
    prompt: "Quel est votre niveau de motivation en ce moment ?",
    helper: "1 = fragile, 5 = inébranlable.",
    required: true,
    kind: "scale",
    min: 1,
    max: 5,
    minLabel: "Fragile",
    maxLabel: "Inébranlable",
  },
] as const;

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

type AnswerMap = Record<string, string>;

export function computePnlLevel(answers: AnswerMap): OnboardingResult["pnlLevel"] {
  const prior = answers.priorKnowledge;
  const rating = Number.parseInt(answers.selfRating ?? "0", 10);
  if (prior === "non" || rating <= 2) return "debutant";
  if (prior === "bases" && rating >= 4) return "avance";
  return "initie";
}

export function computeRecommendedPace(
  answers: AnswerMap
): OnboardingResult["recommendedPace"] {
  const motivation = Number.parseInt(answers.motivationLevel ?? "0", 10);
  if (motivation <= 2) return "lent";
  if (motivation >= 4) return "intensif";
  return "normal";
}

// ---------------------------------------------------------------------------
// Flag localStorage
// ---------------------------------------------------------------------------

const STORAGE_KEY = "onboarding_completed";

export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function markOnboardingCompleted(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, "true");
}

export function resetOnboardingStatus(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
