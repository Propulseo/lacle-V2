"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Play, CheckCircle, Lock, ArrowRight, Award } from "lucide-react";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getModule } from "@/services/modules";
import { getVideosByModule } from "@/services/videos";
import { getExamByModule, getAttempts } from "@/services/exams";
import { useAuth } from "@/hooks/useAuth";
import { formatDuration, cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Module, Video, ModularExam, ExamAttempt } from "@/types";

export default function ModuleDetailLearnerPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [module_, setModule] = useState<Module | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [exam, setExam] = useState<ModularExam | null>(null);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);

  useEffect(() => {
    if (moduleId) {
      getModule(moduleId).then(setModule);
      getVideosByModule(moduleId).then(setVideos);
      getExamByModule(moduleId).then((e) => {
        setExam(e);
        if (e && user?.id) {
          getAttempts(e.id, user.id).then(setAttempts);
        }
      });
    }
  }, [moduleId, user?.id]);

  if (!module_) {
    return (
      <LearnerShell>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-or border-t-transparent" />
        </div>
      </LearnerShell>
    );
  }

  const examPassed = attempts.some((a) => a.passed);

  return (
    <LearnerShell>
      <div className="space-y-6">
        <ScrollReveal>
          <div>
            <p className="text-sm text-or">Module {module_.order}</p>
            <h1 className="mt-1 font-serif text-2xl text-ivoire">{module_.title}</h1>
            <p className="mt-2 text-sm text-cendre">{module_.description}</p>
            <div className="mt-3">
              <ProgressBar value={4} max={videos.length} showLabel size="sm" />
            </div>
          </div>
        </ScrollReveal>

        {/* Videos list */}
        <div className="space-y-2">
          <h2 className="font-serif text-lg text-ivoire">Vidéos du module</h2>
          {videos.map((video, i) => {
            const watched = i < 2; // Mock: first 2 watched
            return (
              <ScrollReveal key={video.id} delay={i * 0.05}>
                <Card
                  variant="interactive"
                  onClick={() => router.push(ROUTES.espace.video(moduleId, video.id))}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        watched ? "bg-succes/10" : "bg-surface"
                      )}
                    >
                      {watched ? (
                        <CheckCircle className="h-5 w-5 text-succes" />
                      ) : (
                        <Play className="h-4 w-4 text-cendre" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ivoire">{video.title}</p>
                      <p className="text-xs text-cendre">
                        {formatDuration(video.duration)} • {video.questions.length} question(s)
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-pierre" />
                  </div>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Exam section */}
        {exam && (
          <ScrollReveal delay={0.3}>
            <Card variant={examPassed ? "default" : "elevated"}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className={cn("h-6 w-6", examPassed ? "text-succes" : "text-or")} />
                  <div>
                    <h3 className="font-serif text-lg text-ivoire">Examen du module</h3>
                    <p className="text-sm text-cendre">
                      {exam.questions.length} questions • Score requis : {exam.passingScore}%
                    </p>
                    {attempts.length > 0 && (
                      <p className="text-xs text-pierre">
                        {attempts.length} tentative(s) • Meilleur score : {Math.max(...attempts.map((a) => a.score))}%
                      </p>
                    )}
                  </div>
                </div>
                {examPassed ? (
                  <Badge variant="success">Validé</Badge>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(ROUTES.espace.examenModule(moduleId))}
                  >
                    Passer l&apos;examen
                  </Button>
                )}
              </div>
            </Card>
          </ScrollReveal>
        )}
      </div>
    </LearnerShell>
  );
}
