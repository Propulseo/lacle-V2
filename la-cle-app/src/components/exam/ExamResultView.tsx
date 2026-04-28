"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ExamAttemptStatus } from "@/components/learner/ExamAttemptStatus";
import type { ExamStatus } from "@/hooks/useExamLogic";
import type { LegacyExamAttempt } from "@/types";

interface ExamResultViewProps {
  result: LegacyExamAttempt;
  passingScore: number;
  examStatus: ExamStatus;
  onRetry: () => void;
  onBack: () => void;
}

export function ExamResultView({ result, passingScore, examStatus, onRetry, onBack }: ExamResultViewProps) {
  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <ScrollReveal>
        <Card variant="elevated" className="text-center">
          <ProgressRing value={result.score} size={120} strokeWidth={10} className="mx-auto" />
          <h1 className="mt-4 font-serif text-2xl text-ivoire">
            {result.passed ? "Examen reussi !" : "Examen non valide"}
          </h1>
          <p className="mt-2 text-cendre">
            Score : {result.score}% — {result.passed ? "Felicitations !" : `Score requis : ${passingScore}%`}
          </p>
          <ExamAttemptStatus status={examStatus} examType="module" />
          <div className="mt-6 flex justify-center gap-3">
            {!result.passed && (
              <Button variant="primary" disabled={!examStatus.canAttempt} onClick={onRetry}>
                Reessayer
              </Button>
            )}
            <Button variant="ghost" onClick={onBack}>
              Retour au module
            </Button>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
