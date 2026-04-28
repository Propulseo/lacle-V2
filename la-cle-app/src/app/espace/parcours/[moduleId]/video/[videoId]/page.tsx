"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { OverlayQuestion } from "@/components/learner/OverlayQuestion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getVideo, getVideosByModule } from "@/services/videos";
import { getModule } from "@/services/modules";
import { formatDuration } from "@/lib/utils";
import { getCapsuleDisplayName } from "@/lib/capsule-utils";
import { ROUTES } from "@/lib/constants";
import { NotFoundError } from "@/lib/errors";

export default function VideoPlayerPage() {
  const { moduleId, videoId } = useParams<{ moduleId: string; videoId: string }>();
  const router = useRouter();

  const pageState = useAsyncData(async () => {
    const [video, module_, allVideos] = await Promise.all([
      getVideo(videoId),
      getModule(moduleId),
      getVideosByModule(moduleId),
    ]);
    if (!module_) throw new NotFoundError("Module", moduleId);
    if (!video) throw new NotFoundError("Video", videoId);
    return { video, module_, allVideos };
  }, [videoId, moduleId]);

  return (
    <LearnerShell>
      <AsyncBoundary state={pageState}>
        {({ video, module_, allVideos }) => (
          <VideoContent
            video={video}
            module_={module_}
            allVideos={allVideos}
            moduleId={moduleId}
            router={router}
          />
        )}
      </AsyncBoundary>
    </LearnerShell>
  );
}

function VideoContent({
  video,
  module_,
  allVideos,
  moduleId,
  router,
}: {
  video: NonNullable<Awaited<ReturnType<typeof getVideo>>>;
  module_: NonNullable<Awaited<ReturnType<typeof getModule>>>;
  allVideos: Awaited<ReturnType<typeof getVideosByModule>>;
  moduleId: string;
  router: ReturnType<typeof useRouter>;
}) {
  const { activeQuestion, answeredQuestions, handleTimeUpdate, handleAnswer } =
    useVideoProgress(video.questions || []);

  const currentIndex = allVideos.findIndex((v) => v.id === video.id);
  const prevVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null;
  const nextVideo = currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => router.push(ROUTES.espace.module(moduleId))}
          className="text-cendre hover:text-ivoire transition-colors"
        >
          &larr; {module_.title}
        </button>
      </div>

      <ScrollReveal>
        <div className="relative">
          <VideoPlayer src={video.src || undefined} onTimeUpdate={handleTimeUpdate} onEnded={() => {}} />
          <AnimatePresence>
            {activeQuestion && <OverlayQuestion question={activeQuestion} onAnswer={handleAnswer} />}
          </AnimatePresence>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div>
          <p className="text-sm text-or">Video {video.order}/{allVideos.length}</p>
          <h1 className="mt-1 font-serif text-2xl text-ivoire">
            {getCapsuleDisplayName(String(video.order), video.title, false)}
          </h1>
          <p className="mt-2 text-sm text-cendre">{video.description}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-pierre">
            <span>{formatDuration(video.duration)}</span>
            <span>&bull;</span>
            <span>{answeredQuestions.size}/{video.questions.length} questions repondues</span>
          </div>
        </div>
      </ScrollReveal>

      {video.questions.length > 0 && (
        <ScrollReveal delay={0.2}>
          <Card>
            <h3 className="mb-3 text-sm font-medium text-ivoire">Questions de la video</h3>
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

      <div className="flex items-center justify-between">
        {prevVideo ? (
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => router.push(ROUTES.espace.video(moduleId, prevVideo.id))}>
            Precedente
          </Button>
        ) : <div />}
        {nextVideo ? (
          <Button variant="primary" onClick={() => router.push(ROUTES.espace.video(moduleId, nextVideo.id))}>
            Suivante <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="primary" onClick={() => router.push(ROUTES.espace.module(moduleId))}>
            Retour au module
          </Button>
        )}
      </div>
    </div>
  );
}
