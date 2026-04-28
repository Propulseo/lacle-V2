import { mockSatisfactionSurveys } from "@/data/mock/satisfaction";
import type { SatisfactionSurvey, SatisfactionType } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const surveys = [...mockSatisfactionSurveys];

/**
 * Recupere les questionnaires de satisfaction, filtres par type si precise.
 *
 * @param type - Type de questionnaire : "a_chaud" (post-examen) ou "a_froid" (J+90)
 * @returns Questionnaires correspondants
 */
// TODO // Supabase: remplacer par query sur satisfaction_surveys
export async function getSatisfactionSurveys(
  type?: SatisfactionType
): Promise<SatisfactionSurvey[]> {
  await sleep(300);
  if (type) return surveys.filter((s) => s.type === type);
  return [...surveys];
}

/**
 * Soumet un questionnaire de satisfaction rempli par un apprenant.
 *
 * @param survey - Donnees du questionnaire (sans id ni completedAt)
 * @returns Le questionnaire enregistre
 */
export async function submitSatisfactionSurvey(
  survey: Omit<SatisfactionSurvey, "id" | "completedAt">
): Promise<SatisfactionSurvey> {
  await sleep(400);
  // TODO // Supabase: INSERT dans satisfaction_surveys
  const created: SatisfactionSurvey = {
    ...survey,
    id: `sat-${generateId()}`,
    completedAt: new Date(),
  };
  surveys.push(created);
  return created;
}

/**
 * Bascule la visibilite publique d'un avis de satisfaction.
 *
 * @param surveyId - Identifiant du questionnaire
 * @returns Le questionnaire mis a jour
 * @throws Si le questionnaire n'existe pas
 */
export async function togglePublicReview(surveyId: string): Promise<SatisfactionSurvey> {
  await sleep(200);
  // TODO // Supabase: UPDATE satisfaction_surveys SET is_public
  const idx = surveys.findIndex((s) => s.id === surveyId);
  if (idx === -1) throw new Error("Questionnaire non trouve");
  surveys[idx] = {
    ...surveys[idx],
    wantsPublicReview: !surveys[idx].wantsPublicReview,
  };
  return surveys[idx];
}
