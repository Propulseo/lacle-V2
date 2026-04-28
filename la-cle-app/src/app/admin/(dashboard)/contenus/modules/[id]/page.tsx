"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Play, Trash2 } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminShell } from "@/components/layout/AdminShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { VideoFormModal } from "@/components/admin/VideoFormModal";
import { getModule, updateModule, deleteModule } from "@/services/modules";
import { getVideosByModule } from "@/services/videos";
import { getExamByModule } from "@/services/exams";
import { formatDuration } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { NotFoundError } from "@/lib/errors";

export default function ModuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("videos");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [videoFormOpen, setVideoFormOpen] = useState(false);

  const pageState = useAsyncData(async () => {
    const [module_, videos, exam] = await Promise.all([
      getModule(id),
      getVideosByModule(id),
      getExamByModule(id),
    ]);
    if (!module_) throw new NotFoundError("Module", id);
    return { module_, videos, exam };
  }, [id]);

  async function handleDelete() {
    await deleteModule(id);
    router.push(ROUTES.admin.modules);
  }

  return (
    <AsyncBoundary
      state={pageState}
      loading={
        <AdminShell breadcrumbs={[{ label: "Chargement..." }]}>
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-or border-t-transparent" />
          </div>
        </AdminShell>
      }
    >
      {({ module_, videos, exam }) => (
        <ModuleDetailContent
          id={id}
          module_={module_}
          videos={videos}
          exam={exam}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          deleteOpen={deleteOpen}
          setDeleteOpen={setDeleteOpen}
          videoFormOpen={videoFormOpen}
          setVideoFormOpen={setVideoFormOpen}
          onDelete={handleDelete}
          onRefetch={pageState.refetch}
          router={router}
        />
      )}
    </AsyncBoundary>
  );
}

function ModuleDetailContent({
  id, module_, videos, exam,
  activeTab, setActiveTab,
  deleteOpen, setDeleteOpen,
  videoFormOpen, setVideoFormOpen,
  onDelete, onRefetch, router,
}: {
  id: string;
  module_: NonNullable<Awaited<ReturnType<typeof getModule>>>;
  videos: Awaited<ReturnType<typeof getVideosByModule>>;
  exam: Awaited<ReturnType<typeof getExamByModule>>;
  activeTab: string;
  setActiveTab: (t: string) => void;
  deleteOpen: boolean;
  setDeleteOpen: (v: boolean) => void;
  videoFormOpen: boolean;
  setVideoFormOpen: (v: boolean) => void;
  onDelete: () => Promise<void>;
  onRefetch: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const [title, setTitle] = useState(module_.title);
  const [description, setDescription] = useState(module_.description);
  const [isPublished, setIsPublished] = useState(module_.isPublished);
  const [saving, setSaving] = useState(false);

  const hasChanges = title !== module_.title || description !== module_.description || isPublished !== module_.isPublished;

  async function handleSave() {
    setSaving(true);
    try {
      await updateModule(id, { title, description, isPublished });
      onRefetch();
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { id: "videos", label: "Videos", count: videos.length },
    { id: "exam", label: "Examen", count: exam?.questions.length },
    { id: "settings", label: "Parametres" },
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
            {module_.isPublished ? "Publie" : "Brouillon"}
          </Badge>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "videos" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setVideoFormOpen(true)}>
                Ajouter une video
              </Button>
            </div>
            {videos.length === 0 ? (
              <EmptyState icon={<Play className="h-12 w-12" />} title="Aucune video" description="Ajoutez des videos a ce module pour commencer." />
            ) : (
              <div className="space-y-2">
                {videos.map((video, i) => (
                  <ScrollReveal key={video.id} delay={i * 0.05}>
                    <Card variant="interactive" onClick={() => router.push(ROUTES.admin.video(id, video.id))}>
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface text-sm text-cendre">{video.order}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-ivoire">{video.title}</p>
                          <p className="text-xs text-cendre">{video.questions.length} question(s) overlay</p>
                        </div>
                        <span className="text-sm text-cendre">{formatDuration(video.duration)}</span>
                        <Badge variant={video.isPublished ? "success" : "default"} className="text-[10px]">
                          {video.isPublished ? "Publie" : "Brouillon"}
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
                    <Button size="sm" icon={<Plus className="h-4 w-4" />}>Ajouter une question</Button>
                  </div>
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
                        <button type="button" aria-label="Supprimer" className="text-pierre hover:text-erreur transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card>
                  <h4 className="mb-3 text-sm font-medium text-ivoire">Configuration</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-sm"><span className="text-cendre">Score requis : </span><span className="text-ivoire">{exam.passingScore}%</span></div>
                    <div className="text-sm"><span className="text-cendre">Tentatives max : </span><span className="text-ivoire">{exam.maxAttempts}</span></div>
                  </div>
                </Card>
              </>
            ) : (
              <EmptyState title="Aucun examen configure" description="Creez un examen pour ce module."
                action={<Button variant="primary" size="sm">Creer un examen</Button>} />
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <Card>
            <div className="space-y-4">
              <Input label="Titre du module" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <div className="flex items-center justify-between">
                <Toggle enabled={isPublished} onChange={setIsPublished} label="Module publie" />
                <div className="flex gap-3">
                  <Button variant="danger" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={() => setDeleteOpen(true)}>
                    Supprimer
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSave} isLoading={saving} disabled={!hasChanges}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <VideoFormModal
        isOpen={videoFormOpen}
        onClose={() => setVideoFormOpen(false)}
        onSuccess={() => { setVideoFormOpen(false); onRefetch(); }}
        moduleId={id}
        nextOrder={videos.length + 1}
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Supprimer le module"
        message={`Voulez-vous vraiment supprimer "${module_.title}" ? Toutes les videos et examens seront perdus.`}
        confirmLabel="Supprimer"
      />
    </AdminShell>
  );
}
