"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ExamQuestionFormModal } from "@/components/admin/ExamQuestionFormModal";
import { createExam, deleteExamQuestion } from "@/services/exams";
import { updateModule } from "@/services/modules";
import type { ModularExam, ExamQuestion } from "@/types";

interface ModuleExamTabProps {
  moduleId: string;
  moduleTitle: string;
  exam: ModularExam | null;
  onRefetch: () => void;
}

export function ModuleExamTab({ moduleId, moduleTitle, exam, onRefetch }: ModuleExamTabProps) {
  const [questionFormOpen, setQuestionFormOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<ExamQuestion | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleCreateExam() {
    setCreating(true);
    try {
      const newExam = await createExam({
        moduleId,
        title: `Examen — ${moduleTitle}`,
        passingScore: 100,
        maxAttempts: 3,
        timeLimitMinutes: null,
      });
      await updateModule(moduleId, { examId: newExam.id });
      onRefetch();
    } finally {
      setCreating(false);
    }
  }

  if (!exam) {
    return (
      <EmptyState
        title="Aucun examen configuré"
        description="Créez un examen pour ce module."
        action={
          <Button variant="primary" size="sm" isLoading={creating} onClick={handleCreateExam}>
            Créer un examen
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-ivoire">{exam.title}</h3>
          <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setQuestionFormOpen(true)}>
            Ajouter une question
          </Button>
        </div>
        {exam.questions.length === 0 ? (
          <p className="py-6 text-center text-sm text-cendre">
            Aucune question pour le moment. Ajoutez la première question de cet examen.
          </p>
        ) : (
          <div className="space-y-3">
            {exam.questions.map((q, i) => (
              <div key={q.id} className="flex items-start gap-3 rounded-lg bg-surface p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-or/10 text-xs text-or">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm text-ivoire">{q.question}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="default">{q.type.toUpperCase()}</Badge>
                    <span className="text-xs text-cendre">{q.points} pts</span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Supprimer la question"
                  onClick={() => setQuestionToDelete(q)}
                  className="text-pierre hover:text-erreur transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card>
        <h4 className="mb-3 text-sm font-medium text-ivoire">Configuration</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="text-sm"><span className="text-cendre">Score requis : </span><span className="text-ivoire">{exam.passingScore}%</span></div>
          <div className="text-sm"><span className="text-cendre">Tentatives max : </span><span className="text-ivoire">{exam.maxAttempts}</span></div>
        </div>
      </Card>

      <ExamQuestionFormModal
        isOpen={questionFormOpen}
        onClose={() => setQuestionFormOpen(false)}
        onSuccess={() => {
          setQuestionFormOpen(false);
          onRefetch();
        }}
        examId={exam.id}
      />

      <ConfirmDialog
        isOpen={questionToDelete !== null}
        onClose={() => setQuestionToDelete(null)}
        onConfirm={async () => {
          if (!questionToDelete) return;
          await deleteExamQuestion(exam.id, questionToDelete.id);
          setQuestionToDelete(null);
          onRefetch();
        }}
        title="Supprimer la question"
        message={`Voulez-vous vraiment supprimer cette question ? "${questionToDelete?.question ?? ""}"`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}
