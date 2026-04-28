"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

/**
 * Gate affiche en mode Decouverte a la place du bouton "Passer l'examen".
 * Invite l'apprenant a s'inscrire sans dark pattern — il peut fermer le gate.
 */
export function TrialGate() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Card variant="elevated">
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <Lock className="h-8 w-8 text-or/60" />
        <div className="space-y-2">
          <h3 className="font-serif text-lg text-ivoire">
            Acces en mode decouverte
          </h3>
          <p className="mx-auto max-w-md text-sm text-cendre">
            Tu as acces aux 7 premiers cours en essai gratuit.
            Rejoins la formation pour continuer.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="primary"
            onClick={() => router.push("/inscription")}
          >
            M&apos;inscrire
          </Button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-xs text-pierre transition-colors hover:text-cendre"
          >
            Pas maintenant
          </button>
        </div>
      </div>
    </Card>
  );
}
