"use client";

// TODO // Supabase: sauvegarder contract_signed, cgv_accepted dans students
// TODO // Stripe: webhook confirme paymentStatus = 'active'

import { useState, useEffect } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import {
  getEnrollmentConditions,
  markContractSigned,
  markCgvAccepted,
  type EnrollmentConditions,
} from "@/lib/enrollment-gate";

interface EnrollmentGateProps {
  onUnlocked: () => void;
}

export function EnrollmentGate({ onUnlocked }: EnrollmentGateProps) {
  const [conditions, setConditions] = useState<EnrollmentConditions>({
    contractSigned: false,
    cgvAccepted: false,
    paymentActive: false,
  });
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setConditions(getEnrollmentConditions());
  }, []);

  const allMet =
    conditions.contractSigned && conditions.cgvAccepted && conditions.paymentActive;

  useEffect(() => {
    if (allMet && !unlocked) {
      setUnlocked(true);
      const t = setTimeout(onUnlocked, 2500);
      return () => clearTimeout(t);
    }
  }, [allMet, unlocked, onUnlocked]);

  function handleSignContract() {
    markContractSigned();
    setConditions((prev) => ({ ...prev, contractSigned: true }));
  }

  function handleAcceptCgv() {
    markCgvAccepted();
    setConditions((prev) => ({ ...prev, cgvAccepted: true }));
  }

  if (unlocked) {
    return (
      <ScrollReveal>
        <Alert variant="success" title="Acces debloque">
          Bienvenue dans la suite de votre formation !
        </Alert>
      </ScrollReveal>
    );
  }

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="font-serif text-2xl text-ivoire">
            Conditions d&apos;acces
          </h1>
          <p className="mt-2 text-sm text-cendre">
            Pour acceder a la suite de votre formation, les conditions suivantes
            doivent etre remplies.
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-3">
        <ScrollReveal delay={0.1}>
          <ConditionRow
            done={conditions.contractSigned}
            label="Contrat de formation signe"
          >
            {!conditions.contractSigned && (
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // TODO // Supabase Storage: URL du contrat PDF
                    alert("Le contrat de formation sera disponible au telechargement une fois votre espace configure. Contactez contact@institutlacle.fr pour toute question.");
                  }}
                >
                  Voir le document
                </Button>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-filet accent-or"
                    onChange={(e) => {
                      if (e.target.checked) handleSignContract();
                    }}
                  />
                  <span className="text-sm text-cendre">
                    J&apos;ai lu et j&apos;accepte
                  </span>
                </label>
              </div>
            )}
          </ConditionRow>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <ConditionRow done={conditions.cgvAccepted} label="CGV acceptees">
            {!conditions.cgvAccepted && (
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // TODO // Supabase Storage: URL des CGV PDF
                    alert("Les CGV seront disponibles au telechargement une fois votre espace configure. Contactez contact@institutlacle.fr pour toute question.");
                  }}
                >
                  Voir le document
                </Button>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-filet accent-or"
                    onChange={(e) => {
                      if (e.target.checked) handleAcceptCgv();
                    }}
                  />
                  <span className="text-sm text-cendre">
                    J&apos;ai lu et j&apos;accepte
                  </span>
                </label>
              </div>
            )}
          </ConditionRow>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ConditionRow
            done={conditions.paymentActive}
            label="Paiement confirme"
          >
            {!conditions.paymentActive && (
              <p className="mt-2 text-sm text-pierre">
                En attente de confirmation de paiement
              </p>
            )}
            {/* TODO // Stripe: webhook de confirmation de paiement */}
          </ConditionRow>
        </ScrollReveal>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function ConditionRow({
  done,
  label,
  children,
}: {
  done: boolean;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            done ? "bg-succes/10" : "bg-surface"
          )}
        >
          {done ? (
            <CheckCircle className="h-5 w-5 text-succes" />
          ) : (
            <Clock className="h-5 w-5 text-cendre" />
          )}
        </div>
        <div className="flex-1">
          <p
            className={cn(
              "font-medium",
              done ? "text-succes" : "text-ivoire"
            )}
          >
            {label}
          </p>
          {children}
        </div>
      </div>
    </Card>
  );
}
