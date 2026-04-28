"use client";

/**
 * OnboardingAssessment — bilan d'accueil (10 questions, stepper).
 *
 * Stocke l'`OnboardingResult` dans le state local, puis :
 *  - marque `onboarding_completed = "true"` dans localStorage
 *  - déclenche `onComplete(result)` afin que l'hôte (ex. page Cours 0)
 *    puisse router ou persister.
 *
 * TODO // Supabase: sauvegarder dans onboarding_results avec horodatage
 * (pour l'instant le flag localStorage remplace la source de vérité côté serveur).
 */

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OnboardingQuestionStep } from "@/components/onboarding/OnboardingQuestionStep";
import { OnboardingResultScreen } from "@/components/onboarding/OnboardingResultScreen";
import { cn } from "@/lib/utils";
import {
  ONBOARDING_QUESTIONS,
  computePnlLevel,
  computeRecommendedPace,
  markOnboardingCompleted,
} from "@/lib/onboarding";
import type { OnboardingAnswer, OnboardingResult } from "@/types";

interface OnboardingAssessmentProps {
  /** Appelé après validation du résultat (flag localStorage déjà écrit). */
  onComplete: (result: OnboardingResult) => void | Promise<void>;
  className?: string;
}

type Phase = "question" | "result";

export function OnboardingAssessment({
  onComplete,
  className,
}: OnboardingAssessmentProps) {
  const [phase, setPhase] = useState<Phase>("question");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<OnboardingResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = ONBOARDING_QUESTIONS.length;
  const question = ONBOARDING_QUESTIONS[stepIndex];
  const currentAnswer = answers[question.id] ?? "";
  const isLast = stepIndex === total - 1;
  const isFirst = stepIndex === 0;

  const canContinue = useMemo(() => {
    if (!question.required) return true;
    return currentAnswer.trim().length > 0;
  }, [currentAnswer, question.required]);

  function update(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function goPrev() {
    if (isFirst) return;
    setStepIndex((i) => i - 1);
  }

  function goNextOrFinish() {
    if (!canContinue || isSubmitting) return;
    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }

    const now = new Date();
    const structured: OnboardingAnswer[] = ONBOARDING_QUESTIONS.filter(
      (q) => (answers[q.id] ?? "").trim().length > 0
    ).map((q) => ({
      questionId: q.id,
      answer: (answers[q.id] ?? "").trim(),
      answeredAt: now,
    }));

    const computed: OnboardingResult = {
      answers: structured,
      recommendedPace: computeRecommendedPace(answers),
      pnlLevel: computePnlLevel(answers),
      completedAt: now,
    };

    setResult(computed);
    setPhase("result");
  }

  async function handleContinueFromResult() {
    if (!result || isSubmitting) return;
    setIsSubmitting(true);
    try {
      markOnboardingCompleted();
      await onComplete(result);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (phase === "result" && result) {
    return (
      <section
        className={cn(
          "mx-auto w-full max-w-2xl rounded-xl border border-filet bg-encre/80 p-8 backdrop-blur-sm",
          className
        )}
      >
        <OnboardingResultScreen
          firstName={answers.firstName ?? ""}
          result={result}
          onContinue={handleContinueFromResult}
        />
      </section>
    );
  }

  return (
    <section
      className={cn(
        "mx-auto w-full max-w-2xl rounded-xl border border-filet bg-encre/80 p-8 backdrop-blur-sm",
        className
      )}
    >
      {/* ---- Progression ---- */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-xs uppercase tracking-wider text-pierre">
          <span>Bilan d&apos;accueil</span>
          <span className="tabular-nums">
            {stepIndex + 1} / {total}
          </span>
        </div>
        <ProgressBar value={stepIndex + 1} max={total} size="sm" />
      </div>

      {/* ---- Question ---- */}
      <OnboardingQuestionStep
        key={question.id}
        question={question}
        value={currentAnswer}
        onChange={update}
      />

      {/* ---- Navigation ---- */}
      <div className="mt-10 flex items-center justify-between border-t border-filet pt-6">
        {!isFirst ? (
          <Button
            variant="ghost"
            onClick={goPrev}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Précédent
          </Button>
        ) : (
          <span aria-hidden="true" />
        )}

        <Button
          variant="primary"
          onClick={goNextOrFinish}
          disabled={!canContinue}
          icon={isLast ? undefined : <ArrowRight className="h-4 w-4" />}
        >
          {isLast ? "Voir mon bilan" : "Continuer"}
        </Button>
      </div>
    </section>
  );
}
