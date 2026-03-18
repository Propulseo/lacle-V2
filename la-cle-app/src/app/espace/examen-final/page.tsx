"use client";

import { useState, useEffect } from "react";
import { Award, Calendar, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getFinalExam, requestFinalExam } from "@/services/exams";
import { getLearner } from "@/services/learners";
import { formatDate } from "@/lib/utils";
import type { FinalExam, Learner } from "@/types";

export default function ExamenFinalPage() {
  const { user } = useAuth();
  const [exam, setExam] = useState<FinalExam | null>(null);
  const [learner, setLearner] = useState<Learner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getFinalExam(user.id).then(setExam);
      getLearner(user.id).then(setLearner);
    }
  }, [user?.id]);

  const allModulesCompleted = learner?.progression.modulesCompleted === learner?.progression.modulesTotal;

  async function handleRequest() {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const result = await requestFinalExam(user.id);
      setExam(result);
    } catch {
      // Already requested
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LearnerShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <ScrollReveal>
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Examen final</h1>
            <p className="mt-1 text-sm text-cendre">
              L&apos;examen final valide l&apos;ensemble de votre formation
            </p>
          </div>
        </ScrollReveal>

        {!allModulesCompleted && !exam && (
          <ScrollReveal delay={0.1}>
            <Alert variant="warning" title="Modules à compléter">
              Vous devez valider tous les modules avant de pouvoir demander l&apos;examen final.
            </Alert>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.1}>
          <Card variant="elevated">
            {!exam && allModulesCompleted && (
              <div className="text-center py-8">
                <Award className="mx-auto h-12 w-12 text-or" />
                <h2 className="mt-4 font-serif text-xl text-ivoire">
                  Prêt pour l&apos;examen final
                </h2>
                <p className="mt-2 text-sm text-cendre">
                  Tous vos modules sont validés. Vous pouvez demander un rendez-vous pour l&apos;examen final.
                </p>
                <Button
                  variant="primary"
                  className="mt-6"
                  onClick={handleRequest}
                  isLoading={isLoading}
                >
                  Demander un rendez-vous
                </Button>
              </div>
            )}

            {!exam && !allModulesCompleted && (
              <div className="text-center py-8">
                <Award className="mx-auto h-12 w-12 text-pierre" />
                <h2 className="mt-4 font-serif text-xl text-ivoire">
                  Examen final
                </h2>
                <p className="mt-2 text-sm text-cendre">
                  Complétez tous les modules pour débloquer l&apos;examen final.
                </p>
                <p className="mt-1 text-xs text-or">
                  {learner?.progression.modulesCompleted}/{learner?.progression.modulesTotal} modules complétés
                </p>
              </div>
            )}

            {exam?.status === "requested" && (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-attention" />
                <h2 className="mt-4 font-serif text-xl text-ivoire">
                  Demande en cours
                </h2>
                <p className="mt-2 text-sm text-cendre">
                  Votre demande a été envoyée le {formatDate(exam.requestedAt!)}.
                  L&apos;équipe vous contactera pour fixer une date.
                </p>
                <Badge variant="warning" className="mt-3">En attente de planification</Badge>
              </div>
            )}

            {exam?.status === "scheduled" && (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-info" />
                <h2 className="mt-4 font-serif text-xl text-ivoire">
                  Examen planifié
                </h2>
                <p className="mt-2 text-sm text-cendre">
                  Votre examen est prévu le {formatDate(exam.scheduledAt!)}.
                </p>
                <Badge variant="info" className="mt-3">Rendez-vous confirmé</Badge>
              </div>
            )}

            {exam?.status === "passed" && (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-succes" />
                <h2 className="mt-4 font-serif text-xl text-ivoire">
                  Examen réussi !
                </h2>
                <ProgressRing value={exam.score!} size={100} className="mx-auto mt-4" />
                <p className="mt-4 text-sm text-cendre">
                  Félicitations ! Vous avez obtenu {exam.score}%.
                </p>
                {exam.notes && (
                  <p className="mt-2 text-sm text-cendre italic">&laquo; {exam.notes} &raquo;</p>
                )}
                <Badge variant="success" className="mt-3">Certifié</Badge>
              </div>
            )}

            {exam?.status === "failed" && (
              <div className="text-center py-8">
                <Award className="mx-auto h-12 w-12 text-erreur" />
                <h2 className="mt-4 font-serif text-xl text-ivoire">
                  Examen non validé
                </h2>
                <p className="mt-2 text-sm text-cendre">
                  Score obtenu : {exam.score}%. Contactez l&apos;institut pour plus d&apos;informations.
                </p>
                <Badge variant="error" className="mt-3">Non validé</Badge>
              </div>
            )}
          </Card>
        </ScrollReveal>
      </div>
    </LearnerShell>
  );
}
