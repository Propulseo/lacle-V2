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
  const formationId = await getActiveFormationId(supabase);
  if (!formationId) throw new Error("Aucune formation active");

  const { data: examFinal, error: examError } = await supabase
    .from("exams_final")
    .select("id")
    .eq("formation_id", formationId)
    .maybeSingle();
  if (examError) throw examError;
  if (!examFinal) throw new Error("Aucun examen final configuré");

  const existing = await getFinalExam(learnerId);
  if (existing) throw new Error("Demande déjà existante");

  const insert: Database["public"]["Tables"]["final_exam_progress"]["Insert"] = {
    exam_final_id: examFinal.id,
    learner_id: learnerId,
    status: "requested",
    requested_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("final_exam_progress")
    .insert(insert)
    .select(PROGRESS_SELECT)
    .single();
  if (error) throw error;
  return mapProgress(data as ProgressRow);
}

/**
 * Met a jour un examen final (planification, notation, etc.).
 *
 * @param id - Identifiant de l'examen final (final_exam_progress.id)
 * @param data - Champs a modifier
 * @returns L'examen final mis a jour
 * @throws Si l'examen final n'existe pas
 */
export async function updateFinalExam(id: string, data: Partial<FinalExam>): Promise<FinalExam> {
  const supabase = createClient();
  const patch: Database["public"]["Tables"]["final_exam_progress"]["Update"] = {};
  if (data.status !== undefined) patch.status = data.status;
  if (data.requestedAt !== undefined) patch.requested_at = data.requestedAt;
  if (data.scheduledAt !== undefined) patch.scheduled_at = data.scheduledAt;
  if (data.completedAt !== undefined) patch.completed_at = data.completedAt;
  if (data.score !== undefined) patch.best_score = data.score;
  if (data.notes !== undefined) patch.notes = data.notes;
  const { data: row, error } = await supabase
    .from("final_exam_progress")
    .update(patch)
    .eq("id", id)
    .select(PROGRESS_SELECT)
    .single();
  if (error) throw error;
  return mapProgress(row as ProgressRow);
}
