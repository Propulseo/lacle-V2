"use client";

import type { ReactNode } from "react";
import { TrialGate } from "@/components/learner/TrialGate";
import { EnrollmentGate } from "@/components/learner/EnrollmentGate";
import { isEnrollmentComplete } from "@/lib/enrollment-gate";
import { getModuleAccessDecision } from "@/lib/module-access";
import type { StudentStatus } from "@/types";

interface ModuleAccessResult {
  canAccess: boolean;
  gate: ReactNode | null;
}

/**
 * Determine si un apprenant peut acceder a un module.
 * Mode Decouverte : cours 1 a 7 consultables, TrialGate au-dela.
 * Cours 8 et suivants : EnrollmentGate tant que contrat + CGV + paiement
 * ne sont pas valides (docs/PARCOURS_UTILISATEUR.md).
 *
 * @param moduleOrder - Numero d'ordre du module
 * @param learnerStatus - Statut actuel de l'apprenant
 * @param onEnrollmentUnlocked - Callback appele quand l'inscription est validee
 * @returns { canAccess, gate } ou gate est le composant de blocage a afficher
 */
export function getModuleAccess(
  moduleOrder: number,
  learnerStatus: StudentStatus | null,
  onEnrollmentUnlocked: () => void
): ModuleAccessResult {
  const decision = getModuleAccessDecision(
    moduleOrder,
    learnerStatus,
    isEnrollmentComplete()
  );

  if (decision === "trial_blocked") {
    return { canAccess: false, gate: <TrialGate /> };
  }

  if (decision === "enrollment_required") {
    return {
      canAccess: false,
      gate: <EnrollmentGate onUnlocked={onEnrollmentUnlocked} />,
    };
  }

  return { canAccess: true, gate: null };
}
