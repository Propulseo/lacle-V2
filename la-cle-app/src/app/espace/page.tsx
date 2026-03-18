"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Award, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getLearner } from "@/services/learners";
import { getModulesForLearner } from "@/services/modules";
import { STATUS_CONFIG } from "@/lib/status";
import { ROUTES } from "@/lib/constants";
import type { Learner, ModuleWithProgress } from "@/types";

export default function EspaceDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [learner, setLearner] = useState<Learner | null>(null);
  const [modules, setModules] = useState<ModuleWithProgress[]>([]);

  useEffect(() => {
    if (user?.id) {
      getLearner(user.id).then(setLearner);
      getModulesForLearner(user.id).then(setModules);
    }
  }, [user?.id]);

  if (!learner) return <LearnerShell><div /></LearnerShell>;

  const prog = learner.progression;
  const statusCfg = STATUS_CONFIG[learner.status];
  const nextModule = modules.find((m) => m.status === "in_progress");

  return (
    <LearnerShell>
      <div className="space-y-6">
        {/* Welcome */}
        <ScrollReveal>
          <Card variant="elevated">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-serif text-2xl text-ivoire">
                  Bienvenue, {learner.firstName}
                </h1>
                <p className="mt-1 text-sm text-cendre">
                  Continuez votre formation en PNL Praticien
                </p>
                <div className="mt-2">
                  <Badge variant={learner.status === "certifie" ? "gold" : learner.status === "valide" ? "success" : "info"}>
                    {statusCfg.label}
                  </Badge>
                </div>
              </div>
              <ProgressRing value={prog.overallPercent} size={100} strokeWidth={8} label="global" />
            </div>
          </Card>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.1}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-or" />
                <div>
                  <p className="text-sm text-cendre">Modules</p>
                  <p className="font-serif text-xl text-ivoire">{prog.modulesCompleted}/{prog.modulesTotal}</p>
                </div>
              </div>
              <ProgressBar value={prog.modulesCompleted} max={prog.modulesTotal} className="mt-3" size="sm" />
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-or" />
                <div>
                  <p className="text-sm text-cendre">Examens réussis</p>
                  <p className="font-serif text-xl text-ivoire">{prog.examsPassed}/{prog.examsTotal}</p>
                </div>
              </div>
              <ProgressBar value={prog.examsPassed} max={prog.examsTotal} className="mt-3" size="sm" />
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-or" />
                <div>
                  <p className="text-sm text-cendre">Vidéos vues</p>
                  <p className="font-serif text-xl text-ivoire">{prog.videosWatched}/{prog.videosTotal}</p>
                </div>
              </div>
              <ProgressBar value={prog.videosWatched} max={prog.videosTotal} className="mt-3" size="sm" />
            </Card>
          </div>
        </ScrollReveal>

        {/* Next module */}
        {nextModule && (
          <ScrollReveal delay={0.2}>
            <Card variant="interactive" onClick={() => router.push(ROUTES.espace.module(nextModule.id))}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-or">Continuer</p>
                  <h3 className="mt-1 font-serif text-lg text-ivoire">{nextModule.title}</h3>
                  <p className="mt-1 text-sm text-cendre">
                    {nextModule.videosWatched}/{nextModule.videosCount} vidéos • Module {nextModule.order}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-or" />
              </div>
            </Card>
          </ScrollReveal>
        )}
      </div>
    </LearnerShell>
  );
}
