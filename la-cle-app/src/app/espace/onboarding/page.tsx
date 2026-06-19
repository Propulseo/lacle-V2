"use client";

import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/hooks/useAuth";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { OnboardingAssessment } from "@/components/onboarding/OnboardingAssessment";
import { saveOnboardingResult } from "@/services/learner-journey";

export default function OnboardingPage() {
  const { isAuthenticated, isLoading } = useRequireAuth("learner");
  const { user } = useAuth();
  const router = useRouter();

  if (isLoading || !isAuthenticated) return null;

  return (
    <LearnerShell>
      <div className="flex justify-center py-8">
        <OnboardingAssessment
          onComplete={async (result) => {
            // Persistance du bilan d'accueil (horodate). Le flag localStorage
            // reste pose par OnboardingAssessment comme cache UX.
            if (user) await saveOnboardingResult(user.id, result);
            router.replace("/espace/parcours");
          }}
        />
      </div>
    </LearnerShell>
  );
}
