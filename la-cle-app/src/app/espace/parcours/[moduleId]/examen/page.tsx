"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getExamByModule, submitAttempt } from "@/services/exams";
import { getModule } from "@/services/modules";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { ModularExam, Module, ExamAttempt } from "@/types";

export default function ExamenModulairePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [module_, setModule] = useState<Module | null>(null);
  const [exam, setExam] = useState<ModularExam | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<ExamAttempt | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (moduleId) {
      getModule(moduleId).then(setModule);
      getExamByModule(moduleId).then(setExam);
    }
  }, [moduleId]);

  if (!exam || !module_) {
    return (
      <LearnerShell>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-or border-t-transparent" />
        </div>
      </LearnerShell>
    );
  }

  const question = exam.questions[currentQ];
  const totalQ = exam.questions.length;

  function handleSelect(value: string) {
    setSelected(value);
  }

  function handleNext() {
    if (!selected || !question || !exam || !user) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ < totalQ - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Submit
      submitAttempt(exam.id, user.id, newAnswers).then(setResult);
    }
  }

  // Result view
  if (result) {
    return (
      <LearnerShell>
        <div className="mx-auto max-w-md space-y-6 py-12">
          <ScrollReveal>
            <Card variant="elevated" className="text-center">
              <ProgressRing value={result.score} size={120} strokeWidth={10} className="mx-auto" />
              <h1 className="mt-4 font-serif text-2xl text-ivoire">
                {result.passed ? "Examen réussi !" : "Examen non validé"}
              </h1>
              <p className="mt-2 text-cendre">
                Score : {result.score}% — {result.passed ? "Félicitations !" : `Score requis : ${exam.passingScore}%`}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                {!result.passed && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setResult(null);
                      setCurrentQ(0);
                      setAnswers({});
                      setSelected(null);
                    }}
                  >
                    Réessayer
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => router.push(ROUTES.espace.module(moduleId))}
                >
                  Retour au module
                </Button>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </LearnerShell>
    );
  }

  // Start screen
  if (!started) {
    return (
      <LearnerShell>
        <div className="mx-auto max-w-md space-y-6 py-12">
          <ScrollReveal>
            <Card variant="elevated" className="text-center">
              <h1 className="font-serif text-2xl text-ivoire">{exam.title}</h1>
              <p className="mt-2 text-cendre">
                {totalQ} questions • Score requis : {exam.passingScore}%
              </p>
              <p className="mt-1 text-xs text-pierre">
                Vous ne pourrez pas revenir en arrière une fois une question validée.
              </p>
              <Button variant="primary" className="mt-6" onClick={() => setStarted(true)}>
                Commencer l&apos;examen
              </Button>
            </Card>
          </ScrollReveal>
        </div>
      </LearnerShell>
    );
  }

  // Exam in progress
  return (
    <LearnerShell>
      <div className="mx-auto max-w-lg space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-cendre">
            Question {currentQ + 1} / {totalQ}
          </span>
          <Badge variant="gold">{module_.title}</Badge>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-filet">
          <div
            className="h-full bg-or transition-all duration-500"
            style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }}
          />
        </div>

        {/* Question */}
        <Card variant="elevated">
          <p className="mb-6 font-serif text-xl text-ivoire">{question.question}</p>

          {question.type === "qcm" && question.options && (
            <div className="space-y-2">
              {question.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
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
                  onClick={() => handleSelect(opt)}
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
              onChange={(e) => setSelected(e.target.value)}
              placeholder="Votre réponse..."
              className="w-full rounded-lg border border-filet bg-surface px-4 py-3 text-sm text-ivoire placeholder:text-pierre focus:border-or/50 focus:outline-none"
            />
          )}
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleNext} disabled={!selected}>
            {currentQ === totalQ - 1 ? "Terminer" : "Suivante"}
          </Button>
        </div>
      </div>
    </LearnerShell>
  );
}
