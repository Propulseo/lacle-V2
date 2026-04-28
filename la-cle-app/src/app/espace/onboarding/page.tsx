"use client";

// TODO // Supabase: sauvegarder le resultat dans
// onboarding_results avec userId + answers + level +
// recommendedPace + completedAt

import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { OnboardingAssessment } from "@/components/onboarding/OnboardingAssessment";

export default function OnboardingPage() {
  const { isAuthenticated, isLoading } = useRequireAuth("learner");
  const router = useRouter();

  if (isLoading || !isAuthenticated) return null;

  return (
    <LearnerShell>
      <div className="flex justify-center py-8">
        <OnboardingAssessment
          onComplete={() => {
            // Le flag localStorage est deja pose par markOnboardingCompleted()
            // dans OnboardingAssessment avant que onComplete ne soit appele.
            router.replace("/espace/parcours");
          }}
        />
      </div>
    </LearnerShell>
  );
}
