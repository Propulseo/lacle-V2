"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { OverlayQuestion } from "@/components/learner/OverlayQuestion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { getVideo } from "@/services/videos";
import { getVideosByModule } from "@/services/videos";
import { getModule } from "@/services/modules";
import { formatDuration } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Video, Module } from "@/types";

export default function VideoPlayerPage() {
  const { moduleId, videoId } = useParams<{ moduleId: string; videoId: string }>();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [module_, setModule] = useState<Module | null>(null);
  const [allVideos, setAllVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (videoId) getVideo(videoId).then(setVideo);
    if (moduleId) {
      getModule(moduleId).then(setModule);
      getVideosByModule(moduleId).then(setAllVideos);
    }
  }, [videoId, moduleId]);

  const { activeQuestion, answeredQuestions, handleTimeUpdate, handleAnswer } =
    useVideoProgress(video?.questions || []);

  if (!video || !module_) {
    return (
      <LearnerShell>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-or border-t-transparent" />
        </div>
      </LearnerShell>
    );
  }

  const currentIndex = allVideos.findIndex((v) => v.id === videoId);
  const prevVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null;
  const nextVideo = currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null;

  return (
    <LearnerShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => router.push(ROUTES.espace.module(moduleId))}
            className="text-cendre hover:text-ivoire transition-colors"
          >
            ← {module_.title}
          </button>
        </div>

        {/* Video Player with overlay */}
        <ScrollReveal>
          <div className="relative">
            <VideoPlayer
              src={video.src || undefined}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {}}
            />
            <AnimatePresence>
              {activeQuestion && (
                <OverlayQuestion
                  question={activeQuestion}
                  onAnswer={handleAnswer}
                />
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Video info */}
        <ScrollReveal delay={0.1}>
          <div>
            <p className="text-sm text-or">Vidéo {video.order}/{allVideos.length}</p>
            <h1 className="mt-1 font-serif text-2xl text-ivoire">{video.title}</h1>
            <p className="mt-2 text-sm text-cendre">{video.description}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-pierre">
              <span>{formatDuration(video.duration)}</span>
              <span>•</span>
              <span>
                {answeredQuestions.size}/{video.questions.length} questions répondues
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Questions summary */}
        {video.questions.length > 0 && (
          <ScrollReveal delay={0.2}>
            <Card>
              <h3 className="mb-3 text-sm font-medium text-ivoire">Questions de la vidéo</h3>
              <div className="space-y-2">
                {video.questions.map((q) => (
                  <div key={q.id} className="flex items-center gap-2 text-sm">
                    {answeredQuestions.has(q.id) ? (
                      <CheckCircle className="h-4 w-4 text-succes" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-filet" />
                    )}
                    <span className="text-cendre">
                      {formatDuration(q.timestamp)} — {q.question.substring(0, 60)}...
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {prevVideo ? (
            <Button
              variant="ghost"
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.push(ROUTES.espace.video(moduleId, prevVideo.id))}
            >
              Précédente
            </Button>
          ) : (
            <div />
          )}
          {nextVideo ? (
            <Button
              variant="primary"
              onClick={() => router.push(ROUTES.espace.video(moduleId, nextVideo.id))}
            >
              Suivante <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => router.push(ROUTES.espace.module(moduleId))}
            >
              Retour au module
            </Button>
          )}
        </div>
      </div>
    </LearnerShell>
  );
}
