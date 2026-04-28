"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { OnboardingResult } from "@/types";

interface OnboardingResultScreenProps {
  firstName: string;
  result: OnboardingResult;
  onContinue: () => void;
}

const PNL_LEVEL_LABEL: Record<OnboardingResult["pnlLevel"], string> = {
  debutant: "Débutant",
  initie: "Initié",
  avance: "Avancé",
};

const PACE_LABEL: Record<OnboardingResult["recommendedPace"], string> = {
  lent: "Rythme posé",
  normal: "Rythme régulier",
  intensif: "Rythme soutenu",
};

const PACE_DESCRIPTION: Record<OnboardingResult["recommendedPace"], string> = {
  lent: "Prenez le temps qu'il vous faut. Mieux vaut avancer lentement que renoncer.",
  normal:
    "Un rythme régulier est souvent le plus durable. Une à deux capsules par semaine suffisent.",
  intensif:
    "Votre élan est là — profitez-en pour installer une vraie dynamique dès les premières semaines.",
};

/**
 * Écran de résultat affiché après la 10e question. Présente le niveau estimé,
 * le rythme recommandé, et un mot personnalisé avec le prénom.
 */
export function OnboardingResultScreen({
  firstName,
  result,
  onContinue,
}: OnboardingResultScreenProps) {
  const levelLabel = PNL_LEVEL_LABEL[result.pnlLevel];
  const paceLabel = PACE_LABEL[result.recommendedPace];
  const paceDescription = PACE_DESCRIPTION[result.recommendedPace];
  const name = firstName.trim() || "À vous";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-or">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        <span className="text-xs uppercase tracking-[0.18em]">
          Votre bilan d&apos;accueil
        </span>
      </div>

      <div className="space-y-3">
        <h2 className="font-serif text-3xl text-ivoire sm:text-4xl">
          Merci {name}.
        </h2>
        <p className="text-base leading-relaxed text-cendre">
          Vos réponses nous donnent une première lecture de votre point de
          départ. Rien n&apos;est figé — c&apos;est une base pour vous
          accompagner au plus juste.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-filet bg-encre/60 p-6">
          <p className="text-xs uppercase tracking-wider text-or">
            Niveau de départ estimé
          </p>
          <p className="mt-2 font-serif text-2xl text-ivoire">{levelLabel}</p>
          <p className="mt-3 text-sm text-cendre">
            Une estimation fondée sur ce que vous nous avez partagé — pas une
            étiquette.
          </p>
        </div>

        <div className="rounded-xl border border-filet bg-encre/60 p-6">
          <p className="text-xs uppercase tracking-wider text-or">
            Rythme recommandé
          </p>
          <p className="mt-2 font-serif text-2xl text-ivoire">{paceLabel}</p>
          <p className="mt-3 text-sm text-cendre">{paceDescription}</p>
        </div>
      </div>

      <div className="rounded-xl border border-or/20 bg-or/5 p-6">
        <p className="font-serif text-lg leading-relaxed text-ivoire">
          {name}, vous êtes attendu. La suite vous appartient —
          avancez comme il vous convient, nous cheminons avec vous.
        </p>
      </div>

      <div className="flex justify-end border-t border-filet pt-6">
        <Button variant="primary" size="lg" onClick={onContinue}>
          Accéder au Cours 0
        </Button>
      </div>
    </div>
  );
}
