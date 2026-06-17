// Service parcours d'entree apprenant — persistance Qualiopi (Ind.4 / Ind.8) +
// bilan d'accueil. Remplace le localStorage par des ecritures horodatees en base
// (tables pre_enrollment_answers / positioning_results / onboarding_results, RLS
// self ; pre-inscription autorisee en anon avec learner_id NULL).
import { createClient } from "@/lib/supabase/client";
import { getActiveFormationId } from "@/lib/supabase/formation";
import type { Json } from "@/types/database.types";
import type { PositioningResult } from "@/lib/positioning";
import type { OnboardingResult } from "@/types";

/**
 * Enregistre les reponses du questionnaire de pre-inscription (Qualiopi Ind.4),
 * horodatees. Appelable sans compte (learner_id NULL) ou par un eleve connecte.
 */
export async function savePreEnrollment(args: {
  answers: Json;
  contactEmail?: string | null;
  learnerId?: string | null;
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("pre_enrollment_answers").insert({
    learner_id: args.learnerId ?? null,
    contact_email: args.contactEmail ?? null,
    answers: args.answers,
  });
  if (error) throw error;
}

/**
 * Enregistre le resultat du test de positionnement (Qualiopi Ind.8), horodate.
 * `answers` = reponses brutes (cle question -> valeur).
 */
export async function savePositioningResult(
  learnerId: string,
  result: PositioningResult,
  answers: Record<string, string>
): Promise<void> {
  const supabase = createClient();
  const formationId = await getActiveFormationId(supabase);
  if (!formationId) throw new Error("Aucune formation active");
  const { error } = await supabase.from("positioning_results").insert({
    learner_id: learnerId,
    formation_id: formationId,
    answers: answers as unknown as Json,
    score: result.score,
    starting_level: result.startingLevel,
    recommendations: result.recommendations as unknown as Json,
  });
  if (error) throw error;
}

/** Enregistre le bilan d'accueil (onboarding), horodate. */
export async function saveOnboardingResult(
  learnerId: string,
  result: OnboardingResult
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("onboarding_results").insert({
    learner_id: learnerId,
    answers: result.answers as unknown as Json,
    pnl_level: result.pnlLevel,
    recommended_pace: result.recommendedPace,
  });
  if (error) throw error;
}

export interface JourneyStatus {
  onboardingDone: boolean;
  positioningDone: boolean;
}

/**
 * Statut d'avancement de l'entree en parcours, lu en base (source de verite,
 * non falsifiable via localStorage). Sert de garde-fou aux pages parcours.
 */
export async function getJourneyStatus(learnerId: string): Promise<JourneyStatus> {
  const supabase = createClient();
  const [onb, pos] = await Promise.all([
    supabase.from("onboarding_results").select("id").eq("learner_id", learnerId).limit(1),
    supabase.from("positioning_results").select("id").eq("learner_id", learnerId).limit(1),
  ]);
  if (onb.error) throw onb.error;
  if (pos.error) throw pos.error;
  return {
    onboardingDone: (onb.data?.length ?? 0) > 0,
    positioningDone: (pos.data?.length ?? 0) > 0,
  };
}
