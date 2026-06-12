"use client";

import { SectionBlock } from "@/components/ui/SectionBlock";
import { KeySymbol } from "@/components/splash/KeySymbol";

interface DSSymbolProps {
  /** Déclenche la lecture du splash screen (état porté par la page). */
  onPlaySplash: () => void;
}

/** Section "Symbole & Splash" de la page design-system. */
export function DSSymbol({ onPlaySplash }: DSSymbolProps) {
  return (
    <SectionBlock>
      <h2 className="mb-12">Symbole &amp; Splash</h2>
      <div className="flex flex-col items-center gap-12 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-4">
          <KeySymbol className="h-32 w-auto text-ivoire" animate={false} />
          <p className="text-xs text-pierre">Symbole statique</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <KeySymbol className="h-32 w-auto text-ivoire" animate />
          <p className="text-xs text-pierre">Animation stroke draw</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onPlaySplash}
            className="border border-filet px-6 py-3 text-xs uppercase tracking-widest text-cendre transition-colors duration-300 hover:border-bronze hover:text-ivoire"
          >
            Jouer le splash
          </button>
          <p className="text-xs text-pierre">Splash screen 1.8s</p>
        </div>
      </div>
    </SectionBlock>
  );
}
