"use client";

import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import type { AuthUser } from "@/services/auth";
import * as authService from "@/services/auth";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  isLearner: boolean;
  loginAdmin: (email: string, password: string) => Promise<void>;
  loginLearner: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  isLearner: false,
  loginAdmin: async () => {},
  loginLearner: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Session initiale
    authService
      .getCurrentUser()
      .then((u) => active && setUser(u))
      .catch(() => {})
      .finally(() => active && setIsLoading(false));

    // Suivi des changements (login/logout/refresh sur cet onglet et les autres).
    // Le profil est refetch hors du callback (setTimeout) pour eviter tout
    // deadlock du client Supabase appele depuis onAuthStateChange.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        if (active) setUser(null);
        return;
      }
      setTimeout(() => {
        authService
          .getCurrentUser()
          .then((u) => active && setUser(u))
          .catch(() => {});
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const loginAdmin = useCallback(async (email: string, password: string) => {
    setUser(await authService.loginAdmin(email, password));
  }, []);

  const loginLearner = useCallback(async (email: string, password: string) => {
    setUser(await authService.loginLearner(email, password));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.type === "admin",
        isLearner: user?.type === "learner",
        loginAdmin,
        loginLearner,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
