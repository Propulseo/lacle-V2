"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2, Clock } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminShell } from "@/components/layout/AdminShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getVideo, updateVideo, deleteVideo, deleteVideoQuestion } from "@/services/videos";
import { getModule } from "@/services/modules";
import { formatDuration } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { NotFoundError } from "@/lib/errors";

export default function VideoDetailPage() {
  const { id: moduleId, videoId } = useParams<{ id: string; videoId: string }>();
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteQId, setDeleteQId] = useState<string | null>(null);

  const pageState = useAsyncData(async () => {
    const [video, module_] = await Promise.all([
      getVideo(videoId),
      getModule(moduleId),
    ]);
    if (!module_) throw new NotFoundError("Module", moduleId);
    if (!video) throw new NotFoundError("Video", videoId);
    return { video, module_ };
  }, [videoId, moduleId]);

  async function handleDelete() {
    await deleteVideo(videoId);
    router.push(ROUTES.admin.module(moduleId));
  }

  async function handleDeleteQuestion() {
    if (!deleteQId) return;
    await deleteVideoQuestion(videoId, deleteQId);
    setDeleteQId(null);
    pageState.refetch();
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
      {({ video, module_ }) => (
        <VideoDetailContent
          video={video}
          module_={module_}
          moduleId={moduleId}
          deleteOpen={deleteOpen}
          setDeleteOpen={setDeleteOpen}
          deleteQId={deleteQId}
          setDeleteQId={setDeleteQId}
          onDelete={handleDelete}
          onDeleteQuestion={handleDeleteQuestion}
          onRefetch={pageState.refetch}
        />
      )}
    </AsyncBoundary>
  );
}

function VideoDetailContent({
  video, module_, moduleId,
  deleteOpen, setDeleteOpen,
  deleteQId, setDeleteQId,
  onDelete, onDeleteQuestion, onRefetch,
}: {
  video: NonNullable<Awaited<ReturnType<typeof getVideo>>>;
  module_: NonNullable<Awaited<ReturnType<typeof getModule>>>;
  moduleId: string;
  deleteOpen: boolean;
  setDeleteOpen: (v: boolean) => void;
  deleteQId: string | null;
  setDeleteQId: (v: string | null) => void;
  onDelete: () => Promise<void>;
  onDeleteQuestion: () => Promise<void>;
  onRefetch: () => void;
}) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [order, setOrder] = useState(video.order);
  const [isPublished, setIsPublished] = useState(video.isPublished);
  const [saving, setSaving] = useState(false);

  const hasChanges = title !== video.title || description !== video.description || order !== video.order || isPublished !== video.isPublished;

  async function handleSave() {
    setSaving(true);
    try {
      await updateVideo(video.id, { title, description, order, isPublished });
      onRefetch();
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Contenus", href: "/admin/contenus" },
        { label: "Modules", href: "/admin/contenus/modules" },
        { label: module_.title, href: `/admin/contenus/modules/${moduleId}` },
        { label: video.title },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl text-ivoire">{video.title}</h1>
            <p className="mt-1 text-sm text-cendre">Video {video.order} &bull; {formatDuration(video.duration)}</p>
          </div>
          <Badge variant={video.isPublished ? "success" : "default"}>
            {video.isPublished ? "Publie" : "Brouillon"}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div><VideoPlayer src={video.src || undefined} /></div>
          <Card>
            <h3 className="mb-4 font-serif text-lg text-ivoire">Parametres</h3>
            <div className="space-y-4">
              <Input label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Input label="Ordre" type="number" value={String(order)} onChange={(e) => setOrder(Number(e.target.value))} />
              <div className="flex items-center justify-between">
                <Toggle enabled={isPublished} onChange={setIsPublished} label="Video publiee" />
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
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-ivoire">Questions overlay ({video.questions.length})</h3>
            <Button size="sm" icon={<Plus className="h-4 w-4" />}>Ajouter une question</Button>
          </div>

          {video.questions.length === 0 ? (
            <p className="py-8 text-center text-sm text-cendre">Aucune question overlay pour cette video</p>
          ) : (
            <div className="space-y-3">
              {video.questions.map((q) => (
                <div key={q.id} className="rounded-lg bg-surface p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-or" />
                      <span className="text-sm text-or">{formatDuration(q.timestamp)}</span>
                      <Badge variant="default">{q.type.toUpperCase()}</Badge>
                    </div>
                    <button
                      type="button"
                      aria-label="Supprimer la question"
                      onClick={() => setDeleteQId(q.id)}
                      className="text-pierre hover:text-erreur transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-ivoire">{q.question}</p>
                  {q.options && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {q.options.map((opt) => (
                        <span key={opt} className={`rounded px-2 py-0.5 text-xs ${opt === q.correctAnswer ? "bg-succes/10 text-succes" : "bg-surface text-cendre"}`}>
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                  {q.type === "vrai_faux" && <p className="mt-1 text-xs text-succes">Reponse : {q.correctAnswer}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Supprimer la video"
        message={`Voulez-vous vraiment supprimer "${video.title}" ? Cette action est irreversible.`}
        confirmLabel="Supprimer"
      />

      <ConfirmDialog
        isOpen={!!deleteQId}
        onClose={() => setDeleteQId(null)}
        onConfirm={onDeleteQuestion}
        title="Supprimer la question"
        message="Voulez-vous vraiment supprimer cette question overlay ?"
        confirmLabel="Supprimer"
      />
    </AdminShell>
  );
}
