// Service d'authentification — Supabase Auth (cle anon, soumis a la RLS).
// Conserve l'interface AuthUser { type: "admin" | "learner" } : le type derive
// de profiles.role (admin/formateur => "admin" staff, eleve => "learner").
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type AuthUser =
  | { type: "admin"; id: string; email: string; firstName: string; lastName: string }
  | { type: "learner"; id: string; email: string; firstName: string; lastName: string };

// Comptes de demo (hints du formulaire de login). A retirer en prod.
export { DEMO_ACCOUNTS } from "@/data/mock/demo-accounts";

type SB = SupabaseClient<Database>;

const GENERIC_ERROR = "Email ou mot de passe incorrect";

/** Construit l'AuthUser depuis le profil applicatif (role -> type). */
async function profileToUser(supabase: SB, userId: string, fallbackEmail: string): Promise<AuthUser> {
  const { data } = await supabase
    .from("profiles")
    .select("role, first_name, last_name, email")
    .eq("id", userId)
    .single();

  const isStaff = data?.role === "admin" || data?.role === "formateur";
  return {
    type: isStaff ? "admin" : "learner",
    id: userId,
    email: data?.email ?? fallbackEmail,
    firstName: data?.first_name ?? "",
    lastName: data?.last_name ?? "",
  };
}

/** Authentifie un apprenant (eleve) par email + mot de passe. */
export async function loginLearner(email: string, password: string): Promise<AuthUser> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error || !data.user) throw new Error(GENERIC_ERROR);
  return profileToUser(supabase, data.user.id, data.user.email ?? email);
}

/** Authentifie un membre du staff (admin/formateur). Refuse les eleves. */
export async function loginAdmin(email: string, password: string): Promise<AuthUser> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error || !data.user) throw new Error(GENERIC_ERROR);
  const user = await profileToUser(supabase, data.user.id, data.user.email ?? email);
  if (user.type !== "admin") {
    await supabase.auth.signOut();
    throw new Error("Acces reserve a l'administration");
  }
  return user;
}

/** Retourne l'utilisateur de la session courante, ou null. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return profileToUser(supabase, data.user.id, data.user.email ?? "");
}

/**
 * Change le mot de passe de l'utilisateur connecte.
 * NB : le flag profiles.must_change_password est protege par trigger (B1) et ne
 * peut etre baisse que cote serveur — gere par une Server Action dediee (service_role).
 */
export async function changePassword(_userId: string, newPassword: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

/** Deconnecte l'utilisateur courant. */
export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}
