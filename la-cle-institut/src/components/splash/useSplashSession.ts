"use client";

import { useState, useEffect, useCallback } from "react";
import { SPLASH_STORAGE_KEY } from "@/lib/constants";

export function useSplashSession() {
  const [showSplash, setShowSplash] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem(SPLASH_STORAGE_KEY);
    if (!hasShown) {
      setShowSplash(true);
    }
    setIsReady(true);
  }, []);

  const completeSplash = useCallback(() => {
    sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
    setShowSplash(false);
  }, []);

  return { showSplash, isReady, completeSplash };
}
