"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useExamLogic } from "@/hooks/useExamLogic";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Alert } from "@/components/ui/Alert";
import { ExamStartView } from "@/components/exam/ExamStartView";
import { ExamQuizView } from "@/components/exam/ExamQuizView";
import { ExamResultView } from "@/components/exam/ExamResultView";
import { TrialGate } from "@/components/learner/TrialGate";
import { getModuleAccess } from "@/hooks/useModuleAccess";
import { getExamByModule, getAttempts, submitAttempt } from "@/services/exams";
import { getModule } from "@/services/modules";
import { getLearner } from "@/services/learners";
import { ROUTES } from "@/lib/constants";
import { NotFoundError } from "@/lib/errors";
import { canTakeModuleExam } from "@/lib/module-access";
import type { LegacyExamAttempt } from "@/types";

export default function ExamenModulairePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<LegacyExamAttempt | null>(null);
  const [started, setStarted] = useState(false);
  const [pastAttempts, setPastAttempts] = useState<LegacyExamAttempt[]>([]);
  const [attemptsLoaded, setAttemptsLoaded] = useState(false);
  const [enrollmentOk, setEnrollmentOk] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pageState = useAsyncData(async () => {
    const [module_, exam, learner] = await Promise.all([
      getModule(moduleId),
      getExamByModule(moduleId),
      user?.id ? getLearner(user.id) : Promise.resolve(null),
    ]);
    let attempts: LegacyExamAttempt[] = [];
    if (exam && user?.id) {
      attempts = await getAttempts(exam.id, user.id);
    }
    if (!attemptsLoaded) {
      setPastAttempts(attempts);
      setAttemptsLoaded(true);
    }
    if (!module_) throw new NotFoundError("Module", moduleId);
    if (!exam) throw new NotFoundError("Examen", moduleId);
    return { module_, exam, learnerStatus: learner?.status ?? null };
  }, [moduleId, user?.id]);

  const examStatus = useExamLogic(pastAttempts, "module");

  async function handleNext() {
    if (!selected || submitting) return;
    const { exam: exam_ } = pageState.data!;
    const question = exam_.questions[currentQ];
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ < exam_.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      return;
    }

    // Derniere question : soumission serveur (RPC submit_exam_attempt). Le serveur
    // applique les lois de tentatives et peut refuser -> on affiche son message.
    setSubmitError("");
    setSubmitting(true);
    try {
      const attempt = await submitAttempt(exam_.id, user!.id, newAnswers, "module");
      setResult(attempt);
      setPastAttempts((prev) => [...prev, attempt]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : (e as { message?: string })?.message;
      setSubmitError(msg || "La soumission de l'examen a échoué. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setResult(null);
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
  }

  return (
    <LearnerShell>
      <AsyncBoundary state={pageState}>
        {({ module_, exam, learnerStatus }) => {
          // Gating deep-link : meme regle que la page module + blocage
          // specifique de l'examen du cours 7 en mode Decouverte.
          const access = getModuleAccess(module_.order, learnerStatus, () => setEnrollmentOk(true));
          if (!access.canAccess && !enrollmentOk) return <>{access.gate}</>;
          if (!canTakeModuleExam(module_.order, learnerStatus)) return <TrialGate />;

          if (result) {
            return (
              <ExamResultView
                result={result}
                passingScore={exam.passingScore}
                examStatus={examStatus}
                onRetry={handleRetry}
                onBack={() => router.push(ROUTES.espace.module(moduleId))}
              />
            );
          }

          if (!started) {
            return (
              <ExamStartView
                exam={exam}
                examStatus={examStatus}
                onStart={() => setStarted(true)}
              />
            );
          }

          return (
            <div className="space-y-4">
              {submitError && <Alert variant="error">{submitError}</Alert>}
              <ExamQuizView
                moduleTitle={module_.title}
                question={exam.questions[currentQ]}
                currentIndex={currentQ}
                totalQuestions={exam.questions.length}
                selected={selected}
                onSelect={setSelected}
                onNext={handleNext}
                isLast={currentQ === exam.questions.length - 1}
              />
            </div>
          );
        }}
      </AsyncBoundary>
    </LearnerShell>
  );
}
