"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Play, Trash2, Settings } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getModule } from "@/services/modules";
import { getVideosByModule } from "@/services/videos";
import { getExamByModule } from "@/services/exams";
import { formatDuration } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Module, Video, ModularExam } from "@/types";

export default function ModuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [module_, setModule] = useState<Module | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [exam, setExam] = useState<ModularExam | null>(null);
  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    if (id) {
      getModule(id).then(setModule);
      getVideosByModule(id).then(setVideos);
      getExamByModule(id).then(setExam);
    }
  }, [id]);

  if (!module_) {
    return (
      <AdminShell breadcrumbs={[{ label: "Chargement..." }]}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-or border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  const tabs = [
    { id: "videos", label: "Vidéos", count: videos.length },
    { id: "exam", label: "Examen", count: exam?.questions.length },
    { id: "settings", label: "Paramètres" },
  ];

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Contenus", href: "/admin/contenus" },
        { label: "Modules", href: "/admin/contenus/modules" },
        { label: module_.title },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl text-ivoire">{module_.title}</h1>
            <p className="mt-1 text-sm text-cendre">{module_.description}</p>
          </div>
          <Badge variant={module_.isPublished ? "success" : "default"}>
            {module_.isPublished ? "Publié" : "Brouillon"}
          </Badge>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "videos" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
                Ajouter une vidéo
              </Button>
            </div>
            {videos.length === 0 ? (
              <EmptyState
                icon={<Play className="h-12 w-12" />}
                title="Aucune vidéo"
                description="Ajoutez des vidéos à ce module pour commencer."
              />
            ) : (
              <div className="space-y-2">
                {videos.map((video, i) => (
                  <ScrollReveal key={video.id} delay={i * 0.05}>
                    <Card
                      variant="interactive"
                      onClick={() => router.push(ROUTES.admin.video(id, video.id))}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface text-sm text-cendre">
                          {video.order}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-ivoire">{video.title}</p>
                          <p className="text-xs text-cendre">{video.questions.length} question(s) overlay</p>
                        </div>
                        <span className="text-sm text-cendre">{formatDuration(video.duration)}</span>
                        <Badge variant={video.isPublished ? "success" : "default"} className="text-[10px]">
                          {video.isPublished ? "Publié" : "Brouillon"}
                        </Badge>
                      </div>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "exam" && (
          <div className="space-y-4">
            {exam ? (
              <>
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg text-ivoire">{exam.title}</h3>
                    <Button size="sm" icon={<Plus className="h-4 w-4" />}>
                      Ajouter une question
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {exam.questions.map((q, i) => (
                      <div key={q.id} className="flex items-start gap-3 rounded-lg bg-surface p-4">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-or/10 text-xs text-or">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-ivoire">{q.question}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="default">{q.type.toUpperCase()}</Badge>
                            <span className="text-xs text-cendre">{q.points} pts</span>
                          </div>
                        </div>
                        <button className="text-pierre hover:text-erreur transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card>
                  <h4 className="mb-3 text-sm font-medium text-ivoire">Configuration</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-sm">
                      <span className="text-cendre">Score requis : </span>
                      <span className="text-ivoire">{exam.passingScore}%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-cendre">Tentatives max : </span>
                      <span className="text-ivoire">{exam.maxAttempts}</span>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <EmptyState
                title="Aucun examen configuré"
                description="Créez un examen pour ce module."
                action={
                  <Button variant="primary" size="sm">
                    Créer un examen
                  </Button>
                }
              />
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <Card>
            <div className="space-y-4">
              <Input label="Titre du module" defaultValue={module_.title} />
              <Textarea label="Description" defaultValue={module_.description} />
              <div className="flex items-center justify-between">
                <Toggle
                  enabled={module_.isPublished}
                  onChange={() => {}}
                  label="Module publié"
                />
                <Button variant="danger" size="sm" icon={<Trash2 className="h-4 w-4" />}>
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
