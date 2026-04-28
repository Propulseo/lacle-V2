"use client";

/**
 * PreEnrollmentQuestionnaire
 *
 * Questionnaire de 7 questions affiché avant la validation finale du compte
 * d'inscription. Stocke les réponses dans le state local avec un horodatage
 * à la soumission, et les renvoie via la prop `onSubmit`.
 *
 * TODO // Supabase: sauvegarder les réponses avec horodatage dans la table
 * pre_enrollment_answers
 *
 * TODO // Qualiopi Ind.4: export possible des réponses pour audit
 */

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { RadioChoice } from "@/components/enrollment/RadioChoice";
import { cn } from "@/lib/utils";
import type { OnboardingAnswer } from "@/types";

// ---------------------------------------------------------------------------
// Types & constantes
// ---------------------------------------------------------------------------

export interface PreEnrollmentSubmission {
  answers: OnboardingAnswer[];
  submittedAt: number;
}

interface PreEnrollmentQuestionnaireProps {
  onSubmit: (data: PreEnrollmentSubmission) => void | Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

interface FormState {
  firstName: string;
  lastName: string;
  profession: string;
  motivation: string;
  pnlLevel: string;
  weeklyHours: string;
  specificNeeds: string;
  expectations: string;
}

const INITIAL_STATE: FormState = {
  firstName: "",
  lastName: "",
  profession: "",
  motivation: "",
  pnlLevel: "",
  weeklyHours: "",
  specificNeeds: "",
  expectations: "",
};

const PNL_LEVELS: { value: string; label: string }[] = [
  { value: "debutant", label: "Débutant" },
  { value: "quelques-notions", label: "J'ai quelques notions" },
  { value: "initie", label: "Initié" },
];

const WEEKLY_HOURS: { value: string; label: string }[] = [
  { value: "moins-2h", label: "Moins de 2h" },
  { value: "2-5h", label: "2 à 5h" },
  { value: "plus-5h", label: "Plus de 5h" },
];

export function PreEnrollmentQuestionnaire({
  onSubmit,
  isSubmitting = false,
  className,
}: PreEnrollmentQuestionnaireProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);

  const isValid = useMemo(() => {
    const required: (keyof FormState)[] = [
      "firstName",
      "lastName",
      "profession",
      "motivation",
      "pnlLevel",
      "weeklyHours",
      "expectations",
    ];
    return required.every((k) => form[k].trim().length > 0);
  }, [form]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    const now = new Date();
    const answers: OnboardingAnswer[] = (
      Object.entries(form) as [keyof FormState, string][]
    )
      .filter(([, answer]) => answer.trim().length > 0)
      .map(([questionId, answer]) => ({
        questionId,
        answer: answer.trim(),
        answeredAt: now,
      }));

    await onSubmit({ answers, submittedAt: Date.now() });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full max-w-2xl space-y-8 rounded-xl border border-filet bg-encre/80 p-8 backdrop-blur-sm",
        className
      )}
      noValidate
    >
      <header className="space-y-2">
        <h1 className="font-serif text-3xl text-ivoire">
          Avant de commencer — dites-nous qui vous êtes
        </h1>
        <p className="text-sm text-cendre">
          Ces informations nous permettent de personnaliser votre parcours.
        </p>
      </header>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Prénom"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            autoComplete="given-name"
            required
          />
          <Input
            label="Nom"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            autoComplete="family-name"
            required
          />
        </div>

        <Input
          label="Profession actuelle"
          value={form.profession}
          onChange={(e) => update("profession", e.target.value)}
          autoComplete="organization-title"
          required
        />

        <Textarea
          label="Pourquoi souhaitez-vous vous former à la PNL ?"
          value={form.motivation}
          onChange={(e) => update("motivation", e.target.value)}
          placeholder="Quelques lignes suffisent."
          required
        />

        <RadioChoice
          name="pnlLevel"
          legend="Quel est votre niveau actuel en PNL ?"
          value={form.pnlLevel}
          options={PNL_LEVELS}
          onChange={(v) => update("pnlLevel", v)}
        />

        <RadioChoice
          name="weeklyHours"
          legend="Combien d'heures par semaine pouvez-vous consacrer à la formation ?"
          value={form.weeklyHours}
          options={WEEKLY_HOURS}
          onChange={(v) => update("weeklyHours", v)}
        />

        <Textarea
          label="Avez-vous des besoins spécifiques ou une situation particulière à nous signaler ?"
          value={form.specificNeeds}
          onChange={(e) => update("specificNeeds", e.target.value)}
          placeholder="Optionnel — accessibilité, rythme, contexte personnel…"
        />

        <Textarea
          label="Qu'attendez-vous concrètement de cette formation ?"
          value={form.expectations}
          onChange={(e) => update("expectations", e.target.value)}
          placeholder="Objectifs, projets, applications envisagées."
          required
        />
      </div>

      <div className="flex justify-end border-t border-filet pt-6">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isValid}
          isLoading={isSubmitting}
        >
          Valider et continuer
        </Button>
      </div>
    </form>
  );
}
