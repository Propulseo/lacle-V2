"use client";

import { Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { PositioningResult } from "@/lib/positioning";

interface PositioningResultScreenProps {
  result: PositioningResult;
  onContinue: () => void;
}

const LEVEL_LABEL: Record<PositioningResult["startingLevel"], string> = {
  debutant: "Debutant",
  initie: "Initie",
  avance: "Avance",
};

const LEVEL_DESCRIPTION: Record<PositioningResult["startingLevel"], string> = {
  debutant:
    "Vous partez de zero ou presque — c'est le meilleur endroit pour construire des bases solides.",
  initie:
    "Vous avez deja une sensibilite a ces sujets — le parcours va structurer et approfondir vos acquis.",
  avance:
    "Vos connaissances sont deja significatives — concentrez-vous sur l'integration et la posture.",
};

export function PositioningResultScreen({
  result,
  onContinue,
}: PositioningResultScreenProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-or">
        <Target className="h-5 w-5" aria-hidden="true" />
        <span className="text-xs uppercase tracking-[0.18em]">
          Votre positionnement
        </span>
      </div>

      <div className="space-y-3">
        <h2 className="font-serif text-3xl text-ivoire sm:text-4xl">
          Votre point de depart
        </h2>
        <p className="text-base leading-relaxed text-cendre">
          Ce test nous permet d&apos;adapter nos recommandations a votre niveau
          actuel. Ce n&apos;est pas une evaluation — c&apos;est un repere.
        </p>
      </div>

      <div className="rounded-xl border border-filet bg-encre/60 p-6">
        <p className="text-xs uppercase tracking-wider text-or">
          Niveau de depart
        </p>
        <p className="mt-2 font-serif text-2xl text-ivoire">
          {LEVEL_LABEL[result.startingLevel]}
        </p>
        <p className="mt-3 text-sm text-cendre">
          {LEVEL_DESCRIPTION[result.startingLevel]}
        </p>
        <p className="mt-2 text-xs text-pierre">
          Score : {result.score} / {10}
        </p>
      </div>

      {result.recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-ivoire">Nos recommandations</h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-2 text-sm text-cendre">
                <span className="mt-0.5 text-or">-</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end border-t border-filet pt-6">
        <Button variant="primary" size="lg" onClick={onContinue}>
          Commencer le parcours
        </Button>
      </div>
    </div>
  );
}
