"use client";

/**
 * PositioningTest — test de positionnement Cours 0 (Qualiopi Ind.8).
 *
 * Stepper 10 questions. A la fin : scoring, ecran resultat, stockage localStorage.
 */

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PositioningResultScreen } from "@/components/positioning/PositioningResultScreen";
import { cn } from "@/lib/utils";
import {
  POSITIONING_QUESTIONS,
  computePositioningResult,
  markPositioningCompleted,
  type PositioningResult,
  type PosQuestion,
} from "@/lib/positioning";

interface PositioningTestProps {
  onComplete: (result: PositioningResult) => void | Promise<void>;
  className?: string;
}

export function PositioningTest({ onComplete, className }: PositioningTestProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PositioningResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = POSITIONING_QUESTIONS.length;
  const question = POSITIONING_QUESTIONS[stepIndex];
  const currentAnswer = answers[question.id] ?? "";
  const isLast = stepIndex === total - 1;
  const isFirst = stepIndex === 0;

  const canContinue = useMemo(() => {
    return currentAnswer.trim().length > 0;
  }, [currentAnswer]);

  function update(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function goPrev() {
    if (!isFirst) setStepIndex((i) => i - 1);
  }

  function goNextOrFinish() {
    if (!canContinue || isSubmitting) return;
    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }
    const computed = computePositioningResult(answers);
    setResult(computed);
  }

  async function handleContinue() {
    if (!result || isSubmitting) return;
    setIsSubmitting(true);
    try {
      markPositioningCompleted(result);
      await onComplete(result);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (result) {
    return (
      <section className={cn("mx-auto w-full max-w-2xl rounded-xl border border-filet bg-encre/80 p-8 backdrop-blur-sm", className)}>
        <PositioningResultScreen result={result} onContinue={handleContinue} />
      </section>
    );
  }

  return (
    <section className={cn("mx-auto w-full max-w-2xl rounded-xl border border-filet bg-encre/80 p-8 backdrop-blur-sm", className)}>
      {/* Progression */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-xs uppercase tracking-wider text-pierre">
          <span>Test de positionnement</span>
          <span className="tabular-nums">{stepIndex + 1} / {total}</span>
        </div>
        <ProgressBar value={stepIndex + 1} max={total} size="sm" />
      </div>

      {/* Question */}
      <PositioningQuestionStep question={question} value={currentAnswer} onChange={update} />

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between border-t border-filet pt-6">
        {!isFirst ? (
          <Button variant="ghost" onClick={goPrev} icon={<ArrowLeft className="h-4 w-4" />}>
            Precedent
          </Button>
        ) : (
          <span aria-hidden="true" />
        )}
        <Button variant="primary" onClick={goNextOrFinish} disabled={!canContinue}>
          {isLast ? "Voir mon resultat" : "Continuer"}
          {!isLast && <ArrowRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Question step (inline — reuse du pattern OnboardingQuestionStep)
// ---------------------------------------------------------------------------

function PositioningQuestionStep({
  question,
  value,
  onChange,
}: {
  question: PosQuestion;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl text-ivoire sm:text-3xl">{question.prompt}</h2>
        {question.helper && <p className="text-sm text-cendre">{question.helper}</p>}
      </div>

      {(question.kind === "qcm" || question.kind === "radio") && (
        <fieldset className="space-y-2">
          <legend className="sr-only">{question.prompt}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {question.options.map((opt) => {
              const isActive = value === opt.value;
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border bg-encre px-4 py-3 text-sm transition-colors duration-200",
                    isActive
                      ? "border-or/50 text-ivoire ring-1 ring-or/25"
                      : "border-filet text-cendre hover:border-filet-accent hover:text-ivoire"
                  )}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={opt.value}
                    checked={isActive}
                    onChange={() => onChange(opt.value)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-block h-2.5 w-2.5 shrink-0 rounded-full border transition-colors duration-200",
                      isActive ? "border-or bg-or" : "border-filet-accent"
                    )}
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {question.kind === "textarea" && (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="min-h-[140px]"
          autoFocus
        />
      )}
    </div>
  );
}
