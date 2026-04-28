"use client";

import { Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { FinalExam, LearnerProgression } from "@/types";

interface FinalExamRequestViewProps {
  exam: FinalExam | null;
  progression: LearnerProgression;
  isLoading: boolean;
  onRequest: () => void;
}

export function FinalExamRequestView({ exam, progression, isLoading, onRequest }: FinalExamRequestViewProps) {
  const allCompleted = progression.modulesCompleted === progression.modulesTotal;

  if (!exam && allCompleted) {
    return (
      <div className="text-center py-8">
        <Award className="mx-auto h-12 w-12 text-or" />
        <h2 className="mt-4 font-serif text-xl text-ivoire">Pret pour l&apos;examen final</h2>
        <p className="mt-2 text-sm text-cendre">
          Tous vos modules sont valides. Vous pouvez demander un rendez-vous pour l&apos;examen final.
        </p>
        <Button variant="primary" className="mt-6" onClick={onRequest} isLoading={isLoading}>
          Demander un rendez-vous
        </Button>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-8">
        <Award className="mx-auto h-12 w-12 text-pierre" />
        <h2 className="mt-4 font-serif text-xl text-ivoire">Examen final</h2>
        <p className="mt-2 text-sm text-cendre">Completez tous les modules pour debloquer l&apos;examen final.</p>
        <p className="mt-1 text-xs text-or">
          {progression.modulesCompleted}/{progression.modulesTotal} modules completes
        </p>
      </div>
    );
  }

  if (exam.status === "requested") {
    return (
      <div className="text-center py-8">
        <Clock className="mx-auto h-12 w-12 text-attention" />
        <h2 className="mt-4 font-serif text-xl text-ivoire">Demande en cours</h2>
        <p className="mt-2 text-sm text-cendre">
          Votre demande a ete envoyee le {formatDate(exam.requestedAt!)}.
          L&apos;equipe vous contactera pour fixer une date.
        </p>
        <Badge variant="warning" className="mt-3">En attente de planification</Badge>
      </div>
    );
  }

  return null;
}
