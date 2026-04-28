"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { StarRating } from "@/components/satisfaction/StarRating";
import { submitSatisfactionSurvey } from "@/services/satisfaction";
import type { SatisfactionAnswer } from "@/types";

// TODO // Supabase: verifier token dans l'URL (?token=xxx)
// pour s'assurer que c'est le bon eleve
// TODO // Resend: email automatique J+90 avec lien tokenise

const questions = [
  { id: "cold-1", label: "Avez-vous mis en pratique ce que vous avez appris ?", type: "stars" as const },
  { id: "cold-2", label: "Impact concret sur votre quotidien", type: "stars" as const },
  { id: "cold-3", label: "Votre niveau en PNL a progresse", type: "stars" as const },
  { id: "cold-4", label: "Suggestions pour ameliorer la formation", type: "text" as const },
  { id: "cold-5", label: "Avez-vous recommande la formation a quelqu'un ?", type: "choice" as const },
];

export default function SatisfactionFroidPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [recommended, setRecommended] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    (ratings["cold-1"] ?? 0) > 0 &&
    (ratings["cold-2"] ?? 0) > 0 &&
    (ratings["cold-3"] ?? 0) > 0 &&
    recommended !== null;

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);

    const answers: SatisfactionAnswer[] = [
      { questionId: "cold-1", rating: ratings["cold-1"] },
      { questionId: "cold-2", rating: ratings["cold-2"] },
      { questionId: "cold-3", rating: ratings["cold-3"] },
      ...(texts["cold-4"] ? [{ questionId: "cold-4", text: texts["cold-4"] }] : [{ questionId: "cold-4" }]),
      { questionId: "cold-5", text: recommended ?? "" },
    ];

    // TODO // Supabase: INSERT avec token verification
    await submitSatisfactionSurvey({
      type: "froid",
      formationId: "pnl-praticien",
      studentId: "anonymous",
      answers,
      wantsPublicReview: false,
    });

    setSubmitted(true);
    setIsSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nuit p-4">
        <Card variant="elevated" className="max-w-md text-center py-10">
          <CheckCircle className="mx-auto h-12 w-12 text-succes" />
          <h1 className="mt-4 font-serif text-2xl text-ivoire">
            Merci pour votre retour !
          </h1>
          <p className="mt-2 text-sm text-cendre">
            Vos reponses nous aident a ameliorer continuellement la formation.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-nuit p-4">
      <Card variant="elevated" className="w-full max-w-lg space-y-5 py-6">
        <div>
          <h1 className="font-serif text-xl text-ivoire">Questionnaire de satisfaction</h1>
          <p className="mt-1 text-xs text-cendre">
            90 jours apres votre formation — votre avis avec du recul
          </p>
        </div>

        {questions.map((q) => (
          <div key={q.id} className="space-y-1.5">
            <label className="text-sm text-ivoire">{q.label}</label>
            {q.type === "stars" && (
              <StarRating
                value={ratings[q.id] ?? 0}
                onChange={(v) => setRatings({ ...ratings, [q.id]: v })}
              />
            )}
            {q.type === "text" && (
              <Textarea
                value={texts[q.id] ?? ""}
                onChange={(e) => setTexts({ ...texts, [q.id]: e.target.value })}
                className="min-h-[60px]"
              />
            )}
            {q.type === "choice" && (
              <div className="flex gap-2">
                {["Oui", "Non", "Pas encore"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRecommended(opt)}
                    className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                      recommended === opt
                        ? "border-or bg-or/10 text-or"
                        : "border-filet text-cendre hover:border-filet"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit} isLoading={isSubmitting}>
            Envoyer
          </Button>
        </div>
      </Card>
    </div>
  );
}
