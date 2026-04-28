"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Mail, Phone, Calendar, Shield, Pencil } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminShell } from "@/components/layout/AdminShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Toggle } from "@/components/ui/Toggle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LearnerEditModal } from "@/components/admin/LearnerEditModal";
import { getLearner, toggleActive } from "@/services/learners";
import { getDocuments } from "@/services/documents";
import { STATUS_CONFIG } from "@/lib/status";
import { formatDate } from "@/lib/utils";
import { NotFoundError } from "@/lib/errors";

export default function ApprenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("progression");
  const [editOpen, setEditOpen] = useState(false);

  const pageState = useAsyncData(async () => {
    const [learner, documents] = await Promise.all([
      getLearner(id),
      getDocuments(id),
    ]);
    if (!learner) throw new NotFoundError("Apprenant", id);
    return { learner, documents };
  }, [id]);

  async function handleToggleActive() {
    if (!pageState.data?.learner) return;
    await toggleActive(pageState.data.learner.id);
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
      {({ learner, documents }) => {
        const statusCfg = STATUS_CONFIG[learner.status];
        const prog = learner.progression;

        const tabs = [
          { id: "progression", label: "Progression" },
          { id: "examens", label: "Examens" },
          { id: "documents", label: "Documents", count: documents.length },
        ];

        return (
          <AdminShell
            breadcrumbs={[
              { label: "Dashboard", href: "/admin" },
              { label: "Apprenants", href: "/admin/apprenants" },
              { label: `${learner.firstName} ${learner.lastName}` },
            ]}
          >
            <div className="space-y-6">
              <Card>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-or/10 font-serif text-xl text-or">
                      {learner.firstName[0]}{learner.lastName[0]}
                    </div>
                    <div>
                      <h1 className="font-serif text-2xl text-ivoire">{learner.firstName} {learner.lastName}</h1>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-cendre">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {learner.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {learner.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={learner.status === "certifie" ? "gold" : learner.status === "inscrit" ? "success" : learner.status === "bloque" ? "error" : "info"}>
                      {statusCfg.label}
                    </Badge>
                    <Button variant="ghost" size="sm" icon={<Pencil className="h-4 w-4" />} onClick={() => setEditOpen(true)}>
                      Modifier
                    </Button>
                    <Toggle enabled={learner.isActive} onChange={handleToggleActive} label="Actif" />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-pierre">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Inscrit le {formatDate(learner.createdAt)}</span>
                  {learner.lastLoginAt && <span>Derniere connexion : {formatDate(learner.lastLoginAt)}</span>}
                  {learner.mustChangePassword && (
                    <span className="flex items-center gap-1 text-attention"><Shield className="h-3 w-3" /> Mot de passe a changer</span>
                  )}
                </div>
              </Card>

              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

              {activeTab === "progression" && (
                <ScrollReveal>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="flex flex-col items-center py-6">
                      <ProgressRing value={prog.overallPercent} size={90} />
                      <p className="mt-2 text-sm text-cendre">Progression globale</p>
                    </Card>
                    <Card>
                      <p className="text-sm text-cendre">Modules</p>
                      <p className="mt-1 font-serif text-xl text-ivoire">{prog.modulesCompleted}/{prog.modulesTotal}</p>
                      <ProgressBar value={prog.modulesCompleted} max={prog.modulesTotal} className="mt-2" size="sm" />
                    </Card>
                    <Card>
                      <p className="text-sm text-cendre">Videos</p>
                      <p className="mt-1 font-serif text-xl text-ivoire">{prog.videosWatched}/{prog.videosTotal}</p>
                      <ProgressBar value={prog.videosWatched} max={prog.videosTotal} className="mt-2" size="sm" />
                    </Card>
                    <Card>
                      <p className="text-sm text-cendre">Examens</p>
                      <p className="mt-1 font-serif text-xl text-ivoire">{prog.examsPassed}/{prog.examsTotal}</p>
                      <ProgressBar value={prog.examsPassed} max={prog.examsTotal} className="mt-2" size="sm" />
                    </Card>
                  </div>
                </ScrollReveal>
              )}

              {activeTab === "examens" && (
                <Card>
                  <h3 className="mb-4 font-serif text-lg text-ivoire">Examen final</h3>
                  <div className="flex items-center gap-3">
                    <Badge variant={prog.finalExamStatus === "passed" ? "success" : prog.finalExamStatus === "requested" ? "warning" : "default"}>
                      {prog.finalExamStatus === "not_started" ? "Non demarre" :
                       prog.finalExamStatus === "requested" ? "Demande" :
                       prog.finalExamStatus === "scheduled" ? "Planifie" :
                       prog.finalExamStatus === "passed" ? "Reussi" : "Echoue"}
                    </Badge>
                  </div>
                </Card>
              )}

              {activeTab === "documents" && (
                <div className="space-y-3">
                  {documents.length === 0 ? (
                    <Card><p className="py-4 text-center text-sm text-cendre">Aucun document</p></Card>
                  ) : (
                    documents.map((doc) => (
                      <Card key={doc.id}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-ivoire">{doc.title}</p>
                            <p className="text-xs text-cendre">{doc.fileName} &bull; {formatDate(doc.uploadedAt)}</p>
                          </div>
                          <Badge variant="default">{doc.type}</Badge>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>

            <LearnerEditModal
              isOpen={editOpen}
              onClose={() => setEditOpen(false)}
              onSuccess={() => { setEditOpen(false); pageState.refetch(); }}
              learner={learner}
            />
          </AdminShell>
        );
      }}
    </AsyncBoundary>
  );
}
