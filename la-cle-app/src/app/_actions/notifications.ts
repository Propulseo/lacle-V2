"use server";

// Server Actions de notification email. Co-localisees ici car declenchees depuis des
// Client Components (signalement eleve, planification admin). Toutes verifient que
// l'appelant est authentifie (et staff pour les actions staff) avant tout envoi, et
// s'appuient sur sendEmail (no-op gracieux si Brevo non configure).
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, emailTemplates } from "@/lib/email";

const STAFF_EMAIL = "contact@institutlacle.fr";

async function requireUser() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Authentification requise.");
  return { supabase, user: auth.user };
}

/**
 * Notifie le staff d'un signalement (Qualiopi Ind.31). Declenche cote eleve apres
 * la persistance du video_report. L'identite de l'apprenant est resolue server-side.
 */
export async function notifyBugReportAction(pageUrl: string, description: string): Promise<void> {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();
  const learnerName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : user.email ?? "Apprenant";

  const tpl = emailTemplates.bugReportNotice(learnerName, pageUrl, description);
  await sendEmail({ to: STAFF_EMAIL, subject: tpl.subject, html: tpl.html, replyTo: user.email ?? undefined });
}

/**
 * Notifie un apprenant de la date d'examen final retenue (action staff).
 *
 * @param learnerId - apprenant a prevenir
 * @param whenIso - date/heure ISO retenue
 */
export async function notifyFinalExamScheduledAction(learnerId: string, whenIso: string): Promise<void> {
  const { supabase, user } = await requireUser();
  // Verifier que l'appelant est staff.
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin" && me?.role !== "formateur") {
    throw new Error("Action réservée à l'administration.");
  }

  const admin = createAdminClient();
  const { data: learner } = await admin
    .from("profiles")
    .select("first_name, email")
    .eq("id", learnerId)
    .single();
  if (!learner?.email) return; // pas d'email connu : rien a envoyer

  const when = new Date(whenIso).toLocaleString("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  });
  const tpl = emailTemplates.finalExamScheduled(learner.first_name ?? "", when);
  await sendEmail({ to: learner.email, subject: tpl.subject, html: tpl.html });
}
