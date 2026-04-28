"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ExamAttemptStatus } from "@/components/learner/ExamAttemptStatus";
import type { ExamStatus } from "@/hooks/useExamLogic";
import type { ModularExam } from "@/types";

interface ExamStartViewProps {
  exam: ModularExam;
  examStatus: ExamStatus;
  onStart: () => void;
}

export function ExamStartView({ exam, examStatus, onStart }: ExamStartViewProps) {
  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <ScrollReveal>
        <Card variant="elevated" className="text-center">
          <h1 className="font-serif text-2xl text-ivoire">{exam.title}</h1>
          <p className="mt-2 text-cendre">
            {exam.questions.length} questions • Score requis : {exam.passingScore}%
          </p>
          <p className="mt-1 text-xs text-pierre">
            Vous ne pourrez pas revenir en arriere une fois une question validee.
          </p>
          <div className="mt-6 space-y-4">
            <ExamAttemptStatus status={examStatus} examType="module" />
            <Button variant="primary" onClick={onStart} disabled={!examStatus.canAttempt}>
              Commencer l&apos;examen
            </Button>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
