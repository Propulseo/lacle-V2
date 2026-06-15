"use server";

// Server Action : creation d'un compte eleve par le staff.
// Securite : verifie que l'APPELANT est staff (le client service_role bypasse la
// RLS), PUIS provisionne via auth.admin.createUser. Le profil est cree par le
// trigger handle_new_user (role lu depuis app_metadata.role).
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveFormationId } from "@/lib/supabase/formation";
import { randomBytes } from "node:crypto";

export interface CreateLearnerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CreateLearnerResult {
  learnerId: string;
  tempPassword: string;
}

function generateTempPassword(): string {
  // 9 octets -> ~12 chars base64url, + un suffixe pour garantir la complexite.
  return randomBytes(9).toString("base64url") + "9A";
}

export async function createLearnerAction(
  input: CreateLearnerInput,
): Promise<CreateLearnerResult> {
  const email = input.email.trim().toLowerCase();
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const phone = input.phone?.trim() || null;

  if (!firstName || !lastName || !email) {
    throw new Error("Prénom, nom et email sont requis.");
  }

  // 1. Verifier que l'appelant est staff (RLS self-read sur profiles).
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Authentification requise.");
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .single();
  if (me?.role !== "admin" && me?.role !== "formateur") {
    throw new Error("Action réservée à l'administration.");
  }

  // 2. Provisionner le compte (service_role).
  const admin = createAdminClient();
  const tempPassword = generateTempPassword();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
    app_metadata: { role: "eleve", provider: "email", providers: ["email"] },
  });
  if (createError || !created.user) {
    throw new Error(
      createError?.message?.includes("already")
        ? "Un compte existe déjà avec cet email."
        : createError?.message ?? "Échec de la création du compte.",
    );
  }
  const learnerId = created.user.id;

  // 3. Completer le profil (telephone + changement de mot de passe force).
  await admin
    .from("profiles")
    .update({ phone, must_change_password: true })
    .eq("id", learnerId);

  // 4. Inscrire a la formation active (acces immediat, provisionne par le staff).
  const formationId = await getActiveFormationId(admin);
  if (formationId) {
    await admin.from("enrollments").upsert(
      {
        learner_id: learnerId,
        formation_id: formationId,
        status: "inscrit",
        payment_status: "active",
        contract_signed: true,
        cgv_accepted: true,
      },
      { onConflict: "learner_id,formation_id" },
    );
  }

  // TODO // Brevo: envoyer l'email de bienvenue avec le mot de passe temporaire.
  return { learnerId, tempPassword };
}
