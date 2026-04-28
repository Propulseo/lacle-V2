"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useExamLogic } from "@/hooks/useExamLogic";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FinalExamRequestView } from "@/components/exam/FinalExamRequestView";
import { FinalExamStatusView } from "@/components/exam/FinalExamStatusView";
import { getFinalExam, getAttempts, requestFinalExam } from "@/services/exams";
import { getLearner } from "@/services/learners";
import type { FinalExam, LegacyExamAttempt } from "@/types";

export default function ExamenFinalPage() {
  const { user } = useAuth();
  const [localExam, setLocalExam] = useState<FinalExam | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [finalAttempts, setFinalAttempts] = useState<LegacyExamAttempt[]>([]);
  const [attemptsLoaded, setAttemptsLoaded] = useState(false);

  const pageState = useAsyncData(async () => {
    const [exam, learner, attempts] = await Promise.all([
      getFinalExam(user!.id),
      getLearner(user!.id),
      getAttempts("final-exam", user!.id),
    ]);
    if (!attemptsLoaded) {
      setFinalAttempts(attempts);
      setAttemptsLoaded(true);
    }
    return { exam, learner: learner! };
  }, [user?.id]);

  const examStatus = useExamLogic(finalAttempts, "final");

  async function handleRequest() {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const result = await requestFinalExam(user.id);
      setLocalExam(result);
    } catch {
      // Already requested
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LearnerShell>
      <AsyncBoundary state={pageState}>
        {({ exam: fetchedExam, learner }) => {
          const exam = localExam ?? fetchedExam;
          const allModulesCompleted = learner.progression.modulesCompleted === learner.progression.modulesTotal;

          return (
            <div className="mx-auto max-w-2xl space-y-6">
              <ScrollReveal>
                <div>
                  <h1 className="font-serif text-2xl text-ivoire">Examen final</h1>
                  <p className="mt-1 text-sm text-cendre">
                    L&apos;examen final valide l&apos;ensemble de votre formation
                  </p>
                </div>
              </ScrollReveal>

              {!allModulesCompleted && !exam && (
                <ScrollReveal delay={0.1}>
                  <Alert variant="warning" title="Modules a completer">
                    Vous devez valider tous les modules avant de pouvoir demander l&apos;examen final.
                  </Alert>
                </ScrollReveal>
              )}

              <ScrollReveal delay={0.1}>
                <Card variant="elevated">
                  {(!exam || exam.status === "requested") && (
                    <FinalExamRequestView
                      exam={exam}
                      progression={learner.progression}
                      isLoading={isLoading}
                      onRequest={handleRequest}
                    />
                  )}
                  {exam && (exam.status === "scheduled" || exam.status === "passed" || exam.status === "failed") && (
                    <FinalExamStatusView exam={exam} examStatus={examStatus} />
                  )}
                </Card>
              </ScrollReveal>
            </div>
          );
        }}
      </AsyncBoundary>
    </LearnerShell>
  );
}
