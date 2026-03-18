"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { VideoQuestion } from "@/types";

interface OverlayQuestionProps {
  question: VideoQuestion;
  onAnswer: (questionId: string) => void;
}

export function OverlayQuestion({ question, onAnswer }: OverlayQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isCorrect =
    question.type === "texte"
      ? textAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase())
      : selected?.toLowerCase() === question.correctAnswer.toLowerCase();

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => onAnswer(question.id), 2500);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-nuit-profond/90 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-lg rounded-xl border border-filet bg-encre p-6">
        <p className="mb-4 font-serif text-lg text-ivoire">{question.question}</p>

        {question.type === "qcm" && question.options && (
          <div className="space-y-2">
            {question.options.map((opt) => (
              <button
                key={opt}
                onClick={() => !submitted && setSelected(opt)}
                disabled={submitted}
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  submitted && opt === question.correctAnswer && "border-succes bg-succes/10 text-succes",
                  submitted && selected === opt && opt !== question.correctAnswer && "border-erreur bg-erreur/10 text-erreur",
                  !submitted && selected === opt && "border-or bg-or/10 text-or",
                  !submitted && selected !== opt && "border-filet text-cendre hover:border-filet-accent"
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
                onClick={() => !submitted && setSelected(opt)}
                disabled={submitted}
                className={cn(
                  "flex-1 rounded-lg border px-4 py-3 text-center text-sm capitalize transition-colors",
                  submitted && opt === question.correctAnswer && "border-succes bg-succes/10 text-succes",
                  submitted && selected === opt && opt !== question.correctAnswer && "border-erreur bg-erreur/10 text-erreur",
                  !submitted && selected === opt && "border-or bg-or/10 text-or",
                  !submitted && selected !== opt && "border-filet text-cendre hover:border-filet-accent"
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
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            disabled={submitted}
            placeholder="Votre réponse..."
            className="w-full rounded-lg border border-filet bg-surface px-4 py-3 text-sm text-ivoire placeholder:text-pierre focus:border-or/50 focus:outline-none"
          />
        )}

        {submitted && (
          <div className={cn("mt-4 flex items-start gap-2 rounded-lg p-3", isCorrect ? "bg-succes/10" : "bg-erreur/10")}>
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-succes" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 text-erreur" />
            )}
            <div className="text-sm">
              <p className={isCorrect ? "text-succes" : "text-erreur"}>
                {isCorrect ? "Bonne réponse !" : "Incorrect"}
              </p>
              {question.explanation && (
                <p className="mt-1 text-cendre">{question.explanation}</p>
              )}
            </div>
          </div>
        )}

        {!submitted && (
          <Button
            variant="primary"
            className="mt-4 w-full"
            onClick={handleSubmit}
            disabled={question.type === "texte" ? !textAnswer : !selected}
          >
            Valider
          </Button>
        )}
      </div>
    </motion.div>
  );
}
