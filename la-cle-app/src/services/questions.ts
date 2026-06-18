// Service questions inter-capsules (methode La Clé). La correction et la planification
// de la repetition espacee (J+1/J+3/J+7/J+21) sont 100% serveur : la RPC DEFINER
// `submit_question_response` ecrit `question_responses` (immuable), declenche
// `scheduled_reviews` si la reponse est correcte, et renvoie {correct, explanation}.
// Le client n'a JAMAIS la bonne reponse (les secrets restent staff-only) : on affiche
// le verdict retourne par le serveur.
import { createClient } from "@/lib/supabase/client";

export interface QuestionResponseResult {
  correct: boolean;
  explanation: string | null;
}

/**
 * Soumet la reponse d'un eleve a une question inter-capsule.
 *
 * @param questionId - UUID de la question
 * @param answer - reponse de l'eleve (texte libre ou option choisie)
 * @param responseTimeMs - temps de reponse en ms (analytics)
 * @returns Verdict serveur { correct, explanation }
 */
export async function submitQuestionResponse(
  questionId: string,
  answer: string,
  responseTimeMs?: number,
): Promise<QuestionResponseResult> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("submit_question_response", {
    p_question_id: questionId,
    p_answer: answer,
    p_response_time_ms: responseTimeMs,
  });
  if (error) throw error;
  const res = (data ?? {}) as { correct?: boolean; explanation?: string | null };
  return { correct: res.correct ?? false, explanation: res.explanation ?? null };
}
