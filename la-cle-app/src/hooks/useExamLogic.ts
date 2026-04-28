"use client";

import { useMemo, useEffect, useState } from "react";
import { computeExamStatus, type ExamStatus } from "@/lib/exam-logic";
export type { ExamStatus };
import type { LegacyExamAttempt, ExamType } from "@/types";

/**
 * Calcule le statut de tentative d'un examen en temps reel.
 * Gere automatiquement le deblocage via un timer lorsque l'apprenant est temporairement bloque.
 *
 * @param attempts - Historique des tentatives de l'apprenant
 * @param examType - Type d'examen ("module" ou "final")
 * @returns Statut incluant canAttempt, isBlocked, blockedUntil, attemptsToday
 * @example
 * const status = useExamLogic(attempts, 'module')
 * if (!status.canAttempt) showBlockedMessage(status.blockedUntil)
 */
export function useExamLogic(
  attempts: LegacyExamAttempt[],
  examType: ExamType
): ExamStatus {
  const [now, setNow] = useState(Date.now());

  const status = useMemo(
    () => computeExamStatus(attempts, examType, now),
    [attempts, examType, now]
  );

  useEffect(() => {
    if (!status.blockedUntil) return;

    const delay = status.blockedUntil.getTime() - Date.now();
    if (delay <= 0) {
      setNow(Date.now());
      return;
    }

    const timer = setTimeout(() => setNow(Date.now()), delay);
    return () => clearTimeout(timer);
  }, [status.blockedUntil]);

  return status;
}
