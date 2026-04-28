"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ExamQuestion } from "@/types";

interface ExamQuizViewProps {
  moduleTitle: string;
  question: ExamQuestion;
  currentIndex: number;
  totalQuestions: number;
  selected: string | null;
  onSelect: (value: string) => void;
  onNext: () => void;
  isLast: boolean;
}

export function ExamQuizView({
  moduleTitle,
  question,
  currentIndex,
  totalQuestions,
  selected,
  onSelect,
  onNext,
  isLast,
}: ExamQuizViewProps) {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-cendre">Question {currentIndex + 1} / {totalQuestions}</span>
        <Badge variant="gold">{moduleTitle}</Badge>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-filet">
        <div
          className="h-full bg-or transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <Card variant="elevated">
        <p className="mb-6 font-serif text-xl text-ivoire">{question.question}</p>
        {question.type === "qcm" && question.options && (
          <div className="space-y-2">
            {question.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onSelect(opt)}
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  selected === opt
                    ? "border-or bg-or/10 text-or"
                    : "border-filet text-cendre hover:border-filet-accent hover:text-ivoire"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        {question.type === "vrai_faux" && (
          <div className="flex gap-3">
            {["vrai", "faux"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onSelect(opt)}
                className={cn(
                  "flex-1 rounded-lg border px-4 py-3 text-center text-sm capitalize transition-colors",
                  selected === opt
                    ? "border-or bg-or/10 text-or"
                    : "border-filet text-cendre hover:border-filet-accent"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        {question.type === "texte" && (
          <input
            type="text"
            value={selected || ""}
            onChange={(e) => onSelect(e.target.value)}
            placeholder="Votre reponse..."
            className="w-full rounded-lg border border-filet bg-surface px-4 py-3 text-sm text-ivoire placeholder:text-pierre focus:border-or/50 focus:outline-none"
          />
        )}
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" onClick={onNext} disabled={!selected}>
          {isLast ? "Terminer" : "Suivante"}
        </Button>
      </div>
    </div>
  );
}
