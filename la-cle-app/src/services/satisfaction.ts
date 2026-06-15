// Service satisfaction — cable Supabase (table satisfaction_surveys) avec
// adaptateur vers le DTO SatisfactionSurvey (pages inchangees).
// - Lecture admin/staff : SELECT direct (RLS staff) sur satisfaction_surveys.
// - Soumission "a chaud" (eleve connecte) : INSERT direct (RLS self).
// - Enquete "a froid" J+90 par token (anonyme) : RPC SECURITY DEFINER
//   get/submit_satisfaction_survey_by_token (pas d'acces direct a la table).
import { createClient } from "@/lib/supabase/client";
import { getActiveFormationId } from "@/lib/supabase/formation";
import type { SatisfactionSurvey, SatisfactionType, SatisfactionAnswer } from "@/types";
import type { Database, Json } from "@/types/database.types";

type SurveyRow = {
  id: string;
  type: SatisfactionType;
  formation_id: string;
  learner_id: string | null;
  answers: Json;
  public_review: string | null;
  wants_public_review: boolean;
  completed_at: string | null;
};

const SURVEY_SELECT =
  "id, type, formation_id, learner_id, answers, public_review, wants_public_review, completed_at";

/** Le champ JSON `answers` est stocke comme tableau de SatisfactionAnswer. */
function parseAnswers(raw: Json): SatisfactionAnswer[] {
  if (!Array.isArray(raw)) return [];
  return raw as unknown as SatisfactionAnswer[];
}

function mapSurvey(r: SurveyRow): SatisfactionSurvey {
  return {
    id: r.id,
    type: r.type,
    formationId: r.formation_id,
    studentId: r.learner_id ?? "anonymous",
    answers: parseAnswers(r.answers),
    publicReview: r.public_review ?? undefined,
    wantsPublicReview: r.wants_public_review,
    completedAt: r.completed_at ? new Date(r.completed_at) : undefined,
  };
}

/**
 * Recupere les questionnaires de satisfaction (lecture staff/admin),
 * filtres par type si precise.
 *
 * @param type - Type de questionnaire : "chaud" (post-examen) ou "froid" (J+90)
 * @returns Questionnaires correspondants, du plus recent au plus ancien
 */
export async function getSatisfactionSurveys(
  type?: SatisfactionType
): Promise<SatisfactionSurvey[]> {
  const supabase = createClient();
  let query = supabase
    .from("satisfaction_surveys")
    .select(SURVEY_SELECT)
    .order("completed_at", { ascending: false, nullsFirst: false });
  if (type) query = query.eq("type", type);
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as SurveyRow[]).map(mapSurvey);
}

/**
 * Soumet un questionnaire de satisfaction rempli par un apprenant.
 * Cas "a chaud" : eleve connecte, INSERT direct (RLS self).
 *
 * @param survey - Donnees du questionnaire (sans id ni completedAt)
 * @returns Le questionnaire enregistre
 */
export async function submitSatisfactionSurvey(
  survey: Omit<SatisfactionSurvey, "id" | "completedAt">
): Promise<SatisfactionSurvey> {
  const supabase = createClient();
  // studentId == "anonymous" => pas d'eleve connecte, learner_id null.
  const learnerId =
    survey.studentId && survey.studentId !== "anonymous" ? survey.studentId : null;
  // formationId "pnl-praticien" (legacy mock) => resoudre la formation active.
  let formationId = survey.formationId;
  if (!formationId || formationId === "pnl-praticien") {
    const active = await getActiveFormationId(supabase);
    if (!active) throw new Error("Aucune formation active");
    formationId = active;
  }

  const payload: Database["public"]["Tables"]["satisfaction_surveys"]["Insert"] = {
    type: survey.type,
    formation_id: formationId,
    learner_id: learnerId,
    answers: survey.answers as unknown as Json,
    public_review: survey.publicReview ?? null,
    wants_public_review: survey.wantsPublicReview,
    completed_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("satisfaction_surveys")
    .insert(payload)
    .select(SURVEY_SELECT)
    .single();
  if (error) throw error;
  return mapSurvey(data as unknown as SurveyRow);
}

/**
 * Bascule la visibilite publique d'un avis de satisfaction (action staff/admin).
 *
 * @param surveyId - Identifiant du questionnaire
 * @returns Le questionnaire mis a jour
 * @throws Si le questionnaire n'existe pas
 */
export async function togglePublicReview(surveyId: string): Promise<SatisfactionSurvey> {
  const supabase = createClient();
  const { data: current, error: readError } = await supabase
    .from("satisfaction_surveys")
    .select("wants_public_review")
    .eq("id", surveyId)
    .maybeSingle();
  if (readError) throw readError;
  if (!current) throw new Error("Questionnaire non trouve");

  const patch: Database["public"]["Tables"]["satisfaction_surveys"]["Update"] = {
    wants_public_review: !current.wants_public_review,
  };
  const { data, error } = await supabase
    .from("satisfaction_surveys")
    .update(patch)
    .eq("id", surveyId)
    .select(SURVEY_SELECT)
    .single();
  if (error) throw error;
  return mapSurvey(data as unknown as SurveyRow);
}

// --- Enquete "a froid" J+90 par token (anonyme, RPC SECURITY DEFINER) ---

/**
 * Recupere une enquete de satisfaction "a froid" via son token (lien email J+90).
 * Passe par une RPC SECURITY DEFINER : aucun acces direct a la table.
 *
 * @param token - Token de l'enquete transmis dans le lien tokenise
 * @returns Le questionnaire correspondant, ou null si token invalide/expire
 */
export async function getSatisfactionSurveyByToken(
  token: string
): Promise<SatisfactionSurvey | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_satisfaction_survey_by_token", {
    p_token: token,
  });
  if (error) throw error;
  if (!data || Array.isArray(data) || typeof data !== "object") return null;
  return mapSurvey(data as unknown as SurveyRow);
}

/**
 * Soumet une enquete de satisfaction "a froid" via son token (lien email J+90).
 * Passe par une RPC SECURITY DEFINER qui valide le token et horodate la reponse.
 *
 * @param token - Token de l'enquete transmis dans le lien tokenise
 * @param answers - Reponses au questionnaire
 * @param options - Avis public optionnel et consentement de publication
 */
export async function submitSatisfactionSurveyByToken(
  token: string,
  answers: SatisfactionAnswer[],
  options?: { publicReview?: string; wantsPublicReview?: boolean }
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("submit_satisfaction_survey_by_token", {
    p_token: token,
    p_answers: answers as unknown as Json,
    p_public_review: options?.publicReview,
    p_wants_public_review: options?.wantsPublicReview,
  });
  if (error) throw error;
}
