"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

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
