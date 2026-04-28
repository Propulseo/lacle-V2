"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "demo_banner_dismissed";

export function DemoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "true") return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  return (
    <div className="relative flex h-8 items-center justify-center bg-or/90 text-xs font-medium text-nuit">
      <span>Demo en donnees fictives — feedback bienvenu</span>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 hover:bg-nuit/10"
        aria-label="Fermer le banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
