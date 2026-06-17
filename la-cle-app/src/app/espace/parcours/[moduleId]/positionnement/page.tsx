"use client";

import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/hooks/useAuth";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { PositioningTest } from "@/components/positioning/PositioningTest";
import { savePositioningResult } from "@/services/learner-journey";

export default function PositionnementPage() {
  const { isAuthenticated, isLoading } = useRequireAuth("learner");
  const { user } = useAuth();
  const router = useRouter();

  if (isLoading || !isAuthenticated) return null;

  return (
    <LearnerShell>
      <div className="flex justify-center py-8">
        <PositioningTest
          onComplete={async (result, answers) => {
            // Persistance horodatee Qualiopi Ind.8 (si echec, on ne route pas :
            // le bouton se reactive pour reessayer).
            if (user) await savePositioningResult(user.id, result, answers);
            router.replace("/espace/parcours");
          }}
        />
      </div>
    </LearnerShell>
  );
}
