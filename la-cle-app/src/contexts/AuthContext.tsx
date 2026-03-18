"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import type { AuthUser } from "@/services/auth";
import * as authService from "@/services/auth";

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const loginAdmin = useCallback(async (email: string, password: string) => {
    const user = await authService.loginAdmin(email, password);
    setUser(user);
    sessionStorage.setItem("auth_user", JSON.stringify(user));
  }, []);

  const loginLearner = useCallback(async (email: string, password: string) => {
    const user = await authService.loginLearner(email, password);
    setUser(user);
    sessionStorage.setItem("auth_user", JSON.stringify(user));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    sessionStorage.removeItem("auth_user");
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
