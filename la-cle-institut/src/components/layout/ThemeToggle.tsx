"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useTheme } from "@/lib/theme";

const HINT_STORAGE_KEY = "toggle_hint_shown";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

interface ThemeToggleProps {
  /**
   * Autorise la micro-animation d'entrée (anneau bronze).
   * Sur la page d'accueil, on passe `showHero` pour ne déclencher qu'une
   * fois l'animation principale terminée. Par défaut : `true` (autres pages).
   */
  hintEnabled?: boolean;
}

export function ThemeToggle({ hintEnabled = true }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inView = useInView(buttonRef, { once: true, amount: 0.5 });
  const [playHint, setPlayHint] = useState(false);

  useEffect(() => {
    if (!hintEnabled || !inView || playHint) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(HINT_STORAGE_KEY)) return;
    sessionStorage.setItem(HINT_STORAGE_KEY, "true");
    setPlayHint(true);
  }, [hintEnabled, inView, playHint]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    toggleTheme(x, y);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-filet-discret text-cendre transition-all duration-500 ease-[var(--ease-institutional)] hover:border-bronze/50 hover:bg-bronze/5 hover:text-bronze-clair ${
        playHint ? "entrance-hint-toggle" : ""
      }`}
      aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
      title={theme === "dark" ? "Mode clair" : "Mode sombre"}
    >
      {theme === "dark" ? (
        <SunIcon className="h-3.5 w-3.5" />
      ) : (
        <MoonIcon className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
