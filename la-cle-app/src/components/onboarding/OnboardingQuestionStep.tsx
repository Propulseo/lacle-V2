"use client";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import type { OnboardingQuestion } from "@/lib/onboarding";

interface OnboardingQuestionStepProps {
  question: OnboardingQuestion;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Rend une question du bilan d'accueil selon son `kind`. Les styles restent
 * délibérément sobres et chaleureux (aucune mention « obligatoire »
 * visible — la contrainte se lit sur le bouton).
 */
export function OnboardingQuestionStep({
  question,
  value,
  onChange,
}: OnboardingQuestionStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl text-ivoire sm:text-3xl">
          {question.prompt}
        </h2>
        {question.helper && (
          <p className="text-sm text-cendre">{question.helper}</p>
        )}
      </div>

      {question.kind === "text" && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          autoFocus
        />
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

      {question.kind === "radio" && (
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

      {question.kind === "scale" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {Array.from(
              { length: question.max - question.min + 1 },
              (_, i) => question.min + i
            ).map((n) => {
              const v = String(n);
              const isActive = value === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => onChange(v)}
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full border font-serif text-xl transition-colors duration-200",
                    isActive
                      ? "border-or bg-or/15 text-or"
                      : "border-filet bg-encre text-cendre hover:border-or/40 hover:text-ivoire"
                  )}
                  aria-pressed={isActive}
                  aria-label={`Note ${v} sur ${question.max}`}
                >
                  {v}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-pierre">
            <span>{question.minLabel}</span>
            <span>{question.maxLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}
