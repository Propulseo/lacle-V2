"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAsyncData } from "@/hooks/useAsyncData";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getModulesForLearner } from "@/services/modules";
import { hasCompletedOnboarding } from "@/lib/onboarding";
import { formatDuration, cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

// TODO // Supabase: remplacer le flag localStorage par
// une query sur onboarding_results (userId) pour eviter
// la triche cote client

export default function ParcoursPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hasCompletedOnboarding()) {
      router.replace("/espace/onboarding");
    }
  }, [router]);

  const modulesState = useAsyncData(
    () => getModulesForLearner(user!.id),
    [user?.id]
  );

  return (
    <LearnerShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl text-ivoire">Parcours pedagogique</h1>
          <p className="mt-1 text-sm text-cendre">
            Progressez a travers les modules pour obtenir votre certification
          </p>
        </div>

        <AsyncBoundary state={modulesState} empty={<p className="text-sm text-cendre">Aucun module disponible.</p>}>
          {(modules) => (
            <div className="relative space-y-4">
              <div className="absolute left-6 top-0 hidden h-full w-px bg-filet sm:block" />

              {modules.map((mod, i) => {
                const isLocked = mod.status === "locked";
                const isCompleted = mod.status === "completed";
                const isInProgress = mod.status === "in_progress";

                return (
                  <ScrollReveal key={mod.id} delay={i * 0.1}>
                    <div className="relative flex gap-4 sm:gap-6">
                      <div className="hidden sm:flex sm:flex-col sm:items-center">
                        <div
                          className={cn(
                            "z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2",
                            isCompleted && "border-succes bg-succes/10",
                            isInProgress && "border-or bg-or/10",
                            isLocked && "border-filet bg-surface"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-succes" />
                          ) : isLocked ? (
                            <Lock className="h-4 w-4 text-pierre" />
                          ) : (
                            <span className="font-serif text-lg text-or">{mod.order}</span>
                          )}
                        </div>
                      </div>

                      <Card
                        variant={isLocked ? "default" : "interactive"}
                        className={cn("flex-1", isLocked && "opacity-60")}
                        onClick={!isLocked ? () => router.push(ROUTES.espace.module(mod.id)) : undefined}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-or sm:hidden">Module {mod.order}</span>
                              <Badge variant={isCompleted ? "success" : isInProgress ? "gold" : "default"}>
                                {isCompleted ? "Termine" : isInProgress ? "En cours" : "Verrouille"}
                              </Badge>
                            </div>
                            <h3 className="mt-2 font-serif text-lg text-ivoire">{mod.title}</h3>
                            <p className="mt-1 text-sm text-cendre line-clamp-2">{mod.description}</p>
                            <div className="mt-3 flex items-center gap-4 text-xs text-pierre">
                              <span>{mod.videosCount} videos</span>
                              <span>{formatDuration(mod.totalDuration)}</span>
                              {!isLocked && (
                                <span>{mod.videosWatched}/{mod.videosCount} vues</span>
                              )}
                            </div>
                            {!isLocked && (
                              <ProgressBar value={mod.videosWatched} max={mod.videosCount} className="mt-2" size="sm" />
                            )}
                          </div>
                          {!isLocked && <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-or" />}
                        </div>
                      </Card>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </AsyncBoundary>
      </div>
    </LearnerShell>
  );
}
