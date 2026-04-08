"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (x?: number, y?: number) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "la-cle-theme";

function applyTheme(next: Theme) {
  localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.setAttribute("data-theme", next);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const toggleTheme = useCallback((x?: number, y?: number) => {
    const next = theme === "dark" ? "light" : "dark";

    // Browsers without View Transitions API — instant switch
    if (!document.startViewTransition) {
      applyTheme(next);
      setTheme(next);
      return;
    }

    // Compute origin for the circular reveal
    const cx = x ?? window.innerWidth / 2;
    const cy = y ?? 0;

    // Max radius = distance from origin to farthest corner
    const maxRadius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    );

    // Set CSS custom properties for the animation origin & size
    document.documentElement.style.setProperty("--theme-transition-x", `${cx}px`);
    document.documentElement.style.setProperty("--theme-transition-y", `${cy}px`);
    document.documentElement.style.setProperty("--theme-transition-r", `${maxRadius}px`);

    const transition = document.startViewTransition(() => {
      applyTheme(next);
      setTheme(next);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${cx}px ${cy}px)`,
            `circle(${maxRadius}px at ${cx}px ${cy}px)`,
          ],
        },
        {
          duration: 1200,
          easing: "cubic-bezier(0.22, 0.68, 0.35, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
