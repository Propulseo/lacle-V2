import type { StudentStatus } from "@/types";

/**
 * Règles d'accès aux modules selon le statut de l'apprenant.
 * Source : docs/PARCOURS_UTILISATEUR.md — l'essai Découverte donne accès aux
 * cours 1 à 7 (examen du cours 7 bloqué, invitation à s'inscrire) ; le cours 8
 * exige contrat signé + CGV acceptées + paiement actif.
 */

/** Dernier cours consultable en mode Découverte. */
export const TRIAL_MAX_ACCESSIBLE_ORDER = 7;

/** Premier cours soumis aux conditions d'inscription (contrat + CGV + paiement). */
export const ENROLLMENT_GATE_ORDER = 8;

export type ModuleAccessDecision =
  | "allowed"
  | "trial_blocked"
  | "enrollment_required";

export function getModuleAccessDecision(
  moduleOrder: number,
  learnerStatus: StudentStatus | null,
  enrollmentComplete: boolean
): ModuleAccessDecision {
  if (learnerStatus === "decouverte" && moduleOrder > TRIAL_MAX_ACCESSIBLE_ORDER) {
    return "trial_blocked";
  }
  if (moduleOrder >= ENROLLMENT_GATE_ORDER && !enrollmentComplete) {
    return "enrollment_required";
  }
  return "allowed";
}

/** En Découverte, l'examen du cours 7 est bloqué — les cours 1 à 6 restent passables. */
export function canTakeModuleExam(
  moduleOrder: number,
  learnerStatus: StudentStatus | null
): boolean {
  return !(
    learnerStatus === "decouverte" && moduleOrder >= TRIAL_MAX_ACCESSIBLE_ORDER
  );
}
