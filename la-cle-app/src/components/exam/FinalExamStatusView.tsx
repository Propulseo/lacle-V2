"use client";

import { Award, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ExamAttemptStatus } from "@/components/learner/ExamAttemptStatus";
import { ExamFinalSuccess } from "@/components/learner/ExamFinalSuccess";
import { formatDate } from "@/lib/utils";
import type { ExamStatus } from "@/hooks/useExamLogic";
import type { FinalExam } from "@/types";

interface FinalExamStatusViewProps {
  exam: FinalExam;
  examStatus: ExamStatus;
}

export function FinalExamStatusView({ exam, examStatus }: FinalExamStatusViewProps) {
  if (exam.status === "scheduled") {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-info" />
        <h2 className="mt-4 font-serif text-xl text-ivoire">Examen planifie</h2>
        <p className="mt-2 text-sm text-cendre">Votre examen est prevu le {formatDate(exam.scheduledAt!)}.</p>
        <Badge variant="info" className="mt-3">Rendez-vous confirme</Badge>
        <div className="mt-4"><ExamAttemptStatus status={examStatus} examType="final" /></div>
      </div>
    );
  }

  if (exam.status === "passed") {
    return <ExamFinalSuccess score={exam.score!} notes={exam.notes} />;
  }

  if (exam.status === "failed") {
    return (
      <div className="text-center py-8">
        <Award className="mx-auto h-12 w-12 text-erreur" />
        <h2 className="mt-4 font-serif text-xl text-ivoire">Examen non valide</h2>
        <p className="mt-2 text-sm text-cendre">
          Score obtenu : {exam.score}%. Contactez l&apos;institut pour plus d&apos;informations.
        </p>
        <Badge variant="error" className="mt-3">Non valide</Badge>
        <div className="mt-4"><ExamAttemptStatus status={examStatus} examType="final" /></div>
      </div>
    );
  }

  return null;
}
