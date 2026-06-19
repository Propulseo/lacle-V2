// Service inscription — chemins d'ecriture serveur (RPC SECURITY DEFINER) sur
// enrollments, qui n'a pas de policy d'ecriture pour authenticated (par design).
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type StudentStatus = Database["public"]["Enums"]["student_status"];

/** Enregistre le consentement horodate (contrat ou CGV) de l'apprenant courant. */
export async function acceptEnrollmentTerms(kind: "contract" | "cgv"): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("accept_enrollment_terms", { p_kind: kind });
  if (error) throw error;
}

/** Change le statut d'inscription d'un apprenant (staff). */
export async function setEnrollmentStatus(
  learnerId: string,
  status: StudentStatus
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("set_enrollment_status", {
    p_learner: learnerId,
    p_status: status,
  });
  if (error) throw error;
}

/** Certifie un apprenant (staff) si son examen final est reussi. */
export async function certifyLearner(learnerId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("certify_learner", { p_learner: learnerId });
  if (error) throw error;
}
