"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useExamLogic } from "@/hooks/useExamLogic";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { ExamStartView } from "@/components/exam/ExamStartView";
import { ExamQuizView } from "@/components/exam/ExamQuizView";
import { ExamResultView } from "@/components/exam/ExamResultView";
import { getExamByModule, getAttempts, submitAttempt } from "@/services/exams";
import { getModule } from "@/services/modules";
import { ROUTES } from "@/lib/constants";
import { NotFoundError } from "@/lib/errors";
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

  const pageState = useAsyncData(async () => {
    const [module_, exam] = await Promise.all([
      getModule(moduleId),
      getExamByModule(moduleId),
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
    return { module_, exam };
  }, [moduleId, user?.id]);

  const examStatus = useExamLogic(pastAttempts, "module");

  function handleNext() {
    if (!selected) return;
    const { exam: exam_ } = pageState.data!;
    const question = exam_.questions[currentQ];
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ < exam_.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      submitAttempt(exam_.id, user!.id, newAnswers, "module").then((attempt) => {
        setResult(attempt);
        setPastAttempts((prev) => [...prev, attempt]);
      });
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
        {({ module_, exam }) => {
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
          );
        }}
      </AsyncBoundary>
    </LearnerShell>
  );
}
