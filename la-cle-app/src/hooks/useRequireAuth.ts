"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

/**
 * Protege une page en exigeant une authentification du type specifie.
 * Redirige vers la page de login si non authentifie, ou vers l'espace
 * correspondant si authentifie avec le mauvais type.
 *
 * @param type - Type d'utilisateur requis ("admin" ou "learner")
 * @returns { user, isLoading, isAuthenticated }
 * @example
 * const { user, isAuthenticated } = useRequireAuth('learner')
 */
export function useRequireAuth(type: "admin" | "learner") {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(type === "admin" ? "/admin/login" : "/login");
      return;
    }
    if (user.type !== type) {
      router.replace(user.type === "admin" ? "/admin" : "/espace");
    }
  }, [user, isLoading, type, router]);

  return { user, isLoading, isAuthenticated: !!user && user.type === type };
}
