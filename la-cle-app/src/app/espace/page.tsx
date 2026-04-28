"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Award, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAsyncData } from "@/hooks/useAsyncData";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getLearner } from "@/services/learners";
import { getModulesForLearner } from "@/services/modules";
import { STATUS_CONFIG } from "@/lib/status";
import { ROUTES } from "@/lib/constants";

export default function EspaceDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const dashState = useAsyncData(
    async () => {
      const [learner, modules] = await Promise.all([
        getLearner(user!.id),
        getModulesForLearner(user!.id),
      ]);
      return { learner: learner!, modules };
    },
    [user?.id]
  );

  return (
    <LearnerShell>
      <AsyncBoundary state={dashState}>
        {({ learner, modules }) => {
          const prog = learner.progression;
          const statusCfg = STATUS_CONFIG[learner.status];
          const nextModule = modules.find((m) => m.status === "in_progress");

          return (
            <div className="space-y-6">
              <ScrollReveal>
                <Card variant="elevated">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="font-serif text-2xl text-ivoire">
                        Bienvenue, {learner.firstName}
                      </h1>
                      <p className="mt-1 text-sm text-cendre">
                        Continuez votre formation en PNL Praticien
                      </p>
                      <div className="mt-2">
                        <Badge variant={learner.status === "certifie" ? "gold" : learner.status === "inscrit" ? "success" : learner.status === "bloque" ? "error" : "info"}>
                          {statusCfg.label}
                        </Badge>
                      </div>
                    </div>
                    <ProgressRing value={prog.overallPercent} size={100} strokeWidth={8} label="global" />
                  </div>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-or" />
                      <div>
                        <p className="text-sm text-cendre">Modules</p>
                        <p className="font-serif text-xl text-ivoire">{prog.modulesCompleted}/{prog.modulesTotal}</p>
                      </div>
                    </div>
                    <ProgressBar value={prog.modulesCompleted} max={prog.modulesTotal} className="mt-3" size="sm" />
                  </Card>
                  <Card>
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-or" />
                      <div>
                        <p className="text-sm text-cendre">Examens reussis</p>
                        <p className="font-serif text-xl text-ivoire">{prog.examsPassed}/{prog.examsTotal}</p>
                      </div>
                    </div>
                    <ProgressBar value={prog.examsPassed} max={prog.examsTotal} className="mt-3" size="sm" />
                  </Card>
                  <Card>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-or" />
                      <div>
                        <p className="text-sm text-cendre">Videos vues</p>
                        <p className="font-serif text-xl text-ivoire">{prog.videosWatched}/{prog.videosTotal}</p>
                      </div>
                    </div>
                    <ProgressBar value={prog.videosWatched} max={prog.videosTotal} className="mt-3" size="sm" />
                  </Card>
                </div>
              </ScrollReveal>

              {nextModule && (
                <ScrollReveal delay={0.2}>
                  <Card variant="interactive" onClick={() => router.push(ROUTES.espace.module(nextModule.id))}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-or">Continuer</p>
                        <h3 className="mt-1 font-serif text-lg text-ivoire">{nextModule.title}</h3>
                        <p className="mt-1 text-sm text-cendre">
                          {nextModule.videosWatched}/{nextModule.videosCount} videos • Module {nextModule.order}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-or" />
                    </div>
                  </Card>
                </ScrollReveal>
              )}
            </div>
          );
        }}
      </AsyncBoundary>
    </LearnerShell>
  );
}
