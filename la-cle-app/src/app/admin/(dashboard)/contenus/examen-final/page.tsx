"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getFinalExams } from "@/services/exams";
import { getLearner } from "@/services/learners";
import { formatDate } from "@/lib/utils";
import type { FinalExam, Learner } from "@/types";

interface FinalExamWithLearner extends FinalExam {
  learner?: Learner | null;
}

export default function FinalExamPage() {
  const [exams, setExams] = useState<FinalExamWithLearner[]>([]);

  useEffect(() => {
    async function load() {
      const rawExams = await getFinalExams();
      const withLearners = await Promise.all(
        rawExams.map(async (e) => ({
          ...e,
          learner: await getLearner(e.learnerId),
        }))
      );
      setExams(withLearners);
    }
    load();
  }, []);

  const statusBadge: Record<string, { variant: "default" | "warning" | "info" | "success" | "error"; label: string }> = {
    not_started: { variant: "default", label: "Non démarré" },
    requested: { variant: "warning", label: "Demandé" },
    scheduled: { variant: "info", label: "Planifié" },
    passed: { variant: "success", label: "Réussi" },
    failed: { variant: "error", label: "Échoué" },
  };

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Contenus", href: "/admin/contenus" },
        { label: "Examen final" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl text-ivoire">Examen final</h1>
          <p className="mt-1 text-sm text-cendre">
            Gestion des demandes et passages de l&apos;examen final
          </p>
        </div>

        {exams.length === 0 ? (
          <EmptyState
            title="Aucune demande"
            description="Les apprenants ayant validé tous les modules pourront demander l'examen final."
          />
        ) : (
          <div className="space-y-3">
            {exams.map((exam, i) => (
              <ScrollReveal key={exam.id} delay={i * 0.05}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ivoire">
                        {exam.learner?.firstName} {exam.learner?.lastName}
                      </p>
                      <p className="text-sm text-cendre">{exam.learner?.email}</p>
                      {exam.requestedAt && (
                        <p className="mt-1 text-xs text-pierre">
                          Demandé le {formatDate(exam.requestedAt)}
                        </p>
                      )}
                      {exam.scheduledAt && (
                        <p className="text-xs text-info">
                          Planifié le {formatDate(exam.scheduledAt)}
                        </p>
                      )}
                      {exam.score !== null && (
                        <p className="text-xs text-or">Score : {exam.score}%</p>
                      )}
                      {exam.notes && (
                        <p className="mt-1 text-xs text-cendre italic">{exam.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusBadge[exam.status]?.variant || "default"}>
                        {statusBadge[exam.status]?.label || exam.status}
                      </Badge>
                      {exam.status === "requested" && (
                        <Button size="sm" variant="primary">
                          Planifier
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
