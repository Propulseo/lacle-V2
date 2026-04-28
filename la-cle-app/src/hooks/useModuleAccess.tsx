"use client";

import type { ReactNode } from "react";
import { TrialGate } from "@/components/learner/TrialGate";
import { EnrollmentGate } from "@/components/learner/EnrollmentGate";
import { isEnrollmentComplete } from "@/lib/enrollment-gate";
import type { StudentStatus } from "@/types";

interface ModuleAccessResult {
  canAccess: boolean;
  gate: ReactNode | null;
}

/**
 * Determine si un apprenant peut acceder a un module.
 * Bloque l'acces au module 7+ en mode decouverte (TrialGate)
 * et au module 2 sans inscription completee (EnrollmentGate).
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
  if (learnerStatus === "decouverte" && moduleOrder >= 7) {
    return { canAccess: false, gate: <TrialGate /> };
  }

  if (moduleOrder === 2 && !isEnrollmentComplete()) {
    return {
      canAccess: false,
      gate: <EnrollmentGate onUnlocked={onEnrollmentUnlocked} />,
    };
  }

  return { canAccess: true, gate: null };
}
