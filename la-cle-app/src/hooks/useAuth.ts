"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

/**
 * Acces au contexte d'authentification (utilisateur courant, login, logout, etat de chargement).
 *
 * @returns Le contexte AuthContext
 * @example
 * const { user, login, logout, isLoading } = useAuth()
 */
export function useAuth() {
  return useContext(AuthContext);
}
