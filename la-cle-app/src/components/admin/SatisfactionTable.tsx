"use client";

import { Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/satisfaction/StarRating";
import { formatDate } from "@/lib/utils";
import type { SatisfactionSurvey } from "@/types";

interface Props {
  surveys: SatisfactionSurvey[];
  onTogglePublic: (id: string) => void;
}

function getStudentLabel(id: string): string {
  const names: Record<string, string> = {
    "learner-1": "Marie Dupont",
    "learner-2": "Thomas Martin",
    "learner-3": "Sophie Bernard",
    "learner-5": "Emma Leroy",
    "learner-6": "Julie Moreau",
  };
  return names[id] ?? id;
}

function getStarRatings(survey: SatisfactionSurvey) {
  return survey.answers.filter((a) => a.rating !== undefined);
}

export function SatisfactionTable({ surveys, onTogglePublic }: Props) {
  if (surveys.length === 0) {
    return <p className="text-sm text-cendre py-4">Aucune reponse pour l&apos;instant.</p>;
  }

  return (
    <div className="space-y-3">
      {surveys.map((survey) => {
        const stars = getStarRatings(survey);
        const textAnswers = survey.answers.filter((a) => a.text);

        return (
          <Card key={survey.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-ivoire">{getStudentLabel(survey.studentId)}</p>
                <p className="text-xs text-pierre">
                  {survey.completedAt ? formatDate(survey.completedAt) : "Non complete"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {stars.map((a) => (
                  <div key={a.questionId} className="flex items-center gap-1">
                    <StarRating value={a.rating ?? 0} readonly size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {textAnswers.length > 0 && (
              <div className="space-y-1 text-sm text-cendre">
                {textAnswers.map((a) => (
                  <p key={a.questionId} className="italic">&laquo; {a.text} &raquo;</p>
                ))}
              </div>
            )}

            {survey.publicReview && (
              <div className="flex items-start justify-between rounded-lg bg-ivoire/5 px-3 py-2">
                <div>
                  <p className="text-xs font-medium text-or">Avis public</p>
                  <p className="mt-1 text-sm text-cendre italic">
                    &laquo; {survey.publicReview} &raquo;
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTogglePublic(survey.id)}
                  title={survey.wantsPublicReview ? "Masquer" : "Valider"}
                >
                  {survey.wantsPublicReview ? (
                    <Eye className="h-4 w-4 text-succes" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-pierre" />
                  )}
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
