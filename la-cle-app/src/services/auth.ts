import { mockAdmin } from "@/data/mock/admin";
import { mockLearners } from "@/data/mock/learners";
import { sleep } from "@/lib/utils";

export type AuthUser =
  | { type: "admin"; id: string; email: string; firstName: string; lastName: string }
  | { type: "learner"; id: string; email: string; firstName: string; lastName: string };

/**
 * Authentifie un administrateur par email et mot de passe.
 *
 * @param email - Adresse email de l'admin
 * @param password - Mot de passe en clair
 * @returns L'utilisateur authentifie avec type "admin"
 * @throws Si les identifiants sont incorrects
 * @example
 * const user = await loginAdmin('admin@institutlacle.fr', 'secret')
 */
export async function loginAdmin(email: string, password: string): Promise<AuthUser> {
  await sleep(500);
  if (email.trim().toLowerCase() === mockAdmin.email.toLowerCase() && password.trim() === mockAdmin.password) {
    return {
      type: "admin",
      id: mockAdmin.id,
      email: mockAdmin.email,
      firstName: mockAdmin.firstName,
      lastName: mockAdmin.lastName,
    };
  }
  throw new Error("Email ou mot de passe incorrect");
}

/**
 * Authentifie un apprenant par email et mot de passe.
 *
 * @param email - Adresse email de l'apprenant
 * @param password - Mot de passe en clair
 * @returns L'utilisateur authentifie avec type "learner"
 * @throws Si les identifiants sont incorrects
 * @example
 * const user = await loginLearner('eleve@example.com', 'mdp123')
 */
export async function loginLearner(email: string, password: string): Promise<AuthUser> {
  await sleep(500);
  const learner = mockLearners.find((l) => l.email.toLowerCase() === email.trim().toLowerCase() && l.isActive);
  // Mock: any password works for existing learners
  if (learner && password.length >= 3) {
    return {
      type: "learner",
      id: learner.id,
      email: learner.email,
      firstName: learner.firstName,
      lastName: learner.lastName,
    };
  }
  throw new Error("Email ou mot de passe incorrect");
}

/**
 * Change le mot de passe d'un utilisateur et desactive le flag `mustChangePassword`.
 *
 * @param userId - Identifiant de l'utilisateur
 * @param newPassword - Nouveau mot de passe
 */
export async function changePassword(userId: string, _newPassword: string): Promise<void> {
  await sleep(300);
  // Mock: just mark password as changed
  const learner = mockLearners.find((l) => l.id === userId);
  if (learner) {
    learner.mustChangePassword = false;
  }
}

/** Deconnecte l'utilisateur courant et invalide la session. */
export async function logout(): Promise<void> {
  await sleep(200);
}
