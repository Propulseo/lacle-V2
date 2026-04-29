"use client";

import { useState, useEffect } from "react";
import { AlertCircle, ExternalLink } from "lucide-react";
import { LearnerHeader } from "./LearnerHeader";
import { LearnerMobileNav } from "./LearnerMobileNav";
import { BackgroundAtmosphere } from "./BackgroundAtmosphere";
import { BugReportButton } from "@/components/learner/BugReportButton";
import { getPaymentStatus } from "@/lib/enrollment-gate";

interface LearnerShellProps {
  children: React.ReactNode;
}

export function LearnerShell({ children }: LearnerShellProps) {
  const [showPaymentBanner, setShowPaymentBanner] = useState(false);

  useEffect(() => {
    setShowPaymentBanner(getPaymentStatus() === "failed");
  }, []);

  return (
    <div className="min-h-screen">
      <BackgroundAtmosphere />
      <LearnerHeader />
      {showPaymentBanner && (
        <div className="border-b border-erreur/20 bg-erreur/5 px-4 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-erreur">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Un probleme a ete detecte avec votre paiement.</span>
            </div>
            <a
              href="mailto:contact@institutlacle.fr?subject=Probleme%20de%20paiement"
              className="flex shrink-0 items-center gap-1 text-sm font-medium text-erreur underline transition-colors hover:text-erreur/80"
            >
              {/* TODO // Stripe: remplacer par lien vers customer portal Stripe */}
              Nous contacter
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
      <main className="mx-auto max-w-5xl px-4 py-6 pb-20 sm:px-6 md:pb-6">
        {children}
      </main>
      {/* TODO // Qualiopi Ind.26: referent handicap */}
      <footer className="border-t border-filet px-4 py-4 text-center text-xs text-pierre hidden md:block">
        Referent handicap : <a href="mailto:contact@institutlacle.fr" className="text-cendre hover:text-ivoire transition-colors">contact@institutlacle.fr</a>
      </footer>
      <BugReportButton />
      <LearnerMobileNav />
    </div>
  );
}
