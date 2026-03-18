import { mockAdmin } from "@/data/mock/admin";
import { mockLearners } from "@/data/mock/learners";
import { sleep } from "@/lib/utils";

export type AuthUser =
  | { type: "admin"; id: string; email: string; firstName: string; lastName: string }
  | { type: "learner"; id: string; email: string; firstName: string; lastName: string };

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

export async function changePassword(userId: string, newPassword: string): Promise<void> {
  await sleep(300);
  // Mock: just mark password as changed
  const learner = mockLearners.find((l) => l.id === userId);
  if (learner) {
    learner.mustChangePassword = false;
  }
}

export async function logout(): Promise<void> {
  await sleep(200);
}
