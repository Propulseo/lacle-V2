import type { FinalExam } from "@/types";
import { sleep, generateId } from "@/lib/utils";

// Final exam mock
// TODO // Supabase: table final_exams (learnerId, status, requestedAt, scheduledAt, completedAt, score, notes)
const finalExams: FinalExam[] = [
  {
    id: "final-2",
    learnerId: "learner-2",
    status: "requested",
    requestedAt: "2026-03-10T10:00:00Z",
    scheduledAt: null,
    completedAt: null,
    score: null,
    notes: null,
  },
  {
    id: "final-3",
    learnerId: "learner-3",
    status: "passed",
    requestedAt: "2026-01-15T10:00:00Z",
    scheduledAt: "2026-02-01T09:00:00Z",
    completedAt: "2026-02-01T11:00:00Z",
    score: 95,
    notes: "Excellente maîtrise des protocoles.",
  },
];

/**
 * Recupere tous les examens finaux (vue admin).
 *
 * @returns Liste de tous les examens finaux
 */
export async function getFinalExams(): Promise<FinalExam[]> {
  await sleep(200);
  return [...finalExams];
}

/**
 * Recupere l'examen final d'un apprenant.
 *
 * @param learnerId - Identifiant de l'apprenant
 * @returns L'examen final ou null si aucune demande
 */
export async function getFinalExam(learnerId: string): Promise<FinalExam | null> {
  await sleep(200);
  return finalExams.find((e) => e.learnerId === learnerId) || null;
}

/**
 * Envoie une demande d'examen final pour un apprenant.
 *
 * @param learnerId - Identifiant de l'apprenant
 * @returns L'examen final cree avec statut "requested"
 * @throws Si une demande existe deja
 */
export async function requestFinalExam(learnerId: string): Promise<FinalExam> {
  await sleep(400);
  const existing = finalExams.find((e) => e.learnerId === learnerId);
  if (existing) throw new Error("Demande déjà existante");
  const exam: FinalExam = {
    id: `final-${generateId()}`,
    learnerId,
    status: "requested",
    requestedAt: new Date().toISOString(),
    scheduledAt: null,
    completedAt: null,
    score: null,
    notes: null,
  };
  finalExams.push(exam);
  return exam;
}

/**
 * Met a jour un examen final (planification, notation, etc.).
 *
 * @param id - Identifiant de l'examen final
 * @param data - Champs a modifier
 * @returns L'examen final mis a jour
 * @throws Si l'examen final n'existe pas
 */
export async function updateFinalExam(id: string, data: Partial<FinalExam>): Promise<FinalExam> {
  await sleep(300);
  const idx = finalExams.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Examen final non trouvé");
  finalExams[idx] = { ...finalExams[idx], ...data };
  return finalExams[idx];
}
