"use client";

// TODO // Supabase: sauvegarder dans positioning_test_results
// avec userId + answers + startingLevel + recommendations
// + completedAt (horodatage Qualiopi Ind.8)

import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { PositioningTest } from "@/components/positioning/PositioningTest";

export default function PositionnementPage() {
  const { isAuthenticated, isLoading } = useRequireAuth("learner");
  const router = useRouter();

  if (isLoading || !isAuthenticated) return null;

  return (
    <LearnerShell>
      <div className="flex justify-center py-8">
        <PositioningTest
          onComplete={() => {
            router.replace("/espace/parcours");
          }}
        />
      </div>
    </LearnerShell>
  );
}
