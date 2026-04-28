"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { StarRating } from "./StarRating";
import { submitSatisfactionSurvey } from "@/services/satisfaction";
import type { SatisfactionAnswer } from "@/types";

const STORAGE_KEY = "satisfaction_hot_completed";

const questions = [
  { id: "hot-1", label: "Qualite globale de la formation", type: "stars" as const },
  { id: "hot-2", label: "Le contenu a repondu a vos attentes", type: "stars" as const },
  { id: "hot-3", label: "La plateforme etait facile a utiliser", type: "stars" as const },
  { id: "hot-4", label: "Recommanderiez-vous cette formation ?", type: "stars" as const },
  { id: "hot-5", label: "Ce que vous avez le plus apprecie", type: "text" as const, required: true },
  { id: "hot-6", label: "Ce qui pourrait etre ameliore", type: "text" as const, required: false },
];

interface Props {
  studentId: string;
  formationId?: string;
  onComplete: () => void;
}

export function SatisfactionSurveyHot({ studentId, formationId = "pnl-praticien", onComplete }: Props) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [wantsPublic, setWantsPublic] = useState<boolean | null>(null);
  const [publicReview, setPublicReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    questions.every((q) => {
      if (q.type === "stars") return (ratings[q.id] ?? 0) > 0;
      if (q.required) return (texts[q.id] ?? "").trim().length > 0;
      return true;
    }) && wantsPublic !== null;

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);

    const answers: SatisfactionAnswer[] = questions.map((q) => ({
      questionId: q.id,
      ...(q.type === "stars" ? { rating: ratings[q.id] } : {}),
      ...(texts[q.id] ? { text: texts[q.id] } : {}),
    }));

    // TODO // Supabase: INSERT dans satisfaction_surveys
    // avec type:'chaud', formationId, userId, answers, publicReview, completedAt
    // TODO // Qualiopi Ind.30: donnees exportables pour audit
    await submitSatisfactionSurvey({
      type: "chaud",
      formationId,
      studentId,
      answers,
      publicReview: wantsPublic ? publicReview : undefined,
      wantsPublicReview: wantsPublic ?? false,
    });

    localStorage.setItem(STORAGE_KEY, "true");
    setSubmitted(true);
    setIsSubmitting(false);
  }

  if (submitted) {
    return (
      <Card className="mt-6 text-center py-6">
        <CheckCircle className="mx-auto h-10 w-10 text-succes" />
        <p className="mt-3 font-serif text-lg text-ivoire">Merci pour votre retour !</p>
        <p className="mt-1 text-sm text-cendre">Vos reponses nous aident a ameliorer la formation.</p>
        <Button variant="ghost" className="mt-4" onClick={onComplete}>
          Continuer
        </Button>
      </Card>
    );
  }

  return (
    <Card className="mt-6 space-y-5">
      <div>
        <h3 className="font-serif text-lg text-ivoire">Votre avis compte</h3>
        <p className="mt-1 text-xs text-cendre">Questionnaire de satisfaction rapide (non bloquant)</p>
      </div>

      {questions.map((q) => (
        <div key={q.id} className="space-y-1.5">
          <label className="text-sm text-ivoire">
            {q.label}
            {q.required && <span className="text-or"> *</span>}
          </label>
          {q.type === "stars" ? (
            <StarRating value={ratings[q.id] ?? 0} onChange={(v) => setRatings({ ...ratings, [q.id]: v })} />
          ) : (
            <Textarea
              value={texts[q.id] ?? ""}
              onChange={(e) => setTexts({ ...texts, [q.id]: e.target.value })}
              className="min-h-[60px]"
            />
          )}
        </div>
      ))}

      <div className="space-y-2">
        <label className="text-sm text-ivoire">
          Souhaitez-vous laisser un avis public ?
        </label>
        <div className="flex gap-3">
          {(["Oui", "Non"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setWantsPublic(opt === "Oui")}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                wantsPublic === (opt === "Oui")
                  ? "border-or bg-or/10 text-or"
                  : "border-filet text-cendre hover:border-filet"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {wantsPublic && (
          <Textarea
            label="Votre avis public"
            value={publicReview}
            onChange={(e) => setPublicReview(e.target.value)}
            className="min-h-[80px]"
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onComplete}>
          Passer pour l&apos;instant
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit} isLoading={isSubmitting}>
          Envoyer
        </Button>
      </div>
    </Card>
  );
}
