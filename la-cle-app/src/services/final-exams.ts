// Service examens finaux — cable Supabase (schema nested) avec adaptateur vers le
// DTO FinalExam (pages inchangees).
// Un "examen final" cote DTO == une ligne final_exam_progress (la progression de
// l'eleve sur l'exams_final de la formation). FinalExam.id == final_exam_progress.id,
// FinalExam.learnerId == final_exam_progress.learner_id, score == best_score.
// NB : exams_final (1 par formation, formation_id UNIQUE) porte le bareme ; la
// demande / planification / notation par eleve vit dans final_exam_progress.
import { createClient } from "@/lib/supabase/client";
import { getActiveFormationId } from "@/lib/supabase/formation";
import type { FinalExam, FinalExamStatus } from "@/types";
import type { Database } from "@/types/database.types";

const PROGRESS_SELECT =
  "id, learner_id, status, requested_at, scheduled_at, completed_at, best_score, notes";

type ProgressRow = {
  id: string;
  learner_id: string;
  status: Database["public"]["Enums"]["final_exam_status"];
  requested_at: string | null;
  scheduled_at: string | null;
  completed_at: string | null;
  best_score: number | null;
  notes: string | null;
};

// L'enum DB couvre des etats "cas pratique" hors perimetre du DTO historique :
// on les ramene au statut DTO le plus proche pour ne pas casser l'UI.
function mapStatus(s: ProgressRow["status"]): FinalExamStatus {
  switch (s) {
    case "practical_case_open":
      return "scheduled";
    case "practical_case_passed":
      return "passed";
    case "practical_case_failed":
      return "failed";
    default:
      return s;
  }
}

function mapProgress(r: ProgressRow): FinalExam {
  return {
    id: r.id,
    learnerId: r.learner_id,
    status: mapStatus(r.status),
    requestedAt: r.requested_at,
    scheduledAt: r.scheduled_at,
    completedAt: r.completed_at,
    score: r.best_score,
    notes: r.notes,
  };
}

/**
 * Recupere tous les examens finaux (vue admin) pour la formation active.
 *
 * @returns Liste de tous les examens finaux
 */
export async function getFinalExams(): Promise<FinalExam[]> {
  const supabase = createClient();
  const formationId = await getActiveFormationId(supabase);
  if (!formationId) return [];
  // Filtre par la formation active via l'exams_final (formation_id UNIQUE).
  const { data: examFinal, error: examError } = await supabase
    .from("exams_final")
    .select("id")
    .eq("formation_id", formationId)
    .maybeSingle();
  if (examError) throw examError;
  if (!examFinal) return [];

  const { data, error } = await supabase
    .from("final_exam_progress")
    .select(PROGRESS_SELECT)
    .eq("exam_final_id", examFinal.id)
    .order("requested_at", { ascending: false });
  if (error) throw error;
  return ((data as ProgressRow[]) ?? []).map(mapProgress);
}

/**
 * Recupere l'examen final d'un apprenant.
 *
 * @param learnerId - Identifiant de l'apprenant
 * @returns L'examen final ou null si aucune demande
 */
export async function getFinalExam(learnerId: string): Promise<FinalExam | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("final_exam_progress")
    .select(PROGRESS_SELECT)
    .eq("learner_id", learnerId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProgress(data as ProgressRow) : null;
}

/**
 * Envoie une demande d'examen final pour un apprenant (formation active).
 *
 * @param learnerId - Identifiant de l'apprenant
 * @returns L'examen final cree avec statut "requested"
 * @throws Si une demande existe deja ou si aucune formation active
 */
export async function requestFinalExam(learnerId: string): Promise<FinalExam> {
  const supabase = createClient();
  // Ecriture via RPC SECURITY DEFINER : final_exam_progress n'a pas de policy
  // d'ecriture pour authenticated. Le learner + l'examen sont derives serveur.
  const { error } = await supabase.rpc("request_final_exam");
  if (error) throw error;
  const exam = await getFinalExam(learnerId);
  if (!exam) throw new Error("Demande d'examen final introuvable");
  return exam;
}

/**
 * Planifie la date d'un examen final (staff). Passe par la RPC SECURITY DEFINER
 * schedule_final_exam (pas de policy UPDATE authenticated sur final_exam_progress).
 *
 * @param progressId - Identifiant de la progression (final_exam_progress.id)
 * @param scheduledAt - Date/heure ISO retenue
 */
export async function scheduleFinalExam(
  progressId: string,
  scheduledAt: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("schedule_final_exam", {
    p_progress_id: progressId,
    p_scheduled_at: scheduledAt,
  });
  if (error) throw error;
}

