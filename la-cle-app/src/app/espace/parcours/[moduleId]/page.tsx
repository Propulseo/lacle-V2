"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Play, CheckCircle, ArrowRight, Award } from "lucide-react";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TrialGate } from "@/components/learner/TrialGate";
import { getModule } from "@/services/modules";
import { getVideosByModule } from "@/services/videos";
import { getExamByModule, getAttempts } from "@/services/exams";
import { getLearner } from "@/services/learners";
import { useAuth } from "@/hooks/useAuth";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getModuleAccess } from "@/hooks/useModuleAccess";
import { formatDuration, cn } from "@/lib/utils";
import { getCapsuleDisplayName } from "@/lib/capsule-utils";
import { hasCompletedPositioning } from "@/lib/positioning";
import { ROUTES } from "@/lib/constants";

export default function ModuleDetailLearnerPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [enrollmentOk, setEnrollmentOk] = useState(false);

  const pageState = useAsyncData(async () => {
    const [module_, videos, exam, learner] = await Promise.all([
      getModule(moduleId),
      getVideosByModule(moduleId),
      getExamByModule(moduleId),
      user?.id ? getLearner(user.id) : Promise.resolve(null),
    ]);

    if (module_ && module_.order === 1 && !hasCompletedPositioning()) {
      router.replace(`/espace/parcours/${moduleId}/positionnement`);
    }

    let attempts: Awaited<ReturnType<typeof getAttempts>> = [];
    if (exam && user?.id) {
      attempts = await getAttempts(exam.id, user.id);
    }

    return {
      module_: module_!,
      videos,
      exam,
      attempts,
      learnerStatus: learner?.status ?? null,
    };
  }, [moduleId, user?.id]);

  return (
    <LearnerShell>
      <AsyncBoundary state={pageState}>
        {({ module_, videos, exam, attempts, learnerStatus }) => {
          const access = getModuleAccess(module_.order, learnerStatus, () => setEnrollmentOk(true));
          if (!access.canAccess && !enrollmentOk) return <>{access.gate}</>;

          const examPassed = attempts.some((a) => a.passed);

          return (
            <div className="space-y-6">
              <ScrollReveal>
                <div>
                  <p className="text-sm text-or">Module {module_.order}</p>
                  <h1 className="mt-1 font-serif text-2xl text-ivoire">{module_.title}</h1>
                  <p className="mt-2 text-sm text-cendre">{module_.description}</p>
                  <div className="mt-3">
                    <ProgressBar value={4} max={videos.length} showLabel size="sm" />
                  </div>
                </div>
              </ScrollReveal>

              <div className="space-y-2">
                <h2 className="font-serif text-lg text-ivoire">Videos du module</h2>
                {videos.map((video, i) => {
                  const watched = i < 2;
                  return (
                    <ScrollReveal key={video.id} delay={i * 0.05}>
                      <Card variant="interactive" onClick={() => router.push(ROUTES.espace.video(moduleId, video.id))}>
                        <div className="flex items-center gap-4">
                          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", watched ? "bg-succes/10" : "bg-surface")}>
                            {watched ? <CheckCircle className="h-5 w-5 text-succes" /> : <Play className="h-4 w-4 text-cendre" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-ivoire">
                              {getCapsuleDisplayName(String(video.order), video.title, watched)}
                            </p>
                            <p className="text-xs text-cendre">
                              {formatDuration(video.duration)} • {video.questions.length} question(s)
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-pierre" />
                        </div>
                      </Card>
                    </ScrollReveal>
                  );
                })}
              </div>

              {exam && learnerStatus === "decouverte" && (
                <ScrollReveal delay={0.3}><TrialGate /></ScrollReveal>
              )}
              {exam && learnerStatus !== "decouverte" && (
                <ScrollReveal delay={0.3}>
                  <Card variant={examPassed ? "default" : "elevated"}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award className={cn("h-6 w-6", examPassed ? "text-succes" : "text-or")} />
                        <div>
                          <h3 className="font-serif text-lg text-ivoire">Examen du module</h3>
                          <p className="text-sm text-cendre">
                            {exam.questions.length} questions • Score requis : {exam.passingScore}%
                          </p>
                          {attempts.length > 0 && (
                            <p className="text-xs text-pierre">
                              {attempts.length} tentative(s) • Meilleur score : {Math.max(...attempts.map((a) => a.score))}%
                            </p>
                          )}
                        </div>
                      </div>
                      {examPassed ? (
                        <Badge variant="success">Valide</Badge>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => router.push(ROUTES.espace.examenModule(moduleId))}>
                          Passer l&apos;examen
                        </Button>
                      )}
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
