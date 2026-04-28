"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, GripVertical, MoreVertical } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminShell } from "@/components/layout/AdminShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ModuleFormModal } from "@/components/admin/ModuleFormModal";
import { getModules, deleteModule } from "@/services/modules";
import { formatDuration } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { LegacyModule } from "@/types";

export default function ModulesListPage() {
  const router = useRouter();
  const modulesState = useAsyncData(() => getModules(), []);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LegacyModule | null>(null);

  function handleCreate() {
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteModule(deleteTarget.id);
    setDeleteTarget(null);
    modulesState.refetch();
  }

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Contenus", href: "/admin/contenus" },
        { label: "Modules" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Modules de formation</h1>
            <p className="mt-1 text-sm text-cendre">{modulesState.data?.length ?? 0} modules</p>
          </div>
          <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Nouveau module</Button>
        </div>

        <AsyncBoundary state={modulesState}>
          {(modules) => (
            <div className="space-y-3">
              {modules.map((mod, i) => (
                <ScrollReveal key={mod.id} delay={i * 0.05}>
                  <Card variant="interactive" onClick={() => router.push(ROUTES.admin.module(mod.id))}>
                    <div className="flex items-center gap-4">
                      <GripVertical className="h-5 w-5 shrink-0 text-pierre cursor-grab" />
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-or/10 font-serif text-lg text-or">
                        {mod.order}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-ivoire">{mod.title}</h3>
                        <p className="mt-0.5 text-sm text-cendre line-clamp-1">{mod.description}</p>
                      </div>
                      <div className="hidden items-center gap-3 sm:flex">
                        <span className="text-sm text-cendre">{mod.videosCount} videos</span>
                        <span className="text-sm text-pierre">&bull;</span>
                        <span className="text-sm text-cendre">{formatDuration(mod.totalDuration)}</span>
                        <Badge variant={mod.isPublished ? "success" : "default"}>
                          {mod.isPublished ? "Publie" : "Brouillon"}
                        </Badge>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu
                          trigger={
                            <span className="rounded p-1 text-pierre hover:text-ivoire hover:bg-ivoire/5 transition-colors inline-flex">
                              <MoreVertical className="h-4 w-4" />
                            </span>
                          }
                          items={[
                            { label: "Voir le detail", onClick: () => router.push(ROUTES.admin.module(mod.id)) },
                            { label: "Supprimer", onClick: () => setDeleteTarget(mod), danger: true },
                          ]}
                        />
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          )}
        </AsyncBoundary>
      </div>

      <ModuleFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => { setFormOpen(false); modulesState.refetch(); }}
        nextOrder={(modulesState.data?.length ?? 0) + 1}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer le module"
        message={`Voulez-vous vraiment supprimer le module "${deleteTarget?.title}" ? Toutes les videos et examens associes seront perdus.`}
        confirmLabel="Supprimer"
      />
    </AdminShell>
  );
}
