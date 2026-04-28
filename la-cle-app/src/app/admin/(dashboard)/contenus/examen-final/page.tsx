"use client";

import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminShell } from "@/components/layout/AdminShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
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

const statusBadge: Record<string, { variant: "default" | "warning" | "info" | "success" | "error"; label: string }> = {
  not_started: { variant: "default", label: "Non demarre" },
  requested: { variant: "warning", label: "Demande" },
  scheduled: { variant: "info", label: "Planifie" },
  passed: { variant: "success", label: "Reussi" },
  failed: { variant: "error", label: "Echoue" },
};

export default function FinalExamPage() {
  const examsState = useAsyncData(async () => {
    const rawExams = await getFinalExams();
    const withLearners: FinalExamWithLearner[] = await Promise.all(
      rawExams.map(async (e) => ({
        ...e,
        learner: await getLearner(e.learnerId),
      }))
    );
    return withLearners;
  }, []);

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

        <AsyncBoundary state={examsState} empty={
          <EmptyState title="Aucune demande" description="Les apprenants ayant valide tous les modules pourront demander l'examen final." />
        }>
          {(exams) => (
            <div className="space-y-3">
              {exams.map((exam, i) => (
                <ScrollReveal key={exam.id} delay={i * 0.05}>
                  <Card>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-ivoire">{exam.learner?.firstName} {exam.learner?.lastName}</p>
                        <p className="text-sm text-cendre">{exam.learner?.email}</p>
                        {exam.requestedAt && <p className="mt-1 text-xs text-pierre">Demande le {formatDate(exam.requestedAt)}</p>}
                        {exam.scheduledAt && <p className="text-xs text-info">Planifie le {formatDate(exam.scheduledAt)}</p>}
                        {exam.score !== null && <p className="text-xs text-or">Score : {exam.score}%</p>}
                        {exam.notes && <p className="mt-1 text-xs text-cendre italic">{exam.notes}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={statusBadge[exam.status]?.variant || "default"}>
                          {statusBadge[exam.status]?.label || exam.status}
                        </Badge>
                        {exam.status === "requested" && <Button size="sm" variant="primary">Planifier</Button>}
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          )}
        </AsyncBoundary>
      </div>
    </AdminShell>
  );
}
